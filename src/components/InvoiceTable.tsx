import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Trash2,
  Send,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  RotateCcw,
  Building,
  Filter,
  Pencil,
} from 'lucide-react';
import { CurrencyCode, InvoiceStatus, InvoiceWithClient } from '../types';

interface InvoiceTableProps {
  invoices: InvoiceWithClient[];
  loading: boolean;
  onMarkPaid: (id: string, newStatus: InvoiceStatus) => Promise<void>;
  onEdit: (invoice: InvoiceWithClient) => void;
  onDelete: (id: string) => Promise<void>;
  onOpenChaseModal: (invoice: InvoiceWithClient) => void;
  onOpenAddModal: () => void;
  selectedCurrency: 'ALL' | CurrencyCode;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  loading,
  onMarkPaid,
  onEdit,
  onDelete,
  onOpenChaseModal,
  onOpenAddModal,
  selectedCurrency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');
  const [copiedLinkMap, setCopiedLinkMap] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter invoices based on search, status, and currency
  const filteredInvoices = invoices.filter((inv) => {
    // Currency filter
    if (selectedCurrency !== 'ALL' && inv.currency !== selectedCurrency) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'escalated' && inv.status !== 'escalated') return false;
      if (statusFilter === 'pending' && inv.status !== 'pending') return false;
      if (statusFilter === 'paid' && inv.status !== 'paid') return false;
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = inv.client.name.toLowerCase().includes(q);
      const matchEmail = inv.client.email.toLowerCase().includes(q);
      const matchInvNo = inv.invoice_number.toLowerCase().includes(q);
      const matchCompany = inv.client.company?.toLowerCase().includes(q);
      return matchName || matchEmail || matchInvNo || matchCompany;
    }

