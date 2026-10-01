"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Info } from "lucide-react";
import { HAS_CLIENT_FEE, TYPICAL_PROFILE, feeLabel, feeOn, money, netAfterFee } from "@/lib/brand";

interface FundingCalculatorProps {
  onApplyWithAmount: (amount: number) => void;
  lang: "fr" | "en";
}

const PRESETS = [25000, 50000, 100000, 250000];

/**
 * Shows the prospect exactly what our fee costs them before they apply.
 * Deliberately does not estimate payments or factor rates: the funder sets those,
 * and quoting numbers we don't control would misdescribe the program.
 */
export const FundingCalculator: React.FC<FundingCalculatorProps> = ({ onApplyWithAmount, lang }) => {
  const [amount, setAmount] = useState<number>(65000);
  const fee = feeOn(amount);
  const net = netAfterFee(amount);

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 glow-emerald relative overflow-hidden backdrop-blur-2xl shadow-2xl">
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "fr" ? "Calculateur transparent" : "Transparent Calculator"}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {lang === "fr" ? "De combien avez-vous besoin ?" : "How much do you need?"}
          </h3>
        </div>
        <div className="text-left sm:text-right bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            {lang === "fr" ? "Montant demandé" : "Amount Requested"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {money(amount, lang)}
          </span>
        </div>
      </div>

      <div className="space-y-5 mb-8">
        <input
          type="range"
          min={TYPICAL_PROFILE.minAmount}
          max={TYPICAL_PROFILE.maxAmount}
          step={5000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          aria-label={lang === "fr" ? "Montant demandé" : "Amount requested"}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
          <span>{money(TYPICAL_PROFILE.minAmount, lang)}</span>
          <span>{money(TYPICAL_PROFILE.maxAmount, lang)}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
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
              {preset / 1000}k
            </button>
          ))}
        </div>
      </div>

      {HAS_CLIENT_FEE ? (
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex justify-between bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
            <span className="text-slate-400">{lang === "fr" ? "Si vous êtes financé :" : "If you get funded:"}</span>
            <span className="font-black text-white">{money(amount, lang)}</span>
          </div>
          <div className="flex justify-between bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
            <span className="text-slate-400">
              {lang === "fr" ? `Nos honoraires (${feeLabel("fr")}, au succès seulement) :` : `Our fee (${feeLabel("en")}, only on success):`}
            </span>
            <span className="font-black text-rose-300">− {money(fee, lang)}</span>
          </div>
          <div className="flex justify-between bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30">
            <span className="text-emerald-200 font-bold">{lang === "fr" ? "Reste pour votre entreprise :" : "Left for your business:"}</span>
            <span className="font-black text-emerald-400">{money(net, lang)}</span>
          </div>
          <div className="flex justify-between bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80">
            <span className="text-slate-400">{lang === "fr" ? "Si vous n'êtes pas financé :" : "If you don't get funded:"}</span>
            <span className="font-black text-white">0 $</span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30 mb-6 text-sm text-emerald-200 font-bold">
          {lang === "fr" ? "Aucuns frais de courtage pour vous." : "No brokerage fee for you."}
        </div>
      )}

      <p className="flex gap-2 text-[11px] text-slate-400 leading-relaxed mb-6">
        <Info className="w-4 h-4 shrink-0 text-slate-500" />
        <span>
          {lang === "fr"
            ? "Le montant approuvé, le coût du financement et le calendrier de remboursement sont fixés par le bailleur de fonds et vous sont présentés par écrit avant toute signature. Le montant offert peut différer du montant demandé."
            : "The approved amount, cost of funding and repayment schedule are set by the funder and shown to you in writing before you sign anything. The amount offered may differ from the amount requested."}
        </span>
      </p>

      <button
        type="button"
        onClick={() => onApplyWithAmount(amount)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
      >
        <span>{lang === "fr" ? `Demander ${money(amount, "fr")}` : `Request ${money(amount, "en")}`}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
