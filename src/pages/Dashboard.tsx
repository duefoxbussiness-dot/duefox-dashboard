import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Zap,
  Search,
  Filter,
  Send,
  MoreVertical,
  ExternalLink,
  Trash2,
  Edit2,
  FileText,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  MessageSquare,
  Mail,
  Copy,
  Check,
  X,
  Building2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export type InvoiceStatus = 'paid' | 'escalated' | 'pending';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface Client {
  id: string;
  name: string;
  contact_name: string;
  email: string;
  phone?: string;
  country?: string;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  client_id: string;
  client: Client;
  amount: number;
  currency: CurrencyCode;
  due_date: string;
  days_overdue: number;
  status: InvoiceStatus;
  chase_count: number;
  last_chased_at?: string;
  last_channel?: 'email' | 'whatsapp';
  notes?: string;
}

export interface UserProfile {
  company_name: string;
  contact_email: string;
  default_currency: CurrencyCode;
  bank_name: string;
  swift_bic: string;
  virtual_iban: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv-1',
    invoice_number: 'INV-2026-8891',
    client_id: 'cl-1',
    client: {
      id: 'cl-1',
      name: 'Acme Global Media LLC',
      contact_name: 'Marcus Vance',
      email: 'marcus.vance@acmeglobal.com',
      phone: '+1 555-019-2834',
      country: 'USA',
    },
    amount: 14850,
    currency: 'USD',
    due_date: '2026-09-17',
    days_overdue: 12,
    status: 'escalated',
    chase_count: 3,
    last_chased_at: '2026-09-29T14:15:00Z',
    last_channel: 'whatsapp',
  },
  {
    id: 'inv-2',
    invoice_number: 'INV-2026-7619',
    client_id: 'cl-2',
    client: {
      id: 'cl-2',
      name: 'Novex Spatial Systems GmbH',
      contact_name: 'Elena Rostova',
      email: 'elena@novexspatial.de',
      phone: '+49 89 2441-992',
      country: 'Germany',
    },
    amount: 29750,
    currency: 'EUR',
    due_date: '2026-09-10',
    days_overdue: 0,
    status: 'paid',
    chase_count: 2,
    last_chased_at: '2026-09-10T11:20:00Z',
    last_channel: 'email',
  },
  {
    id: 'inv-3',
    invoice_number: 'INV-2026-9041',
    client_id: 'cl-3',
    client: {
      id: 'cl-3',
      name: 'Pacific Cloud Pte Ltd',
      contact_name: 'David Chen',
      email: 'dchen@pacificcloud.sg',
      phone: '+65 6789 0123',
      country: 'Singapore',
    },
    amount: 32000,
    currency: 'USD',
    due_date: '2026-09-05',
    days_overdue: 18,
    status: 'escalated',
    chase_count: 4,
    last_chased_at: '2026-09-28T09:40:00Z',
    last_channel: 'whatsapp',
  },
  {
    id: 'inv-4',
    invoice_number: 'INV-2026-4412',
    client_id: 'cl-4',
    client: {
      id: 'cl-4',
      name: 'Kensington Advisory Ltd',
      contact_name: 'Oliver Thorne',
      email: 'oliver@kensingtonadv.co.uk',
      phone: '+44 20 7946 0912',
      country: 'UK',
    },
    amount: 18500,
    currency: 'GBP',
    due_date: '2026-09-26',
    days_overdue: 4,
    status: 'pending',
    chase_count: 1,
    last_chased_at: '2026-09-27T10:00:00Z',
    last_channel: 'email',
  },
  {
    id: 'inv-5',
    invoice_number: 'INV-2026-3108',
    client_id: 'cl-5',
    client: {
      id: 'cl-5',
      name: 'Nexus Bharat Technologies',
      contact_name: 'Rohan Sharma',
      email: 'rohan.sharma@nexusbharat.in',
      phone: '+91 98200 12345',
      country: 'India',
    },
    amount: 850000,
    currency: 'INR',
    due_date: '2026-09-22',
    days_overdue: 8,
    status: 'pending',
    chase_count: 2,
    last_chased_at: '2026-09-25T15:30:00Z',
    last_channel: 'whatsapp',
  },
];