    return true;
  });

  const handleCopyLink = (invoice: InvoiceWithClient) => {
    const link = invoice.payment_link || `https://pay.duefox.co/inv/${invoice.invoice_number}`;
    navigator.clipboard.writeText(link);
    setCopiedLinkMap((prev) => ({ ...prev, [invoice.id]: true }));
    setTimeout(() => {
      setCopiedLinkMap((prev) => ({ ...prev, [invoice.id]: false }));
    }, 2000);
  };

  const handleDeleteConfirm = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice? This will remove all associated chase history.')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Format currency
  const formatAmount = (amount: number, currency: CurrencyCode) => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format due date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Table Header Controls: Search & Segmented Filter */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by client, email, company, or invoice #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Invoices ({invoices.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({invoices.filter((i) => i.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('escalated')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'escalated'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Escalated 30+d ({invoices.filter((i) => i.status === 'escalated').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Paid ({invoices.filter((i) => i.status === 'paid').length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 px-5">Client Name</th>
              <th scope="col" className="py-3 px-5">Email & Contact</th>
              <th scope="col" className="py-3 px-5 text-right">Amount ($ / ₹)</th>
              <th scope="col" className="py-3 px-5">Due Date & Aging</th>
              <th scope="col" className="py-3 px-5">Status Badge</th>
              <th scope="col" className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {loading ? (
              // Skeleton loading states
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-5">
                    <div className="h-4 bg-neutral-200 rounded w-32 mb-1" />
                    <div className="h-3 bg-neutral-100 rounded w-20" />
                  </td>
                  <td className="py-4 px-5">
                    <div className="h-4 bg-neutral-200 rounded w-40" />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="h-4 bg-neutral-200 rounded w-20 ml-auto" />
                  </td>
                  <td className="py-4 px-5">
                    <div className="h-4 bg-neutral-200 rounded w-28" />
                  </td>
                  <td className="py-4 px-5">
                    <div className="h-6 bg-neutral-200 rounded-md w-16" />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="h-8 bg-neutral-200 rounded w-24 ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-5 text-center">
                  <div className="max-w-sm mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-slate-400">
                      <Filter className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">No invoices match your criteria</p>
                    <p className="text-xs text-slate-500">
                      Try updating your search term or filter options, or add a new invoice to start chasing.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenAddModal}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Create New Invoice</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const isEscalated = inv.status === 'escalated';
                const isPaid = inv.status === 'paid';
                const isPending = inv.status === 'pending';
                const isCopied = copiedLinkMap[inv.id];

                // Client initials for clean icon
                const initials = inv.client.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={inv.id}
                    className={`transition-colors hover:bg-neutral-50/70 group ${
                      isEscalated ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    {/* 1. Client Name Column */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isEscalated
                              ? 'bg-rose-100 text-rose-800'
                              : isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-slate-700'
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {inv.client.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <span className="font-mono text-[11px] text-slate-600 font-medium">
                              {inv.invoice_number}
                            </span>
                            {inv.client.company && (
                              <>
                                <span aria-hidden="true" className="text-neutral-300">·</span>
                                <span className="truncate max-w-[120px] text-[11px] text-slate-500">
                                  {inv.client.company}
                                </span>
                              </>
                            )}
                          </div>
                          {inv.notes && (
                            <p
                              className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5"
                              title={inv.notes}
                            >
                              <span className="font-medium text-slate-600">Work:</span> {inv.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Email Column */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <a
                          href={`mailto:${inv.client.email}`}
                          className="text-xs font-medium text-slate-700 hover:text-slate-950 underline-offset-2 hover:underline block truncate max-w-[180px]"
                        >
                          {inv.client.email}
                        </a>
                        {inv.client.phone && (
                          <p className="text-[11px] text-slate-400 font-mono">
                            {inv.client.phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* 3. Amount Column */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="font-mono tabular-nums text-sm font-bold text-slate-900">
                        {formatAmount(inv.amount, inv.currency)}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {inv.currency}
                      </span>
                    </td>

                    {/* 4. Due Date & Aging Column */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-800">
                          {formatDate(inv.due_date)}
                        </p>
                        <p className="text-[11px]">
                          {isPaid ? (
                            <span className="text-emerald-700 font-medium">Settled & Closed</span>
                          ) : inv.days_overdue > 0 ? (
                            <span
                              className={`font-medium ${
                                inv.days_overdue >= 30 ? 'text-rose-600 font-semibold' : 'text-amber-700'
                              }`}
                            >
                              {inv.days_overdue} {inv.days_overdue === 1 ? 'day' : 'days'} overdue
                            </span>
                          ) : inv.days_overdue === 0 ? (
                            <span className="text-amber-700 font-medium">Due Today</span>
                          ) : (
                            <span className="text-slate-500">
                              Due in {Math.abs(inv.days_overdue)} days
                            </span>
                          )}
                        </p>
                      </div>
                    </td>

                    {/* 5. Status Badge Column */}
                    <td className="py-3.5 px-5">
                      {isPaid && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid</span>
                        </span>
                      )}

                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}

                      {isEscalated && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Escalated</span>
                        </span>
                      )}

                      {/* Chase count indicator if chased */}
                      {inv.chase_count > 0 && !isPaid && (
                        <span className="block text-[10px] text-slate-400 font-mono mt-1">
                          {inv.chase_count} {inv.chase_count === 1 ? 'chase' : 'chases'} sent
                        </span>
                      )}
                    </td>

                    {/* 6. Actions Column */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Chase / Reminder Trigger Button */}
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => onOpenChaseModal(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                            title="Preview and dispatch automated chase reminder"
                          >
                            <Send className="w-3 h-3 text-slate-600" />
                            <span>Chase</span>
                          </button>
                        )}

                        {/* Copy / Open Payment Link */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(inv)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                          title="Copy direct payment gateway link"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Edit Button next to Mark Paid */}
                        <button
                          type="button"
                          onClick={() => onEdit(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 rounded-md transition-colors cursor-pointer"
                          title="Edit invoice details and notes"
                        >
                          <Pencil className="w-3 h-3 text-slate-600" />
                          <span>Edit</span>
                        </button>

                        {/* Mark Paid / Reopen Button */}
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => onMarkPaid(inv.id, 'pending')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                            title="Reopen invoice as pending"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reopen</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onMarkPaid(inv.id, 'paid')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                            title="Mark invoice as paid and settled"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                        )}

                        {/* Delete Invoice Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteConfirm(inv.id)}
                          disabled={deletingId === inv.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete invoice record"
                          aria-label="Delete invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary Count */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-mono text-slate-800">{filteredInvoices.length}</strong> of{' '}
            <strong className="font-mono text-slate-800">{invoices.length}</strong> total invoices
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Overdue items automatically escalate at <strong className="font-mono text-slate-800">30+ days</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Green = Paid</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Yellow = Pending</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Red = Escalated</span>
          </span>
        </div>
      </div>
    </div>
  );
};
