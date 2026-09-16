'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, TrendingUp, 
  DollarSign, Landmark, Zap, ArrowRight, RefreshCw, Award
} from 'lucide-react';
import { runUnderwritingEngine, FlinksAccountData, UnderwritingResult } from '@/lib/underwritingEngine';

// Sample Profiles for 1-Click Testing
const SAMPLE_PROFILES: { label: string; data: FlinksAccountData }[] = [
  {
    label: '🏆 Couvreur Pro (Alberta) - 85k$/mois (Tier A Golden File)',
    data: {
      accountNumber: '****4892',
      institution: 'RBC Royal Bank',
      holderName: 'Jean-Philippe Tremblay',
      businessName: 'Sommet Toiture & Rénovation Inc.',
      currentBalance: 18450,
      transactions: [
        { id: '1', date: '2026-09-01', description: 'INTERAC E-TRANSFER DEP CLIENT CHANTIER', amount: 28500, balance: 34500 },
        { id: '2', date: '2026-09-05', description: 'ACHAT MATERIAUX CANAC', amount: -12400, balance: 22100 },
        { id: '3', date: '2026-09-10', description: 'DEPOT DIRECT CLIENT VILLE MONTREAL', amount: 32000, balance: 54100 },
        { id: '4', date: '2026-09-15', description: 'PAIE EMPLOYES HEBDO', amount: -9800, balance: 44300 },
        { id: '5', date: '2026-09-20', description: 'VIREMENT CLIENT RESIDENTIEL', amount: 24500, balance: 68800 },
        { id: '6', date: '2026-09-25', description: 'LOCATION EQUIPEMENT PELLE', amount: -4500, balance: 64300 },
      ]
    }
  },
  {
    label: '🚛 Transporteur Routier (Ontario) - 55k$/mois (Tier B / 1 MCA Existant)',
    data: {
      accountNumber: '****9124',
      institution: 'TD Canada Trust',
      holderName: 'Harpreet Singh',
      businessName: 'Apex Logistics Freight Ltd.',
      currentBalance: 6200,
      transactions: [
        { id: '1', date: '2026-09-02', description: 'FREIGHT BROKERAGE FACTORING DEP', amount: 18500, balance: 21200 },
        { id: '2', date: '2026-09-06', description: 'PAD THINKING CAPITAL DAILY DEBIT', amount: -380, balance: 20820 },
        { id: '3', date: '2026-09-12', description: 'DIESEL PETRO CANADA CARBURANT', amount: -6400, balance: 14420 },
        { id: '4', date: '2026-09-16', description: 'DEP CLIENT LOGISTIQUE DIRECT', amount: 21000, balance: 35420 },
        { id: '5', date: '2026-09-22', description: 'PAD THINKING CAPITAL DAILY DEBIT', amount: -380, balance: 35040 },
        { id: '6', date: '2026-09-28', description: 'DEPOT FACTURATION TRUCKING', amount: 15500, balance: 50540 },
      ]
    }
  },
  {
    label: '⚠️ Restaurant en Difficulté (Québec) - 18k$/mois (Tier C / 2 NSF)',
    data: {
      accountNumber: '****3310',
      institution: 'Desjardins',
      holderName: 'Marc-André Lavoie',
      businessName: 'Bistro du Marché Inc.',
      currentBalance: 1200,
      transactions: [
        { id: '1', date: '2026-09-01', description: 'MONERIS TERMINAL ENCAISSEMENT', amount: 6200, balance: 6800 },
        { id: '2', date: '2026-09-05', description: 'FOURNISSEUR VIANDES GFS', amount: -4500, balance: 2300 },
        { id: '3', date: '2026-09-11', description: 'FRAIS DE REFUS NSF SANS PROVISION', amount: -48, balance: 2252 },
        { id: '4', date: '2026-09-18', description: 'MONERIS ENCAISSEMENTS WE', amount: 7400, balance: 9652 },
        { id: '5', date: '2026-09-24', description: 'FRAIS DE REFUS NSF CHEQUE REJETE', amount: -48, balance: 9604 },
        { id: '6', date: '2026-09-29', description: 'SQUARE DEPOTS CARTE CREDIT', amount: 4400, balance: 14004 },
      ]
    }
  }
];

