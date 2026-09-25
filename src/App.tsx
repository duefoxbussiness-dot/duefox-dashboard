import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabaseService, calculateDaysOverdue } from './lib/supabase';
import {
  CurrencyCode,
  DashboardStats,
  InvoiceStatus,
  InvoiceWithClient,
  NewInvoiceInput,
  SupabaseConfig,
} from './types';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { InvoiceTable } from './components/InvoiceTable';
import { AddInvoiceModal } from './components/AddInvoiceModal';
import { ChasePreviewModal } from './components/ChasePreviewModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<'ALL' | CurrencyCode>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [chaseInvoice, setChaseInvoice] = useState<InvoiceWithClient | null>(null);

  // Supabase Config state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() =>
    supabaseService.getConfig()
  );

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supabaseService.fetchClientsAndInvoices();
      setInvoices(data);
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
      addToast('error', 'Failed to fetch data', err?.message || 'Please verify database connectivity');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load and Real-time subscription setup
  useEffect(() => {
    loadData();

    // Subscribe to live Postgres changes and local bus updates
    const unsubscribe = supabaseService.subscribeToChanges(() => {
      // Reload on change
      supabaseService.fetchClientsAndInvoices().then((updated) => {
        setInvoices(updated);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Compute Dashboard Statistics dynamically
  const stats: DashboardStats = useMemo(() => {
    let overdueUSD = 0;
    let overdueINR = 0;
    let pendingCount = 0;
    let escalatedCount = 0;
    let paidCount = 0;
    let paidUSD = 0;
    let paidINR = 0;

    invoices.forEach((inv) => {
      if (inv.status === 'paid') {
        paidCount++;
        if (inv.currency === 'USD') paidUSD += inv.amount;
        else paidINR += inv.amount;
      } else {
        // Pending or Escalated
        if (inv.status === 'escalated') {
          escalatedCount++;
        } else {
          pendingCount++;
        }

        // Add to overdue amount if due date is passed or today
        if (inv.days_overdue >= 0) {
          if (inv.currency === 'USD') overdueUSD += inv.amount;
          else overdueINR += inv.amount;
        }
      }
    });

    return {
      totalOverdueUSD: overdueUSD,
      totalOverdueINR: overdueINR,
      pendingCount,
      escalatedCount,
      paidCount,
      totalPaidUSD: paidUSD,
      totalPaidINR: paidINR,
    };
  }, [invoices]);

  // Handler: Add New Invoice
  const handleAddInvoice = async (input: NewInvoiceInput) => {
    try {
      const created = await supabaseService.insertInvoice(input);
      setInvoices((prev) => [created, ...prev]);
      addToast(
        'success',
        `Invoice ${created.invoice_number} created`,
        `Client: ${created.client.name} · Automated chase schedule initialized`
      );
    } catch (err: any) {
      addToast('error', 'Failed to create invoice', err?.message || 'Database insert failed');
      throw err;
    }
  };

  // Handler: Update status (Mark Paid / Reopen)
  const handleMarkPaid = async (id: string, newStatus: InvoiceStatus) => {
    const target = invoices.find((i) => i.id === id);
    if (!target) return;

    try {
      await supabaseService.updateInvoiceStatus(id, newStatus);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
      if (newStatus === 'paid') {
        addToast(
          'success',
          `Invoice ${target.invoice_number} marked as Paid`,
          `Recovered ${target.currency === 'USD' ? '$' : '₹'}${target.amount.toLocaleString()} from ${target.client.name}`
        );
      } else {
        addToast('info', `Invoice ${target.invoice_number} reopened`, 'Status reset to pending');
      }
    } catch (err: any) {
      addToast('error', 'Status update failed', err?.message);
    }
  };

  // Handler: Delete invoice
  const handleDeleteInvoice = async (id: string) => {
    const target = invoices.find((i) => i.id === id);
    try {
      await supabaseService.deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      addToast(
        'info',
        `Invoice ${target?.invoice_number || ''} deleted`,
        'Record removed from database'
      );
    } catch (err: any) {
      addToast('error', 'Failed to delete invoice', err?.message);
    }
  };

  // Handler: Dispatch Chase reminder
  const handleSendChase = async (invoiceId: string) => {
    const target = invoices.find((i) => i.id === invoiceId);
    if (!target) return;

    try {
      await supabaseService.recordChase(invoiceId);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId
            ? {
                ...inv,
                chase_count: (inv.chase_count || 0) + 1,
                last_chased_at: new Date().toISOString(),
              }
            : inv
        )
      );
      addToast(
        'success',
        `Chase reminder sent to ${target.client.name}`,
        `Payment link dispatched to ${target.client.email}`
      );
    } catch (err: any) {
      addToast('error', 'Failed to record chase', err?.message);
    }
  };

  // Handler: Batch chase all overdue invoices
  const handleBatchChase = async () => {
    const overdueInvoices = invoices.filter((i) => i.status !== 'paid');
    if (overdueInvoices.length === 0) return;

    try {
      for (const inv of overdueInvoices) {
        await supabaseService.recordChase(inv.id);
      }
      await loadData();
      addToast(
        'success',
        `Automated chase triggered for ${overdueInvoices.length} invoices`,
        'Email & SMS payment notices dispatched via dueFox engine'
      );
    } catch (err: any) {
      addToast('error', 'Batch chase failed', err?.message);
    }
  };

  // Handler: Reset demo data
  const handleResetDemoData = () => {
    supabaseService.resetDemoData();
    loadData();
    addToast('info', 'Demo data re-seeded', 'Default invoices & clients restored');
  };

  const handleConfigUpdated = () => {
    setSupabaseConfig(supabaseService.getConfig());
    loadData();
  };

  const unpaidCount = invoices.filter((i) => i.status !== 'paid').length;

  return (
    <div className="min-h-screen bg-neutral-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onTriggerBatchChase={handleBatchChase}
        supabaseConfig={supabaseConfig}
        chaseActive={true}
        unpaidCount={unpaidCount}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Row: Stat Cards */}
        <section aria-label="Dashboard Statistics">
          <StatCards
            stats={stats}
            selectedCurrency={selectedCurrency}
            onSelectCurrency={setSelectedCurrency}
          />
        </section>

        {/* Main Section: Invoice Data Table */}
        <section aria-label="Invoice Management Table">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Invoice Accounts & Chase Queue
                </h2>
                <p className="text-xs text-slate-500">
                  Track overdue balances, automate collections, and escalate past-due client accounts.
                </p>
              </div>

              {/* Status explanation indicator */}
              <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Paid</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Escalated (30+ Days)</span>
                </span>
              </div>
            </div>

            <InvoiceTable
              invoices={invoices}
              loading={loading}
              onMarkPaid={handleMarkPaid}
              onDelete={handleDeleteInvoice}
              onOpenChaseModal={(inv) => setChaseInvoice(inv)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              selectedCurrency={selectedCurrency}
            />
          </div>
        </section>

        {/* Quiet Footnote & Database Integration Reference */}
        <footer className="pt-6 pb-4 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">dueFox.co</span>
            <span aria-hidden="true">·</span>
            <span>Automated Invoice Chasing Engine</span>
            <span aria-hidden="true">·</span>
            <span>Real-time persistence via @supabase/supabase-js</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-medium underline underline-offset-2 cursor-pointer"
            >
              Supabase SQL Schema & Credentials
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleResetDemoData}
              className="text-slate-600 hover:text-slate-900 font-medium underline underline-offset-2 cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddInvoice}
      />

      <ChasePreviewModal
        invoice={chaseInvoice}
        isOpen={Boolean(chaseInvoice)}
        onClose={() => setChaseInvoice(null)}
        onSendChase={handleSendChase}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        config={supabaseConfig}
        onConfigUpdated={handleConfigUpdated}
        onResetDemoData={handleResetDemoData}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
