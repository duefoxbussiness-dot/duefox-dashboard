import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, MessageSquare, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrial: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onOpenTrial }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: '1. Connect Invoicing Source',
      time: '0:00 - 0:15',
      desc: 'DueFox ingests invoices from Stripe, QuickBooks, or CSV in 60 seconds with zero disruption.',
      preview: 'Stripe webhook connected. 14 invoices ($184,200) indexed with aging timestamps.',
      highlight: 'Instant Ingestion',
    },
    {
      title: '2. Multi-Channel Escalation',
      time: '0:15 - 0:35',
      desc: 'Automatic email pre-due notification followed by polite, high-converting WhatsApp message at Day +5 overdue.',
      preview: 'Marcus Vance (CFO) received WhatsApp prompt with 1-click SWIFT / IBAN settlement link.',
      highlight: '98% Open Rate',
    },
    {
      title: '3. High-Ticket Remittance',
      time: '0:35 - 0:50',
      desc: 'International clients pay $1,000–$50,000 via local virtual IBAN or ACH debit without 3.5% card fees.',
      preview: 'Deutsche Bank wire initiated for $24,500 USD with unique reconciliation reference DF-4019.',
      highlight: 'Zero Card Fee Bleed',
    },
    {
      title: '4. Instant Silence & Reconcile',
      time: '0:50 - 1:00',
      desc: 'The moment wire clears, all reminders halt immediately and your ledger marks the balance settled.',
      preview: 'Funds verified in Stripe Connect treasury. Automated cadence silenced. Receipt emailed.',
      highlight: 'Zero Duplicate Chasing',
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#FF5722] flex items-center justify-center text-white text-xs font-bold">
              DF
            </div>
            <span className="text-sm font-bold text-white">
              DueFox Autopilot Walkthrough (Interactive Demo)
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video simulation viewport */}
        <div className="p-6 bg-[#0F172A] min-h-[340px] flex flex-col justify-between">
          {/* Step indicator tabs */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {steps.map((st, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveStep(i);
                  setIsPlaying(false);
                }}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  activeStep === i
                    ? 'bg-[#1E293B] border-[#FF5722] text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block font-mono text-[10px] text-orange-400">{st.time}</span>
                <span className="font-semibold block truncate mt-0.5">{st.title.split('.')[1]}</span>
              </button>
            ))}
          </div>

          {/* Active scene animation display */}
          <div className="bg-[#1E293B] p-6 rounded-xl border border-slate-700/80 shadow-inner space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded">
                {steps[activeStep].highlight}
              </span>
              <span className="text-xs text-slate-400 font-mono">Simulated Live Environment</span>
            </div>

            <h4 className="text-xl font-bold text-white">{steps[activeStep].title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {steps[activeStep].desc}
            </p>

            <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping shrink-0" />
              <p className="text-xs font-mono text-slate-200 truncate">
                {steps[activeStep].preview}
              </p>
            </div>
          </div>

          {/* Bottom Player controls */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#FF5722]" />
                    <span>Pause Walkthrough</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Play Walkthrough</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveStep(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenTrial();
              }}
              className="px-5 py-2 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-lg text-xs shadow-md glow-orange-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Test With Your Own Invoices (Free)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
