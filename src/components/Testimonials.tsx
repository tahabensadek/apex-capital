"use client";

import React from "react";
import { Star, Building2, Quote, CheckCircle2, ShieldCheck, ArrowUpRight, Receipt, Zap } from "lucide-react";

interface TestimonialsProps {
  lang: "fr" | "en";
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const reviews = [
    {
      name: "Marc-André L.",
      company: "Toitures & Rénovation Pro Inc.",
      location: "Montréal, QC (NEQ: 1174XXXXXX)",
      amount: "$85,000 Déboursé",
      amountEn: "$85,000 Funded",
      speed: "24 Heures (11h00 AM)",
      speedEn: "24 Hours (11:00 AM)",
      wireId: "EFT-MTL-8841",
      bank: "RBC Banque Royale",
      netProfitGain: "+160,000 $ Profit Réalisé",
      quote:
        lang === "fr"
          ? "La banque nous demandait 3 ans d'états financiers pour un contrat de toiture commerciale urgent. Apex Capital a validé nos relevés Flinks et les 85,000$ étaient dans notre compte le lendemain à 11h. On a pu acheter nos bardeaux en gros et empocher 160k$ de profit net."
          : "Our bank stalled for 4 weeks asking for audited T2s. Apex Capital verified our bank flow and wired $85,000 the next morning. We bought bulk roofing materials and netted $160k on that contract.",
    },
    {
      name: "Dany B.",
      company: "Garage & Pneus Express Rive-Sud",
      location: "Brossard, QC (NEQ: 1169XXXXXX)",
      amount: "$45,000 Déboursé",
      amountEn: "$45,000 Funded",
      speed: "Même Jour (3h30)",
      speedEn: "Same Day (3.5 Hours)",
      wireId: "EFT-BSS-9102",
      bank: "Desjardins Entreprises",
      netProfitGain: "+78,000 $ Inventaire Sécurisé",
      quote:
        lang === "fr"
          ? "On avait besoin de 45,000$ pour commander notre inventaire de pneus d'hiver en pré-saison. Processus en 5 minutes sur le cellulaire, aucun casse-tête de paperasse et service ultra courtois de Taha."
          : "Needed $45,000 to lock in pre-season winter tire pallets. 5-minute phone review, zero paper headaches, and funds were wired same day.",
    },
    {
      name: "Sophie T.",
      company: "Studio 30 Médico-Esthétique Inc.",
      location: "Laval, QC (NEQ: 1182XXXXXX)",
      amount: "$35,000 Déboursé",
      amountEn: "$35,000 Funded",
      speed: "24 Heures",
      speedEn: "24 Hours",
      wireId: "EFT-LVL-4491",
      bank: "TD Canada Trust",
      netProfitGain: "+55,000 $ Laser Installé",
      quote:
        lang === "fr"
          ? "On fait 30,000$ de chiffre d'affaires mensuel mais avec des dépenses de rénovation, la banque bloquait. Apex a regardé nos flux de caisse réels et débloqué les fonds immédiatement."
          : "We do $30k/month in revenue but banks were difficult due to renovation expenses. Apex underwrote our real cash flow and approved us immediately.",
    },
  ];

  return (
    <section className="py-24 bg-slate-950/90 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            <Receipt className="w-3.5 h-3.5" />
            <span>{lang === "fr" ? "Décaissements Vérifiés & Récépissés" : "Verified Funding Slips"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {lang === "fr" ? "Des entrepreneurs québécois propulsés en 24H" : "Real Canadian Businesses Funded in 24 Hours"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Relevés de déboursement authentiques et retours sur investissement mesurés de nos clients financés."
              : "Authentic wire confirmations and verified business ROI outcomes across Quebec and Canada."}
          </p>
        </div>

        {/* Wire Receipts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative border border-white/10 hover:border-emerald-500/40 glow-emerald transition-all shadow-xl group"
            >
              <div>
                {/* Encrypted Wire Receipt Header */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Zap className="w-3 h-3" />
                      {r.wireId}
                    </span>
                    <span>{r.bank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{lang === "fr" ? r.amount : r.amountEn}</span>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {r.netProfitGain}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{r.quote}"
                </p>
              </div>

              {/* Author & Business Metadata */}
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-sm font-black text-white block">{r.name}</span>
                <span className="text-xs text-slate-300 font-bold block">{r.company}</span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{r.location}</span>
                
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
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
