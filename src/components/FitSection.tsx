"use client";

import React from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { TYPICAL_PROFILE, money } from "@/lib/brand";

interface FitSectionProps {
  onApplyClick: () => void;
  lang: "fr" | "en";
}

/**
 * Honest "is this for you" section. Revenue-based funding is expensive short-term
 * money; saying so up front filters out bad fits before they cost us a call, and
 * keeps the marketing an accurate description of the program.
 */
export const FitSection: React.FC<FitSectionProps> = ({ onApplyClick, lang }) => {
  const rev = money(TYPICAL_PROFILE.minMonthlyRevenue, lang);
  const months = TYPICAL_PROFILE.minMonthsInBusiness;

  const goodFit =
    lang === "fr"
      ? [
          `Revenus d'environ ${rev} / mois ou plus déposés dans un compte d'entreprise`,
          `En affaires depuis ${months} mois ou plus`,
          "Un projet qui rapporte : contrat à exécuter, inventaire, équipement, embauche",
          "Besoin d'agir vite, et la banque dit non ou prend trop de temps",
        ]
      : [
          `Around ${rev}/month or more deposited into a business account`,
          `In business for ${months} months or more`,
          "A project that pays back: a contract to deliver, inventory, equipment, hiring",
          "You need to move fast and the bank says no or is too slow",
        ];

  const notFit =
    lang === "fr"
      ? [
          "Couvrir des pertes récurrentes sans plan pour les renverser",
          "Une entreprise qui n'a pas encore de revenus",
          "Un besoin à long terme à faible coût (un prêt bancaire traditionnel sera moins cher, si vous y avez accès)",
        ]
      : [
          "Covering ongoing losses with no plan to turn them around",
          "A business with no revenue yet",
          "A long-term, low-cost need (a traditional bank loan will be cheaper if you can get one)",
        ];

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === "fr" ? "Est-ce que c'est pour vous?" : "Is this right for you?"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Le financement basé sur les revenus est rapide et accessible, mais il coûte plus cher qu'un prêt bancaire. On préfère vous le dire tout de suite."
              : "Revenue-based funding is fast and accessible, but it costs more than a bank loan. We'd rather tell you up front."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30">
            <h3 className="text-lg font-black text-emerald-400 mb-4">
              {lang === "fr" ? "Généralement un bon fit" : "Usually a good fit"}
            </h3>
            <ul className="space-y-3">
              {goodFit.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg font-black text-slate-300 mb-4">
              {lang === "fr" ? "Probablement pas la bonne solution" : "Probably not the right tool"}
            </h3>
            <ul className="space-y-3">
              {notFit.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-400">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mb-8">
          {lang === "fr"
            ? "Ces critères sont indicatifs. Le bailleur de fonds établit ses propres critères et prend seul la décision finale."
            : "These criteria are guidelines. The funder sets its own criteria and alone makes the final decision."}
        </p>

        <div className="text-center">
          <button
            onClick={onApplyClick}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
          >
            <span>{lang === "fr" ? "Vérifier mon admissibilité" : "Check My Eligibility"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
