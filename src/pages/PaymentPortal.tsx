import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  HelpCircle,
  FileText,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Globe
} from 'lucide-react';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface VendorDetails {
  name: string;
  legalName: string;
  taxId: string;
  address: string;
  contactEmail: string;
  supportPhone: string;
}

export interface ClientDetails {
  name: string;
  contactName: string;
  contactEmail: string;
  address: string;
  vatId?: string;
}

export interface PaymentTransactionRecord {
  transactionId: string;
  paymentMethod: string;
  methodLabel: string;
  amountPaid: number;
  currency: string;
  paidAt: string;
  authCode: string;
  cardLast4?: string;
  cardBrand?: string;
  processorFee: number;
  receiptNumber: string;
  reconciliationStatus: string;
  gatewayReference: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'paid' | 'overdue' | 'due';
  daysDifference: number;
  issueDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmountDue: number;
  paymentTerms: string;
  vendor: VendorDetails;
  client: ClientDetails;
  lineItems: InvoiceItem[];
  paymentRecord?: PaymentTransactionRecord;
  wireInstructions?: {
    bankName: string;
    swiftBic: string;
    virtualIban: string;
    routingNumber: string;
    beneficiaryName: string;
    referenceCode: string;
  };
}

export const VENDOR_DUEFOX: VendorDetails = {
  name: 'DueFox Technologies Inc.',
  legalName: 'DueFox Global Solutions LLC',
  taxId: 'US-94-3829104',
  address: '100 Montgomery St, Suite 1800, San Francisco, CA 94104',
  contactEmail: 'billing@duefox.co',
  supportPhone: '+1 (800) 412-3849',
};

export const MOCK_INVOICES: Record<string, Invoice> = {
  'INV-2026-8891': {
    id: 'INV-2026-8891',
    invoiceNumber: 'INV-2026-8891',
    status: 'overdue',
    daysDifference: 12,
    issueDate: '2026-09-02',
    dueDate: '2026-09-17',
    currency: 'USD',
    currencySymbol: '$',
    subtotal: 13500,
    taxRate: 10,
    taxAmount: 1350,
    totalAmountDue: 14850,
    paymentTerms: 'Net 15',
    vendor: VENDOR_DUEFOX,
    client: {
      name: 'Acme Global Media LLC',
      contactName: 'Marcus Vance',
      contactEmail: 'marcus.vance@acmeglobal.com',
      address: '742 Evergreen Terrace, New York, NY 10001',
      vatId: 'US-EIN-12-9849201',
    },
    lineItems: [
      {
        id: 'li-1',
        description: 'Q3 Enterprise Accounts Receivable Automation & Chaser Engine',
        quantity: 1,
        unitPrice: 9500,
        total: 9500,
      },
      {
        id: 'li-2',
        description: 'Cross-Border Treasury Gateway & Virtual SWIFT IBAN Provisioning',
        quantity: 1,
        unitPrice: 4000,
        total: 4000,
      },
    ],
    wireInstructions: {
      bankName: 'J.P. Morgan Chase N.A. (New York)',
      swiftBic: 'CHASUS33XXX',
      virtualIban: 'US64 CHAS 0000 1928 3847 11',
      routingNumber: '021000021',
      beneficiaryName: 'DueFox Global Solutions Escrow',
      referenceCode: 'DF-INV-8891-AUTO',
    },
  },
  'INV-2026-7619': {
    id: 'INV-2026-7619',
    invoiceNumber: 'INV-2026-7619',
    status: 'paid',
    daysDifference: 0,
    issueDate: '2026-08-25',
    dueDate: '2026-09-10',
    currency: 'EUR',
    currencySymbol: '€',
    subtotal: 25000,
    taxRate: 19,
    taxAmount: 4750,
    totalAmountDue: 29750,
    paymentTerms: 'Net 15',
    vendor: VENDOR_DUEFOX,
    client: {
      name: 'Novex Spatial Systems GmbH',
      contactName: 'Elena Rostova',
      contactEmail: 'elena@novexspatial.de',
      address: 'Kaufingerstraße 14, 80331 Munich, Germany',
      vatId: 'DE384910283',
    },
    lineItems: [
      {
        id: 'li-1',
        description: 'Automated Global Remittance Setup & ERP Webhook Integration',
        quantity: 1,
        unitPrice: 25000,
        total: 25000,
      },
    ],
    paymentRecord: {
      transactionId: 'wire_tx_9981248a',
      paymentMethod: 'fedwire_wire',
      methodLabel: 'SEPA Instant Credit Wire (Deutsche Bank)',
      amountPaid: 29750,
      currency: 'EUR',
      paidAt: '2026-09-10T14:32:00Z',
      authCode: 'SEPA-DE-883910',
      processorFee: 0,
      receiptNumber: 'RCP-DF-2026-7619',
      reconciliationStatus: 'settled',
      gatewayReference: 'DB-SEPA-REF-9921',
    },
    wireInstructions: {
      bankName: 'Deutsche Bank AG (Frankfurt)',
      swiftBic: 'DEUTDEDBFXX',
      virtualIban: 'DE89 3704 0044 0532 0130 00',
      routingNumber: '37040044',
      beneficiaryName: 'DueFox Europe Client Escrow',
      referenceCode: 'DF-INV-7619-EUR',
    },
  },
  'INV-2026-9041': {
    id: 'INV-2026-9041',
    invoiceNumber: 'INV-2026-9041',
    status: 'overdue',
    daysDifference: 18,
    issueDate: '2026-08-20',
    dueDate: '2026-09-05',
    currency: 'USD',
    currencySymbol: '$',
    subtotal: 32000,
    taxRate: 0,
    taxAmount: 0,
    totalAmountDue: 32000,
    paymentTerms: 'Net 15',
    vendor: VENDOR_DUEFOX,
    client: {
      name: 'Pacific Cloud Pte Ltd',
      contactName: 'David Chen',
      contactEmail: 'dchen@pacificcloud.sg',
      address: '10 Collyer Quay, #14-01 Ocean Financial Centre, Singapore 049315',
      vatId: 'SG-201948102M',
    },
    lineItems: [
      {
        id: 'li-1',
        description: 'Multi-Tenant AR Infrastructure License (Annual)',
        quantity: 1,
        unitPrice: 32000,
        total: 32000,
      },
    ],
    wireInstructions: {
      bankName: 'DBS Bank Ltd (Singapore)',
      swiftBic: 'DBSSSGSGXXX',
      virtualIban: 'SG72 DBSS 0039 1827 4910 22',
      routingNumber: '7171003',
      beneficiaryName: 'DueFox Asia Pte Ltd Escrow',
      referenceCode: 'DF-INV-9041-PAC',
    },
  },
};

