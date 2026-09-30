import React from 'react';
import { Plus, Database, Zap, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { SupabaseConfig, ThemeMode, AuthUser } from '../types';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenSupabaseModal: () => void;
  onTriggerBatchChase: () => void;
  supabaseConfig: SupabaseConfig;
  chaseActive: boolean;
  unpaidCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  user: AuthUser | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenSupabaseModal,
  onTriggerBatchChase,
  supabaseConfig,
  chaseActive,
  unpaidCount,
  theme,
  onToggleTheme,
  user,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-electric flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {/* Fox silhouette minimalist geometric icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white"
              >
                <polygon points="12 2 19 8 19 19 5 19 5 8 12 2" fill="currentColor" fillOpacity="0.25" />
                <path d="M5 8l7 4 7-4" />
                <path d="M12 12v7" />
                <path d="M9 5l3 3 3-3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                dueFox<span className="text-electric font-semibold">.co</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                Automated Invoice Chaser
              </span>
            </div>
          </div>
        </div>

        {/* Center: System Status & Batch Chase */}
        <div className="hidden md:flex items-center gap-2">
          {/* Supabase status button */}
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              supabaseConfig.isConnected
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Click to view Supabase connection & SQL migration"
          >
            <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{supabaseConfig.isConnected ? 'Supabase Live' : 'Demo DB (Local)'}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                supabaseConfig.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Quick Auto-chase runner trigger (Electric Orange Accent) */}
          <button
            type="button"
            onClick={onTriggerBatchChase}
            disabled={unpaidCount === 0}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-electric hover:bg-[#F4511E] active:bg-[#E64A19] rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            title="Trigger automated chase reminders for pending and escalated invoices"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Chase All Overdue ({unpaidCount})</span>
          </button>
        </div>

        {/* Right: Actions, Theme Toggle, User Email & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Add Invoice Primary Button - Vibrant Electric Orange */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-electric hover:bg-[#F4511E] active:bg-[#E64A19] rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>

          {/* Authenticated User & Sign Out */}
          {user && (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[170px]" title={user.email}>
                  {user.name || user.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
                  {user.email}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Sign out of dueFox"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
