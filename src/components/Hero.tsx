import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTrial, onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [simulatedPaid, setSimulatedPaid] = useState(false);

  const handleSimulatePayment = () => {
    setSimulatedPaid(true);
    setTimeout(() => {
      setSimulatedPaid(false);
    }, 4500);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#0F172A]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-[#FF5722]/20 via-[#FF5722]/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-20 left-1/4 w-[350px] h-[250px] bg-indigo-600/10 blur-3xl rounded-full" />
        <div className="absolute top-20 right-1/4 w-[350px] h-[250px] bg-amber-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top announcement kicker */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5722] animate-pulse" />
            <span className="text-orange-300 font-semibold">New:</span>
            <span>Intelligent WhatsApp Escalate 2.0 with SWIFT & IBAN Reconcile</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] balance">
            Get Paid <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] via-[#FF5722] to-[#FF8A65]">3x Faster</span> Without Awkward Follow-Up Emails
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Automate your B2B invoice chasing via intelligent Email & WhatsApp cadences. Collect global payments effortlessly.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenTrial}
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-[#FF5722] hover:bg-[#F4511E] rounded-xl shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 glow-orange cursor-pointer"
            >
              <span>Start Free Trial (5 Invoices Free)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:border-slate-600 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[#FF5722]">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Quick value notes */}
          <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No credit card required
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              4-minute setup
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Hero Interactive Showcase / Product Preview Canvas */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-700/50 to-slate-800/40 p-1 sm:p-2 border border-slate-700/70 shadow-2xl shadow-black/80">
            {/* Top browser/window bar */}
            <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-slate-700/60">
              <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                    app.duefox.co/cadences/acme-corp
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Cadence Active · Smart Timing ON</span>
                  </div>
                </div>
              </div>

              {/* Interactive preview workspace */}
              <div className="p-4 sm:p-6 lg:p-8 bg-[#0F172A]/90 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left side: Invoice summary and automated escalation trigger */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono">INV-2026-084</span>
                      <span className="text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                        12 Days Overdue
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-white">Acme Global Media LLC</h4>
                        <p className="text-xs text-slate-400">Quarterly Enterprise Retainer</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-white tabular-nums">$14,850.00</span>
                        <p className="text-[11px] text-slate-400">USD via SWIFT / Stripe</p>
                      </div>
                    </div>

                    {/* Cadence Timeline */}
                    <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Day -3: Friendly Pre-Due Email</span>
                        </div>
                        <span className="text-slate-500 font-mono">Opened · 3 clicks</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Day 0: Due Date Direct Payment Link</span>
                        </div>
                        <span className="text-slate-500 font-mono">Delivered</span>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg border border-orange-500/30">
                        <div className="flex items-center gap-2 text-orange-200 font-medium">
                          <Zap className="w-4 h-4 text-[#FF5722] shrink-0" />
                          <span>Day +10: WhatsApp Executive Escalation</span>
                        </div>
                        <span className="text-xs font-semibold text-orange-400 font-mono">Read Receipts: Yes</span>
                      </div>
                    </div>

                    {/* Simulator Action */}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        onClick={handleSimulatePayment}
                        className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          simulatedPaid
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                            : 'bg-gradient-to-r from-orange-600 to-[#FF5722] text-white hover:brightness-110 shadow-md'
                        }`}
                      >
                        {simulatedPaid ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Payment Received! $14,850 Settled in Stripe & SWIFT</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            <span>Test Live Escalation & Instant Pay Simulator</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side: Live Phone / WhatsApp + Portal Remittance Mockup */}
                <div className="lg:col-span-6">
                  <div className="bg-[#1E293B] rounded-xl border border-slate-700/70 p-4 sm:p-5 relative shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('whatsapp')}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                            activeTab === 'whatsapp'
                              ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          WhatsApp Delivery
                        </button>
                        <button
                          onClick={() => setActiveTab('email')}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                            activeTab === 'email'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Executive Email
                        </button>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FF5722]" /> 10:14 AM (Client Local Time)
                      </span>
                    </div>

                    {activeTab === 'whatsapp' ? (
                      /* WhatsApp preview */
                      <div className="mt-4 space-y-3">
                        <div className="bg-[#0B141B] rounded-lg p-3.5 border border-emerald-950/60 font-sans text-xs text-slate-200 space-y-2 relative">
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> DueFox Collections Bot · Verified
                            </span>
                            <span className="text-slate-500">10:14 AM</span>
                          </div>
                          <p className="leading-relaxed text-slate-200">
                            Hi Marcus, quick heads-up regarding <span className="font-semibold text-white">Acme Global Media’s</span> invoice <span className="font-mono text-orange-300">#INV-2026-084 ($14,850.00 USD)</span>.
                          </p>
                          <p className="text-slate-300">
                            It reached day 12 past due. You can clear this with 1 click via Corporate Card, SWIFT Wire, or direct ACH transfer below:
                          </p>
                          <div className="bg-[#1E293B] p-2.5 rounded border border-slate-700 flex items-center justify-between">
                            <div className="text-left">
                              <span className="block font-semibold text-white text-xs">Instant Settlement Link</span>
                              <span className="text-[11px] text-slate-400">pay.duefox.co/c/acme-8492</span>
                            </div>
                            <span className="px-2.5 py-1 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded text-[11px]">
                              Pay Now
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-400">
                            <span>Read 10:15 AM</span>
                            <span className="font-mono text-xs">✓✓</span>
                          </div>
                        </div>

                        {/* Remittance options tag */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Globe className="w-3 h-3 text-[#FF5722]" /> SWIFT, IBAN & Card Rails
                          </span>
                          <span className="text-emerald-400 font-medium">Automatic Reconciliation</span>
                        </div>
                      </div>
                    ) : (
                      /* Email preview */
                      <div className="mt-4 space-y-3">
                        <div className="bg-slate-900 rounded-lg p-3.5 border border-slate-800 font-sans text-xs text-slate-200 space-y-2">
                          <div className="border-b border-slate-800 pb-2 text-[11px] text-slate-400 space-y-1">
                            <div><strong className="text-slate-300">From:</strong> billing@yourcompany.com via DueFox</div>
                            <div><strong className="text-slate-300">To:</strong> marcus.vance@acmeglobal.com</div>
                            <div><strong className="text-slate-300">Subject:</strong> Statement for Acme Global Media (INV-2026-084)</div>
                          </div>
                          <p className="leading-relaxed text-slate-200 pt-1">
                            Dear Marcus, our automated ledger noted that Invoice #INV-2026-084 is awaiting remittance. Attached is the updated SWIFT Wire instruction sheet and a direct Stripe portal link.
                          </p>
                          <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700 flex items-center justify-between">
                            <span className="text-white font-mono font-medium">$14,850.00 USD</span>
                            <span className="text-[#FF5722] text-xs font-semibold flex items-center gap-1">
                              View Invoice & Pay <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST BADGES SECTION */}
        <div className="mt-16 pt-10 border-t border-slate-800/80">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-7">
            Trusted Infrastructure & Multi-Currency Settlement Protocols
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* Badge 1: Stripe Connect */}
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-white">Stripe Connect</span>
                <span className="block text-[11px] text-slate-400">Instant Card & ACH</span>
              </div>
            </div>

            {/* Badge 2: SWIFT Wire */}
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-white">SWIFT Wire</span>
                <span className="block text-[11px] text-slate-400">Global IBAN Routing</span>
              </div>
            </div>

            {/* Badge 3: WhatsApp API */}
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-white">WhatsApp API</span>
                <span className="block text-[11px] text-slate-400">Official Meta Partner</span>
              </div>
            </div>

            {/* Badge 4: Supabase Encrypted */}
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-700/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-white">Supabase Encrypted</span>
                <span className="block text-[11px] text-slate-400">SOC2 Type II & AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
