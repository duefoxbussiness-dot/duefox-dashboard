import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Mail, Phone, User, Link as LinkIcon, Building2, Clock, Sparkles, FileText, Pencil } from 'lucide-react';
import { CurrencyCode, InvoiceWithClient, NewInvoiceInput } from '../types';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewInvoiceInput) => Promise<void>;
  initialInvoice?: InvoiceWithClient | null;
}

export const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialInvoice,
}) => {
  const isEditing = Boolean(initialInvoice);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [dueDate, setDueDate] = useState(() => {
    // Default to 7 days from now (2026-09-24 -> 2026-10-01)
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [paymentLink, setPaymentLink] = useState('');
  const [chaseSchedule, setChaseSchedule] = useState<'gentle' | 'standard' | 'assertive'>('standard');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialInvoice) {
        setClientName(initialInvoice.client.name || '');
        setEmail(initialInvoice.client.email || '');
        setPhone(initialInvoice.client.phone || '');
        setCompany(initialInvoice.client.company || '');
        setAmount(String(initialInvoice.amount));
        setCurrency(initialInvoice.currency);
        setDueDate(initialInvoice.due_date);
        setPaymentLink(initialInvoice.payment_link || '');
        setChaseSchedule(initialInvoice.chase_schedule || 'standard');
        setNotes(initialInvoice.notes || '');
      } else {
        setClientName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setAmount('');
        setCurrency('USD');
        const d = new Date();
        d.setDate(d.getDate() + 7);
        setDueDate(d.toISOString().split('T')[0]);
        setPaymentLink('');
        setChaseSchedule('standard');
        setNotes('');
      }
      setError(null);
    }
  }, [isOpen, initialInvoice]);

  if (!isOpen) return null;

  const handleSetPresetDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim()) {
      setError('Client name is required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('A valid client email address is required for automated chasing');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please specify a valid invoice amount greater than 0');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        clientName: clientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || undefined,
        amount: parsedAmount,
        currency,
        dueDate,
        paymentLink: paymentLink.trim() || undefined,
        chaseSchedule,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setClientName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setAmount('');
      setPaymentLink('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save invoice record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-xl rounded-xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            {isEditing && (
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Pencil className="w-4 h-4" />
              </div>
            )}
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                {isEditing ? `Edit Invoice (${initialInvoice!.invoice_number})` : 'Add New Invoice'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEditing
                  ? 'Update client details, invoice amount, due date, and work description.'
                  : 'Enter invoice & client details for automated tracking & chasing.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Client Details Section */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Client Contact Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe or Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="billing@client.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone (for SMS/WhatsApp Chasing)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000 / +91 98..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Acme Studios LLC"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Invoice & Payment Terms
            </span>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm font-semibold font-mono text-slate-500">
                    {currency === 'USD' ? '$' : '₹'}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="2500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm font-mono tabular-nums bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <div className="flex rounded-lg border border-neutral-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      currency === 'USD' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-neutral-100'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('INR')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      currency === 'INR' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-neutral-100'
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>
            </div>

            {/* Due Date & Presets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Due Date <span className="text-rose-500">*</span>
                </label>
                {/* Presets */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSetPresetDate(7)}
                    className="text-slate-700 hover:text-slate-950 underline cursor-pointer"
                  >
                    +7d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPresetDate(14)}
                    className="text-slate-700 hover:text-slate-950 underline cursor-pointer"
                  >
                    +14d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPresetDate(-35)}
                    className="text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer"
                    title="Simulate 35 days overdue for escalation test"
                  >
                    35d Overdue (Test)
                  </button>
                </div>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            {/* Payment Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Link (Stripe, Razorpay, Wise, PayPal)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  placeholder="https://pay.stripe.com/... or https://rzp.io/..."
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Leave blank to auto-generate a secure dueFox branded payment gateway link.
              </p>
            </div>

            {/* Invoice Notes / Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Notes / Description
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <textarea
                  rows={2}
                  placeholder="e.g. Q3 Software development sprint, design deliverables, website migration..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 resize-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Specify what work this invoice is for (included in invoice records and chase messages).
              </p>
            </div>

            {/* Chase Cadence Schedule */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Automated Chase Schedule
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChaseSchedule('gentle')}
                  className={`p-2.5 text-left border rounded-lg transition-colors cursor-pointer ${
                    chaseSchedule === 'gentle'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">Gentle</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Every 7 days, courteous tone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChaseSchedule('standard')}
                  className={`p-2.5 text-left border rounded-lg transition-colors cursor-pointer ${
                    chaseSchedule === 'standard'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">Standard</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Days 3, 7, 14 & 21</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChaseSchedule('assertive')}
                  className={`p-2.5 text-left border rounded-lg transition-colors cursor-pointer ${
                    chaseSchedule === 'assertive'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">Assertive</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Multi-channel with legal escalation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-neutral-200 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isEditing ? 'Update Invoice' : 'Create Invoice & Schedule Chase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
