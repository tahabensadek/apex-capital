"use client";

import React from "react";
import { ShieldCheck, Zap, TrendingUp, CheckCircle2, Lock, ArrowUpRight, Sparkles, Building2 } from "lucide-react";
import { LoanCalculator } from "./LoanCalculator";

interface HeroProps {
  onApplyClick: () => void;
  onApplyWithAmount: (amt: number) => void;
  lang: "fr" | "en";
}

export const Hero: React.FC<HeroProps> = ({ onApplyClick, onApplyWithAmount, lang }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Proof */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Live Desk Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-black shadow-lg shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-white font-bold">{lang === "fr" ? "Desk Direct Actif :" : "Direct Desk Online :"}</span>
              <span className="text-emerald-300 uppercase tracking-wider">{lang === "fr" ? "Décaissements 24H Ouverts" : "24H Wires Active"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              {lang === "fr" ? (
                <>
                  N'attendez pas la banque. Débloquez <span className="gradient-text-emerald">$15k à $500k</span> en 24H.
                </>
              ) : (
                <>
                  Don't wait on banks. Unlock <span className="gradient-text-emerald">$15k to $500k</span> in 24 Hours.
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {lang === "fr"
                ? "Nous guidons les entrepreneurs canadiens vers les solutions de capital commercial basées sur leurs flux de trésorerie réels. Aucun collatéral immobilier, approbation sous 2 heures."
                : "We connect Canadian business owners with direct commercial capital facilities based on real bank cash flow. 100% unsecured, formal terms in under 2 hours."}
            </p>

            {/* Bullet Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "Dépôts bancaires >20k$/mois" : "Gross Bank Deposits >$20k/mo"}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "6+ Mois d'activité commerciale" : "6+ Months in Business"}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "Déboursement direct sous 24H" : "Direct Wire in 24 Hours"}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "0$ de frais d'avance (Succès 7%)" : "$0 Upfront Fees (7% Success)"}</span>
              </div>
            </div>

            {/* Trust Stats Counter Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800/80 text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">$640M+</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === "fr" ? "Réseau de Prêteurs" : "Lender Network"}
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800/80 text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block tracking-tight">&lt; 24H</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === "fr" ? "Délai Déboursement" : "Average Wire Time"}
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800/80 text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">96.8%</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === "fr" ? "Taux d'Approbation" : "Funded Success"}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Capital Calculator */}
          <div className="lg:col-span-6">
            <LoanCalculator onApplyWithAmount={onApplyWithAmount} lang={lang} />
          </div>

        </div>
      </div>
    </section>
  );
};
