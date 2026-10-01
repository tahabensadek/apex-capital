"use client";

import React from "react";
import { ClipboardList, PhoneCall, FileSearch, BadgeCheck } from "lucide-react";
import { HAS_CLIENT_FEE, feeLabel } from "@/lib/brand";

interface HowItWorksProps {
  lang: "fr" | "en";
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang }) => {
  const steps =
    lang === "fr"
      ? [
          {
            icon: ClipboardList,
            title: "1. Votre demande (2 minutes)",
            desc: "Quelques questions sur votre entreprise et vos revenus. Aucun impact sur votre crédit.",
          },
          {
            icon: PhoneCall,
            title: "2. On vous appelle",
            desc: "En moins de 5 minutes pendant nos heures d'ouverture. On comprend votre projet et on vous dit franchement si votre profil est un bon fit.",
          },
          {
            icon: FileSearch,
            title: "3. On monte et présente votre dossier",
            desc: "Relevés bancaires des 3 à 6 derniers mois, pièce d'identité, chèque annulé. On présente votre dossier au bailleur de fonds, qui fait l'analyse.",
          },
          {
            icon: BadgeCheck,
            title: "4. Vous décidez",
            desc: HAS_CLIENT_FEE
              ? `Si une offre est approuvée, vous recevez les conditions par écrit. Vous acceptez ou non. Nos honoraires de ${feeLabel("fr")} ne sont dus que si les fonds sont déboursés.`
              : "Si une offre est approuvée, vous recevez les conditions par écrit. Vous acceptez ou non, sans frais.",
          },
        ]
      : [
          {
            icon: ClipboardList,
            title: "1. Your request (2 minutes)",
            desc: "A few questions about your business and revenue. No impact on your credit.",
          },
          {
            icon: PhoneCall,
            title: "2. We call you",
            desc: "Within 5 minutes during business hours. We learn about your project and tell you honestly whether your profile is a good fit.",
          },
          {
            icon: FileSearch,
            title: "3. We build and present your file",
            desc: "Last 3–6 months of bank statements, photo ID, a void cheque. We present your file to the funder, who does the underwriting.",
          },
          {
            icon: BadgeCheck,
            title: "4. You decide",
            desc: HAS_CLIENT_FEE
              ? `If an offer is approved, you get the terms in writing. You accept or walk away. Our ${feeLabel("en")} fee is only owed if funds are disbursed.`
              : "If an offer is approved, you get the terms in writing. You accept or walk away, at no cost.",
          },
        ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950/90 relative border-t border-slate-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {lang === "fr" ? "Comment ça marche" : "How It Works"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Simple, rapide, et vous savez exactement ce que ça coûte avant de signer quoi que ce soit."
              : "Simple, fast, and you know exactly what it costs before you sign anything."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="glass-card rounded-3xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
