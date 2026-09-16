"use client";

import React from "react";
import { Check, X, ShieldCheck, Zap, AlertTriangle, ArrowRight } from "lucide-react";

interface ObjectionSectionProps {
  onApplyClick: () => void;
  lang: "fr" | "en";
}

export const ObjectionSection: React.FC<ObjectionSectionProps> = ({ onApplyClick, lang }) => {
  const comparisonRows = [
    {
      feature: lang === "fr" ? "Délai de Décision & Déboursement" : "Decision & Wire Speed",
      banks: lang === "fr" ? "4 à 8 Semaines d'attente" : "4 to 8 Weeks of bureaucratic delay",
      apex: lang === "fr" ? "24 à 48 Heures garanties" : "24 to 48 Hours direct wire",
    },
    {
      feature: lang === "fr" ? "Documents & État Financier Exigés" : "Required Documentation",
      banks: lang === "fr" ? "3 ans de bilans audités, T2, déclarations" : "3 years audited balance sheets & T2s",
      apex: lang === "fr" ? "3 derniers relevés bancaires (Flinks)" : "3 Months bank statements (via Flinks)",
    },
    {
      feature: lang === "fr" ? "Collatéral & Garantie Personnelle" : "Collateral / Asset Liens",
      banks: lang === "fr" ? "Hypothèque sur maison ou équipements" : "Personal property or home mortgage",
      apex: lang === "fr" ? "100% Non garanti (Basé sur les flux)" : "100% Unsecured (Cash-flow based)",
    },
    {
      feature: lang === "fr" ? "Cote de Crédit Personnelle" : "Credit Score Flexibility",
      banks: lang === "fr" ? "Rejet automatique sous 680" : "Auto-rejected if score under 680",
      apex: lang === "fr" ? "500+ accepté (Axé sur vos ventes)" : "500+ accepted (Focus on gross deposits)",
    },
    {
      feature: lang === "fr" ? "Frais d'Étude de Dossier" : "Upfront Application Fees",
      banks: lang === "fr" ? "500$ à 1,500$ non remboursables" : "$500 to $1,500 non-refundable",
      apex: lang === "fr" ? "0$ (Rémunération 100% au succès)" : "$0 (100% Success-only performance)",
    },
  ];

  return (
    <section className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase block mb-2">
            {lang === "fr" ? "La Réalité du Marché" : "Market Reality Check"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === "fr" ? "L'argent le plus cher est celui que la banque vous refuse." : "The Most Expensive Money is the Loan Banks Deny."}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Un taux de 5% sur papier qui prend 2 mois pour être rejeté coûte des centaines de milliers de dollars en opportunités perdues."
              : "A 5% bank rate on paper that takes 2 months to get rejected costs you six figures in lost contracts and stalled growth."}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 glow-emerald overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4 font-bold">{lang === "fr" ? "Critères de Financement" : "Financing Criteria"}</th>
                <th className="py-4 px-4 font-bold text-red-400/80">{lang === "fr" ? "Banques Traditionnelles (RBC/TD/BMO)" : "Traditional Big-5 Banks"}</th>
                <th className="py-4 px-4 font-extrabold text-emerald-400 bg-emerald-950/20 rounded-t-xl">{lang === "fr" ? "Apex Capital Commercial Desk" : "Apex Capital Desk"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-200">{row.feature}</td>
                  <td className="py-4 px-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{row.banks}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-white bg-emerald-950/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300">{row.apex}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={onApplyClick}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
          >
            <span>{lang === "fr" ? "Sécuriser mon déboursement en 24H" : "Secure Your 24H Funding Facility"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
