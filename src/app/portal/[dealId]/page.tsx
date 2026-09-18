"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Building2, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, 
  FileText, Upload, Lock, Sparkles, Phone, Mail, Check, CreditCard, ChevronRight, Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import { PlaidLinkModal } from "@/components/PlaidLinkModal";

interface DealData {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  amountRequested: number;
  monthlyRevenue: number;
  stage: number; // 1: Bank Connect, 2: Pre-Screen, 3: Underwriting, 4: Approved Offer, 5: Funded
  status: string;
  mandateSigned: boolean;
  plaidConnected: boolean;
  plaidData?: {
    institution: string;
    accountNumber: string;
    currentBalance: number;
    verifiedAt: string;
  };
  underwriting?: any;
  documents?: { name: string; type: string; uploadedAt: string }[];
}

const CANADIAN_BANKS = [
  { id: 'rbc', name: 'RBC Royal Bank', logo: '🦁', color: 'from-blue-600 to-blue-800' },
  { id: 'td', name: 'TD Canada Trust', logo: '🟩', color: 'from-emerald-600 to-emerald-800' },
  { id: 'bmo', name: 'BMO Bank of Montreal', logo: '🔵', color: 'from-blue-700 to-indigo-900' },
  { id: 'scotia', name: 'Scotiabank', logo: '🔴', color: 'from-red-600 to-red-800' },
  { id: 'cibc', name: 'CIBC', logo: '🏛️', color: 'from-red-700 to-rose-900' },
  { id: 'desjardins', name: 'Desjardins', logo: '🟢', color: 'from-green-600 to-emerald-900' },
  { id: 'nbc', name: 'National Bank', logo: '⚡', color: 'from-red-500 to-red-700' },
];

