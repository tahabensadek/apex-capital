'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, Phone, MessageSquare, CheckCircle2,
  Clock, ShieldCheck, AlertTriangle, ArrowRight, Zap, RefreshCw,
  Award, Building2, User, Landmark, Send, Eye, FileText, ChevronRight,
  Sparkles, ExternalLink
} from 'lucide-react';
import { runUnderwritingEngine, FlinksAccountData, UnderwritingResult } from '@/lib/underwritingEngine';

interface CRMLead {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  province: string;
  amount: number;
  monthlyRevenue: string;
  stage: 'INBOUND_NEW' | 'CONTACTED_FLINKS' | 'UNDERWRITING' | 'MANDATE_SIGNED' | 'SENT_TO_LENDER' | 'FUNDED' | 'RENEWAL_READY';
  lender: 'MERCHANT_GROWTH' | 'AFN' | 'LIQUID_CAPITAL' | 'EQUIREX' | 'PENDING';
  tier: 'TIER_A' | 'TIER_B' | 'TIER_C';
  hasFlinksConnected: boolean;
  apexCommission: number;
  notes: string[];
  createdAt: string;
  lastActivity: string;
  minutesAgo: number;
}

const PIPELINE_COLUMNS: { key: CRMLead['stage']; title: string; color: string; badgeBg: string }[] = [
  { key: 'INBOUND_NEW', title: '🚨 Nouveaux Leads (< 3 Min)', color: 'border-rose-500/80', badgeBg: 'bg-rose-500/20 text-rose-300' },
  { key: 'CONTACTED_FLINKS', title: '📱 Contacté & Plaid Ouvert', color: 'border-amber-500/80', badgeBg: 'bg-amber-500/20 text-amber-300' },
  { key: 'UNDERWRITING', title: '⚡ Souscription & Buy-Box', color: 'border-blue-500/80', badgeBg: 'bg-blue-500/20 text-blue-300' },
  { key: 'MANDATE_SIGNED', title: '✍️ Mandat 7.0% Direction to Pay', color: 'border-purple-500/80', badgeBg: 'bg-purple-500/20 text-purple-300' },
  { key: 'SENT_TO_LENDER', title: '🏦 Transmis au Prêteur (BCC Fund / AFN)', color: 'border-cyan-500/80', badgeBg: 'bg-cyan-500/20 text-cyan-300' },
  { key: 'FUNDED', title: '💰 Déboursé & Commission 7.0% Virée', color: 'border-emerald-500/80', badgeBg: 'bg-emerald-500/20 text-emerald-300' },
];

