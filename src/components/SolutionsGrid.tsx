"use client";

import React from "react";
import { Zap, Truck, CreditCard, Receipt, Building2, CheckCircle2, ArrowRight } from "lucide-react";

interface SolutionsGridProps {
  onSelectSolution: (solution: string) => void;
  lang: "fr" | "en";
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({ onSelectSolution, lang }) => {
  const solutions = [
    {
      id: "cash-flow",
      title: lang === "fr" ? "Avance de Trésorerie 24H (MCA)" : "24H Cash Flow Financing",
      badge: lang === "fr" ? "Le Plus Populaire" : "Most Popular",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      amount: "$10,000 - $500,000",
      speed: lang === "fr" ? "24 Heures" : "24 Hours",
      minTime: lang === "fr" ? "6 Mois d'activité" : "6 Months in Business",
      minRev: "$10,000 / mo",
      credit: "500+ Equifax",
      icon: Zap,
      desc:
        lang === "fr"
          ? "Financement 100% non garanti basé sur vos dépôts bancaires mensuels. Déboursé en 24h pour stock, paie et urgences."
          : "100% unsecured working capital calculated on gross bank deposits. Funded within 24h for payroll, inventory, and growth.",
    },
    {
      id: "equipment",
      title: lang === "fr" ? "Financement d'Équipement & Machinerie" : "Equipment & Machinery Lease",
      badge: lang === "fr" ? "Métiers & Transport" : "Trades & Trucking",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      amount: "$25,000 - $1,000,000",
      speed: lang === "fr" ? "48 Heures" : "48 Hours",
      minTime: lang === "fr" ? "6 Mois" : "6 Months",
      minRev: "$15,000 / mo",
      credit: "550+ Equifax",
      icon: Truck,
      desc:
        lang === "fr"
          ? "Achat ou refinancement de camions, remorques, pelles mécaniques, ponts élévateurs et machinerie industrielle."
          : "Purchase or lease-back trucks, trailers, excavators, lifts, and heavy industrial machinery with structured tax deductions.",
    },
    {
      id: "loc",
      title: lang === "fr" ? "Marge de Crédit Commerciale" : "Revolving Line of Credit",
      badge: lang === "fr" ? "Flexible" : "Flexible Draw",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      amount: "$50,000 - $750,000",
      speed: lang === "fr" ? "48 - 72 Heures" : "48 - 72 Hours",
      minTime: lang === "fr" ? "12 Mois" : "1 Year",
      minRev: "$25,000 / mo",
      credit: "620+ Equifax",
      icon: CreditCard,
      desc:
        lang === "fr"
          ? "Retirez des fonds uniquement lorsque vous en avez besoin. Intérêts payés seulement sur le solde utilisé."
          : "Draw capital on demand like a corporate credit card. Only pay interest on what you use, when you use it.",
    },
    {
      id: "factoring",
      title: lang === "fr" ? "Affacturage / Rachat de Factures (B2B)" : "Accounts Receivable Factoring",
      badge: lang === "fr" ? "Contrats & Factures 30-90j" : "B2B Invoices 30-90d",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      amount: "$50,000 - $2,000,000",
      speed: lang === "fr" ? "24 - 48 Heures" : "24 - 48 Hours",
      minTime: lang === "fr" ? "3 Mois" : "3 Months",
      minRev: "$30,000 / mo",
      credit: "Tous scores acceptés",
      icon: Receipt,
      desc:
        lang === "fr"
          ? "Débloquez immédiatement 85% à 90% de la valeur de vos comptes clients sans attendre les délais de paiement de 60 jours."
          : "Unlock 85% to 90% cash against outstanding B2B invoices immediately without waiting 60–90 days for clients to pay.",
    },
  ];

  return (
    <section className="py-20 bg-slate-950/80 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase block mb-2">
            {lang === "fr" ? "Solutions de Financement Dédiées" : "Tailored Capital Products"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === "fr" ? "Chaque profil d'entreprise a son produit sur-mesure" : "A Solution for Every Canadian Business Profile"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Nous analysons votre situation financière et dirigeons votre dossier vers l'institution qui vous offre le coût de capital le plus bas."
              : "We package and match your file with institutional lenders offering the highest approvals and fastest funding speeds."}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">{s.desc}</p>

                  {/* Specs Matrix */}
                  <div className="grid grid-cols-2 gap-2.5 py-4 border-y border-slate-800/80 mb-6 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {lang === "fr" ? "Montant Finançable" : "Funding Range"}
                      </span>
                      <span className="font-extrabold text-emerald-400 text-sm">{s.amount}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {lang === "fr" ? "Délai Déboursement" : "Disbursement Speed"}
                      </span>
                      <span className="font-bold text-slate-200">{s.speed}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {lang === "fr" ? "Revenu Minimum" : "Min. Revenue"}
                      </span>
                      <span className="font-bold text-slate-200">{s.minRev}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {lang === "fr" ? "Ancienneté" : "Time in Business"}
                      </span>
                      <span className="font-bold text-slate-200">{s.minTime}</span>
                    </div>
                  </div>
                </div>

                {/* Apply for this specific product */}
                <button
                  onClick={() => onSelectSolution(s.title)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-800 hover:border-emerald-400 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <span>{lang === "fr" ? "Demander ce financement" : "Apply For This Facility"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
