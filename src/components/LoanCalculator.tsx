"use client";

import React, { useState } from "react";
import { CheckCircle2, DollarSign, Clock, Shield, Sparkles, ArrowRight } from "lucide-react";

interface LoanCalculatorProps {
  onApplyWithAmount: (amount: number) => void;
  lang: "fr" | "en";
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onApplyWithAmount, lang }) => {
  const [amount, setAmount] = useState<number>(65000);
  const [termMonths, setTermMonths] = useState<number>(12);

  // Approximate metrics based on standard alternative B2B factor (1.18 - 1.22)
  const factorRate = 1.19;
  const totalRepayment = amount * factorRate;
  const weeklyPayment = Math.round(totalRepayment / (termMonths * 4.33));
  const dailyPayment = Math.round(totalRepayment / (termMonths * 21.5));

  return (
    <div className="w-full glass-card rounded-2xl p-6 sm:p-8 border border-white/10 glow-emerald relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === "fr" ? "Simulateur de Trésorerie 24H" : "24H Capital Simulator"}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            {lang === "fr" ? "Combien votre entreprise a-t-elle besoin ?" : "How much capital do you need?"}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">{lang === "fr" ? "Montant Sélectionné" : "Selected Amount"}</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            ${amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-2">
            <span>$10,000</span>
            <span>$100,000</span>
            <span>$250,000</span>
            <span>$500,000+</span>
          </div>
        </div>

        {/* Term buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 font-medium">
            {lang === "fr" ? "Durée estimée :" : "Estimated Term:"}
          </span>
          <div className="flex gap-2">
            {[6, 12, 18, 24].map((m) => (
              <button
                key={m}
                onClick={() => setTermMonths(m)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  termMonths === m
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {m} {lang === "fr" ? "Mois" : "Mos"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Output Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block font-medium">
            {lang === "fr" ? "Paiement Hebdomadaire" : "Weekly Payment"}
          </span>
          <span className="text-lg font-extrabold text-white mt-0.5 block">
            ~${weeklyPayment.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">{lang === "fr" ? "Débit direct PAD" : "Direct bank PAD"}</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block font-medium">
            {lang === "fr" ? "Délai de Déboursement" : "Funding Speed"}
          </span>
          <span className="text-lg font-extrabold text-emerald-300 mt-0.5 block">
            24 Heures
          </span>
          <span className="text-[10px] text-slate-500">{lang === "fr" ? "Virement direct" : "Direct wire"}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900/90 rounded-xl p-3.5 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block font-medium">
            {lang === "fr" ? "Garantie Personnelle" : "Collateral"}
          </span>
          <span className="text-lg font-extrabold text-white mt-0.5 block">
            {lang === "fr" ? "Aucune (100% Non Garanti)" : "None (100% Unsecured)"}
          </span>
          <span className="text-[10px] text-slate-500">{lang === "fr" ? "Basé sur vos dépôts" : "Cash flow backed"}</span>
        </div>
      </div>

      {/* Fast Action CTA */}
      <button
        onClick={() => onApplyWithAmount(amount)}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-98"
      >
        <span>
          {lang === "fr"
            ? `Vérifier mon admissibilité pour $${amount.toLocaleString()}`
            : `Lock in $${amount.toLocaleString()} Pre-Approval`}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {lang === "fr" ? "Sans impact sur la cote de crédit" : "No impact on credit score"}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          {lang === "fr" ? "Cryptage bancaire 256-bit" : "Bank-level 256-bit encryption"}
        </span>
      </div>
    </div>
  );
};
