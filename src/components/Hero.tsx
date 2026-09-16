"use client";

import React from "react";
import { ShieldCheck, Zap, TrendingUp, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Proof */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{lang === "fr" ? "Financement Commercial Canadien Rapide" : "Canadian Commercial Financing"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              {lang === "fr" ? (
                <>
                  N'attendez pas la banque. Obtenez <span className="gradient-text-emerald">$10k à $500k</span> en 24H.
                </>
              ) : (
                <>
                  Don't wait for banks. Get <span className="gradient-text-emerald">$10k to $500k</span> in 24 Hours.
                </>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {lang === "fr"
                ? "Nous guidons les entrepreneurs canadiens vers les solutions de capital adaptées à leurs flux de trésorerie réels. Aucun collatéral requis, approbation le jour même."
                : "We guide Canadian business owners to optimal working capital & equipment solutions based on real bank cash flow. 100% unsecured, same-day approval."}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "Dépôts bancaires >$10k/mois" : "Gross Bank Deposits >$10k/mo"}</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "6+ Mois d'activité commerciale" : "6+ Months in Business"}</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "Déboursement direct sous 24H" : "Direct Wire in 24 Hours"}</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === "fr" ? "0$ de frais d'ouverture de dossier" : "$0 Upfront Application Fees"}</span>
              </div>
            </div>

            {/* Trust Stats Counter Bar */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">$640M+</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === "fr" ? "Capital Déployé" : "Capital Originated"}
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block tracking-tight">24H</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === "fr" ? "Délai Moyen" : "Average Wire Time"}
                </span>
              </div>
              <div>
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
