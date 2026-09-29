import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Client, Invoice, InvoiceWithClient, NewInvoiceInput, SupabaseConfig, InvoiceStatus } from '../types';
import { INITIAL_CLIENTS, INITIAL_INVOICES } from './initialData';

const CONFIG_STORAGE_KEY = 'duefox_supabase_config_v1';
const LOCAL_CLIENTS_KEY = 'duefox_local_clients_v1';
const LOCAL_INVOICES_KEY = 'duefox_local_invoices_v1';

// Event bus for local real-time synchronization across tabs and within app
const localEventTarget = new EventTarget();
const LOCAL_CHANGE_EVENT = 'duefox_db_change';

// Calculate days overdue based on today
export function calculateDaysOverdue(dueDateStr: string): number {
  const due = new Date(dueDateStr);
  const now = new Date(); // Current date (2026-09-24)
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Automatically resolve status based on days overdue if not explicitly marked paid
export function resolveAutomaticStatus(dueDateStr: string, currentStatus: InvoiceStatus): InvoiceStatus {
  if (currentStatus === 'paid') return 'paid';
  const daysOverdue = calculateDaysOverdue(dueDateStr);
  if (daysOverdue >= 30) {
    return 'escalated';
  }
  return 'pending';
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private channel: RealtimeChannel | null = null;
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false,
    isCustom: false,
  };

  constructor() {
    this.init();
  }

  public init() {
    // Check environment variables first
    const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
    const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

    // Check localStorage overrides
    let storedConfig: { url?: string; anonKey?: string } | null = null;
    try {
      const item = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (item) storedConfig = JSON.parse(item);
    } catch {
      // Ignore storage errors
    }

    const targetUrl = storedConfig?.url || envUrl;
    const targetKey = storedConfig?.anonKey || envKey;

    if (targetUrl && targetKey && targetUrl.startsWith('http') && targetKey.length > 20) {
      try {
        this.client = createClient(targetUrl, targetKey, {
          auth: { persistSession: false },
        });
        this.config = {
          url: targetUrl,
          anonKey: targetKey,
          isConnected: true,
          isCustom: Boolean(storedConfig?.url),
        };
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this.client = null;
        this.config = { url: targetUrl, anonKey: targetKey, isConnected: false, isCustom: true };
      }
    } else {
      this.client = null;
      this.config = {
        url: '',
        anonKey: '',
        isConnected: false,
        isCustom: false,
      };
    }

    // Ensure local seed data exists if in local mode
    this.ensureLocalSeedData();
  }

  private ensureLocalSeedData() {
    try {
      if (!localStorage.getItem(LOCAL_CLIENTS_KEY)) {
        localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS));
      }
      if (!localStorage.getItem(LOCAL_INVOICES_KEY)) {
        localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
      }
    } catch {
      // Ignore local storage quota errors
    }
  }

  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public async updateConfig(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl && !trimmedKey) {
      // Clear custom config, switch to demo mode
      localStorage.removeItem(CONFIG_STORAGE_KEY);
      this.init();
      localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
      return { success: true };
    }

    if (!trimmedUrl.startsWith('https://') && !trimmedUrl.startsWith('http://')) {
      return { success: false, error: 'Project URL must start with https://' };
    }

    if (trimmedKey.length < 20) {
      return { success: false, error: 'Anon key is too short. Please provide a valid Supabase anon key.' };
    }

    try {
      const testClient = createClient(trimmedUrl, trimmedKey);
      // Test connectivity by querying clients or invoices
      const { error } = await testClient.from('invoices').select('id').limit(1);
      
      if (error && error.code !== 'PGRST116' && !error.message.includes('permission denied')) {
        // Even if table does not exist yet, we still allow saving so user can run SQL migration!
        console.info('Connected to Supabase, but schema might need migration:', error.message);
      }

      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ url: trimmedUrl, anonKey: trimmedKey }));
      this.client = testClient;
      this.config = {
        url: trimmedUrl,
        anonKey: trimmedKey,
        isConnected: true,
        isCustom: true,
      };

      localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to connect to Supabase' };
    }
  }

  public resetDemoData() {
    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
    localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  }

  // Fetch all invoices combined with client info
  public async fetchClientsAndInvoices(): Promise<InvoiceWithClient[]> {
    if (this.client) {
      try {
        // First try joined query
        const { data, error } = await this.client
          .from('invoices')
          .select(`
            *,
            clients:client_id (*)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((row: any) => {
            const clientData = row.clients || {
              id: row.client_id,
              name: 'Unknown Client',
              email: 'unknown@client.com',
              phone: '',
              created_at: row.created_at,
            };
            const daysOverdue = calculateDaysOverdue(row.due_date);
            const status = row.status === 'paid' ? 'paid' : (daysOverdue >= 30 ? 'escalated' : row.status || 'pending');

            return {
              id: row.id,
              client_id: row.client_id,
              invoice_number: row.invoice_number || `INV-${row.id.substring(0, 6)}`,
              amount: Number(row.amount),
              currency: row.currency || 'USD',
              due_date: row.due_date,
              status,
              payment_link: row.payment_link,
              chase_count: Number(row.chase_count || 0),
              last_chased_at: row.last_chased_at,
              chase_schedule: row.chase_schedule || 'standard',
              notes: row.notes,
              created_at: row.created_at,
              client: clientData,
              days_overdue: daysOverdue,
            };
          });
        }

        // If joined query failed (e.g. FK not named clients or separate tables), query separately
        const [clientsRes, invoicesRes] = await Promise.all([
          this.client.from('clients').select('*'),
          this.client.from('invoices').select('*').order('created_at', { ascending: false }),
        ]);

        if (invoicesRes.data) {
          const clientMap = new Map<string, Client>();
          (clientsRes.data || []).forEach((c: any) => clientMap.set(c.id, c));

          return invoicesRes.data.map((inv: any) => {
            const client = clientMap.get(inv.client_id) || {
              id: inv.client_id,
              name: 'Unknown Client',
              email: 'unknown@client.com',
              phone: '',
              created_at: inv.created_at,
            };
            const daysOverdue = calculateDaysOverdue(inv.due_date);
            const status = inv.status === 'paid' ? 'paid' : (daysOverdue >= 30 ? 'escalated' : inv.status || 'pending');

            return {
              id: inv.id,
              client_id: inv.client_id,
              invoice_number: inv.invoice_number || `INV-${inv.id.substring(0, 6)}`,
              amount: Number(inv.amount),
              currency: inv.currency || 'USD',
              due_date: inv.due_date,
              status,
              payment_link: inv.payment_link,
              chase_count: Number(inv.chase_count || 0),
              last_chased_at: inv.last_chased_at,
              chase_schedule: inv.chase_schedule || 'standard',
              notes: inv.notes,
              created_at: inv.created_at,
              client,
              days_overdue: daysOverdue,
            };
          });
        }
      } catch (err) {
        console.warn('Supabase fetch error, falling back to local database:', err);
      }
    }

    // Fallback to local synced storage
    return this.getLocalClientsAndInvoices();
  }

  private getLocalClientsAndInvoices(): InvoiceWithClient[] {
    try {
      this.ensureLocalSeedData();
      const rawClients = localStorage.getItem(LOCAL_CLIENTS_KEY);
      const rawInvoices = localStorage.getItem(LOCAL_INVOICES_KEY);

      const clients: Client[] = rawClients ? JSON.parse(rawClients) : INITIAL_CLIENTS;
      const invoices: Invoice[] = rawInvoices ? JSON.parse(rawInvoices) : INITIAL_INVOICES;

      const clientMap = new Map<string, Client>();
      clients.forEach((c) => clientMap.set(c.id, c));

      return invoices.map((inv) => {
        const client = clientMap.get(inv.client_id) || {
          id: inv.client_id,
          name: 'Client',
          email: 'client@example.com',
          phone: '',
          created_at: inv.created_at,
        };
        const daysOverdue = calculateDaysOverdue(inv.due_date);
        const resolvedStatus = inv.status === 'paid' ? 'paid' : (daysOverdue >= 30 ? 'escalated' : inv.status);

        return {
          ...inv,
          status: resolvedStatus,
          client,
          days_overdue: daysOverdue,
        };
      });
    } catch {
      return [];
    }
  }

  // Insert a new invoice with client handling
  public async insertInvoice(input: NewInvoiceInput): Promise<InvoiceWithClient> {
    const nowIso = new Date().toISOString();
    const daysOverdue = calculateDaysOverdue(input.dueDate);
    const initialStatus: InvoiceStatus = daysOverdue >= 30 ? 'escalated' : 'pending';

    if (this.client) {
      try {
        // 1. Check if client exists by email in Supabase
        const { data: existingClients } = await this.client
          .from('clients')
          .select('*')
          .eq('email', input.email.trim().toLowerCase())
          .limit(1);

        let clientId: string;
        let clientRecord: Client;

        if (existingClients && existingClients.length > 0) {
          clientId = existingClients[0].id;
          clientRecord = existingClients[0];
          // Update phone or name if provided
          await this.client
            .from('clients')
            .update({
              name: input.clientName.trim(),
              phone: input.phone.trim(),
              company: input.company?.trim(),
            })
            .eq('id', clientId);
        } else {
          // Insert client
          const newClientId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`;
          const newClient = {
            id: newClientId,
            name: input.clientName.trim(),
            email: input.email.trim().toLowerCase(),
            phone: input.phone.trim(),
            company: input.company?.trim() || '',
            created_at: nowIso,
          };
          const { data: createdClient, error: clientError } = await this.client
            .from('clients')
            .insert(newClient)
            .select()
            .single();

          if (clientError || !createdClient) {
            throw clientError || new Error('Failed to create client in Supabase');
          }
          clientId = createdClient.id;
          clientRecord = createdClient;
        }

        // 2. Generate invoice number
        const randomNum = Math.floor(100 + Math.random() * 900);
        const invoiceNumber = `INV-${new Date().getFullYear()}-${randomNum}`;
        const newInvoiceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `inv-${Date.now()}`;

        const invoiceToInsert = {
          id: newInvoiceId,
          client_id: clientId,
          invoice_number: invoiceNumber,
          amount: Number(input.amount),
          currency: input.currency,
          due_date: input.dueDate,
          status: initialStatus,
          payment_link: input.paymentLink?.trim() || `https://pay.duefox.co/inv/${invoiceNumber}`,
          chase_count: 0,
          chase_schedule: input.chaseSchedule || 'standard',
          notes: input.notes?.trim() || '',
          created_at: nowIso,
        };

        const { data: createdInvoice, error: invError } = await this.client
          .from('invoices')
          .insert(invoiceToInsert)
          .select()
          .single();

        if (invError || !createdInvoice) {
          throw invError || new Error('Failed to insert invoice into Supabase');
        }

        return {
          id: createdInvoice.id,
          client_id: clientId,
          invoice_number: invoiceNumber,
          amount: Number(createdInvoice.amount),
          currency: createdInvoice.currency,
          due_date: createdInvoice.due_date,
          status: createdInvoice.status,
          payment_link: createdInvoice.payment_link,
          chase_count: 0,
          chase_schedule: createdInvoice.chase_schedule,
          notes: createdInvoice.notes,
          created_at: createdInvoice.created_at,
          client: clientRecord,
          days_overdue: daysOverdue,
        };
      } catch (err) {
        console.warn('Supabase insert failed, inserting into local store:', err);
      }
    }

    // Local Insert Fallback
    const rawClients = localStorage.getItem(LOCAL_CLIENTS_KEY);
    const rawInvoices = localStorage.getItem(LOCAL_INVOICES_KEY);

    const clients: Client[] = rawClients ? JSON.parse(rawClients) : [...INITIAL_CLIENTS];
    const invoices: Invoice[] = rawInvoices ? JSON.parse(rawInvoices) : [...INITIAL_INVOICES];

    // Find or create client
    let client = clients.find((c) => c.email.toLowerCase() === input.email.trim().toLowerCase());
    if (!client) {
      client = {
        id: `c-${Date.now()}`,
        name: input.clientName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        company: input.company?.trim(),
        created_at: nowIso,
      };
      clients.unshift(client);
    } else {
      client.name = input.clientName.trim();
      client.phone = input.phone.trim();
      if (input.company) client.company = input.company.trim();
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${randomNum}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      client_id: client.id,
      invoice_number: invoiceNumber,
      amount: Number(input.amount),
      currency: input.currency,
      due_date: input.dueDate,
      status: initialStatus,
      payment_link: input.paymentLink?.trim() || `https://pay.duefox.co/inv/${invoiceNumber}`,
      chase_count: 0,
      chase_schedule: input.chaseSchedule || 'standard',
      notes: input.notes?.trim() || '',
      created_at: nowIso,
    };

    invoices.unshift(newInvoice);

    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(clients));
    localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(invoices));
    localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));

    return {
      ...newInvoice,
      client,
      days_overdue: daysOverdue,
    };
  }

  // Update an existing invoice and its client details
  public async updateInvoice(id: string, input: NewInvoiceInput): Promise<InvoiceWithClient> {
    const daysOverdue = calculateDaysOverdue(input.dueDate);

    if (this.client) {
      try {
        // 1. Fetch current invoice to know client_id and current status
        const { data: currentInv } = await this.client
          .from('invoices')
          .select('client_id, status, invoice_number, chase_count, created_at')
          .eq('id', id)
          .single();

        const clientId = currentInv?.client_id;
        const currentStatus = currentInv?.status || 'pending';
        const updatedStatus: InvoiceStatus =
          currentStatus === 'paid' ? 'paid' : (daysOverdue >= 30 ? 'escalated' : 'pending');

        let clientRecord: Client;

        if (clientId) {
          // Update client in clients table
          const { data: updatedClient } = await this.client
            .from('clients')
            .update({
              name: input.clientName.trim(),
              email: input.email.trim().toLowerCase(),
              phone: input.phone.trim(),
              company: input.company?.trim() || '',
            })
            .eq('id', clientId)
            .select()
            .single();

          clientRecord = updatedClient || {
            id: clientId,
            name: input.clientName.trim(),
            email: input.email.trim().toLowerCase(),
            phone: input.phone.trim(),
            company: input.company?.trim(),
            created_at: new Date().toISOString(),
          };
        } else {
          clientRecord = {
            id: `c-${Date.now()}`,
            name: input.clientName.trim(),
            email: input.email.trim().toLowerCase(),
            phone: input.phone.trim(),
            company: input.company?.trim(),
            created_at: new Date().toISOString(),
          };
        }

        // Update invoice in invoices table
        const { data: updatedInv, error: invError } = await this.client
          .from('invoices')
          .update({
            amount: Number(input.amount),
            currency: input.currency,
            due_date: input.dueDate,
            status: updatedStatus,
            payment_link: input.paymentLink?.trim() || null,
            chase_schedule: input.chaseSchedule || 'standard',
            notes: input.notes?.trim() || '',
          })
          .eq('id', id)
          .select()
          .single();

        if (invError) {
          throw invError;
        }

        const result: InvoiceWithClient = {
          id,
          client_id: clientId || clientRecord.id,
          invoice_number: updatedInv?.invoice_number || currentInv?.invoice_number || `INV-${id.substring(0, 6)}`,
          amount: Number(updatedInv?.amount ?? input.amount),
          currency: updatedInv?.currency || input.currency,
          due_date: updatedInv?.due_date || input.dueDate,
          status: updatedInv?.status || updatedStatus,
          payment_link: updatedInv?.payment_link || input.paymentLink,
          chase_count: updatedInv?.chase_count ?? (currentInv?.chase_count || 0),
          last_chased_at: updatedInv?.last_chased_at,
          chase_schedule: updatedInv?.chase_schedule || input.chaseSchedule || 'standard',
          notes: updatedInv?.notes ?? input.notes,
          created_at: updatedInv?.created_at || currentInv?.created_at || new Date().toISOString(),
          client: clientRecord,
          days_overdue: daysOverdue,
        };

        // Also update local storage to keep state mirrored
        this.updateLocalInvoiceAndClient(id, input, result);

        localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
        return result;
      } catch (err) {
        console.warn('Supabase update failed, falling back to local store:', err);
      }
    }

    // Local fallback update
    return this.updateLocalInvoiceAndClient(id, input);
  }

  private updateLocalInvoiceAndClient(
    id: string,
    input: NewInvoiceInput,
    exactResult?: InvoiceWithClient
  ): InvoiceWithClient {
    const rawClients = localStorage.getItem(LOCAL_CLIENTS_KEY);
    const rawInvoices = localStorage.getItem(LOCAL_INVOICES_KEY);

    const clients: Client[] = rawClients ? JSON.parse(rawClients) : [...INITIAL_CLIENTS];
    const invoices: Invoice[] = rawInvoices ? JSON.parse(rawInvoices) : [...INITIAL_INVOICES];

    const invIndex = invoices.findIndex((i) => i.id === id);
    const existingInv = invIndex >= 0 ? invoices[invIndex] : null;

    const daysOverdue = calculateDaysOverdue(input.dueDate);
    const currentStatus = existingInv?.status || 'pending';
    const resolvedStatus: InvoiceStatus =
      currentStatus === 'paid' ? 'paid' : (daysOverdue >= 30 ? 'escalated' : 'pending');

    let client = clients.find((c) => c.id === existingInv?.client_id);
    if (client) {
      client.name = input.clientName.trim();
      client.email = input.email.trim().toLowerCase();
      client.phone = input.phone.trim();
      client.company = input.company?.trim();
    } else {
      client = {
        id: existingInv?.client_id || `c-${Date.now()}`,
        name: input.clientName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        company: input.company?.trim(),
        created_at: new Date().toISOString(),
      };
      clients.push(client);
    }

    const updatedInvoice: Invoice = {
      ...(existingInv || {
        id,
        invoice_number: `INV-${new Date().getFullYear()}-001`,
        chase_count: 0,
        created_at: new Date().toISOString(),
      }),
      client_id: client.id,
      amount: Number(input.amount),
      currency: input.currency,
      due_date: input.dueDate,
      status: resolvedStatus,
      payment_link: input.paymentLink?.trim() || existingInv?.payment_link,
      chase_schedule: input.chaseSchedule || 'standard',
      notes: input.notes?.trim() || '',
    };

    if (invIndex >= 0) {
      invoices[invIndex] = updatedInvoice;
    } else {
      invoices.unshift(updatedInvoice);
    }

    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(clients));
    localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(invoices));
    localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));

    return exactResult || {
      ...updatedInvoice,
      client,
      days_overdue: daysOverdue,
    };
  }

  // Update status (e.g. mark paid or reopen)
  public async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<void> {
    if (this.client) {
      try {
        const { error } = await this.client
          .from('invoices')
          .update({ status })
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.warn('Supabase status update failed, saving locally:', err);
      }
    }

    // Always update local store to mirror state
    try {
      const rawInvoices = localStorage.getItem(LOCAL_INVOICES_KEY);
      if (rawInvoices) {
        const invoices: Invoice[] = JSON.parse(rawInvoices);
        const updated = invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv));
        localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(updated));
      }
    } catch {}

    localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  }

  // Delete an invoice
  public async deleteInvoice(id: string): Promise<void> {
    if (this.client) {
      try {
        const { error } = await this.client
          .from('invoices')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.warn('Supabase delete failed, deleting locally:', err);
      }
    }

    try {
      const rawInvoices = localStorage.getItem(LOCAL_INVOICES_KEY);
      if (rawInvoices) {
        const invoices: Invoice[] = JSON.parse(rawInvoices);
        const filtered = invoices.filter((inv) => inv.id !== id);
        localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(filtered));
      }
    } catch {}

    localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  }

  // Record a chase reminder sent
  public async recordChase(id: string): Promise<void> {
    const nowIso = new Date().toISOString();

    if (this.client) {
      try {
        // Query current chase count
        const { data } = await this.client.from('invoices').select('chase_count').eq('id', id).single();
        const nextCount = (data?.chase_count || 0) + 1;
        await this.client
          .from('invoices')
          .update({
            chase_count: nextCount,
            last_chased_at: nowIso,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase chase update failed, updating locally:', err);
      }
    }

    try {
      const rawInvoices = localStorage.getItem(LOCAL_INVOICES_KEY);
      if (rawInvoices) {
        const invoices: Invoice[] = JSON.parse(rawInvoices);
        const updated = invoices.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                chase_count: (inv.chase_count || 0) + 1,
                last_chased_at: nowIso,
              }
            : inv
        );
        localStorage.setItem(LOCAL_INVOICES_KEY, JSON.stringify(updated));
      }
    } catch {}

    localEventTarget.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  }

  // Real-time updates subscription
  public subscribeToChanges(onChange: () => void): () => void {
    // 1. Supabase Postgres Realtime channel
    if (this.client) {
      try {
        this.channel = this.client
          .channel('public:invoices_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'invoices' },
            () => {
              onChange();
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'clients' },
            () => {
              onChange();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime channel subscription error:', err);
      }
    }

    // 2. Local EventTarget listener for instant state reflection
    const handleLocalChange = () => onChange();
    localEventTarget.addEventListener(LOCAL_CHANGE_EVENT, handleLocalChange);

    // 3. Storage event listener for multi-tab support
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === LOCAL_INVOICES_KEY || e.key === LOCAL_CLIENTS_KEY) {
        onChange();
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (this.channel) {
        this.channel.unsubscribe();
      }
      localEventTarget.removeEventListener(LOCAL_CHANGE_EVENT, handleLocalChange);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }

  // Generate SQL migration snippet for the user's Supabase SQL Editor
  public getSqlMigrationScript(): string {
    return `-- ==========================================
-- dueFox.co Supabase Migration Schema
-- Run this in your Supabase Project's SQL Editor
-- ==========================================

-- 1. Create Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'escalated', 'paid')),
  payment_link TEXT,
  chase_count INTEGER NOT NULL DEFAULT 0,
  last_chased_at TIMESTAMPTZ,
  chase_schedule TEXT DEFAULT 'standard',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 5. Open Access Policies for Public Demo / Client Key
CREATE POLICY "Allow public read clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete clients" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Allow public read invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete invoices" ON public.invoices FOR DELETE USING (true);

-- 6. Enable Realtime Replication for instant live UI updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
`;
  }
}

export const supabaseService = new SupabaseService();