export default function Dashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [selectedCurrency, setSelectedCurrency] = useState<'ALL' | CurrencyCode>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceRecord | null>(null);
  const [chaseInvoice, setChaseInvoice] = useState<InvoiceRecord | null>(null);
  const [timelineInvoice, setTimelineInvoice] = useState<InvoiceRecord | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    company_name: 'DueFox Solutions Inc.',
    contact_email: 'billing@duefox.co',
    default_currency: 'USD',
    bank_name: 'J.P. Morgan Chase N.A. (New York)',
    swift_bic: 'CHASUS33XXX',
    virtual_iban: 'US64 CHAS 0000 1928 3847 11',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message?: string) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Compute live statistics
  const stats = useMemo(() => {
    let overdueUSD = 0;
    let overdueEUR = 0;
    let overdueGBP = 0;
    let overdueINR = 0;
    let pendingCount = 0;
    let escalatedCount = 0;
    let paidCount = 0;
    let paidUSD = 0;

    invoices.forEach((inv) => {
      if (inv.status === 'paid') {
        paidCount++;
        if (inv.currency === 'USD') paidUSD += inv.amount;
      } else {
        if (inv.status === 'escalated') escalatedCount++;
        else pendingCount++;

        if (inv.currency === 'USD') overdueUSD += inv.amount;
        else if (inv.currency === 'EUR') overdueEUR += inv.amount;
        else if (inv.currency === 'GBP') overdueGBP += inv.amount;
        else overdueINR += inv.amount;
      }
    });

    return {
      overdueUSD,
      overdueEUR,
      overdueGBP,
      overdueINR,
      pendingCount,
      escalatedCount,
      paidCount,
      paidUSD,
    };
  }, [invoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (selectedCurrency !== 'ALL' && inv.currency !== selectedCurrency) return false;
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inv.invoice_number.toLowerCase().includes(q) ||
          inv.client.name.toLowerCase().includes(q) ||
          inv.client.contact_name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoices, selectedCurrency, statusFilter, searchQuery]);

  // Actions
  const handleMarkPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const nextStatus: InvoiceStatus = inv.status === 'paid' ? 'pending' : 'paid';
          if (nextStatus === 'paid') {
            addToast(
              'success',
              `Invoice ${inv.invoice_number} marked as Paid`,
              `Recovered ${inv.currency} ${inv.amount.toLocaleString()} from ${inv.client.name}`
            );
          } else {
            addToast('info', `Invoice ${inv.invoice_number} reopened`, 'Status reset to pending');
          }
          return { ...inv, status: nextStatus };
        }
        return inv;
      })
    );
  };

  const handleDelete = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    addToast('info', `Invoice ${inv?.invoice_number || ''} deleted`, 'Removed from ledger');
  };

  const handleSendChase = (invoiceId: string, channel: 'email' | 'whatsapp') => {
    const target = invoices.find((i) => i.id === invoiceId);
    if (!target) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              chase_count: inv.chase_count + 1,
              last_chased_at: new Date().toISOString(),
              last_channel: channel,
            }
          : inv
      )
    );

    addToast(
      'success',
      `${channel === 'whatsapp' ? 'WhatsApp Escalation' : 'Polite Email Reminder'} Sent`,
      `Dispatched to ${target.client.contact_name} (${target.client.name})`
    );
    setChaseInvoice(null);
  };

  const handleBatchChase = () => {
    const overdue = invoices.filter((i) => i.status !== 'paid');
    if (overdue.length === 0) {
      addToast('info', 'No Overdue Invoices', 'All client accounts are settled.');
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.status !== 'paid'
          ? {
              ...inv,
              chase_count: inv.chase_count + 1,
              last_chased_at: new Date().toISOString(),
              last_channel: 'whatsapp',
            }
          : inv
      )
    );

    addToast(
      'success',
      `Auto-Chaser Triggered for ${overdue.length} Invoices`,
      'Smart cadences dispatched via Verified WhatsApp API & Email'
    );
  };

  const handleSaveInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const invoiceNum = formData.get('invoice_number') as string;
    const clientName = formData.get('client_name') as string;
    const contactName = formData.get('contact_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const amount = Number(formData.get('amount'));
    const currency = formData.get('currency') as CurrencyCode;
    const dueDate = formData.get('due_date') as string;

    if (editingInvoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...inv,
                invoice_number: invoiceNum,
                amount,
                currency,
                due_date: dueDate,
                client: {
                  ...inv.client,
                  name: clientName,
                  contact_name: contactName,
                  email,
                  phone,
                },
              }
            : inv
        )
      );
      addToast('success', `Invoice ${invoiceNum} updated`);
    } else {
      const newInv: InvoiceRecord = {
        id: `inv-${Date.now()}`,
        invoice_number: invoiceNum,
        client_id: `cl-${Date.now()}`,
        client: {
          id: `cl-${Date.now()}`,
          name: clientName,
          contact_name: contactName,
          email,
          phone,
        },
        amount,
        currency,
        due_date: dueDate,
        days_overdue: 0,
        status: 'pending',
        chase_count: 0,
      };
      setInvoices((prev) => [newInv, ...prev]);
      addToast('success', `Invoice ${invoiceNum} created`);
    }

    setIsAddModalOpen(false);
    setEditingInvoice(null);
  };

  return (
    <div
      className={`min-h-screen font-['Plus_Jakarta_Sans',sans-serif] ${
        theme === 'dark' ? 'bg-[#0F172A] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-30 border-b px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md ${
          theme === 'dark'
            ? 'bg-[#0F172A]/90 border-slate-800'
            : 'bg-white/90 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#FF5722] flex items-center justify-center text-white shadow-md">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                  <path d="M4 5L12 11L20 5L17 19L12 16L7 19L4 5Z" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                dueFox<span className="text-[#FF5722]">.co</span>
              </span>
            </Link>
            <span
              className={`hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded border ${
                theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              AR Workspace
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBatchChase}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5722] hover:bg-[#F4511E] text-white shadow transition-all cursor-pointer glow-orange-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Batch Chase Overdue</span>
            </button>

            <button
              onClick={() => {
                setEditingInvoice(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Treasury & SWIFT Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/"
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Exit to Landing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stat Cards Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Total Overdue (USD)</span>
              <DollarSign className="w-4 h-4 text-[#FF5722]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              ${stats.overdueUSD.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats.escalatedCount + stats.pendingCount} unpaid accounts</span>
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Overdue (EUR &amp; GBP)</span>
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tabular-nums">
              €{stats.overdueEUR.toLocaleString()} <span className="text-xs text-slate-400">/ £{stats.overdueGBP.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SWIFT / Virtual IBAN Active</span>
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Escalated Accounts</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
              {stats.escalatedCount}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Active WhatsApp executive pings
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Recovered This Month</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              ${stats.paidUSD.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-slate-400 font-mono">
              {stats.paidCount} settlements reconciled
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search invoice or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-[#FF5722] ${
                  theme === 'dark'
                    ? 'bg-[#1E293B] border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Currency selector */}
            <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs">
              {(['ALL', 'USD', 'EUR', 'GBP', 'INR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
                    selectedCurrency === curr
                      ? 'bg-[#FF5722] text-white font-bold'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Status selector */}
            <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs">
              {(['ALL', 'escalated', 'pending', 'paid'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1.5 font-medium capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#FF5722] text-white font-bold'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredInvoices.length}</strong> of {invoices.length} invoices
          </span>
        </div>

        {/* Invoices Table */}
        <div
          className={`rounded-2xl border overflow-hidden shadow-xl ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-mono border-b ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 text-slate-400 border-slate-800'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client / Entity</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status &amp; Aging</th>
                  <th className="py-3 px-4">Chases</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-medium">
                      <Link
                        to={`/pay/${inv.invoice_number}`}
                        className="text-[#FF5722] hover:underline flex items-center gap-1 font-bold"
                        title="Open Public Payment Portal"
                      >
                        <span>{inv.invoice_number}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{inv.client.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {inv.client.contact_name} · {inv.client.email}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">{inv.due_date}</td>

                    <td className="py-3 px-4">
                      {inv.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Paid &amp; Settled
                        </span>
                      )}
                      {inv.status === 'escalated' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-950/70 border border-orange-800/60 text-orange-400">
                          <Zap className="w-3 h-3" /> {inv.days_overdue}d Overdue · WhatsApp
                        </span>
                      )}
                      {inv.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/70 border border-amber-800/60 text-amber-400">
                          <Clock className="w-3 h-3" /> {inv.days_overdue}d Overdue
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                        <span>{inv.chase_count} pings</span>
                        {inv.last_channel === 'whatsapp' ? (
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Mail className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== 'paid' ? (
                          <button
                            onClick={() => setChaseInvoice(inv)}
                            className="px-2.5 py-1 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Chase</span>
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            inv.status === 'paid'
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          {inv.status === 'paid' ? 'Reopen' : 'Mark Paid'}
                        </button>

                        <button
                          onClick={() => setTimelineInvoice(inv)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Audit Trail"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingInvoice(inv);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Chase Preview Modal */}
      {chaseInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setChaseInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase">
                Dispatch Automated Reminder
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Chase {chaseInvoice.invoice_number} ({chaseInvoice.client.name})
              </h3>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Recipient:</span>
                <span className="text-white font-semibold">{chaseInvoice.client.contact_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Overdue Balance:</span>
                <span className="text-[#FF5722] font-mono font-bold">
                  {chaseInvoice.currency} {chaseInvoice.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Public Portal URL:</span>
                <span className="text-slate-300 font-mono">
                  app.duefox.co/pay/{chaseInvoice.invoice_number}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleSendChase(chaseInvoice.id, 'whatsapp')}
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Notice (98% Open)</span>
              </button>

              <button
                onClick={() => handleSendChase(chaseInvoice.id, 'email')}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Send Courtesy Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Timeline Modal */}
      {timelineInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setTimelineInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Forensic Audit Log
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Cadence History · {timelineInvoice.invoice_number}
              </h3>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex gap-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Invoice Created &amp; Synced</div>
                  <div className="text-slate-400 text-[11px]">Due date recorded: {timelineInvoice.due_date}</div>
                </div>
              </div>

              <div className="flex gap-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Day -3 Pre-Due Email Delivered</div>
                  <div className="text-slate-400 text-[11px]">Opened by {timelineInvoice.client.contact_name}</div>
                </div>
              </div>

              <div className="flex gap-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Day +5 WhatsApp Escalation Triggered</div>
                  <div className="text-slate-400 text-[11px]">Blue ticks received · Link clicked from client device</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTimelineInvoice(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Audit Trail
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingInvoice(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h3>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Invoice #</label>
                  <input
                    name="invoice_number"
                    defaultValue={editingInvoice?.invoice_number || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    defaultValue={editingInvoice?.due_date || '2026-10-15'}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Entity</label>
                  <input
                    name="client_name"
                    defaultValue={editingInvoice?.client.name || ''}
                    placeholder="Acme Corp LLC"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person</label>
                  <input
                    name="contact_name"
                    defaultValue={editingInvoice?.client.contact_name || ''}
                    placeholder="Jane Doe"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingInvoice?.client.email || ''}
                    placeholder="ap@company.com"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp / Phone</label>
                  <input
                    name="phone"
                    defaultValue={editingInvoice?.client.phone || ''}
                    placeholder="+1 555-019-2834"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingInvoice?.amount || 5000}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Currency</label>
                  <select
                    name="currency"
                    defaultValue={editingInvoice?.currency || 'USD'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl text-xs"
                >
                  Save &amp; Arm Cadence
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile & SWIFT Settings Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase">
                Treasury &amp; Bank Rails
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">DueFox Organization Settings</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  value={profile.company_name}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Billing Email</label>
                <input
                  value={profile.contact_email}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">SWIFT / BIC Code</label>
                <input
                  value={profile.swift_bic}
                  onChange={(e) => setProfile({ ...profile, swift_bic: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Virtual Dedicated IBAN</label>
                <input
                  value={profile.virtual_iban}
                  onChange={(e) => setProfile({ ...profile, virtual_iban: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                addToast('success', 'Treasury & SWIFT details saved');
              }}
              className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl text-xs mt-2"
            >
              Save Organization Settings
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-3.5 rounded-xl border shadow-xl text-xs flex items-start gap-2.5 bg-slate-900 ${
              t.type === 'success'
                ? 'border-emerald-500/60 text-white'
                : t.type === 'error'
                ? 'border-rose-500/60 text-white'
                : 'border-slate-700 text-white'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : t.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold">{t.title}</div>
              {t.message && <div className="text-slate-400 text-[11px] mt-0.5">{t.message}</div>}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
