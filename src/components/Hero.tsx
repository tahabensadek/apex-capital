"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { FundingCalculator } from "./FundingCalculator";
import { HAS_CLIENT_FEE, TYPICAL_PROFILE, feeLabel, money } from "@/lib/brand";

interface HeroProps {
  onApplyClick: () => void;
  onApplyWithAmount: (amt: number) => void;
  lang: "fr" | "en";
}

export const Hero: React.FC<HeroProps> = ({ onApplyWithAmount, lang }) => {
  const min = money(TYPICAL_PROFILE.minAmount, lang);
  const max = money(TYPICAL_PROFILE.maxAmount, lang);

  const bullets =
    lang === "fr"
      ? [
          "Aucuns frais d'avance",
          "On vous rappelle en moins de 5 minutes*",
          "Basé sur vos revenus, pas seulement votre crédit",
          HAS_CLIENT_FEE ? `${feeLabel("fr")} seulement si vous êtes financé` : "Aucuns frais de courtage",
        ]
      : [
          "No upfront fees",
          "We call you back in under 5 minutes*",
          "Based on your revenue, not just your credit",
          HAS_CLIENT_FEE ? `${feeLabel("en")} only if you get funded` : "No brokerage fee",
        ];

  const promises =
    lang === "fr"
      ? [
          { value: "< 5 min", label: "Délai de rappel visé*" },
          { value: "0 $", label: "Frais d'avance" },
          { value: HAS_CLIENT_FEE ? feeLabel("fr") : "0 %", label: "Seulement si financé" },
        ]
      : [
          { value: "< 5 min", label: "Target callback time*" },
          { value: "$0", label: "Upfront fees" },
          { value: HAS_CLIENT_FEE ? feeLabel("en") : "0%", label: "Only if funded" },
        ];

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{lang === "fr" ? "Pour les entreprises refusées par la banque" : "For businesses turned down by the bank"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              {lang === "fr" ? (
                <>
                  La banque a dit non? Trouvez de <span className="gradient-text-emerald">{min} à {max}</span> pour votre entreprise.
                </>
              ) : (
                <>
                  Bank said no? Find <span className="gradient-text-emerald">{min} to {max}</span> for your business.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {lang === "fr"
                ? "On regarde vos dépôts bancaires réels, pas seulement votre cote de crédit. Vous parlez à une vraie personne en quelques minutes, on monte votre dossier et on le présente à notre réseau de bailleurs de fonds pour que vous puissiez prendre de plus gros projets."
                : "We look at your real bank deposits, not just your credit score. You talk to a real person within minutes, we build your file and present it to our funding network so you can take on bigger projects."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-200">
              {bullets.map((b) => (
                <div key={b} className="flex items-center gap-2.5 justify-center lg:justify-start bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              {promises.map((p) => (
                <div key={p.label} className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800/80 text-center lg:text-left">
                  <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">{p.value}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{p.label}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500">
              {lang === "fr"
                ? "* Pendant nos heures d'ouverture. Toute demande est sujette à l'approbation du bailleur de fonds."
                : "* During business hours. Every application is subject to the funder's approval."}
            </p>
          </div>

          <div className="lg:col-span-6">
            <FundingCalculator onApplyWithAmount={onApplyWithAmount} lang={lang} />
          </div>

        </div>
      </div>
    </section>
  );
};
