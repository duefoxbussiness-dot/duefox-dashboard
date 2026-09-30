import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  MessageCircle,
  CreditCard,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  ShieldCheck,
  Send,
  Zap,
  Globe,
  ExternalLink
} from 'lucide-react';

export const FeatureCarousel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Tab 1 interactive state
  const [chasingStatus, setChasingStatus] = useState<Record<string, boolean>>({
    'inv-1': false,
    'inv-2': true,
    'inv-3': true,
  });

  // Tab 3 interactive payment method state
  const [selectedRail, setSelectedRail] = useState<'swift' | 'stripe' | 'sepa'>('swift');

  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds
  const TICK_INTERVAL = 50; // update progress every 50ms

  const tabs = [
    {
      id: 'ledger',
      label: 'Cash Flow Ledger',
      icon: TrendingUp,
      title: 'Real-Time Cash Flow Ledger',
      subtitle: 'Complete visibility into aging buckets and collection velocity',
      tagline: 'Instant DSO Reduction',
    },
    {
      id: 'automation',
      label: 'Multi-Channel Cadence',
      icon: MessageCircle,
      title: 'Multi-Channel Automation',
      subtitle: 'Escalate politely from friendly emails to WhatsApp pings',
      tagline: 'Zero Awkward Calls',
    },
    {
      id: 'remittance',
      label: 'Global Remittance',
      icon: CreditCard,
      title: 'High-Ticket Remittance ($1k–$50k)',
      subtitle: 'SWIFT wire instructions, virtual IBANs, and Stripe direct rails',
      tagline: '135+ Currencies',
    },
    {
      id: 'audit',
      label: 'Audit & Read Receipts',
      icon: FileCheck2,
      title: 'Audit Trail & Read Receipts',
      subtitle: 'Know exactly when the invoice was viewed, downloaded, and approved',
      tagline: 'Tamper-Proof Logs',
    },
  ];

  // Auto-play logic with progress bar
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((curr) => (curr + 1) % tabs.length);
          return 0;
        }
        return prev + (TICK_INTERVAL / AUTO_PLAY_INTERVAL) * 100;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, tabs.length]);

  const handleSelectTab = (index: number) => {
    setActiveTab(index);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % tabs.length);
    setProgress(0);
  };

  return (
    <section id="features" className="py-24 bg-[#0F172A] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 -left-64 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-64 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-4">
            <span>AUTOPILOT AR PLATFORM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Recover High-Ticket Invoices Without Burning Bridges
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            DueFox connects to your billing system, detects overdue milestones, and activates calibrated reminders that stop immediately the second cash arrives.
          </p>
        </div>

        {/* 4 Tabs Selector Bar with 5-second progress bars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(idx)}
                className={`relative text-left p-4 rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                  isActive
                    ? 'bg-[#1E293B] border-[#FF5722] shadow-lg shadow-orange-950/30'
                    : 'bg-[#1E293B]/50 border-slate-800 hover:border-slate-700 hover:bg-[#1E293B]/80 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#FF5722] text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isActive ? 'text-orange-400' : 'text-slate-400'
                    }`}
                  >
                    {tab.tagline}
                  </span>
                </div>

                <div
                  className={`text-sm font-semibold truncate ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {tab.label}
                </div>

                {/* Animated 5s Progress Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5722] to-amber-500 transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Main Stage Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-[#1E293B] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden"
        >
          {/* Top Stage Bar */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-orange-400 font-semibold uppercase">
                  Tab 0{activeTab + 1}
                </span>
                <span className="text-slate-600">/</span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {tabs[activeTab].title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {tabs[activeTab].subtitle}
              </p>
            </div>

            {/* Carousel Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs flex items-center gap-1 px-2.5 cursor-pointer"
                title={isPaused ? 'Resume 5s carousel' : 'Pause auto-sliding'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>5s Timer Active</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Previous tab"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Next tab"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Feature Stage Body */}
          <div className="p-5 sm:p-8 min-h-[460px] flex items-center">
            {/* TAB 1: Real-Time Cash Flow Ledger */}
            {activeTab === 0 && (
              <div className="w-full space-y-6">
                {/* Metric Summary Ribbon */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Total Outstanding</span>
                    <span className="text-2xl font-bold font-mono text-white tabular-nums">$184,200</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">14 active accounts</span>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-amber-400 block mb-1">Overdue & Chasing</span>
                    <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">$42,650</span>
                    <span className="text-[11px] text-emerald-400 mt-1 block">3 escalated via WhatsApp</span>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Avg. DSO</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">14.2d</span>
                      <span className="text-xs text-slate-500 line-through">44.8d</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 mt-1 block">-68% payment delay</span>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Recovered This Month</span>
                    <span className="text-2xl font-bold font-mono text-white tabular-nums">$112,400</span>
                    <span className="text-[11px] text-emerald-400 mt-1 block">99.4% settlement rate</span>
                  </div>
                </div>

                {/* Aging buckets visual progress */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">Aging Velocity Distribution</span>
                    <span className="font-mono text-emerald-400">77% current or &lt;15 days</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden">
                    <div style={{ width: '65%' }} className="bg-emerald-500" title="Current: $120,000" />
                    <div style={{ width: '20%' }} className="bg-amber-500" title="1-15 Days: $36,800" />
                    <div style={{ width: '10%' }} className="bg-orange-500" title="16-30 Days: $18,400" />
                    <div style={{ width: '5%' }} className="bg-rose-500" title="30+ Days: $9,000" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Current ($120k)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 1-15d ($36.8k)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> 16-30d ($18.4k)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> 31d+ ($9k)</span>
                  </div>
                </div>

                {/* Interactive live table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Invoice #</th>
                        <th className="py-2.5 px-4">Client / Entity</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4">Overdue</th>
                        <th className="py-2.5 px-4">Current Cadence</th>
                        <th className="py-2.5 px-4 text-right">Auto-Chaser</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
                      <tr>
                        <td className="py-3 px-4 font-mono font-medium text-white">#INV-4019</td>
                        <td className="py-3 px-4 font-semibold text-white">Vanguard Digital GmbH (Frankfurt)</td>
                        <td className="py-3 px-4 font-mono text-white">$24,500 USD</td>
                        <td className="py-3 px-4 text-amber-400 font-medium">8 days</td>
                        <td className="py-3 px-4">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> WhatsApp Direct Link Delivered
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setChasingStatus((s) => ({ ...s, 'inv-1': !s['inv-1'] }))}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              chasingStatus['inv-1']
                                ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {chasingStatus['inv-1'] ? 'Active Auto-Chase' : 'Paused (Manual)'}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono font-medium text-white">#INV-4022</td>
                        <td className="py-3 px-4 font-semibold text-white">Helix Systems Inc (New York)</td>
                        <td className="py-3 px-4 font-mono text-white">$18,200 USD</td>
                        <td className="py-3 px-4 text-slate-400 font-medium">Due in 2 days</td>
                        <td className="py-3 px-4 text-slate-400">
                          Scheduled: Pre-Due Courtesy Email (Day -2)
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            Autopilot Armed
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono font-medium text-white">#INV-4011</td>
                        <td className="py-3 px-4 font-semibold text-white">Pacific Cloud Pte (Singapore)</td>
                        <td className="py-3 px-4 font-mono text-white">$32,000 USD</td>
                        <td className="py-3 px-4 text-rose-400 font-medium">17 days</td>
                        <td className="py-3 px-4 text-orange-400">
                          Escalated: WhatsApp to AP Lead + CC CFO
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-orange-950/60 text-orange-400 border border-orange-800/50">
                            High Priority
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Multi-Channel Automation */}
            {activeTab === 1 && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Intelligent Escalation Sequence</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white tracking-tight">
                    Polite, Human-Tone Cadences That Escalate Automatically
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Most accounts payable delays are not intentional malice—they are buried inboxes. DueFox switches channels gracefully without embarrassing your account managers.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Day -3: Friendly Email Preview</span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Email</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Reminds client accounting team with attached PDF invoice and SWIFT routing codes.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Day 0: Due Date Direct Settlement Link</span>
                          <span className="text-[10px] text-orange-300 bg-orange-950 px-1.5 py-0.5 rounded">Email + SMS</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Direct 1-click checkout portal supporting Corporate Card, ACH Debit, and SEPA.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-emerald-500/30 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Day +5: Official WhatsApp Business Escalation</span>
                          <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded">WhatsApp API</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Reaches decision maker with 98% open rate. Auto-pauses immediately when funds hit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#0B141B] p-5 rounded-2xl border border-emerald-900/40 shadow-xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> Live WhatsApp API Stream
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400">✓✓ Delivered & Read</span>
                  </div>
                  <div className="mt-4 space-y-3 font-sans text-xs">
                    <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700/80 text-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">DueFox Verified Bot</span>
                        <span className="text-[10px] text-slate-400">Today, 2:45 PM</span>
                      </div>
                      <p className="text-slate-200">
                        Hello Sarah, following up on our project milestones for <strong className="text-white">Cognitive Labs Corp</strong>.
                      </p>
                      <p className="text-slate-300">
                        Invoice <span className="font-mono text-orange-400">#INV-8912 ($28,400.00 USD)</span> was scheduled for remittance yesterday. Would you like to authorize settlement now?
                      </p>
                      <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Amount Due:</span>
                          <span className="font-mono font-bold text-white">$28,400.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Settlement Method:</span>
                          <span className="text-slate-200">SWIFT / Stripe Virtual IBAN</span>
                        </div>
                        <div className="pt-2 flex gap-2">
                          <button className="flex-1 py-1.5 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded font-semibold text-xs transition-colors">
                            Instant Pay Portal
                          </button>
                          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors">
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: High-Ticket Remittance ($1k–$50k SWIFT/IBAN & Stripe portal) */}
            {activeTab === 2 && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Cross-Border B2B Payments</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white tracking-tight">
                    Collect $1,000 to $50,000+ Cross-Border Without 3% Card Fees
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    International clients often fail to pay because they lack easy cross-border remittance methods. DueFox provides dedicated virtual IBANs and automated SWIFT wire reconciliation.
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Dedicated Virtual IBAN per customer for automated matching</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Direct Stripe ACH & SEPA Instant with zero chargeback risk</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Zero manual bank statement reconciling—webhook synced</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-700 p-5 sm:p-6 shadow-2xl">
                  {/* Remittance Portal View */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 block">DueFox Global Settlement Gateway</span>
                      <span className="text-lg font-bold text-white font-mono">$38,500.00 USD</span>
                    </div>
                    <div className="flex gap-1.5 bg-slate-800 p-1 rounded-lg">
                      <button
                        onClick={() => setSelectedRail('swift')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                          selectedRail === 'swift'
                            ? 'bg-[#FF5722] text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        SWIFT / IBAN
                      </button>
                      <button
                        onClick={() => setSelectedRail('stripe')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                          selectedRail === 'stripe'
                            ? 'bg-[#FF5722] text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Stripe ACH
                      </button>
                      <button
                        onClick={() => setSelectedRail('sepa')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                          selectedRail === 'sepa'
                            ? 'bg-[#FF5722] text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        SEPA Euro
                      </button>
                    </div>
                  </div>

                  {selectedRail === 'swift' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-[#1E293B] rounded-xl border border-slate-700/80 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Beneficiary Bank:</span>
                          <span className="font-semibold text-white">J.P. Morgan Chase N.A. (New York)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">SWIFT / BIC Code:</span>
                          <span className="font-mono text-orange-400 font-bold">CHASUS33XXX</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Virtual Dedicated IBAN:</span>
                          <span className="font-mono text-white">US64 CHAS 0000 1928 3847 11</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Unique Match Reference:</span>
                          <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-emerald-400">
                            DF-INV-38500-AUTO
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> Wire funds auto-reconcile in 60 seconds
                        </span>
                        <span className="text-slate-300">Direct Bank-to-Bank</span>
                      </div>
                    </div>
                  )}

                  {selectedRail === 'stripe' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-[#1E293B] rounded-xl border border-slate-700/80 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Method:</span>
                          <span className="font-semibold text-white">ACH Direct Bank Debit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Processing Fee:</span>
                          <span className="font-mono text-emerald-400 font-bold">$5.00 Cap (Zero 3% Card Fee)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Plaid Authentication:</span>
                          <span className="text-white">Instant Account Verification</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2">
                        <span>Authorize ACH via Stripe Connect</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {selectedRail === 'sepa' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-[#1E293B] rounded-xl border border-slate-700/80 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">SEPA Instant Clearing:</span>
                          <span className="font-semibold text-emerald-400">10 Seconds Guaranteed</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Euro Equivalent:</span>
                          <span className="font-mono text-white font-bold">€35,420.00 EUR (Locked FX)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">IBAN (Frankfurt):</span>
                          <span className="font-mono text-white">DE89 3704 0044 0532 0130 00</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Audit Trail & Read Receipts */}
            {activeTab === 3 && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Forensic Read Tracking</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white tracking-tight">
                    Timestamped Proof. No More "We Never Received the Invoice"
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Eliminate the #1 excuse for delayed corporate payments. See exact IP addresses, WhatsApp read receipts, PDF download stamps, and accounting handoffs.
                  </p>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Forensic Audit Export</span>
                      <span className="text-emerald-400 font-semibold font-mono">SOC2 Compliant</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Download 1-click evidentiary PDF log for your board, accounting audit, or legal reconciliation.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                    <span className="font-mono text-white font-semibold">Activity Ledger · INV-2049</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Stream
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 text-xs p-2.5 bg-[#1E293B] rounded-lg border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Full Settlement Reconciled</span>
                          <span className="text-[11px] font-mono text-slate-400">10:28 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          $14,850.00 USD received via SWIFT wire (Deutsche Bank AG). Automated cadence paused.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs p-2.5 bg-[#1E293B] rounded-lg border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-blue-900/60 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Payment Portal Link Clicked</span>
                          <span className="text-[11px] font-mono text-slate-400">10:21 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Opened from Munich, Germany (IP: 84.112.92.1 · Chrome on macOS).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs p-2.5 bg-[#1E293B] rounded-lg border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">WhatsApp Message Read by CFO</span>
                          <span className="text-[11px] font-mono text-slate-400">10:15 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Blue ticks confirmed: Marcus Vance (CFO) opened message.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs p-2.5 bg-[#1E293B] rounded-lg border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-orange-900/60 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Send className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Day +10 WhatsApp Escalation Triggered</span>
                          <span className="text-[11px] font-mono text-slate-400">10:14 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Cadence rule: 10 days past due milestone reached for #INV-2049.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
