import React from 'react';
import { ArrowRight, CheckCircle2, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#0B1320] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-3">
            <span>EFFORTLESS 3-STEP PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How DueFox Recovers Cash in 3 Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Set it up once in 4 minutes. Your finance team stops manually copying emails and your cash lands directly into your bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-orange-500/20 via-[#FF5722]/50 to-orange-500/20 -translate-y-12 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 bg-[#1E293B] rounded-2xl p-7 border border-slate-700/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FF5722] flex items-center justify-center font-bold text-lg mb-6 shadow-inner">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sync Your Invoices</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                One-click integration with QuickBooks, Xero, Stripe, FreshBooks, or simple CSV upload. DueFox ingests due dates, amounts, and contact details automatically.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero double-entry accounting</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 bg-[#1E293B] rounded-2xl p-7 border border-[#FF5722]/60 shadow-xl shadow-orange-950/20 flex flex-col justify-between">
            <div className="absolute -top-3 right-6 bg-[#FF5722] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
              SMART CADENCE
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-orange-900/40">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Deploy Escalation Cadence</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Select pre-built, polite B2B templates or customize tone. DueFox sends pre-due reminders, due date links, and escalates to verified WhatsApp when invoices reach critical days.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-orange-300">
              <Zap className="w-4 h-4 text-[#FF5722] shrink-0" />
              <span>Human-crafted, relationship-safe tone</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 bg-[#1E293B] rounded-2xl p-7 border border-slate-700/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FF5722] flex items-center justify-center font-bold text-lg mb-6 shadow-inner">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Automate Reconciliation</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Clients pay in their preferred channel—SWIFT wire, virtual IBAN, SEPA, or Stripe ACH. When cash arrives, DueFox matches the reference and immediately silences further chasing.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant webhook stop &amp; ledger update</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
