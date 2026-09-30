import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Globe, Landmark, Sparkles } from 'lucide-react';
import { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const faqs: FaqItem[] = [
    {
      question: 'Will automated invoice chasing damage my client relationships?',
      answer:
        'Not at all. In fact, our clients report higher client satisfaction because communications are professional, polite, and consistent. DueFox does not use aggressive collection agency jargon. Instead, reminders are phrased as helpful, courteous account status updates with 1-click links to settle. Furthermore, you have granular control: you can customize the cadence tone, set grace periods, pause reminders for sensitive accounts with a single toggle, or require manual approval before any WhatsApp escalation fires.',
      category: 'Relationship Safety',
    },
    {
      question: 'How does the SWIFT / Wire transfer and Virtual IBAN setup work?',
      answer:
        'When you connect your bank or Stripe Treasury account, DueFox generates dedicated virtual IBAN and SWIFT instructions for each of your international clients. When your client initiates a bank wire, the unique virtual account number or reference tag automatically reconciles the transaction in real-time. You avoid manual statement digging, and DueFox stops all automated follow-up cadences within 60 seconds of fund confirmation.',
      category: 'Wire Transfer Setup',
    },
    {
      question: 'Which currencies and global payment rails are supported?',
      answer:
        'DueFox supports collections in over 135 global currencies. Clients can settle via domestic ACH (USA), SEPA Instant (Europe), BACS (UK), EFT (Canada), and SWIFT wire transfers for high-ticket cross-border invoices ($1,000 to $50,000+). We also support corporate credit cards (Visa, MasterCard, Amex) and Apple Pay via Stripe Connect with customizable surcharge or direct debit pass-through options.',
      category: 'Currency Support',
    },
    {
      question: 'What happens the moment a client pays an invoice?',
      answer:
        'All active cadences (Email, SMS, and WhatsApp) immediately and automatically halt. Your client receives a clean, branded payment receipt, and your accounting platform (QuickBooks, Xero, or Stripe) is marked as paid via real-time webhooks. No duplicate messages or embarrassing follow-ups after payment has already occurred.',
      category: 'Automation Logic',
    },
    {
      question: 'Can I white-label the emails and WhatsApp messages with my own branding?',
      answer:
        'Yes! On the Pro Chaser and Agency plans, there is zero DueFox branding. Reminders come directly from your company billing email address (via custom DKIM/SPF domain verification) and your verified company name. Your clients simply experience a smooth, premium accounts receivable workflow provided by your firm.',
      category: 'Branding & White-label',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#0F172A] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-3">
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Know About DueFox
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Clear answers on relationship safety, international banking rails, and automated collections.
          </p>
        </div>

        {/* Expandable Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#1E293B] border-slate-700 shadow-lg'
                    : 'bg-[#1E293B]/60 border-slate-800 hover:border-slate-700/80 hover:bg-[#1E293B]/90'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#FF5722] text-white rotate-180'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                    <p>{faq.answer}</p>
                    {faq.category && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-orange-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
                        <span>Topic: {faq.category}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support contact footnote */}
        <div className="mt-12 p-6 rounded-xl bg-[#1E293B]/60 border border-slate-800 text-center">
          <p className="text-sm text-slate-300">
            Have a custom treasury workflow or specific ERP requirement?{' '}
            <a
              href="mailto:support@duefox.co"
              className="text-[#FF5722] hover:underline font-semibold"
            >
              Talk to our collections specialists →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