export default function ClientPortalPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  const dealId = resolvedParams.dealId;

  const [deal, setDeal] = useState<DealData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBank, setSelectedBank] = useState<string>('RBC Royal Bank');
  const [isPlaidModalOpen, setIsPlaidModalOpen] = useState<boolean>(false);
  const [isConnectingPlaid, setIsConnectingPlaid] = useState<boolean>(false);
  const [plaidSuccess, setPlaidSuccess] = useState<boolean>(false);
  const [mandateName, setMandateName] = useState<string>("");
  const [mandateAgreed, setMandateAgreed] = useState<boolean>(false);
  const [isSigningMandate, setIsSigningMandate] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'bank' | 'docs' | 'mandate'>('bank');
  const [offerAccepted, setOfferAccepted] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/deals/${dealId}`)
      .then(r => r.json())
      .then(data => {
        if (data.deal) {
          setDeal(data.deal);
          setMandateName(data.deal.contactName || "");
          if (data.deal.plaidConnected) setPlaidSuccess(true);
          if (data.deal.mandateSigned) setMandateAgreed(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dealId]);

  const handlePlaidModalSuccess = async (bankInfo: { institution: string; accountNumber: string; balance: number }) => {
    setIsPlaidModalOpen(false);
    setIsConnectingPlaid(true);
    setSelectedBank(bankInfo.institution);
    try {
      const res = await fetch('/api/plaid/exchange-public-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_token: 'link-sandbox-apex-mock-' + Date.now(),
          dealId: dealId,
          institution: bankInfo.institution,
          businessName: deal?.companyName || 'Apex Client Corp'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlaidSuccess(true);
        setDeal(prev => prev ? {
          ...prev,
          stage: 3,
          status: 'UNDERWRITING_REVIEW',
          plaidConnected: true,
          plaidData: data.account,
          underwriting: data.underwriting
        } : null);

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnectingPlaid(false);
    }
  };

  const handleSignMandate = async () => {
    if (!mandateName || !mandateAgreed) return;
    setIsSigningMandate(true);
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mandateSigned: true,
          mandateSigner: mandateName,
          mandateSignedAt: new Date().toISOString()
        })
      });
      setDeal(prev => prev ? { ...prev, mandateSigned: true } : null);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningMandate(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setUploadedFiles(prev => [...prev, `${docType}: ${fileName}`]);
    }
  };

  const handleAcceptOffer = async () => {
    setOfferAccepted(true);
    await fetch(`/api/deals/${dealId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 5,
        status: 'DISBURSEMENT_INITIATED',
        offerAcceptedAt: new Date().toISOString()
      })
    });
    setDeal(prev => prev ? { ...prev, stage: 5, status: 'DISBURSEMENT_INITIATED' } : null);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Authenticating Apex Secure Session...</p>
      </div>
    );
  }

  const stages = [
    { num: 1, title: "Intake & Bank Connect", desc: "Plaid / Flinks verified", done: deal?.plaidConnected },
    { num: 2, title: "Risk Pre-Screening", desc: "< 2 NSFs, $30k+ vol", done: deal?.plaidConnected },
    { num: 3, title: "Underwriting Review", desc: "Direct with BCC Fund desk", done: deal?.stage ? deal.stage >= 4 : false, current: deal?.stage === 3 },
    { num: 4, title: "Term Sheet & Approval", desc: "Capital offer ready", done: deal?.stage ? deal.stage >= 5 : false, current: deal?.stage === 4 },
    { num: 5, title: "Capital Disbursed", desc: "Same-Day Wire Transfer", done: deal?.stage === 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-24">
      {/* Top Luxury Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-base">APEX CAPITAL</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">SECURE PORTAL</span>
              </div>
              <p className="text-xs text-slate-400">Deal Reference: <span className="font-mono text-slate-300">#{dealId}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="tel:+15148002739" 
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Desk</span>
            </a>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>24H FAST-LANE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Top Company & Target Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commercial Bridge Allocation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {deal?.companyName || "Commercial Borrower"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Authorized Officer: <span className="text-slate-200 font-medium">{deal?.contactName || "Managing Director"}</span> • {deal?.phone}
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center space-x-6">
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Target Capital</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  ${(deal?.amountRequested || 65000).toLocaleString()} <span className="text-xs font-normal text-slate-400">CAD</span>
                </p>
              </div>
              <div className="h-10 w-[1px] bg-slate-800" />
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase">Disbursement</p>
                <p className="text-sm font-semibold text-white flex items-center space-x-1.5 mt-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>24-Hour Wire</span>
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Status Alert Banner */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${deal?.stage === 5 ? 'bg-emerald-400' : 'bg-emerald-500 animate-ping'}`} />
              <div>
                <p className="text-xs font-mono text-slate-400">CURRENT DESK STATUS</p>
                <p className="text-sm font-medium text-slate-200">
                  {deal?.stage === 5 
                    ? "🎉 Funds wired! Your commercial advance is active."
                    : deal?.stage === 4 
                      ? "⚡ Approved Term Sheet Ready: Review terms & execute below."
                      : deal?.stage === 3 
                        ? "🔍 File packaged with verified bank records. Active review with senior credit desk."
                        : "⏳ Awaiting Instant Bank Verification below to generate instant approval."}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">Underwriter: partners@bccfund.com</span>
          </div>
        </div>

        {/* 🍕 Domino's Live Deal Tracker Timeline */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-6 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Live Deal Progression</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {stages.map((st, i) => {
              const isPassed = st.done;
              const isCurrent = st.current;

              return (
                <div 
                  key={st.num}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPassed 
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-white' 
                      : isCurrent 
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10' 
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isPassed ? 'bg-emerald-500 text-slate-950' : isCurrent ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider">
                      {isPassed ? 'DONE' : isCurrent ? 'ACTIVE' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">{st.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Tabs: [1. Fast Bank Connect (Plaid)] | [2. Documents] | [3. Mandate] */}
        <div className="flex border-b border-slate-800 space-x-2">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'bank' 
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Instant Bank Connect (Plaid Fast-Track)</span>
          </button>
          <button
            onClick={() => setActiveTab('mandate')}
            className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'mandate' 
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Apex Mandate Agreement</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'docs' 
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>3. Identity & Documents</span>
          </button>
        </div>

        {/* TAB 1: PLAID FAST-TRACK BANK CONNECT */}
        {activeTab === 'bank' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Fast-Track Bank Verification</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PLAID ENCRYPTED</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Connecting your commercial operating account automatically extracts the 12-month deposit volume required by underwriting, eliminating days of manual statement review.
                </p>
              </div>

              {plaidSuccess && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFIED VIA PLAID</span>
                </div>
              )}
            </div>

            {!plaidSuccess ? (
              <div className="space-y-4">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Select Your Financial Institution:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CANADIAN_BANKS.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => {
                        setSelectedBank(bank.name);
                        setIsPlaidModalOpen(true);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                        selectedBank === bank.name 
                          ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80'
                      }`}
                    >
                      <span className="text-xl">{bank.logo}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{bank.name}</p>
                        <p className="text-[10px] text-emerald-400 font-mono">Connecter ➔</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setIsPlaidModalOpen(true)}
                    disabled={isConnectingPlaid}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide uppercase transition shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isConnectingPlaid ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Analyse des 90 jours de relevés en cours...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 stroke-[2.5]" />
                        <span>Ouvrir la Fenêtre Plaid & Connecter {selectedBank}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Verified Plaid Underwriting Dashboard */
              <div className="bg-slate-950 rounded-xl border border-emerald-500/30 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-emerald-400 uppercase">Verified Account Summary</p>
                      <p className="text-base font-bold text-white">{deal?.plaidData?.institution || selectedBank} (****9182)</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-[10px] text-slate-400 uppercase">Current Operating Balance</p>
                    <p className="text-base font-bold text-emerald-400">${(deal?.plaidData?.currentBalance || 28450).toLocaleString()} CAD</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Avg Monthly Deposits</p>
                    <p className="text-base font-black text-white font-mono">$58,200 <span className="text-xs font-normal text-slate-400">/mo</span></p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">✓ Passed Tier-1 Threshold</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">NSF / Return Checks (90d)</p>
                    <p className="text-base font-black text-emerald-400 font-mono">0 NSFs</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">✓ Clean Cash Flow Record</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Pre-Approved Capital</p>
                    <p className="text-base font-black text-emerald-400 font-mono">${(deal?.amountRequested || 65000).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready for final term sheet</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANDATE E-SIGN */}
        {activeTab === 'mandate' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Apex Capital Brokerage Success Mandate</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">LEGAL LOCK</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero upfront fees. Apex Capital acts as your exclusive commercial finance advisor. Our success fee (7.5%) is payable only upon actual fund disbursement to your account.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-44 overflow-y-auto text-xs text-slate-400 font-mono space-y-2 leading-relaxed">
              <p><strong className="text-slate-200">1. SCOPE OF SERVICES:</strong> Apex Capital Inc. agrees to package, underwrite, and submit Client&apos;s financing file to accredited commercial funding institutions (including BCC Fund and institutional syndicates).</p>
              <p><strong className="text-slate-200">2. CONTINGENT SUCCESS FEE:</strong> Client agrees to pay Apex Capital a success fee equal to 7.5% of the total gross capital disbursed, payable via EFT, Wire, or Interac within 24 hours of funds clearing Client&apos;s account.</p>
              <p><strong className="text-slate-200">3. NO UPFRONT FEES:</strong> If no funding is obtained or accepted, Client owes exactly $0.00.</p>
            </div>

            {!deal?.mandateSigned ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="mandateCheck"
                    checked={mandateAgreed}
                    onChange={(e) => setMandateAgreed(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="mandateCheck" className="text-xs text-slate-300 cursor-pointer">
                    I acknowledge and agree to the Apex Capital Success Mandate terms on behalf of <strong className="text-white">{deal?.companyName}</strong>.
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase">Authorized Signer Full Name</label>
                    <input
                      type="text"
                      value={mandateName}
                      onChange={(e) => setMandateName(e.target.value)}
                      placeholder="e.g. Alex Tremblay"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase">Signature Timestamp</label>
                    <div className="mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                      {new Date().toLocaleDateString()} — Cryptographically Bound
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignMandate}
                  disabled={!mandateAgreed || !mandateName || isSigningMandate}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Execute Mandate & Lock In Rate</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mandate Signed & Legally Locked by {mandateName}</span>
                </div>
                <span className="font-mono text-slate-400 text-[10px]">SUCCESS FEE: 7.5% UPON WIRE</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENTS & ID DROPZONE */}
        {activeTab === 'docs' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>KYC & Corporate Documents</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">STAGE 1</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload your business identification to expedite the underwriter’s compliance check.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Driver's License */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-white">1. Driver&apos;s License (Photo ID)</p>
                  <p className="text-[11px] text-slate-400 mt-1">Front & Back photo of principal director.</p>
                </div>
                <label className="mt-4 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-medium text-slate-200 cursor-pointer transition flex items-center justify-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, "ID Photo")} />
                </label>
              </div>

              {/* Incorporation Articles */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-white">2. Incorporation Articles</p>
                  <p className="text-[11px] text-slate-400 mt-1">Federal or Provincial corporate certificate.</p>
                </div>
                <label className="mt-4 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-medium text-slate-200 cursor-pointer transition flex items-center justify-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload PDF</span>
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, "Incorp Certificate")} />
                </label>
              </div>

              {/* Void Cheque */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-white">3. Void Cheque / PAD Form</p>
                  <p className="text-[11px] text-slate-400 mt-1">For 24h wire disbursement & direct debit.</p>
                </div>
                <label className="mt-4 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-medium text-slate-200 cursor-pointer transition flex items-center justify-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload Void Cheque</span>
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, "Void Cheque")} />
                </label>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Uploaded Files ({uploadedFiles.length})</p>
                {uploadedFiles.map((f, i) => (
                  <p key={i} className="text-xs text-emerald-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{f}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🌟 FINAL OFFER APPROVAL CARD (Appears when Plaid is connected / Stage >= 3) */}
        {plaidSuccess && (
          <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 rounded-2xl border-2 border-emerald-500/50 p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  OFFICIAL OFFER READY
                </span>
                <h3 className="text-2xl font-black text-white mt-2">Commercial Funding Allocation Approved</h3>
                <p className="text-xs text-slate-300">Underwritten by Direct Lending Desk • 24-Hour Wire Guarantee</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-slate-400">Approved Loan Amount</p>
                <p className="text-3xl font-black text-emerald-400 font-mono">${(deal?.amountRequested || 65000).toLocaleString()} <span className="text-xs font-normal text-slate-300">CAD</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">TERM</span>
                <span className="text-white font-bold">7 Months</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PAYMENT SCHEDULE</span>
                <span className="text-white font-bold">Weekly ($2,390 / wk)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">COLLATERAL</span>
                <span className="text-emerald-400 font-bold">Unsecured</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ESTIMATED WIRE</span>
                <span className="text-white font-bold">Tomorrow 12:00 PM</span>
              </div>
            </div>

            {!offerAccepted ? (
              <button
                onClick={handleAcceptOffer}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base tracking-wide uppercase transition shadow-2xl shadow-emerald-500/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Accept Terms & Authorize 24H Wire Transfer</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-400 text-center space-y-1">
                <p className="text-emerald-300 font-bold text-sm">🎉 Offer Accepted! Wire transfer is being prepared.</p>
                <p className="text-xs text-slate-300">Your account representative is finalizing closing documents with BCC Fund.</p>
              </div>
            )}
          </div>
        )}

        {/* Interactive Plaid Link Modal Popup */}
        <PlaidLinkModal
          isOpen={isPlaidModalOpen}
          onClose={() => setIsPlaidModalOpen(false)}
          onSuccess={handlePlaidModalSuccess}
          businessName={deal?.companyName}
        />

      </main>
    </div>
  );
}
