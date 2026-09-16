"use client";

import React from "react";
import { Star, Building2, Quote, CheckCircle2 } from "lucide-react";

interface TestimonialsProps {
  lang: "fr" | "en";
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const reviews = [
    {
      name: "Marc-André L.",
      company: "Toitures & Rénovation Pro (Montréal, QC)",
      amount: "$85,000 Déboursé",
      amountEn: "$85,000 Funded",
      speed: "24 Heures",
      speedEn: "24 Hours",
      quote:
        lang === "fr"
          ? "La banque nous demandait 3 ans d'états financiers pour un contrat de toiture commerciale urgent. Apex Capital a validé nos relevés Flinks et les 85,000$ étaient dans notre compte le lendemain à 11h. On a pu acheter nos bardeaux en gros et faire 160k$ de profit."
          : "Our bank stalled for 4 weeks asking for audited T2s. Apex Capital verified our bank flow and wired $85,000 the next morning. We bought bulk roofing materials and netted $160k on that contract.",
    },
    {
      name: "Dany B.",
      company: "Garage & Pneus Express Rive-Sud (Brossard, QC)",
      amount: "$45,000 Déboursé",
      amountEn: "$45,000 Funded",
      speed: "Même Jour",
      speedEn: "Same Day",
      quote:
        lang === "fr"
          ? "On avait besoin de 45,000$ pour commander notre inventaire de pneus d'hiver en pré-saison. Processus en 5 minutes sur le téléphone, aucun casse-tête de paperasse et service ultra courtois de Taha."
          : "Needed $45,000 to lock in pre-season winter tire pallets. 5-minute phone review, zero paper headaches, and funds were wired same day.",
    },
    {
      name: "Sophie T.",
      company: "Salon & Clinique Esthétique Studio 30 (Laval, QC)",
      amount: "$35,000 Déboursé",
      amountEn: "$35,000 Funded",
      speed: "24 Heures",
      speedEn: "24 Hours",
      quote:
        lang === "fr"
          ? "On fait 30,000$ de chiffre d'affaires mensuel mais avec des dépenses de rénovation, la banque bloquait. Apex a regardé nos flux de caisse réels et débloqué les fonds immédiatement."
          : "We do $30k/month in revenue but banks were difficult due to renovation expenses. Apex underwrote our real cash flow and approved us immediately.",
    },
  ];

  return (
    <section className="py-20 bg-slate-950/90 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase block mb-2">
            {lang === "fr" ? "Études de Cas & Résultats" : "Verified Client Outcomes"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === "fr" ? "Des entrepreneurs canadiens propulsés en 24H" : "Real Canadian Businesses Funded in 24 Hours"}
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative border border-white/10"
            >
              <div>
                {/* Top Stars & Funding Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {lang === "fr" ? r.amount : r.amountEn}
                  </span>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{r.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-sm font-bold text-white block">{r.name}</span>
                <span className="text-[11px] text-slate-400 block">{r.company}</span>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{lang === "fr" ? `Déboursé en ${r.speed}` : `Funded in ${r.speedEn}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