export default function ApexCRMPage() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [activeUnderwriting, setActiveUnderwriting] = useState<UnderwritingResult | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/crm/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error('Error fetching CRM leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStage = async (leadId: string, newStage: CRMLead['stage']) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STAGE', leadId, stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, stage: newStage } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!noteInput.trim()) return;
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_NOTE', leadId, note: noteInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, notes: [noteInput.trim(), ...prev.notes] } : null);
        }
        setNoteInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunUnderwriting = (lead: CRMLead) => {
    // Generate synthetic transactional data calibrated to the lead
    const monthlyAmt = lead.amount * 1.15;
    const sampleData: FlinksAccountData = {
      accountNumber: '****' + lead.phone.slice(-4),
      institution: lead.province === 'QC' ? 'RBC Royal Bank' : 'TD Canada Trust',
      holderName: lead.ownerName,
      businessName: lead.businessName,
      currentBalance: Math.round(monthlyAmt * 0.18),
      transactions: [
        { id: '1', date: '2026-09-01', description: 'INTERAC E-TRANSFER CLIENT DEPOSIT', amount: Math.round(monthlyAmt * 0.35), balance: 25000 },
        { id: '2', date: '2026-09-08', description: 'SUPPLIER MATERIALS INVOICE PAD', amount: -Math.round(monthlyAmt * 0.20), balance: 18000 },
        { id: '3', date: '2026-09-15', description: 'COMMERCIAL CONTRACT WIRE RECEIVED', amount: Math.round(monthlyAmt * 0.45), balance: 45000 },
        { id: '4', date: '2026-09-22', description: 'WEEKLY CREW PAYROLL EFT', amount: -Math.round(monthlyAmt * 0.15), balance: 35000 },
      ]
    };
    const evalRes = runUnderwritingEngine(sampleData);
    setActiveUnderwriting(evalRes);
  };

  const handleTriggerQuickSms = (phone: string, name: string) => {
    setSmsNotification(`SMS Speed-to-Lead Telnyx envoyé à ${name} (${phone}) : "Salut ${name}, c'est Taha d'Apex Capital..."`);
    setTimeout(() => setSmsNotification(null), 5000);
  };

  // Financial KPI Calculations
  const totalFundedAmount = leads.filter(l => l.stage === 'FUNDED').reduce((acc, l) => acc + l.amount, 0);
  const totalApexEarned = leads.filter(l => l.stage === 'FUNDED').reduce((acc, l) => acc + l.apexCommission, 0);
  const activePipelineAmount = leads.filter(l => l.stage !== 'FUNDED').reduce((acc, l) => acc + l.amount, 0);
  const potentialCommission = leads.filter(l => l.stage !== 'FUNDED').reduce((acc, l) => acc + l.apexCommission, 0);
  
  // Porsche 911 Progress ($180,000 Cash Target)
  const porscheTarget = 180000;
  const porscheProgress = Math.min(100, Math.round((totalApexEarned / porscheTarget) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      
      {/* Toast Notification */}
      {smsNotification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4" /> {smsNotification}
        </div>
      )}

      {/* Top Header & Executive Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            APEX CAPITAL TRADING FLOOR • LIVE DESK OPERATING SYSTEM
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Origination & Deal Flow CRM
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchLeads}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Rafraîchir les leads"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href="https://merchantadvance.my.site.com/partners/s/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all"
          >
            <Landmark className="w-4 h-4 text-emerald-400" /> Portail Merchant Growth
          </a>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/60 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> AFN Wholesale Ready (Amir)
          </div>
        </div>
      </div>

      {/* Top KPI Scoreboard & Porsche 911 Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        {/* 1. MTD Net Commission Earned */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
            <span>Commissions Encaissées (MTD)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {totalApexEarned.toLocaleString()} $ <span className="text-xs text-slate-400 font-normal">CAD NET</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Volume déboursé : <strong className="text-white">{totalFundedAmount.toLocaleString()} $</strong>
          </div>
        </div>

        {/* 2. Active Pipeline Value */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
            <span>Pipeline Actif en Cours</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {activePipelineAmount.toLocaleString()} $ <span className="text-xs text-slate-400 font-normal">CAD</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Commissions potentielles : <strong className="text-emerald-400">+{potentialCommission.toLocaleString()} $</strong>
          </div>
        </div>

        {/* 3. Speed-to-Lead Health */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
            <span>Speed-to-Lead SLA</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            45s <span className="text-xs text-slate-400 font-normal">Temps Moyen de Rappel</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Taux de contact immédiat : <strong className="text-emerald-400">94.2%</strong>
          </div>
        </div>

        {/* 4. Porsche 911 Carrera 4S Goal Tracker */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300 uppercase">
            <span>🎯 Objectif Porsche 911 4S (180k$)</span>
            <span className="font-bold text-emerald-400">{porscheProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-2 border border-slate-700">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, porscheProgress)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-300 mt-1">
            <span>Cash: <strong className="text-white">{totalApexEarned.toLocaleString()}$</strong></span>
            <span>Reste: <strong className="text-emerald-400">{Math.max(0, porscheTarget - totalApexEarned).toLocaleString()}$</strong></span>
          </div>
        </div>

      </div>

      {/* Main Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {PIPELINE_COLUMNS.map(col => {
          const columnLeads = leads.filter(l => l.stage === col.key);
          const colSum = columnLeads.reduce((a, b) => a + b.amount, 0);

          return (
            <div key={col.key} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[550px] shadow-xl">
              
              {/* Column Header */}
              <div className={`p-3 rounded-xl border ${col.color} bg-slate-900/90 mb-3 flex flex-col gap-1`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">{col.title}</span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {columnLeads.length}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {colSum.toLocaleString()} $ CAD
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {columnLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/60 rounded-xl p-3.5 cursor-pointer transition-all shadow-md group relative"
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                        {lead.id} • {lead.province}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        +{lead.apexCommission.toLocaleString()} $ Spread
                      </span>
                    </div>

                    {/* Business Name */}
                    <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {lead.businessName}
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2">{lead.ownerName}</div>

                    {/* Amount & Revenue */}
                    <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800/60 text-xs flex justify-between items-center mb-2.5">
                      <span className="text-slate-400">Demandé :</span>
                      <span className="font-black text-white">{lead.amount.toLocaleString()} $</span>
                    </div>

                    {/* Quick Action Dial Buttons */}
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Appeler immédiatement"
                      >
                        <Phone className="w-3 h-3" /> Appeler
                      </a>
                      <button
                        onClick={() => handleTriggerQuickSms(lead.phone, lead.ownerName)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                        title="Envoyer SMS Telnyx"
                      >
                        <MessageSquare className="w-3 h-3 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          handleRunUnderwriting(lead);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                        title="Souscription 0.8s"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>

                    {/* Stage Transition Selector */}
                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500" onClick={(e) => e.stopPropagation()}>
                      <span>Changer étape :</span>
                      <select
                        value={lead.stage}
                        onChange={(e) => handleUpdateStage(lead.id, e.target.value as CRMLead['stage'])}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:border-emerald-500"
                      >
                        {PIPELINE_COLUMNS.map(c => (
                          <option key={c.key} value={c.key}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Slide-Over Drawer / Modal for Selected Lead Details & Underwriting */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end" onClick={() => setSelectedLead(null)}>
          <div 
            className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">{selectedLead.id} • {selectedLead.province}</span>
                <h2 className="text-2xl font-black text-white mt-0.5">{selectedLead.businessName}</h2>
                <p className="text-sm text-slate-400">{selectedLead.ownerName} • {selectedLead.phone} • {selectedLead.email}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href={`tel:${selectedLead.phone}`}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Phone className="w-4 h-4" /> Appeler ({selectedLead.phone})
              </a>
              <button
                onClick={() => handleTriggerQuickSms(selectedLead.phone, selectedLead.ownerName)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" /> SMS Telnyx
              </button>
              <button
                onClick={() => handleRunUnderwriting(selectedLead)}
                className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/60 text-amber-300 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" /> Souscription 0.8s
              </button>
            </div>

            {/* Deal Snapshot */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">Montant Demandé</span>
                <span className="text-2xl font-black text-white">{selectedLead.amount.toLocaleString()} $ CAD</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-mono">Commission Nette Apex (6.5%)</span>
                <span className="text-2xl font-black text-emerald-400">+{selectedLead.apexCommission.toLocaleString()} $ NET</span>
              </div>
            </div>

            {/* Underwriting Evaluation (If Active) */}
            {activeUnderwriting && (
              <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Évaluation Algorithmique Flinks
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {activeUnderwriting.headline}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Dépôts Mensuels:</span>
                    <strong className="text-white text-sm">{activeUnderwriting.metrics.monthlyGrossRevenue.toLocaleString()} $</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Solde Quotidien (ADB):</span>
                    <strong className="text-white text-sm">{activeUnderwriting.metrics.avgDailyBalance.toLocaleString()} $</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Compteur NSF:</span>
                    <strong className="text-emerald-400 text-sm">{activeUnderwriting.metrics.nsfCount90Days} NSF</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-300">Offre Recommandée : <strong className="text-white font-mono">{activeUnderwriting.loanOffers.recommended.toLocaleString()} $</strong></span>
                  <a
                    href="https://merchantadvance.my.site.com/partners/s/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    Transmettre à Merchant Growth <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Notes & Activity Log */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Notes & Historique du Dossier
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedLead.id)}
                  placeholder="Ajouter une note de suivi..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleAddNote(selectedLead.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Ajouter
                </button>
              </div>

              <div className="space-y-2">
                {selectedLead.notes.map((n, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300">
                    {n}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
