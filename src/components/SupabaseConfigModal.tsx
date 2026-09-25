import React, { useState } from 'react';
import { X, Database, Check, Copy, AlertCircle, RefreshCw, KeyRound, Globe, ExternalLink } from 'lucide-react';
import { SupabaseConfig } from '../types';
import { supabaseService } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onConfigUpdated: () => void;
  onResetDemoData: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
  onResetDemoData,
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [activeTab, setActiveTab] = useState<'connect' | 'sql'>('connect');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const sqlScript = supabaseService.getSqlMigrationScript();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const result = await supabaseService.updateConfig(url, anonKey);
    setSaving(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: url.trim()
          ? 'Successfully connected to your Supabase project! Real-time sync enabled.'
          : 'Switched back to local demo storage.',
      });
      onConfigUpdated();
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to connect to Supabase. Check your URL and anon key.',
      });
    }
  };

  const handleClear = async () => {
    setUrl('');
    setAnonKey('');
    await supabaseService.updateConfig('', '');
    onConfigUpdated();
    setStatusMessage({ type: 'success', text: 'Reset to local demo sandbox mode.' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-2xl rounded-xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Supabase Database & Realtime Setup</span>
                {config.isConnected && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Live Connected
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Connect your Supabase project with clients & invoices tables for live sync.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 px-6 pt-2 bg-neutral-50/40">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'connect'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            API Credentials & Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sql'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            SQL Table Migration Schema
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {statusMessage && (
            <div
              className={`p-3 text-xs rounded-lg mb-4 flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'connect' ? (
            <form onSubmit={handleSaveConnection} className="space-y-4">
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-semibold">How dueFox.co connects:</strong> The app uses{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-mono text-slate-800">
                  @supabase/supabase-js
                </code>{' '}
                to execute SQL queries on <code className="font-mono text-slate-800">public.clients</code> and{' '}
                <code className="font-mono text-slate-800">public.invoices</code>, with live subscriptions via{' '}
                <code className="font-mono text-slate-800">supabase.channel()</code>. When no external credentials are provided,
                it uses a zero-latency local database with the exact same structure!
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://xyzproject.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supabase Anon Public API Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-lg text-slate-900 placeholder:text-neutral-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onResetDemoData}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Starter Demo Data</span>
                  </button>
                  {config.isCustom && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Disconnect & Use Demo Mode
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {saving && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>Save & Test Connection</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  SQL Schema for <code className="font-mono text-slate-900">clients</code> and{' '}
                  <code className="font-mono text-slate-900">invoices</code>:
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md transition-colors cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied to Clipboard' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 text-slate-200 text-[11px] font-mono rounded-lg overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                  {sqlScript}
                </pre>
              </div>

              <p className="text-[11px] text-slate-500">
                Tip: Paste this script into your Supabase Dashboard &gt; SQL Editor and click "Run". It creates tables, adds foreign keys, sets permissive RLS policies for testing, and enables realtime replication.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
