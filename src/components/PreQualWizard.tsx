"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  Briefcase,
  TrendingUp,
  CreditCard,
  Check,
  BadgePercent,
  HardHat,
  Truck,
  Factory,
  Utensils,
  ShoppingBag,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface PreQualWizardProps {
  initialAmount?: number;
  initialProduct?: string;
  onComplete: (leadData: any) => void;
  onOpenMandate: (leadData: any) => void;
  lang: "fr" | "en";
}

const SECTORS = [
  {
    id: "construction",
    labelFr: "Construction & Rénovation (RBQ)",
    labelEn: "General Construction & Trade",
    icon: HardHat,
    tier: "Fast-Track 24H",
  },
  {
    id: "transport",
    labelFr: "Transport, Camionnage & Fret",
    labelEn: "Transport & Logistics",
    icon: Truck,
    tier: "Fast-Track 24H",
  },
  {
    id: "manufacturing",
    labelFr: "Manufacturier & Usinage",
    labelEn: "Manufacturing & Industrial",
    icon: Factory,
    tier: "High Capacity",
  },
  {
    id: "services",
    labelFr: "Services Professionnels & B2B",
    labelEn: "Professional & B2B Services",
    icon: Briefcase,
    tier: "Preferred Tier A",
  },
  {
    id: "retail",
    labelFr: "Commerce, Détail & E-Commerce",
    labelEn: "Retail & E-Commerce",
    icon: ShoppingBag,
    tier: "High Flow",
  },
  {
    id: "restaurant",
    labelFr: "Restauration, Bar & Hôtellerie",
    labelEn: "Restaurant & Hospitality",
    icon: Utensils,
    tier: "Standard Flow",
  },
  {
    id: "health",
    labelFr: "Santé, Médical & Cliniques",
    labelEn: "Healthcare & Clinics",
    icon: Stethoscope,
    tier: "Preferred Tier A",
  },
  {
    id: "other",
    labelFr: "Autre Secteur Commercial",
    labelEn: "Other Commercial Sector",
    icon: Sparkles,
    tier: "Standard",
  },
];

const FUND_PURPOSES = [
  {
    id: "working_capital",
    labelFr: "Fonds de Roulement & Trésorerie",
    labelEn: "Working Capital & Cash Flow",
    descFr: "Combler les délais de paiement clients (30-90 jours)",
    descEn: "Bridge 30-90 day client invoice delays",
  },
  {
    id: "equipment",
    labelFr: "Achat ou Réparation d'Équipement",
    labelEn: "Equipment Purchase or Repair",
    descFr: "Camion, machinerie, outillage, technologie",
    descEn: "Machinery, trucks, specialized tools",
  },
  {
    id: "payroll",
    labelFr: "Paie & Exécution de Contrats Majeurs",
    labelEn: "Payroll & Major Contract Delivery",
    descFr: "Engager du personnel ou sous-traitants d'urgence",
    descEn: "Mobilize crews & sub-contractors quickly",
  },
  {
    id: "inventory",
    labelFr: "Achat d'Inventaire & Matériaux en Gros",
    labelEn: "Bulk Materials & Inventory Buy",
    descFr: "Profiter d'escomptes de volume auprès des fournisseurs",
    descEn: "Take advantage of bulk supplier discounts",
  },
  {
    id: "taxes",
    labelFr: "Règlement Taxes Revenu Québec / ARC",
    labelEn: "Revenu Québec / CRA Tax Arrears",
    descFr: "Régulariser DAS, TPS/TVQ pour débloquer les banques",
    descEn: "Clear DAS/GST arrears to unlock banking",
  },
  {
    id: "refinance",
    labelFr: "Consolidation / Rachat de Financement Coûteux",
    labelEn: "MCA Refinance / Consolidation",
    descFr: "Remplacer des prélèvements quotidiens étouffants",
    descEn: "Consolidate aggressive daily MCA debits",
  },
];

const REVENUE_BRACKETS = [
  { id: "rev_15k", label: "< 20 000 $ / mois", val: 18000, tier: "Tier B" },
  { id: "rev_35k", label: "20 000 $ – 50 000 $ / mois", val: 35000, tier: "Tier A (BCC Standard)" },
  { id: "rev_75k", label: "50 000 $ – 100 000 $ / mois", val: 75000, tier: "Tier A (Priority Wire)" },
  { id: "rev_150k", label: "100 000 $ – 250 000 $ / mois", val: 150000, tier: "Executive Fast-Track" },
  { id: "rev_300k", label: "250 000 $ + / mois", val: 300000, tier: "Institutional Syndicate" },
];