export default function UnderwritingDeskPage() {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const [result, setResult] = useState<UnderwritingResult>(() => 
    runUnderwritingEngine(SAMPLE_PROFILES[0].data)
  );

  const handleSelectProfile = (idx: number) => {
    setSelectedProfileIndex(idx);
    const evalResult = runUnderwritingEngine(SAMPLE_PROFILES[idx].data);
    setResult(evalResult);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4" /> Moteur de Décision Algorithmique v1.0
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Apex Capital <span className="text-emerald-400 font-normal">| Desk de Souscription Instantané</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Évaluation Flinks Open Banking en 0.8s • Détection de Stacking • Calcul de Spread 6.5% Net
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-semibold text-slate-300">Partenaire Connecté:</span>
            <span className="text-emerald-400 font-bold">Merchant Growth Ltd. (API Live)</span>
          </div>
        </div>

        {/* 1-Click Profile Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tester un Profil d'Entreprise en 1-Clic :
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_PROFILES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectProfile(idx)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedProfileIndex === idx
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-white">{p.label}</div>
                <div className="text-xs text-slate-400 mt-1">{p.data.businessName} • {p.data.institution}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Output Decision Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8">
          
          {/* Top Decision Banner */}
          <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            result.decision === 'APPROVED_TIER_A'
              ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
              : result.decision === 'APPROVED_TIER_B'
              ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
              : 'bg-rose-950/60 border-rose-500/80 text-rose-300'
          }`}>
            <div className="flex items-center gap-4">
              {result.decision === 'APPROVED_TIER_A' && <CheckCircle2 className="w-10 h-10 text-emerald-400 flex-shrink-0" />}
              {result.decision === 'APPROVED_TIER_B' && <ShieldCheck className="w-10 h-10 text-amber-400 flex-shrink-0" />}
              {result.decision === 'CONDITIONAL_TIER_C' && <AlertTriangle className="w-10 h-10 text-orange-400 flex-shrink-0" />}
              {result.decision === 'DECLINED' && <XCircle className="w-10 h-10 text-rose-400 flex-shrink-0" />}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-80">
                  Résultat de l'Algorithme de Souscription :
                </span>
                <h2 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">{result.headline}</h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Délai Estimé de Déboursement</span>
              <span className="text-lg font-bold text-white">24 Heures Chrono</span>
            </div>
          </div>

          {/* 3 Main Metric Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Loan Offers */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-400" /> Montants Éligibles</span>
                <span className="text-emerald-400 font-bold">Fonds Virés 24h</span>
              </div>
              <div className="space-y-3">
                <div className="bg-emerald-950/30 border border-emerald-600/40 rounded-lg p-3">
                  <span className="text-xs text-emerald-400 font-semibold block">Recommandé (Optimal) :</span>
                  <span className="text-3xl font-black text-white">{result.loanOffers.recommended.toLocaleString()} $ <span className="text-xs text-slate-400 font-normal">CAD</span></span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 px-1">
                  <span>Conservateur: <strong className="text-slate-200">{result.loanOffers.conservative.toLocaleString()}$</strong></span>
                  <span>Agressif: <strong className="text-slate-200">{result.loanOffers.aggressive.toLocaleString()}$</strong></span>
                </div>
              </div>
            </div>

            {/* 2. Repayment Structure */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-blue-400" /> Structure de Remboursement</span>
                <span className="text-blue-400 font-bold">PAD Automatique</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Terme :</span>
                  <span className="font-bold text-white">{result.terms.termMonths} Mois</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Factor Rate :</span>
                  <span className="font-bold text-white">{result.terms.estimatedFactorRate}x</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Prélèvement Quotidien (PAD) :</span>
                  <span className="font-bold text-emerald-400">{result.terms.estimatedDailyPayment} $ / jour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Option Hebdomadaire :</span>
                  <span className="font-bold text-white">{result.terms.estimatedWeeklyPayment} $ / sem</span>
                </div>
              </div>
            </div>

            {/* 3. Apex Capital Commission Spread */}
            <div className="bg-gradient-to-br from-emerald-950/50 to-slate-950 border border-emerald-500/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 uppercase">
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Spread Net Apex Capital</span>
                <span className="font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px]">6.5% Brut</span>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-emerald-400">
                  {result.apexCommissions.totalGrossSpread.toLocaleString()} $ <span className="text-xs text-slate-400 font-normal">CAD NET</span>
                </div>
                <div className="space-y-1 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                  <div className="flex justify-between">
                    <span>Mandat Client (5%) :</span>
                    <strong className="text-white">{result.apexCommissions.clientMandate5Percent.toLocaleString()} $</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission Prêteur (1.5%) :</span>
                    <strong className="text-white">{result.apexCommissions.lenderCommission1_5Percent.toLocaleString()} $</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Underwriting Scan Details & Risk Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
            
            {/* Financial Health Metrics */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                📊 Métriques Extraites de Flinks (180 Jours)
              </h3>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenus Mensuels Récurrents :</span>
                  <span className="font-bold text-white">{result.metrics.monthlyGrossRevenue.toLocaleString()} $ / mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Solde Quotidien Moyen (ADB) :</span>
                  <span className="font-bold text-white">{result.metrics.avgDailyBalance.toLocaleString()} $</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compteur NSF (90 Jours) :</span>
                  <span className={`font-bold ${result.metrics.nsfCount90Days > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {result.metrics.nsfCount90Days} Frais NSF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stacking MCA Détecté :</span>
                  <span className="font-bold text-white">
                    {result.metrics.existingMcaDetected.length > 0 
                      ? `${result.metrics.existingMcaDetected.length} actif (${result.metrics.existingMcaDetected.map(m => m.lenderName).join(', ')})`
                      : '0 (Position 1 Pure)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Plan */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                ⚡ Plan d'Action & Closing Immédiat
              </h3>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 space-y-3">
                <p className="text-xs text-slate-300">
                  Dossier prêt pour soumission instantanée sur le portail Merchant Growth avec Direction to Pay 5%.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://merchantadvance.my.site.com/partners/s/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    Transmettre à Merchant Growth <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
