import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PricingPlan } from '../types';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan | null;
}

export const TrialModal: React.FC<TrialModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [billingTool, setBillingTool] = useState('stripe');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.location.href = '/dashboard';
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setEmail('');
    setCompany('');
    onClose();
  };

  const planName = selectedPlan?.name || 'Free Trial (5 Invoices Free)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Close button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                {planName}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              Start Chasing Free with DueFox
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 mb-6">
              Recover overdue receivables in minutes. 5 active invoices free forever. No credit card required.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company / Agency Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Acme Global Media"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Invoicing / Accounting Tool
                </label>
                <select
                  value={billingTool}
                  onChange={(e) => setBillingTool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#FF5722]"
                >
                  <option value="stripe">Stripe Invoicing</option>
                  <option value="quickbooks">QuickBooks Online</option>
                  <option value="xero">Xero Accounting</option>
                  <option value="freshbooks">FreshBooks</option>
                  <option value="csv">Direct Spreadsheet / CSV</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-950/40 glow-orange flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Activate Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Secure
                </span>
                <span>·</span>
                <span>Zero credit card commitment</span>
              </div>
            </form>
          </div>
        ) : (
          /* Success state */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Your DueFox Ledger is Ready!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              We just sent your verification link to <strong className="text-white">{email}</strong>. You can now import your first 5 invoices and test the intelligent cadence.
            </p>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 text-left text-xs space-y-2 mt-4">
              <div className="flex items-center justify-between text-slate-300">
                <span>Selected Plan:</span>
                <span className="font-semibold text-white">{planName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Integration Rail:</span>
                <span className="font-semibold text-white capitalize">{billingTool}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Free Credits:</span>
                <span className="text-emerald-400 font-bold font-mono">5 Invoices Loaded</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors cursor-pointer"
            >
              Close &amp; Check Inbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
