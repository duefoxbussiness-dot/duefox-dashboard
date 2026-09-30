import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { Testimonial } from '../types';

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "We had $142,000 in invoices stuck beyond 45 days with European and US clients. Adding DueFox’s WhatsApp cadence recovered 82% of it within 18 days. Our account directors never have to send uncomfortable follow-up emails again.",
      author: 'Marcus Vance',
      role: 'Managing Partner & Founder',
      company: 'Vance & Horizon Creative Media',
      metric: '+$116,400 Recovered in 18 Days',
      avatarText: 'MV',
      avatarBg: 'bg-orange-600',
    },
    {
      quote:
        "The automated SWIFT wire details and virtual IBAN matching solved our cross-border nightmare. International clients pay directly via their local banking rails without 3.5% credit card transaction bleed. Our DSO plummeted from 49 to 14 days.",
      author: 'Elena Rostova',
      role: 'Head of Finance & Operations',
      company: 'Novex Spatial Systems GmbH',
      metric: 'DSO Dropped from 49d to 14d',
      avatarText: 'ER',
      avatarBg: 'bg-indigo-600',
    },
    {
      quote:
        "DueFox is polite, tactful, and relentless. The moment a client clears their balance, the cadence auto-silences immediately. We’ve had zero client pushback and our cash flow forecasting is finally predictable.",
      author: 'David Chen',
      role: 'VP Operations',
      company: 'CloudMatrix Technologies',
      metric: '100% On-Time Retainer Inflow',
      avatarText: 'DC',
      avatarBg: 'bg-emerald-600',
    },
  ];

  return (
    <section className="py-20 bg-[#0B1320] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-3">
            <span>PROVEN B2B RECOVERY</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Trusted by Finance Leaders Across 30+ Countries
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Over $48M in overdue invoices recovered without losing a single client relationship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#1E293B] rounded-2xl p-7 border border-slate-700/80 flex flex-col justify-between shadow-lg hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2.5 py-0.5 rounded">
                    {t.metric}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow`}
                >
                  {t.avatarText}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.author}</h4>
                  <p className="text-xs text-slate-400">
                    {t.role} · <span className="text-slate-300">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
