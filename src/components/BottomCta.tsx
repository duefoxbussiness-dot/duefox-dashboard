import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface BottomCtaProps {
  onOpenTrial: () => void;
}

export const BottomCta: React.FC<BottomCtaProps> = ({ onOpenTrial }) => {
  return (
    <section className="py-20 bg-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#1E293B] to-[#151E2E] border-2 border-slate-700/80 p-8 sm:p-14 lg:p-16 text-center shadow-2xl overflow-hidden">
          {/* Subtle orange background aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5722]/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Pill kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>PUT CASH FLOW ON AUTOPILOT</span>
            </div>

            {/* Required Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight balance">
              Stop Acting Like a Collection Agency. Let DueFox Recover Your Cash Flow.
            </h2>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Automate polite, high-converting Email and WhatsApp cadences. Recover payments via SWIFT, virtual IBAN, and Stripe without ruining valuable client partnerships.
            </p>

            {/* CTA Button */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenTrial}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-[#FF5722] hover:bg-[#F4511E] rounded-xl shadow-xl shadow-orange-950/50 hover:shadow-orange-900/70 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 glow-orange cursor-pointer"
              >
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Guarantee points */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                5 Invoices Free Forever
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No Credit Card Required
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Bank-Grade AES-256 Encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
