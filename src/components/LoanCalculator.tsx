"use client";

import React, { useState } from "react";
import { CheckCircle2, DollarSign, Clock, Shield, Sparkles, ArrowRight, Zap, TrendingUp, Calendar, Building2 } from "lucide-react";

interface LoanCalculatorProps {
  onApplyWithAmount: (amount: number) => void;
  lang: "fr" | "en";
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onApplyWithAmount, lang }) => {
  const [amount, setAmount] = useState<number>(65000);
  const [termMonths, setTermMonths] = useState<number>(12);

  // Approximate metrics based on standard alternative B2B factor (1.18 - 1.22)
  const factorRate = termMonths <= 6 ? 1.16 : termMonths <= 12 ? 1.19 : 1.24;
  const totalRepayment = amount * factorRate;
  const weeklyPayment = Math.round(totalRepayment / (termMonths * 4.33));
  const dailyPayment = Math.round(totalRepayment / (termMonths * 21.5));
  const estimatedCost = Math.round(totalRepayment - amount);

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 glow-emerald relative overflow-hidden backdrop-blur-2xl shadow-2xl">
      {/* Background radial ambience */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header with Live Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "fr" ? "Simulateur de Trésorerie 24H" : "24H Capital Simulator"}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {lang === "fr" ? "Calculez votre Avance Immédiate" : "Calculate Your Direct Advance"}
          </h3>
        </div>
        <div className="text-left sm:text-right bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {lang === "fr" ? "Montant Sélectionné" : "Selected Facility"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            ${amount.toLocaleString()} <span className="text-xs text-slate-400 font-bold">CAD</span>
          </span>
        </div>
      </div>

      {/* Interactive Slider & Quick Preset Chips */}
      <div className="space-y-5 mb-8">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
            <span>{lang === "fr" ? "Ajustez le curseur :" : "Adjust Amount Slider:"}</span>
            <span className="text-emerald-400 font-extrabold">{lang === "fr" ? "Déboursement 24H" : "24H Wire Speed"}</span>
          </div>
          <input
            type="range"
            min={15000}
            max={350000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-2">
            <span>$15,000</span>
            <span>$100,000</span>
            <span>$200,000</span>
            <span>$350,000+</span>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="grid grid-cols-4 gap-2">
          {[25000, 50000, 100000, 250000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                amount === preset
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
            >
              ${preset / 1000}k
            </button>
          ))}
        </div>

        {/* Term Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            {lang === "fr" ? "Durée de remboursement cible :" : "Target Term:"}
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[6, 9, 12, 18].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTermMonths(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  termMonths === m
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {m} {lang === "fr" ? "Mois" : "Mos"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Output Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            {lang === "fr" ? "Paiement Hebdo Estimé" : "Est. Weekly Payment"}
          </span>
          <span className="text-lg sm:text-xl font-black text-white mt-1 block">
            ~${weeklyPayment.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">{lang === "fr" ? "Prélèvement PAD" : "Direct PAD"}</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            {lang === "fr" ? "Paiement Quotidien" : "Est. Daily Payment"}
          </span>
          <span className="text-lg sm:text-xl font-black text-white mt-1 block">
            ~${dailyPayment.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">{lang === "fr" ? "Jours ouvrables (Lun-Ven)" : "Business days only"}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">
            {lang === "fr" ? "Décaissement Net" : "Net Wire Target"}
          </span>
          <span className="text-lg sm:text-xl font-black text-emerald-400 mt-1 block">
            ${amount.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-300 font-medium">{lang === "fr" ? "100% Non garanti" : "100% Unsecured"}</span>
        </div>
      </div>

      {/* Trust Line */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/70 border border-slate-800/80 rounded-2xl px-4 py-2.5 mb-6">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === "fr" ? "0$ d'avance • Rémunération 100% au succès" : "$0 Upfront • 100% Performance Success"}</span>
        </div>
        <span className="text-emerald-400 font-black">24H Wire</span>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={() => onApplyWithAmount(amount)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all active:scale-98 cursor-pointer"
      >
        <span>{lang === "fr" ? `Sécuriser mon $${amount.toLocaleString()} en 24H` : `Fund My $${amount.toLocaleString()} in 24H`}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