export const PreQualWizard: React.FC<PreQualWizardProps> = ({
  initialAmount = 65000,
  initialProduct = "24H Cash Flow Financing",
  onComplete,
  onOpenMandate,
  lang,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedDealId, setGeneratedDealId] = useState<string>("");

  // Form State
  const [amount, setAmount] = useState<number>(initialAmount);
  const [purposeId, setPurposeId] = useState<string>("working_capital");
  const [selectedSector, setSelectedSector] = useState<string>("construction");
  const [businessName, setBusinessName] = useState<string>("");
  const [neq, setNeq] = useState<string>("");
  const [legalStructure, setLegalStructure] = useState<string>("inc");
  const [province, setProvince] = useState<string>("QC");
  const [timeInBusiness, setTimeInBusiness] = useState<string>("1-2 Years");
  
  // Step 3 Financials
  const [revenueBracket, setRevenueBracket] = useState<string>("rev_75k");
  const [avgBankBalance, setAvgBankBalance] = useState<string>("5k_15k");
  const [nsfCount, setNsfCount] = useState<string>("0");
  
  // Step 4 Identity & Verification
  const [ownerName, setOwnerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationMethod, setVerificationMethod] = useState<"plaid" | "pdf">("plaid");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Live Calculations for Real-Time Underwriting Engine Feedback
  const estimatedRevenueNum = useMemo(() => {
    const found = REVENUE_BRACKETS.find((r) => r.id === revenueBracket);
    return found ? found.val : 50000;
  }, [revenueBracket]);

  const maxAdvanceCapacity = useMemo(() => {
    // Standard Canadian Bridge Advance formula: ~100% to 150% of monthly verified revenue
    let multiplier = 1.15;
    if (nsfCount === "0") multiplier += 0.25;
    if (timeInBusiness === "2-5 Years" || timeInBusiness === "5+ Years") multiplier += 0.15;
    return Math.min(500000, Math.round(estimatedRevenueNum * multiplier));
  }, [estimatedRevenueNum, nsfCount, timeInBusiness]);

  const approvalScore = useMemo(() => {
    let score = 88;
    if (estimatedRevenueNum >= 50000) score += 6;
    if (nsfCount === "0") score += 4;
    if (timeInBusiness !== "Under 6 Months") score += 2;
    return Math.min(99, score);
  }, [estimatedRevenueNum, nsfCount, timeInBusiness]);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
    // Scroll smoothly to top of wizard container
    const el = document.getElementById("apply-wizard");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const selectedPurposeObj = FUND_PURPOSES.find((p) => p.id === purposeId);
    const selectedRevObj = REVENUE_BRACKETS.find((r) => r.id === revenueBracket);

    const leadPayload = {
      businessName: businessName || (lang === "fr" ? "Entreprise Commerciale" : "Commercial Partner"),
      neq: neq || "",
      ownerName: ownerName || (lang === "fr" ? "Directeur Commercial" : "Managing Director"),
      phone: phone || "+1 (514) 555-0199",
      email: email || "contact@entreprise.ca",
      province,
      legalStructure,
      amount,
      purpose: selectedPurposeObj ? (lang === "fr" ? selectedPurposeObj.labelFr : selectedPurposeObj.labelEn) : "Fonds de roulement",
      sector: selectedSector,
      timeInBusiness,
      monthlyRevenue: selectedRevObj?.label || "$50,000 / mois",
      avgBankBalance,
      nsfCount,
      hasFlinksConnected: verificationMethod === "plaid",
      uploadedFileName,
      lang,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
      const data = await res.json();
      const dealId = data?.leadId || data?.lead?.id || `APEX-${Date.now().toString(36).toUpperCase()}`;
      setGeneratedDealId(dealId);
      onComplete({ ...leadPayload, dealId });
    } catch (err) {
      console.error("Submission error:", err);
      const fallbackId = `APEX-${Date.now().toString(36).toUpperCase()}`;
      setGeneratedDealId(fallbackId);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#14b8a6", "#3b82f6", "#f59e0b"],
      });
    }
  };

  return (
    <div id="apply-wizard" className="py-20 scroll-mt-16 relative">
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "fr" ? "Souscription Directe • Sans Intermédiaire" : "Direct Origination • Zero Middlemen"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {lang === "fr" ? (
              <>Calculateur d'Admissibilité & <span className="gradient-text">Offre 24H</span></>
            ) : (
              <>Eligibility Calculator & <span className="gradient-text">24H Funding</span></>
            )}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            {lang === "fr"
              ? "Évaluez votre capacité d'avance en 60 secondes. Aucun impact sur votre bureau de crédit."
              : "Pre-screen your borrowing capacity in 60 seconds. Zero impact to your credit bureau score."}
          </p>
        </div>

        {/* Main Wizard Container */}
        <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          
          {/* Header Step Indicator & Live Capacity Pill */}
          {!isSubmitted && (
            <div className="mb-8 border-b border-slate-800/80 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                {/* Steps Breadcrumbs */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => s < step && setStep(s)}
                      disabled={s > step}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        step === s
                          ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                          : s < step
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-900/40"
                          : "bg-slate-900 text-slate-500 border border-slate-800"
                      }`}
                    >
                      <span>{s < step ? "✓" : `0${s}`}</span>
                      <span className="hidden md:inline">
                        {s === 1 && (lang === "fr" ? "Montant" : "Amount")}
                        {s === 2 && (lang === "fr" ? "Entreprise" : "Business")}
                        {s === 3 && (lang === "fr" ? "Revenus" : "Financials")}
                        {s === 4 && (lang === "fr" ? "Validation" : "Contact")}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Real-time Dynamic Underwriting Preview Badge */}
                <div className="flex items-center gap-3 bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2 self-start sm:self-auto">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {lang === "fr" ? "Capacité d'Avance Estimée" : "Estimated Max Advance"}
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      ${maxAdvanceCapacity.toLocaleString()} CAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/50"
                  style={{ width: `${step * 25}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: Montant Recherché & Objectif d'Utilisation des Fonds */}
          {/* ========================================================================= */}
          {!isSubmitted && step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  {lang === "fr" ? "Étape 01 • Montant & Objectif" : "Step 01 • Amount & Target"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {lang === "fr" ? "De combien de capital avez-vous besoin ?" : "How much capital are you looking to secure?"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === "fr"
                    ? "Nos bailleurs de fonds directs déboursent de 15 000 $ à 500 000 $ en 24H sans garantie immobilière."
                    : "Direct institutional lenders wire from $15,000 to $500,000 in 24H with zero real estate collateral required."}
                </p>
              </div>

              {/* Amount Display & Interactive Slider */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {lang === "fr" ? "Montant demandé :" : "Requested Amount:"}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-1">
                    <span className="text-emerald-400">$</span>
                    <span>{amount.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 font-bold tracking-normal">CAD</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="15000"
                  max="350000"
                  step="5000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />

                {/* Quick Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[25000, 50000, 100000, 250000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                        amount === amt
                          ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                          : "bg-slate-850 border border-slate-750 text-slate-300 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      ${amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Use of Funds Card Grid */}
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-3">
                  {lang === "fr" ? "Destination principale des fonds :" : "Primary Use of Capital:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUND_PURPOSES.map((purpose) => {
                    const isSelected = purposeId === purpose.id;
                    return (
                      <button
                        key={purpose.id}
                        type="button"
                        onClick={() => setPurposeId(purpose.id)}
                        className={`p-4 rounded-2xl text-left transition-all relative border flex flex-col justify-between ${
                          isSelected
                            ? "bg-emerald-950/40 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-black text-white">
                            {lang === "fr" ? purpose.labelFr : purpose.labelEn}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {lang === "fr" ? purpose.descFr : purpose.descEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Action */}
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-98 cursor-pointer"
              >
                <span>{lang === "fr" ? "Valider le Profil d'Entreprise" : "Continue to Business Profile"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Profil & Secteur d'Activité de l'Entreprise */}
          {/* ========================================================================= */}
          {!isSubmitted && step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {lang === "fr" ? "Étape 02 • Structure & Industrie" : "Step 02 • Structure & Industry"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {lang === "fr" ? "Quel est votre domaine d'activité ?" : "Select your commercial industry"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === "fr"
                    ? "Nos desks de souscription ont des buy-boxes spécialisées pour chaque secteur économique."
                    : "Our direct underwriting desks have dedicated buy-box criteria tailored to your specific trade."}
                </p>
              </div>

              {/* Sector Grid */}
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-3">
                  {lang === "fr" ? "Secteur d'activité :" : "Industry Sector:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SECTORS.map((sec) => {
                    const Icon = sec.icon;
                    const isSelected = selectedSector === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setSelectedSector(sec.id)}
                        className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? "bg-emerald-950/50 border-emerald-400 text-white shadow-md shadow-emerald-500/15 ring-1 ring-emerald-400/50"
                            : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl ${isSelected ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${isSelected ? "bg-emerald-500/20 text-emerald-300" : "text-slate-500"}`}>
                            {sec.tier}
                          </span>
                        </div>
                        <span className="text-xs font-bold leading-tight">
                          {lang === "fr" ? sec.labelFr : sec.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legal Structure & Time in Business & Province */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Structure Légale :" : "Legal Structure:"}
                  </label>
                  <select
                    value={legalStructure}
                    onChange={(e) => setLegalStructure(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="inc">{lang === "fr" ? "Société Incorporée (Inc. / Corp)" : "Incorporated (Inc. / Corp)"}</option>
                    <option value="sole_prop">{lang === "fr" ? "Entreprise Individuelle (Enr.)" : "Sole Proprietorship"}</option>
                    <option value="senc">{lang === "fr" ? "Société en Nom Collectif (SENC)" : "Partnership"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Ancienneté d'opérations :" : "Time in Business:"}
                  </label>
                  <select
                    value={timeInBusiness}
                    onChange={(e) => setTimeInBusiness(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Under 6 Months">{lang === "fr" ? "Moins de 6 mois" : "Under 6 Months"}</option>
                    <option value="6-12 Months">{lang === "fr" ? "6 à 12 mois (Admissible Tier A)" : "6 - 12 Months (Tier A)"}</option>
                    <option value="1-2 Years">{lang === "fr" ? "1 à 2 ans (Prime)" : "1 - 2 Years (Prime)"}</option>
                    <option value="2-5 Years">{lang === "fr" ? "2 à 5 ans (Prime)" : "2 - 5 Years (Prime)"}</option>
                    <option value="5+ Years">{lang === "fr" ? "5 ans et plus (Exécutif)" : "5+ Years (Executive)"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Province d'opération :" : "Province:"}
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="QC">Québec (QC)</option>
                    <option value="ON">Ontario (ON)</option>
                    <option value="BC">British Columbia (BC)</option>
                    <option value="AB">Alberta (AB)</option>
                    <option value="OTHER">Autre Province</option>
                  </select>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase hover:bg-slate-850 transition-all flex items-center justify-center cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-98 cursor-pointer"
                >
                  <span>{lang === "fr" ? "Étape Suivante : Santé Financière" : "Next: Financial Health"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: Santé Financière, Dépôts & Radar de Souscription */}
          {/* ========================================================================= */}
          {!isSubmitted && step === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {lang === "fr" ? "Étape 03 • Dépôts Bancaires & Cash Flow" : "Step 03 • Monthly Revenue & Banking"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {lang === "fr" ? "Quel est le volume de vos dépôts mensuels ?" : "What is your monthly gross bank deposit volume?"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === "fr"
                    ? "Nos offres sont basées sur votre cashflow réel d'entreprise, pas sur vos états financiers de fin d'année."
                    : "Underwriting is anchored on real monthly business bank deposits, not outdated tax returns."}
                </p>
              </div>

              {/* Monthly Revenue Chips */}
              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-3">
                  {lang === "fr" ? "Revenu brut mensuel moyen :" : "Average Monthly Bank Deposits:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REVENUE_BRACKETS.map((rb) => {
                    const isSelected = revenueBracket === rb.id;
                    return (
                      <button
                        key={rb.id}
                        type="button"
                        onClick={() => setRevenueBracket(rb.id)}
                        className={`p-4 rounded-2xl text-left transition-all border flex items-center justify-between ${
                          isSelected
                            ? "bg-emerald-950/50 border-emerald-400 text-white shadow-md shadow-emerald-500/15 ring-1 ring-emerald-400/50"
                            : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-black block text-white">{rb.label}</span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">{rb.tier}</span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NSF and Daily Balance Health */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Historique NSF (Frais sans provision) 30 jours :" : "30-Day NSF / Overdraft History:"}
                  </label>
                  <select
                    value={nsfCount}
                    onChange={(e) => setNsfCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="0">{lang === "fr" ? "0 NSF (Taux Préférentiel & Fast Track)" : "0 NSF (Prime Rate & Fast Track)"}</option>
                    <option value="1-2">{lang === "fr" ? "1 à 2 NSF (Admissible Standard)" : "1 to 2 NSF (Standard Approval)"}</option>
                    <option value="3+">{lang === "fr" ? "3+ NSF (Étude Manuelle Souscription)" : "3+ NSF (Manual Desk Review)"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Solde Quotidien Moyen Conservé :" : "Average Daily Ending Balance:"}
                  </label>
                  <select
                    value={avgBankBalance}
                    onChange={(e) => setAvgBankBalance(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="under_5k">&lt; 5 000 $ CAD</option>
                    <option value="5k_15k">5 000 $ – 15 000 $ CAD</option>
                    <option value="15k_50k">15 000 $ – 50 000 $ CAD</option>
                    <option value="50k_plus">50 000 $ + CAD</option>
                  </select>
                </div>
              </div>

              {/* Real-time Pre-Underwriting Matrix Box */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 glow-emerald space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === "fr" ? "Radar de Pré-Approbation Instantané" : "Live Pre-Approval Radar"}</span>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {approvalScore}% {lang === "fr" ? "Probabilité d'Admissibilité" : "Approval Probability"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-slate-800">
                  <div className="bg-slate-950/60 rounded-2xl p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Fourchette d'Offre" : "Estimated Facility"}</span>
                    <span className="text-sm sm:text-base font-black text-white">${Math.round(amount * 0.9).toLocaleString()} - ${Math.round(amount * 1.25).toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950/60 rounded-2xl p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Délai Déboursement" : "Wire Speed"}</span>
                    <span className="text-sm sm:text-base font-black text-emerald-400">4 à 24 Heures</span>
                  </div>
                  <div className="bg-slate-950/60 rounded-2xl p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Impact Crédit" : "Bureau Impact"}</span>
                    <span className="text-sm sm:text-base font-black text-emerald-400">0 Impact (Soft)</span>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase hover:bg-slate-850 transition-all flex items-center justify-center cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-98 cursor-pointer"
                >
                  <span>{lang === "fr" ? "Dernière Étape : Débloquer l'Offre" : "Final Step: Unlock Funding"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: Identification & Option de Vérification (Plaid vs PDF) */}
          {/* ========================================================================= */}
          {!isSubmitted && step === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  {lang === "fr" ? "Étape 04 • Coordonnées & Déblocage Officiel" : "Step 04 • Identification & Release"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {lang === "fr" ? "À qui transmettons-nous l'offre formelle ?" : "Where should we deliver your term sheet?"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === "fr"
                    ? "Remplissez vos coordonnées pour ouvrir votre Espace Client et recevoir votre proposition."
                    : "Provide your direct contact details to unlock your deal portal and terms sheet."}
                </p>
              </div>

              {/* Company & Officer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Nom Légal de l'Entreprise :" : "Legal Business Name:"}
                  </label>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-emerald-400">
                    <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-600"
                      placeholder="ex: Construction & Structure Apex Inc."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Numéro NEQ (Optionnel / REQ) :" : "NEQ / Business Number (Optional):"}
                  </label>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-emerald-400">
                    <Sparkles className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={neq}
                      onChange={(e) => setNeq(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-600"
                      placeholder="1178XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Nom & Prénom du Dirigeant / Signataire :" : "Full Name of Owner / Signing Officer:"}
                  </label>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-emerald-400">
                    <User className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-600"
                      placeholder="Jean-François Roy"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Numéro de Cellulaire Direct :" : "Direct Cell Phone:"}
                  </label>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-emerald-400">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-600"
                      placeholder="(514) 819-4921"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {lang === "fr" ? "Courriel Professionnel (Pour réception de l'offre) :" : "Official Business Email:"}
                  </label>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-emerald-400">
                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-600"
                      placeholder="jf.roy@apexstructure.ca"
                    />
                  </div>
                </div>
              </div>

              {/* Verification Method Toggle */}
              <div className="space-y-3 pt-2">
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                  {lang === "fr" ? "Méthode de validation bancaire préférée :" : "Preferred Verification Method:"}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option Plaid Fast-Track */}
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("plaid")}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 ${
                      verificationMethod === "plaid"
                        ? "bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400/50 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-white">
                          {lang === "fr" ? "Plaid / Flinks 256-Bit" : "Instant Plaid Connect"}
                        </span>
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {lang === "fr" ? "Déboursement 24H" : "24H Priority"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {lang === "fr" ? "Connexion directe en 60s. Aucune paperasse manuelle." : "Direct secure API sync. Zero manual paperwork."}
                    </span>
                  </button>

                  {/* Option Manual PDF Upload */}
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("pdf")}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 ${
                      verificationMethod === "pdf"
                        ? "bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400/50 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-black text-white">
                          {lang === "fr" ? "Dépôt Relevés PDF (3 mois)" : "Upload 3 Months PDF"}
                        </span>
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Standard 2-4H
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {lang === "fr" ? "Déposez vos relevés de compte entreprise au portail." : "Attach bank statement PDFs directly in your portal."}
                    </span>
                  </button>
                </div>

                {/* PDF File Upload Zone if PDF chosen */}
                {verificationMethod === "pdf" && (
                  <label className="border-2 border-dashed border-slate-700 hover:border-emerald-400 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/50 mt-3">
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-200">
                      {uploadedFileName || (lang === "fr" ? "Sélectionnez vos 3 derniers relevés bancaires (PDF)" : "Select 3 months PDF bank statements")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setUploadedFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Privacy and Trust Assurance Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === "fr" ? "Chiffrement bancaire SSL 256-Bit • Conforme Loi 25 Québec" : "256-Bit SSL Bank Encryption • Privacy Protected"}</span>
                </div>
                <span className="text-emerald-400 font-bold hidden sm:inline">
                  {lang === "fr" ? "Offre sous 2H" : "2H Decision"}
                </span>
              </div>

              {/* Final Submit Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase hover:bg-slate-850 transition-all flex items-center justify-center cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !businessName || !ownerName || !phone}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>{lang === "fr" ? "Génération du Dossier de Souscription..." : "Generating Underwriting Deal..."}</span>
                    </div>
                  ) : (
                    <>
                      <span>{lang === "fr" ? `Débloquer mon Financement de $${amount.toLocaleString()}` : `Lock in My $${amount.toLocaleString()} Advance`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUCCESS SCREEN: Pre-Qualification Certificate & Deal Portal Access */}
          {/* ========================================================================= */}
          {isSubmitted && (
            <div className="py-6 space-y-8 animate-fadeIn">
              {/* Success Badge */}
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto glow-emerald">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                  {lang === "fr" ? "Dossier Qualifié • Souscription Active" : "Deal Qualified • Active Underwriting"}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white">
                  {lang === "fr" ? `Pré-Approbation Confirmée pour ${businessName || "votre entreprise"}` : `Pre-Approval Locked for ${businessName || "Your Business"}`}
                </h3>
                <p className="text-slate-300 text-sm max-w-lg mx-auto">
                  {lang === "fr"
                    ? `Votre dossier pour un montant de $${amount.toLocaleString()} CAD a été créé et synchronisé avec notre desk direct BCC Fund.`
                    : `Your facility request for $${amount.toLocaleString()} CAD is recorded and assigned to our direct BCC Fund underwriting desk.`}
                </p>
              </div>

              {/* Official Digital Deal Certificate */}
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 glow-emerald relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      {lang === "fr" ? "Numéro de Dossier Unique" : "Unique Deal Identifier"}
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-400">
                      {generatedDealId || "APEX-8829"}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{lang === "fr" ? "Mandat 7.0% au Succès" : "7.0% Performance Fee"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Montant Qualifié" : "Qualified Advance"}</span>
                    <span className="text-base font-black text-white">${amount.toLocaleString()} CAD</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Délai Déboursement" : "Target Wire"}</span>
                    <span className="text-base font-black text-emerald-400">24 Heures</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Desk Assuré" : "Assigned Desk"}</span>
                    <span className="text-base font-black text-white">Amir (BCC Fund)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === "fr" ? "Statut" : "Status"}</span>
                    <span className="text-base font-black text-emerald-300">Prêt pour Déboursement</span>
                  </div>
                </div>

                {/* Primary Action: Open Secure Deal Portal */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/portal/${generatedDealId || "deal_8829"}`}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all text-center"
                  >
                    <span>{lang === "fr" ? "Accéder à mon Espace Client Sécurisé (/portal)" : "Open My Secure Deal Portal (/portal)"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenMandate({
                        businessName,
                        ownerName,
                        phone,
                        email,
                        amount,
                        dealId: generatedDealId || "deal_8829",
                      })
                    }
                    className="py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>{lang === "fr" ? "Signer le Mandat (1 Clic)" : "E-Sign Mandate (1-Click)"}</span>
                  </button>
                </div>
              </div>

              {/* Direct Phone Support */}
              <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <span>{lang === "fr" ? "Besoin d'un déboursement le jour même ?" : "Need same-day priority wiring?"}</span>
                <a href="tel:5145550199" className="text-emerald-400 font-bold hover:underline">
                  (514) 800-APEX
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
