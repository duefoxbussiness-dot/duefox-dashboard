import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenTrial: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTrial }) => {
  return (
    <footer className="bg-[#0A0F1D] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#FF5722] flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                >
                  <path
                    d="M4 5L12 11L20 5L17 19L12 16L7 19L4 5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                dueFox<span className="text-[#FF5722]">.co</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              Automated B2B invoice chasing &amp; cross-border collections. Recover outstanding receivables 3x faster without awkward emails.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>SOC2 Type II Certified</span>
              <span>·</span>
              <span>GDPR Compliant</span>
              <span>·</span>
              <span>AES-256</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Cash Flow Ledger
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  WhatsApp Escalation
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  SWIFT & Virtual IBAN
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Audit Read Receipts
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Recovery Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Integrations
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-slate-400">Stripe Connect</span>
              </li>
              <li>
                <span className="text-slate-400">QuickBooks Online</span>
              </li>
              <li>
                <span className="text-slate-400">Xero Accounting</span>
              </li>
              <li>
                <span className="text-slate-400">WhatsApp Cloud API</span>
              </li>
              <li>
                <span className="text-slate-400">Custom Webhooks</span>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ & Docs
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <span className="text-slate-500">Security & Privacy</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Service</span>
              </li>
              <li>
                <a
                  href="mailto:support@duefox.co"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-[#FF5722]"
                >
                  Contact Support <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} DueFox Inc. All rights reserved. Automated accounts receivable &amp; global collections.
          </div>
          <div className="flex items-center gap-4">
            <span>Stripe Connect Partner</span>
            <span>·</span>
            <span>Meta WhatsApp API Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
