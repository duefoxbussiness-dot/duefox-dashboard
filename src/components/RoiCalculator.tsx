import React, { useState } from 'react';
import { DollarSign, Clock, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenTrial: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenTrial }) => {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(85000);
  const [daysOverdue, setDaysOverdue] = useState<number>(38);

  // Calculations
  // B2B industry average: 22% of invoiced volume gets delayed beyond term
  const delayedVolume = Math.round(monthlyVolume * 0.28);
  // DueFox reduces DSO by approx 65%
  const newDso = Math.max(9, Math.round(daysOverdue * 0.35));
  const daysSaved = daysOverdue - newDso;
  // Working capital unblocked earlier
  const cashAccelerated = Math.round((delayedVolume * (daysSaved / 30)));
  // Hours saved (approx 0.75 hrs per overdue invoice, avg invoice size $4,500)
  const overdueInvoiceCount = Math.max(2, Math.round(delayedVolume / 4500));
  const hoursSavedPerMonth = Math.round(overdueInvoiceCount * 2.8);

  return (
    <section id="calculator" className="py-24 bg-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400 mb-3">
            <span>CASH RECOVERY ESTIMATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Much Cash Is Trapped in Your Overdue Invoices?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            See the exact working capital DueFox unlocks for your business each month by shaving 20+ days off your collection cycle.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-[#1E293B] rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left side: Interactive Sliders */}
            <div className="lg:col-span-6 space-y-7">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="monthly-volume-slider" className="text-sm font-semibold text-white">Monthly Invoiced Revenue</label>
                  <span className="text-lg font-bold font-mono text-[#FF5722] tabular-nums">
                    ${monthlyVolume.toLocaleString()}
                  </span>
                </div>
                <input
                  id="monthly-volume-slider"
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF5722]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>$10,000</span>
                  <span>$250,000</span>
                  <span>$500,000+</span>
                </div>
                {/* Preset quick buttons */}
                <div className="flex gap-2 mt-2">
                  {[25000, 85000, 200000, 400000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMonthlyVolume(val)}
                      className={`text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        monthlyVolume === val
                          ? 'bg-[#FF5722] text-white border-[#FF5722]'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      ${val / 1000}k/mo
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="days-overdue-slider" className="text-sm font-semibold text-white">Current Average Days Overdue (DSO)</label>
                  <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                    {daysOverdue} days
                  </span>
                </div>
                <input
                  id="days-overdue-slider"
                  type="range"
                  min="15"
                  max="75"
                  step="1"
                  value={daysOverdue}
                  onChange={(e) => setDaysOverdue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>15 days (Fast)</span>
                  <span>45 days (Standard)</span>
                  <span>75 days (Severe)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="font-semibold text-white block">Under the Hood:</span>
                <p className="text-slate-400 leading-relaxed">
                  Based on benchmark B2B collection data across 1,800+ agencies and SaaS teams. Adding WhatsApp escalation with direct SWIFT / IBAN links clears 74% of overdue balances within 72 hours.
                </p>
              </div>
            </div>

            {/* Right side: Live Calculated Outcomes */}
            <div className="lg:col-span-6 bg-slate-900/90 rounded-xl p-6 sm:p-7 border border-slate-700/80 space-y-5">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
                Estimated 30-Day Impact With DueFox
              </span>

              <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700/70">
                <span className="text-xs text-slate-400 block">Cash Unlocked &amp; Recovered Faster</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tabular-nums">
                    ${cashAccelerated.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold font-mono">
                    +{Math.round((daysSaved / daysOverdue) * 100)}% Velocity
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Working capital accelerated directly back into your operating bank accounts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700/70">
                  <span className="text-xs text-slate-400 block">DSO Drop</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-white tabular-nums">
                      {newDso} days
                    </span>
                    <span className="text-xs text-slate-500 line-through tabular-nums">
                      {daysOverdue}d
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                    Saved {daysSaved} waiting days
                  </span>
                </div>

                <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700/70">
                  <span className="text-xs text-slate-400 block">Admin Hours Saved</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-white tabular-nums">
                      {hoursSavedPerMonth} hrs/mo
                    </span>
                  </div>
                  <span className="text-[10px] text-orange-400 font-medium block mt-0.5">
                    0 manual reminder emails
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenTrial}
                className="w-full py-3.5 px-4 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 flex items-center justify-center gap-2 glow-orange cursor-pointer"
              >
                <span>Recover My Trapped Cash (Free Trial)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>5 invoices completely free · No card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
