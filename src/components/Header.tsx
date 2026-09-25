import React from 'react';
import { Plus, Database, BellRing, ShieldCheck, Zap } from 'lucide-react';
import { SupabaseConfig } from '../types';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenSupabaseModal: () => void;
  onTriggerBatchChase: () => void;
  supabaseConfig: SupabaseConfig;
  chaseActive: boolean;
  unpaidCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenSupabaseModal,
  onTriggerBatchChase,
  supabaseConfig,
  chaseActive,
  unpaidCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              {/* Fox silhouette minimalist geometric icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-amber-400"
              >
                <polygon points="12 2 19 8 19 19 5 19 5 8 12 2" fill="currentColor" fillOpacity="0.2" />
                <path d="M5 8l7 4 7-4" />
                <path d="M12 12v7" />
                <path d="M9 5l3 3 3-3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                dueFox<span className="text-slate-400 font-normal">.co</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-0.5">
                Automated Invoice Chaser
              </span>
            </div>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {/* Supabase status button */}
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              supabaseConfig.isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
            }`}
            title="Click to view Supabase connection & SQL migration"
          >
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>{supabaseConfig.isConnected ? 'Supabase Live' : 'Demo DB (Local)'}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                supabaseConfig.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Quick Auto-chase runner trigger */}
          <button
            type="button"
            onClick={onTriggerBatchChase}
            disabled={unpaidCount === 0}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer"
            title="Trigger automated chase reminders for pending and escalated invoices"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Chase All Overdue ({unpaidCount})</span>
          </button>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          {/* Add Invoice Primary Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>

          {/* Profile Avatar */}
          <div className="relative pl-2 border-l border-neutral-200 hidden sm:flex items-center gap-2.5">
            <img
              src="/src/assets/images/avatar_finance_manager_1790313279025.jpg"
              alt="Finance Manager"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-neutral-300 shadow-xs"
              onError={(e) => {
                // Styled SVG fallback container if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-800 leading-tight">Accounts Team</span>
              <span className="text-[11px] text-slate-400">dueFox Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
