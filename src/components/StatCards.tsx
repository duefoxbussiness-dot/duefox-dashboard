import React from 'react';
import { AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import { CurrencyCode, DashboardStats } from '../types';

interface StatCardsProps {
  stats: DashboardStats;
  selectedCurrency: 'ALL' | CurrencyCode;
  onSelectCurrency: (currency: 'ALL' | CurrencyCode) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  stats,
  selectedCurrency,
  onSelectCurrency,
}) => {
  // Format numbers nicely
  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-3">
      {/* Currency Segmented Control & Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Invoice Chasing Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated tracking and escalation schedule for outstanding client accounts.
          </p>
        </div>

        {/* Currency switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => onSelectCurrency('ALL')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedCurrency === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Currencies
          </button>
          <button
            type="button"
            onClick={() => onSelectCurrency('USD')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedCurrency === 'USD'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => onSelectCurrency('INR')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedCurrency === 'INR'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            INR (₹)
          </button>
        </div>
      </div>

      {/* Primary Stat Grid: Dark Mode #1E293B, border #334155 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Overdue Amount */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Overdue Amount
            </span>
            <span className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 space-y-1">
            {selectedCurrency === 'ALL' ? (
              <div className="space-y-0.5">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                  {formatUSD(stats.totalOverdueUSD)}
                </div>
                <div className="text-base font-semibold font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  + {formatINR(stats.totalOverdueINR)}
                </div>
              </div>
            ) : selectedCurrency === 'USD' ? (
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                {formatUSD(stats.totalOverdueUSD)}
              </div>
            ) : (
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                {formatINR(stats.totalOverdueINR)}
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Uncollected balance across pending and escalated invoices</span>
          </p>
        </div>

        {/* Card 2: Pending Invoices Count */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Invoices
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
              {stats.pendingCount}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">invoices awaiting payment</span>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Active automatic email & WhatsApp chase queue</span>
          </p>
        </div>

        {/* Card 3: Escalated Invoices (30+ Days) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Escalated Invoices (30+ Days)
            </span>
            <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 tracking-tight">
              {stats.escalatedCount}
            </div>
            <span className="text-xs text-rose-500 dark:text-rose-400/80 font-medium">severe delinquent accounts</span>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Overdue &gt; 30 days; prioritized firm reminder cadence</span>
          </p>
        </div>
      </div>
    </div>
  );
};
