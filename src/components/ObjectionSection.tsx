"use client";

import React, { useState } from "react";
import { Check, X, ShieldCheck, Zap, AlertTriangle, ArrowRight, DollarSign, Clock, TrendingDown } from "lucide-react";

interface ObjectionSectionProps {
  onApplyClick: () => void;
  lang: "fr" | "en";
}

export const ObjectionSection: React.FC<ObjectionSectionProps> = ({ onApplyClick, lang }) => {
  const [contractValue, setContractValue] = useState<number>(150000);
  const [grossMargin, setGrossMargin] = useState<number>(30); // 30% margin

  const lostProfit = Math.round(contractValue * (grossMargin / 100));
  const estimatedBridgeCost = Math.round(contractValue * 0.35 * 0.18); // ~18% factor on working capital needed
  const netGainWithApex = Math.round(lostProfit - estimatedBridgeCost);

  const comparisonRows = [
    {
      feature: lang === "fr" ? "Délai de Décision & Déboursement" : "Decision & Wire Speed",
      banks: lang === "fr" ? "4 à 8 Semaines d'attente bureaucratique" : "4 to 8 Weeks of bureaucratic stall",
      apex: lang === "fr" ? "Sous 2H • Déboursement garanti en 24H" : "Under 2H • 24H Guaranteed Wire",
    },
    {
      feature: lang === "fr" ? "Documents & États Financiers Exigés" : "Required Documentation",
      banks: lang === "fr" ? "3 ans d'états financiers audités, bilans, T2s" : "3 years audited balance sheets & T2s",
      apex: lang === "fr" ? "3 à 6 mois de relevés bancaires (Plaid / PDF)" : "3-6 Months bank flow (via Plaid / PDF)",
    },
    {
      feature: lang === "fr" ? "Collatéral & Garantie Personnelle" : "Collateral & Asset Liens",
      banks: lang === "fr" ? "Hypothèque sur résidence ou actifs personnels" : "Personal home mortgage or equipment liens",
      apex: lang === "fr" ? "100% Non garanti (Basé sur le cash flow)" : "100% Unsecured (Cash flow underwritten)",
    },
    {
      feature: lang === "fr" ? "Tolérance Score de Crédit" : "Credit Score Flexibility",
      banks: lang === "fr" ? "Rejet automatique si score < 680" : "Auto-rejected if credit score < 680",
      apex: lang === "fr" ? "500+ accepté (Axé sur vos ventes réelles)" : "500+ accepted (Focus on gross deposits)",
    },
    {
      feature: lang === "fr" ? "Retards de Taxes (ARC / Revenu Québec)" : "CRA / Revenu Québec Tax Arrears",
      banks: lang === "fr" ? "Refus catégorique et blocage immédiat" : "Immediate decline / frozen files",
      apex: lang === "fr" ? "Régularisation et consolidation admissibles" : "Tax debt consolidation & bridge permitted",
    },
    {
      feature: lang === "fr" ? "Frais d'Étude de Dossier" : "Upfront Application Fees",
      banks: lang === "fr" ? "500$ à 1,500$ non remboursables d'avance" : "$500 to $1,500 non-refundable retainer",
      apex: lang === "fr" ? "0$ d'avance (Honoraires 7% au succès)" : "$0 Upfront (7.0% Performance at closing)",
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lang === "fr" ? "La Réalité Économique du Marché" : "Commercial Reality Check"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {lang === "fr" ? "L'argent le plus cher est celui que la banque vous refuse." : "The Most Expensive Capital is the Loan Banks Refuse."}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Un taux théorique de 6% qui prend 2 mois pour être rejeté vous coûte des dizaines de milliers de dollars en contrats manqués et chantiers bloqués."
              : "A 6% bank interest rate on paper that takes 8 weeks to get declined costs you six figures in lost inventory profits and delayed contracts."}
          </p>
        </div>

        {/* High-Impact Comparison HUD */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 glow-emerald overflow-x-auto shadow-2xl mb-16">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-bold text-slate-400">{lang === "fr" ? "Critères Stratégiques" : "Financing Criteria"}</th>
                <th className="py-4 px-4 font-bold text-rose-400 bg-rose-950/20 rounded-tl-2xl">{lang === "fr" ? "Banques Traditionnelles (RBC / TD / BDC)" : "Traditional Big-5 Banks"}</th>
                <th className="py-4 px-4 font-black text-emerald-400 bg-emerald-950/40 rounded-tr-2xl border-l border-emerald-500/30">{lang === "fr" ? "⚡ Apex Capital Direct Desk" : "⚡ Apex Capital Desk"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-200">{row.feature}</td>
                  <td className="py-4 px-4 text-slate-400 bg-rose-950/10">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{row.banks}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-white bg-emerald-950/30 border-l border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                      <span className="text-emerald-300">{row.apex}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost of Opportunity Loss Simulator Widget */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                <TrendingDown className="w-4 h-4" />
                <span>{lang === "fr" ? "Calculateur de Coût d'Opportunité Manquée" : "Lost Opportunity Cost Calculator"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {lang === "fr" ? "Combien vous coûte un retard de 6 semaines ?" : "What is a 6-Week Bank Delay Costing You?"}
              </h3>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Gain Net avec Avance Apex" : "Net Profit with Apex Bridge"}</span>
              <span className="text-3xl font-black text-emerald-400">+${netGainWithApex.toLocaleString()} CAD</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                  {lang === "fr" ? "Valeur du contrat ou projet bloqué :" : "Contract or Project Value:"}
                </label>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xl font-black text-white">${contractValue.toLocaleString()} CAD</span>
                  <input
                    type="range"
                    min="30000"
                    max="500000"
                    step="10000"
                    value={contractValue}
                    onChange={(e) => setContractValue(Number(e.target.value))}
                    className="w-40 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                  {lang === "fr" ? "Marge bénéficiaire nette estimée :" : "Estimated Profit Margin:"}
                </label>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xl font-black text-emerald-400">{grossMargin}%</span>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="5"
                    value={grossMargin}
                    onChange={(e) => setGrossMargin(Number(e.target.value))}
                    className="w-40 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{lang === "fr" ? "Profit Brut du Projet :" : "Gross Contract Profit:"}</span>
                <span className="font-bold text-white">${lostProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{lang === "fr" ? "Coût de l'avance 24H :" : "Estimated Bridge Cost:"}</span>
                <span className="font-bold text-rose-400">-${estimatedBridgeCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-300 font-bold">{lang === "fr" ? "Profit Sauvegardé dans votre poche :" : "Net Profit Saved in Your Account:"}</span>
                <span className="font-black text-emerald-400 text-sm">${netGainWithApex.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center sm:text-right">
            <button
              onClick={onApplyClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === "fr" ? "Sécuriser mon déboursement en 24H" : "Secure 24H Facility"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
