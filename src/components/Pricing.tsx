import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Ideal for solo freelancers & early consultants needing automated email follow-ups.',
      features: [
        '5 Active Invoices',
        'Email Reminders',
        'Standard Dashboard',
        'Standard Stripe & ACH Portal',
        'Direct CSV Upload',
        'Email Support',
      ],
      ctaText: 'Start Free (5 Invoices)',
      highlightCta: false,
    },
    {
      id: 'pro',
      name: 'Pro Chaser',
      recommended: true,
      badge: '★ MOST POPULAR',
      monthlyPrice: 29,
      annualPrice: 23,
      description: 'The complete automated collection suite for growing agencies and B2B SaaS teams.',
      features: [
        'Unlimited Invoices',
        'Email + WhatsApp Automation',
        'Custom Gateways',
        'SWIFT Wire Details & Virtual IBANs',
        'No DueFox Badge (100% White-Label)',
        'Smart Escalation Rules & Tone Customizer',
        'Read Receipts & Forensic Audit Log',
        'Priority Delivery Queue & Webhooks',
      ],
      ctaText: 'Start 14-Day Free Pro Trial',
      highlightCta: true,
    },
    {
      id: 'agency',
      name: 'Agency',
      monthlyPrice: 79,
      annualPrice: 63,
      description: 'For high-volume finance teams, accounting firms, and multi-brand corporate agencies.',
      features: [
        'Everything in Pro Chaser',
        'Multi-User Seats (Unlimited Team)',
        'Custom Domain & Branded Sender DNS',
        'Dedicated Support & Account Manager',
        'Custom ERP & QuickBooks / Xero Sync',
        'Multi-Entity Billing Workspaces',
        '99.9% High-Volume SLA Guarantee',
      ],
      ctaText: 'Start Free Agency Trial',
      highlightCta: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0F172A] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FF5722]/15 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-3">
            <span>TRANSPARENT, ROI-FIRST PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple Plans. Unlimited Recovered Cash.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            One collected overdue invoice pays for an entire year of DueFox. No hidden commissions or collection cut percentages.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-xl bg-[#1E293B] border border-slate-700/80">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !annualBilling
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                annualBilling
                  ? 'bg-[#FF5722] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-white text-[#FF5722] font-extrabold px-1.5 py-0.5 rounded">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((plan) => {
            const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;
            const isPro = plan.recommended;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPro
                    ? 'bg-[#1E293B] border-2 border-[#FF5722] glow-orange shadow-2xl shadow-orange-950/40 p-8 transform lg:-translate-y-2'
                    : 'bg-[#1E293B]/70 hover:bg-[#1E293B] border border-slate-700/70 p-7'
                }`}
              >
                {/* Most Popular Badge on Pro Chaser */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF5722] text-white text-xs font-extrabold tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Desc */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {isPro && (
                      <span className="text-[11px] font-mono font-semibold text-orange-400 bg-orange-950/60 border border-orange-800/40 px-2 py-0.5 rounded">
                        Full Autopilot
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 min-h-[36px] leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 mb-7 pb-6 border-b border-slate-800 flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tabular-nums">
                      ${price}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">
                      /month {annualBilling && plan.monthlyPrice > 0 ? '(billed annually)' : ''}
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPro
                              ? 'bg-[#FF5722]/20 text-[#FF5722]'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={feature.includes('WhatsApp') || feature.includes('SWIFT') ? 'font-semibold text-white' : ''}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    plan.highlightCta
                      ? 'bg-[#FF5722] hover:bg-[#F4511E] text-white shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 glow-orange'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee notes */}
        <div className="mt-14 max-w-2xl mx-auto p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" /> 14-day zero-risk trial on paid tiers
          </span>
          <span className="text-slate-600">·</span>
          <span>Zero collection percentage fees</span>
          <span className="text-slate-600">·</span>
          <span>Keep 100% of recovered cash</span>
        </div>
      </div>
    </section>
  );
};
