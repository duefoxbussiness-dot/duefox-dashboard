export type InvoiceStatus = 'pending' | 'escalated' | 'paid';
export type CurrencyCode = 'USD' | 'INR';
export type ThemeMode = 'dark' | 'light';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Client {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id?: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  currency: CurrencyCode;
  due_date: string; // ISO date string YYYY-MM-DD
  status: InvoiceStatus;
  payment_link?: string;
  chase_count: number;
  last_chased_at?: string;
  chase_schedule?: 'gentle' | 'standard' | 'assertive';
  notes?: string;
  created_at: string;
}

export interface InvoiceWithClient extends Invoice {
  client: Client;
  days_overdue: number;
}

export interface NewInvoiceInput {
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  amount: number;
  currency: CurrencyCode;
  dueDate: string;
  paymentLink?: string;
  chaseSchedule?: 'gentle' | 'standard' | 'assertive';
  notes?: string;
}

export interface DashboardStats {
  totalOverdueUSD: number;
  totalOverdueINR: number;
  pendingCount: number;
  escalatedCount: number;
  paidCount: number;
  totalPaidUSD: number;
  totalPaidINR: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  isCustom: boolean;
}