export default function PaymentPortal() {
  const { invoiceId } = useParams<{ invoiceId?: string }>();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Record<string, Invoice>>({ ...MOCK_INVOICES });
  const [currentId, setCurrentId] = useState<string>(invoiceId || 'INV-2026-8891');
  const [newlyPaidId, setNewlyPaidId] = useState<string | null>(null);

  // Payment tab state
  const [paymentTab, setPaymentTab] = useState<'card' | 'wire' | 'ach'>('card');
  const [cardProcessing, setCardProcessing] = useState(false);
  const [wireRef, setWireRef] = useState('');
  const [wireSubmitted, setWireSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync route param with state
  useEffect(() => {
    if (invoiceId) {
      const normalized = invoiceId.toUpperCase();
      if (!invoices[normalized]) {
        // Create dynamic invoice placeholder for unlisted ID
        const dynamicInv: Invoice = {
          ...MOCK_INVOICES['INV-2026-8891'],
          id: normalized,
          invoiceNumber: normalized,
          status: 'overdue',
          daysDifference: 8,
          totalAmountDue: 14850,
        };
        setInvoices((prev) => ({ ...prev, [normalized]: dynamicInv }));
      }
      setCurrentId(normalized);
    }
  }, [invoiceId]);

  const activeInvoice = invoices[currentId] || MOCK_INVOICES['INV-2026-8891'];
  const isPaid = activeInvoice.status === 'paid';

  const handleSelectInvoice = (id: string) => {
    setCurrentId(id);
    navigate(`/pay/${id}`);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePaymentSuccess = (details: {
    transactionId: string;
    cardLast4: string;
    cardBrand: string;
    authCode: string;
  }) => {
    const current = invoices[currentId];
    if (!current) return;

    const record: PaymentTransactionRecord = {
      transactionId: details.transactionId,
      paymentMethod: 'stripe_card',
      methodLabel: `${details.cardBrand} (•••• ${details.cardLast4}) via Stripe Express`,
      amountPaid: current.totalAmountDue,
      currency: current.currency,
      paidAt: new Date().toISOString(),
      authCode: details.authCode,
      cardLast4: details.cardLast4,
      cardBrand: details.cardBrand,
      processorFee: 0,
      receiptNumber: `RCP-DF-2026-${current.invoiceNumber.split('-')[2] || '442'}`,
      reconciliationStatus: 'settled',
      gatewayReference: `STRIPE-PAY-${details.authCode}`,
    };

    const updated: Invoice = {
      ...current,
      status: 'paid',
      paymentRecord: record,
    };

    setInvoices((prev) => ({ ...prev, [currentId]: updated }));
    setNewlyPaidId(currentId);
  };

  const handleSimulateCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    setCardProcessing(true);
    setTimeout(() => {
      setCardProcessing(false);
      handlePaymentSuccess({
        transactionId: `tx_stripe_${Date.now().toString(36)}`,
        cardLast4: '4242',
        cardBrand: 'Visa Corporate',
        authCode: `AUTH-ST-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }, 1200);
  };

  const handleWireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wireRef) return;

    const current = invoices[currentId];
    if (!current) return;

    const record: PaymentTransactionRecord = {
      transactionId: `wire_tx_${Date.now().toString(36)}`,
      paymentMethod: 'fedwire_wire',
      methodLabel: 'Commercial SWIFT/Fedwire Wire Transfer',
      amountPaid: current.totalAmountDue,
      currency: current.currency,
      paidAt: new Date().toISOString(),
      authCode: `WIRE-REF-${wireRef.toUpperCase()}`,
      processorFee: 0,
      receiptNumber: `RCP-DF-WIRE-${current.invoiceNumber.split('-')[2] || '10'}`,
      reconciliationStatus: 'processing',
      gatewayReference: wireRef,
    };

    const updated: Invoice = {
      ...current,
      status: 'paid',
      paymentRecord: record,
    };

    setInvoices((prev) => ({ ...prev, [currentId]: updated }));
    setNewlyPaidId(currentId);
    setWireSubmitted(true);
  };

  const handleResetInvoice = (id: string) => {
    const original = MOCK_INVOICES[id] || {
      ...MOCK_INVOICES['INV-2026-8891'],
      id,
      invoiceNumber: id,
      status: 'overdue',
    };

    setInvoices((prev) => ({
      ...prev,
      [id]: {
        ...original,
        status: 'overdue',
      },
    }));
    setNewlyPaidId(null);
    setWireSubmitted(false);
    setWireRef('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5722]/30 selection:text-orange-200">
      {/* Top Demo Toolbar: Scenario Switcher */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Public Payment Portal</span>
            <span className="text-slate-600">·</span>
            <Link to="/" className="text-[#FF5722] hover:underline font-medium">
              ← Return to DueFox.co
            </Link>
            <span className="text-slate-600">·</span>
            <Link to="/dashboard" className="text-slate-400 hover:text-white underline">
              Go to Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Test Invoices:</span>
            {Object.keys(invoices).map((id) => (
              <button
                key={id}
                onClick={() => handleSelectInvoice(id)}
                className={`px-2 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                  currentId === id
                    ? 'bg-[#FF5722] text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {id} ({invoices[id].status})
              </button>
            ))}

            <button
              onClick={() => handleResetInvoice(currentId)}
              className="ml-2 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Header with DueFox Logo, Verified B2B Badge & Vendor Information */}
      <header className="border-b border-slate-800/80 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-30 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5722] flex items-center justify-center text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M4 5L12 11L20 5L17 19L12 16L7 19L4 5Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">dueFox</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified B2B Remittance
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Billed by: <strong className="text-slate-200">{activeInvoice.vendor.name}</strong>
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-xs text-slate-400 block">Recipient / Client</span>
            <span className="text-sm font-semibold text-white block">
              {activeInvoice.client.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Attn: {activeInvoice.client.contactName}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 sm:px-6 max-w-5xl mx-auto w-full space-y-8">
        {/* PAID SUCCESS STATE */}
        {isPaid ? (
          <div className="bg-[#1E293B] rounded-2xl border border-emerald-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-block text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                {activeInvoice.paymentRecord?.reconciliationStatus === 'processing'
                  ? 'Wire Transfer Submitted · Processing'
                  : 'Invoice Fully Settled'}
              </span>

              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Payment Successfully Received
              </h2>

              <p className="text-sm text-slate-300">
                A formal payment receipt has been issued to{' '}
                <strong className="text-white">{activeInvoice.client.contactEmail}</strong> and your
                vendor ledger has been updated. Automated chase notices have been permanently silenced.
              </p>

              {/* Receipt card */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 text-left text-xs space-y-3 font-mono mt-6">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Receipt Number:</span>
                  <span className="text-white font-bold">
                    {activeInvoice.paymentRecord?.receiptNumber || 'RCP-DF-2026-8891'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Invoice Settled:</span>
                  <span className="text-white font-bold">{activeInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {activeInvoice.currencySymbol}
                    {activeInvoice.totalAmountDue.toLocaleString()} {activeInvoice.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Settlement Rail:</span>
                  <span className="text-slate-200">
                    {activeInvoice.paymentRecord?.methodLabel || 'Stripe Corporate Express'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway Auth Reference:</span>
                  <span className="text-slate-200">
                    {activeInvoice.paymentRecord?.authCode || 'AUTH-OK-9921'}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => alert(`Receipt PDF for ${activeInvoice.invoiceNumber} downloaded.`)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
                >
                  <Download className="w-4 h-4 text-[#FF5722]" />
                  <span>Download Official PDF Receipt</span>
                </button>

                <button
                  onClick={() => handleResetInvoice(activeInvoice.id)}
                  className="px-4 py-2.5 bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Simulate Unpaid State
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* UNPAID STATE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Invoice Breakdown */}
            <div className="lg:col-span-7 bg-[#1E293B] rounded-2xl border border-slate-700/80 p-6 sm:p-7 shadow-xl space-y-6">
              {/* Top Invoice Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">Statement Reference</span>
                  <h3 className="text-2xl font-bold font-mono text-white mt-0.5">
                    {activeInvoice.invoiceNumber}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    {activeInvoice.status === 'overdue' ? (
                      <span className="text-xs font-semibold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {activeInvoice.daysDifference} Days Past Due
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
                        Due Net 15
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Balance Due</span>
                  <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                    {activeInvoice.currencySymbol}
                    {activeInvoice.totalAmountDue.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">
                    {activeInvoice.currency}
                  </span>
                </div>
              </div>

              {/* Dates & Billing Parties */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Issue Date</span>
                  <span className="font-semibold text-white font-mono">{activeInvoice.issueDate}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Due Date</span>
                  <span className="font-semibold text-amber-400 font-mono">{activeInvoice.dueDate}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Services Rendered
                </span>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Description</th>
                        <th className="py-2.5 px-4 text-center">Qty</th>
                        <th className="py-2.5 px-4 text-right">Rate</th>
                        <th className="py-2.5 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                      {activeInvoice.lineItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 px-4 text-white font-medium">{item.description}</td>
                          <td className="py-3 px-4 text-center text-slate-400 font-mono">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-300">
                            {activeInvoice.currencySymbol}
                            {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white font-semibold">
                            {activeInvoice.currencySymbol}
                            {item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subtotal breakdown */}
              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-mono text-white">
                    {activeInvoice.currencySymbol}
                    {activeInvoice.subtotal.toLocaleString()}
                  </span>
                </div>
                {activeInvoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Applicable Tax ({activeInvoice.taxRate}%)</span>
                    <span className="font-mono text-white">
                      {activeInvoice.currencySymbol}
                      {activeInvoice.taxAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                  <span className="text-white">Total Amount Due</span>
                  <span className="font-mono text-[#FF5722] text-base">
                    {activeInvoice.currencySymbol}
                    {activeInvoice.totalAmountDue.toLocaleString()} {activeInvoice.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Payment Actions */}
            <div className="lg:col-span-5 bg-[#1E293B] rounded-2xl border border-slate-700/80 p-6 sm:p-7 shadow-xl space-y-5">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-orange-400 tracking-wider">
                  Remittance Options
                </span>
                <h4 className="text-xl font-bold text-white tracking-tight mt-1">
                  Select Payment Rail
                </h4>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`py-2 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                    paymentTab === 'card'
                      ? 'bg-[#FF5722] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('wire')}
                  className={`py-2 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                    paymentTab === 'wire'
                      ? 'bg-[#FF5722] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SWIFT Wire
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('ach')}
                  className={`py-2 px-2 rounded-lg font-medium transition-all cursor-pointer ${
                    paymentTab === 'ach'
                      ? 'bg-[#FF5722] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ACH Debit
                </button>
              </div>

              {/* Tab 1: Credit Card Form */}
              {paymentTab === 'card' && (
                <form onSubmit={handleSimulateCardPay} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      defaultValue={activeInvoice.client.contactName}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        defaultValue="4242 •••• •••• 4242"
                        required
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#FF5722]"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Expires
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#FF5722]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        CVC
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        defaultValue="384"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#FF5722]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cardProcessing}
                    className="w-full py-3.5 bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold rounded-xl transition-all shadow-lg glow-orange flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {cardProcessing ? (
                      <span>Authorizing with Stripe...</span>
                    ) : (
                      <>
                        <span>
                          Pay {activeInvoice.currencySymbol}
                          {activeInvoice.totalAmountDue.toLocaleString()} {activeInvoice.currency}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Tab 2: SWIFT Wire Transfer Instructions */}
              {paymentTab === 'wire' && (
                <div className="space-y-4 pt-1 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    Instruct your bank or treasury team to wire funds to the dedicated virtual
                    account below. All incoming wires with matching reference tags auto-settle within
                    60 seconds.
                  </p>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Beneficiary Bank:</span>
                      <span className="text-white font-semibold">
                        {activeInvoice.wireInstructions?.bankName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">SWIFT / BIC:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-orange-400 font-bold">
                          {activeInvoice.wireInstructions?.swiftBic}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(activeInvoice.wireInstructions?.swiftBic || '', 'swift')
                          }
                          className="text-slate-400 hover:text-white"
                        >
                          {copiedField === 'swift' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Virtual Dedicated IBAN:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">
                          {activeInvoice.wireInstructions?.virtualIban}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(activeInvoice.wireInstructions?.virtualIban || '', 'iban')
                          }
                          className="text-slate-400 hover:text-white"
                        >
                          {copiedField === 'iban' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded">
                      <span className="text-amber-400 font-bold">Wire Reference:</span>
                      <span className="text-white font-bold">
                        {activeInvoice.wireInstructions?.referenceCode}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleWireSubmit} className="space-y-3 pt-2">
                    <label className="block text-slate-300 font-semibold">
                      Already initiated the bank wire? Submit reference:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WIRE-8849201"
                        value={wireRef}
                        onChange={(e) => setWireRef(e.target.value)}
                        required
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#FF5722]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Confirm Wire
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 3: ACH Debit */}
              {paymentTab === 'ach' && (
                <div className="space-y-4 pt-1 text-xs">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-white block">Plaid ACH Direct Debit</span>
                    <p className="text-slate-400 leading-relaxed">
                      Connect your US corporate checking account (Chase, BofA, Wells Fargo, etc.)
                      with instant micro-deposit or Plaid credential authentication. Zero 3% card
                      processing surcharges.
                    </p>
                  </div>
                  <button
                    onClick={handleSimulateCardPay}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Connect Corporate Bank Account via Plaid</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Security info */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Bank Grade Encryption
                </span>
                <span>DueFox Escrow</span>
              </div>
            </div>
          </div>
        )}

        {/* Trust strip */}
        <div className="rounded-2xl border border-slate-800 bg-[#1E293B]/40 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>
                Protected by <strong className="text-slate-200">DueFox Escrow &amp; Treasury Rails</strong>. Automated ledger receipt issued immediately upon settlement.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-slate-400" />
                PCI-DSS SAQ-A Certified
              </span>
              <span>·</span>
              <span>SOC2 Type II</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080c14] py-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">dueFox.co</span>
            <span>·</span>
            <span>Verified Public B2B Payment Portal</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${activeInvoice.vendor.contactEmail}`}
              className="hover:text-slate-300 transition-colors"
            >
              Vendor Support ({activeInvoice.vendor.contactEmail})
            </a>
            <span>·</span>
            <span className="font-mono text-[11px]">SHA256: 8A94-F291-CC40</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
