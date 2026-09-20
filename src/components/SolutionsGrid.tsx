"use client";

import React, { useState } from "react";
import { Zap, Truck, CreditCard, Receipt, Building2, CheckCircle2, ArrowRight, HardHat, Factory, Briefcase, ShoppingBag, Utensils, Stethoscope, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

interface SolutionsGridProps {
  onSelectSolution: (solution: string) => void;
  lang: "fr" | "en";
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({ onSelectSolution, lang }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterTabs = [
    { id: "all", labelFr: "Tous les Produits", labelEn: "All Products" },
    { id: "construction", labelFr: "🏗️ Construction & RBQ", labelEn: "🏗️ Construction" },
    { id: "transport", labelFr: "🚛 Transport & Logistique", labelEn: "🚛 Transport" },
    { id: "manufacturing", labelFr: "🏭 Manufacturier & Usines", labelEn: "🏭 Manufacturing" },
    { id: "services", labelFr: "💼 Services Pros & Tech", labelEn: "💼 Professional Services" },
  ];

  const solutions = [
    {
      id: "cash-flow",
      categories: ["all", "construction", "transport", "manufacturing", "services"],
      title: lang === "fr" ? "Avance de Trésorerie 24H (Cash Flow Facility)" : "24H Cash Flow Financing",
      badge: lang === "fr" ? "⚡ Le Plus Demandé" : "⚡ Most Popular",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      amount: "$15,000 - $500,000",
      speed: lang === "fr" ? "24 Heures" : "24 Hours",
      minTime: lang === "fr" ? "6 Mois d'activité" : "6 Months in Business",
      minRev: "$20,000 / mois",
      credit: "500+ Equifax (Souple)",
      icon: Zap,
      desc:
        lang === "fr"
          ? "Financement 100% non garanti basé sur vos dépôts bancaires mensuels réels. Déboursé en 24h pour stock, paie et exécution de contrats."
          : "100% unsecured working capital calculated on gross bank deposits. Funded within 24h for payroll, materials, and contract execution.",
      buyBoxCriteria: [
        { labelFr: "Revenu mensuel minimum :", valFr: "20,000 $ / mois" },
        { labelFr: "Tolérance NSF :", valFr: "Max 2 NSF sur 30 jours (0 NSF pour taux prime)" },
        { labelFr: "Multiplicateur de capacité :", valFr: "1.0x à 1.5x le revenu mensuel vérifié" },
        { labelFr: "Garantie exigée :", valFr: "Aucune hypothèque ni collatéral immobilier" },
      ]
    },
    {
      id: "equipment",
      categories: ["all", "construction", "transport", "manufacturing"],
      title: lang === "fr" ? "Financement & Lease-Back d'Équipement" : "Equipment & Machinery Lease-Back",
      badge: lang === "fr" ? "🚜 Machinerie & Camions" : "🚜 Machinery & Fleets",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      amount: "$25,000 - $1,000,000",
      speed: lang === "fr" ? "24 - 48 Heures" : "24 - 48 Hours",
      minTime: lang === "fr" ? "6 Mois" : "6 Months",
      minRev: "$20,000 / mois",
      credit: "550+ Equifax",
      icon: Truck,
      desc:
        lang === "fr"
          ? "Achat ou refinancement de camions lourds, remorques, pelles mécaniques, machinerie d'usinage et technologie industrielle."
          : "Purchase or lease-back heavy trucks, trailers, excavators, lifts, and CNC machinery with structured tax-deductible write-offs.",
      buyBoxCriteria: [
        { labelFr: "Types d'équipements :", valFr: "Pelles, camions classe 8, grues, machinerie CNC" },
        { labelFr: "Option Sale-Leaseback :", valFr: "Débloquez jusqu'à 80% de la valeur de votre actif actuel" },
        { labelFr: "Structure fiscale :", valFr: "Déductions d'amortissement accéléré admissibles" },
      ]
    },
    {
      id: "loc",
      categories: ["all", "services", "manufacturing"],
      title: lang === "fr" ? "Marge de Crédit Commerciale Tournante" : "Revolving Commercial Line of Credit",
      badge: lang === "fr" ? "🔄 Tirage à la Demande" : "🔄 Flexible Draw",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      amount: "$50,000 - $750,000",
      speed: lang === "fr" ? "48 Heures" : "48 Hours",
      minTime: lang === "fr" ? "12 Mois" : "1 Year",
      minRev: "$30,000 / mois",
      credit: "620+ Equifax",
      icon: CreditCard,
      desc:
        lang === "fr"
          ? "Retirez des fonds uniquement lorsque vous en avez besoin. Intérêts payés exclusivement sur le solde utilisé le mois en cours."
          : "Draw capital on demand like a corporate revolving facility. Only pay interest on the active balance utilized.",
      buyBoxCriteria: [
        { labelFr: "Mécanisme de tirage :", valFr: "Virement direct sous 2h sur simple demande" },
        { labelFr: "Intérêts calculés :", valFr: "Au prorata journalier sur les montants utilisés" },
        { labelFr: "Rechargement :", valFr: "Automatique à chaque remboursement de principal" },
      ]
    },
    {
      id: "factoring",
      categories: ["all", "construction", "transport", "services"],
      title: lang === "fr" ? "Affacturage & Rachat de Factures B2B" : "Accounts Receivable Factoring",
      badge: lang === "fr" ? "📑 Contrats & Factures 30-90j" : "📑 B2B Invoices 30-90d",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      amount: "$50,000 - $2,000,000",
      speed: lang === "fr" ? "24 Heures" : "24 Hours",
      minTime: lang === "fr" ? "3 Mois" : "3 Months",
      minRev: "$30,000 / mois",
      credit: "Tous scores acceptés",
      icon: Receipt,
      desc:
        lang === "fr"
          ? "Débloquez immédiatement 85% à 90% de la valeur de vos factures émises sans attendre les délais de paiement clients de 60 à 90 jours."
          : "Unlock 85% to 90% cash against outstanding B2B invoices immediately without waiting 60–90 days for corporate clients to settle.",
      buyBoxCriteria: [
        { labelFr: "Base d'approbation :", valFr: "Solvabilité de vos clients payeurs (Gouvernement, PME, Mines)" },
        { labelFr: "Avance immédiate :", valFr: "85% à 90% viré le jour même de l'émission" },
        { labelFr: "Solde résiduel :", valFr: "Versé dès encaissement de la facture finale" },
      ]
    },
  ];

  const filteredSolutions = solutions.filter((s) => s.categories.includes(activeTab));

  return (
    <section id="solutions" className="py-24 bg-slate-950/90 relative border-t border-slate-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === "fr" ? "Gamme Complète de Capital Commercial" : "Full Institutional Suite"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {lang === "fr" ? "Chaque profil d'entreprise a son produit sur-mesure" : "A Dedicated Product for Every Business Profile"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {lang === "fr"
              ? "Nous structurons votre dossier et négocions auprès des desks de souscription partenaires pour sécuriser le coût du capital le plus bas."
              : "We package and underwrite your deal directly with institutional lenders for maximal approval rates and lowest factor fees."}
          </p>
        </div>

        {/* Industry Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
            >
              {lang === "fr" ? tab.labelFr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSolutions.map((s) => {
            const Icon = s.icon;
            const isExpanded = expandedId === s.id;
            return (
              <div
                key={s.id}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-emerald-500/40 transition-all glow-emerald flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${s.badgeColor}`}>
                          {s.badge}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg sm:text-xl font-black text-white tracking-tight block">
                        {s.amount}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">{s.speed}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {s.desc}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">{lang === "fr" ? "Ancienneté" : "Min. Time"}</span>
                      <span className="text-slate-200 font-bold">{s.minTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">{lang === "fr" ? "Revenu Min." : "Min. Revenue"}</span>
                      <span className="text-slate-200 font-bold">{s.minRev}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">{lang === "fr" ? "Score Crédit" : "Credit Score"}</span>
                      <span className="text-emerald-400 font-bold">{s.credit}</span>
                    </div>
                  </div>

                  {/* Expandable Buy-Box Drawer */}
                  {isExpanded && (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 mb-6 space-y-2 text-xs animate-fadeIn">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                        {lang === "fr" ? "⚡ Critères de Souscription Directe :" : "⚡ Direct Underwriting Criteria:"}
                      </span>
                      {s.buyBoxCriteria.map((crit, idx) => (
                        <div key={idx} className="flex justify-between border-b border-slate-800/80 pb-1.5 last:border-0 last:pb-0 text-[11px]">
                          <span className="text-slate-400 font-medium">{crit.labelFr}</span>
                          <span className="text-white font-bold text-right ml-2">{crit.valFr}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="text-xs font-bold text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? (lang === "fr" ? "Masquer critères" : "Hide criteria") : (lang === "fr" ? "Critères de souscription" : "View criteria")}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectSolution(s.title)}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>{lang === "fr" ? "Sélectionner" : "Select"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
