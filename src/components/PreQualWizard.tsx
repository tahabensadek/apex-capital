"use client";

import React, { useState } from "react";
import {
  Building2,
  DollarSign,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Briefcase,
  TrendingUp,
  Check,
  HardHat,
  Truck,
  Factory,
  Utensils,
  ShoppingBag,
  Stethoscope,
  AlertCircle,
  Info,
  FileText,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BRAND, TYPICAL_PROFILE, money } from "@/lib/brand";
import { isWithinBusinessHours } from "@/lib/hours";
import { readAttribution, trackLeadConversion } from "@/lib/ads";

interface PreQualWizardProps {
  initialAmount?: number;
  onComplete: (leadData: Record<string, unknown>) => void;
  lang: "fr" | "en";
}

const SECTORS = [
  { id: "construction", labelFr: "Construction & rénovation", labelEn: "Construction & Trades", icon: HardHat },
  { id: "transport", labelFr: "Transport & logistique", labelEn: "Transport & Logistics", icon: Truck },
  { id: "manufacturing", labelFr: "Manufacturier", labelEn: "Manufacturing", icon: Factory },
  { id: "services", labelFr: "Services professionnels", labelEn: "Professional Services", icon: Briefcase },
  { id: "retail", labelFr: "Commerce de détail", labelEn: "Retail & E-Commerce", icon: ShoppingBag },
  { id: "restaurant", labelFr: "Restauration & hôtellerie", labelEn: "Restaurants & Hospitality", icon: Utensils },
  { id: "health", labelFr: "Santé & cliniques", labelEn: "Health & Clinics", icon: Stethoscope },
  { id: "other", labelFr: "Autre secteur", labelEn: "Other", icon: Sparkles },
];

const FUND_PURPOSES = [
  { id: "contract", labelFr: "Exécuter un contrat ou un gros projet", labelEn: "Deliver a contract or big project" },
  { id: "working_capital", labelFr: "Fonds de roulement", labelEn: "Working capital" },
  { id: "inventory", labelFr: "Inventaire & matériaux", labelEn: "Inventory & materials" },
  { id: "equipment", labelFr: "Équipement ou réparation", labelEn: "Equipment or repairs" },
  { id: "payroll", labelFr: "Embauche & paie", labelEn: "Hiring & payroll" },
  { id: "other", labelFr: "Autre", labelEn: "Other" },
];

const REVENUE_BRACKETS = [
  { id: "rev_lt20k", labelFr: "Moins de 20 000 $ / mois", labelEn: "Under $20,000 / month", val: 15000 },
  { id: "rev_20_50k", labelFr: "20 000 $ – 50 000 $ / mois", labelEn: "$20,000 – $50,000 / month", val: 35000 },
  { id: "rev_50_100k", labelFr: "50 000 $ – 100 000 $ / mois", labelEn: "$50,000 – $100,000 / month", val: 75000 },
  { id: "rev_100_250k", labelFr: "100 000 $ – 250 000 $ / mois", labelEn: "$100,000 – $250,000 / month", val: 175000 },
  { id: "rev_250k", labelFr: "250 000 $ + / mois", labelEn: "$250,000+ / month", val: 300000 },
];

const TIME_IN_BUSINESS = [
  { id: "lt6m", labelFr: "Moins de 6 mois", labelEn: "Under 6 months", months: 3 },
  { id: "6_12m", labelFr: "6 à 12 mois", labelEn: "6–12 months", months: 9 },
  { id: "1_2y", labelFr: "1 à 2 ans", labelEn: "1–2 years", months: 18 },
  { id: "2_5y", labelFr: "2 à 5 ans", labelEn: "2–5 years", months: 36 },
  { id: "5y", labelFr: "5 ans et plus", labelEn: "5+ years", months: 72 },
];

const PROVINCES = [
  { id: "QC", label: "Québec" },
  { id: "ON", label: "Ontario" },
  { id: "BC", label: "Colombie-Britannique / British Columbia" },
  { id: "AB", label: "Alberta" },
  { id: "MB", label: "Manitoba" },
  { id: "SK", label: "Saskatchewan" },
  { id: "NS", label: "Nouvelle-Écosse / Nova Scotia" },
  { id: "NB", label: "Nouveau-Brunswick / New Brunswick" },
  { id: "NL", label: "Terre-Neuve-et-Labrador / Newfoundland and Labrador" },
  { id: "PE", label: "Île-du-Prince-Édouard / Prince Edward Island" },
  { id: "YT", label: "Yukon" },
  { id: "NT", label: "Territoires du Nord-Ouest / Northwest Territories" },
  { id: "NU", label: "Nunavut" },
];

const digitsOnly = (s: string) => s.replace(/\D/g, "");
const isValidPhone = (s: string) => {
  const d = digitsOnly(s);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

const inputClass =
  "w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-600";
const fieldClass =
  "flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4 focus-within:border-emerald-400";
const selectClass =
  "w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none";
const primaryBtn =
  "w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const backBtn =
  "px-6 py-4 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer";
const choiceClass = (selected: boolean) =>
  `p-4 rounded-2xl text-left transition-all border cursor-pointer ${
    selected
      ? "bg-emerald-950/50 border-emerald-400 text-white ring-1 ring-emerald-400/50"
      : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
  }`;

export const PreQualWizard: React.FC<PreQualWizardProps> = ({ initialAmount = 65000, onComplete, lang }) => {
  const fr = lang === "fr";
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [leadId, setLeadId] = useState<string>("");
  const [submittedInHours, setSubmittedInHours] = useState<boolean>(true);

  const [amount, setAmount] = useState<number>(initialAmount);
  const [purposeId, setPurposeId] = useState<string>("contract");
  const [sector, setSector] = useState<string>("construction");
  const [timeInBusiness, setTimeInBusiness] = useState<string>("1_2y");
  const [province, setProvince] = useState<string>("QC");
  const [revenueBracket, setRevenueBracket] = useState<string>("rev_20_50k");
  const [nsfCount, setNsfCount] = useState<string>("0");
  const [existingAdvance, setExistingAdvance] = useState<string>("no");

  const [businessName, setBusinessName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  // Keep the amount in sync when the hero calculator sends a new one.
  const [lastInitialAmount, setLastInitialAmount] = useState(initialAmount);
  if (initialAmount !== lastInitialAmount) {
    setLastInitialAmount(initialAmount);
    setAmount(initialAmount);
  }

  const revenue = REVENUE_BRACKETS.find((r) => r.id === revenueBracket)!;
  const tib = TIME_IN_BUSINESS.find((t) => t.id === timeInBusiness)!;
  const meetsTypicalProfile =
    revenue.val >= TYPICAL_PROFILE.minMonthlyRevenue && tib.months >= TYPICAL_PROFILE.minMonthsInBusiness;

  const contactValid =
    businessName.trim().length > 1 && ownerName.trim().length > 1 && isValidPhone(phone) && isValidEmail(email) && consent;

  const consentText = fr
    ? `J'autorise ${BRAND.name} (${BRAND.legalName}) à me contacter par téléphone, texto et courriel au sujet de ma demande et à utiliser ces renseignements pour l'évaluer. Je peux retirer ce consentement en tout temps.`
    : `I authorize ${BRAND.name} (${BRAND.legalName}) to contact me by phone, text and email about my request and to use this information to assess it. I can withdraw this consent at any time.`;

  const goTo = (s: number) => {
    setStep(s);
    document.getElementById("apply-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    if (!contactValid) return;
    setIsSubmitting(true);
    setSubmitError("");

    const purpose = FUND_PURPOSES.find((p) => p.id === purposeId)!;
    const payload = {
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      province,
      amount,
      purpose: fr ? purpose.labelFr : purpose.labelEn,
      sector,
      timeInBusiness: fr ? tib.labelFr : tib.labelEn,
      monthsInBusiness: tib.months,
      monthlyRevenueLabel: fr ? revenue.labelFr : revenue.labelEn,
      monthlyRevenue: revenue.val,
      nsfCount,
      existingAdvance: existingAdvance === "yes",
      consentToContact: true,
      consentText,
      lang,
      landingUrl: typeof window !== "undefined" ? window.location.href : "",
      attribution: readAttribution(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || "submit_failed");
      setLeadId(data.leadId);
      trackLeadConversion(data.leadId);
      setSubmittedInHours(isWithinBusinessHours());
      onComplete({ ...payload, leadId: data.leadId });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#10b981", "#14b8a6"] });
    } catch (err) {
      console.error("Lead submission failed:", err);
      setSubmitError(
        fr
          ? `Oups, votre demande n'a pas pu être envoyée. Appelez-nous directement au ${BRAND.phoneDisplay}.`
          : `Sorry, your request couldn't be sent. Please call us at ${BRAND.phoneDisplay}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = fr ? ["Montant", "Entreprise", "Revenus", "Coordonnées"] : ["Amount", "Business", "Revenue", "Contact"];
  const firstName = ownerName.trim().split(/\s+/)[0];
  const founderFirstName = BRAND.founder.split(" ")[0];

  return (
    <div id="apply-wizard" className="py-20 scroll-mt-16 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{fr ? "Gratuit • 2 minutes • Sans impact sur votre crédit" : "Free • 2 minutes • No credit impact"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {fr ? (
              <>Vérifiez votre <span className="gradient-text">admissibilité</span></>
            ) : (
              <>Check your <span className="gradient-text">eligibility</span></>
            )}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            {fr
              ? "Répondez à quelques questions. On vous rappelle en moins de 5 minutes pendant nos heures d'ouverture."
              : "Answer a few questions. We'll call you back within 5 minutes during business hours."}
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {!leadId && (
            <div className="mb-8 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 mb-4">
                {stepLabels.map((label, i) => {
                  const s = i + 1;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => s < step && goTo(s)}
                      disabled={s > step}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        step === s
                          ? "bg-emerald-500 text-slate-950"
                          : s < step
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                          : "bg-slate-900 text-slate-500 border border-slate-800"
                      }`}
                    >
                      <span>{s < step ? "✓" : `0${s}`}</span>
                      <span className="hidden md:inline">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${step * 25}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* STEP 1: Amount & purpose */}
          {!leadId && step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  {fr ? "Étape 1 • Montant" : "Step 1 • Amount"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {fr ? "De combien avez-vous besoin?" : "How much do you need?"}
                </h3>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight text-center">
                  {money(amount, lang)}
                </div>
                <input
                  type="range"
                  min={TYPICAL_PROFILE.minAmount}
                  max={TYPICAL_PROFILE.maxAmount}
                  step={5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  aria-label={fr ? "Montant demandé" : "Amount requested"}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[25000, 50000, 100000, 250000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        amount === amt
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      {money(amt, lang)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-3">
                  {fr ? "À quoi serviront les fonds?" : "What will the funds be used for?"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUND_PURPOSES.map((p) => (
                    <button key={p.id} type="button" onClick={() => setPurposeId(p.id)} className={choiceClass(purposeId === p.id)}>
                      <span className="text-xs font-black flex items-center justify-between">
                        {fr ? p.labelFr : p.labelEn}
                        {purposeId === p.id && <Check className="w-4 h-4 text-emerald-400" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => goTo(2)} className={primaryBtn}>
                <span>{fr ? "Continuer" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Business */}
          {!leadId && step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {fr ? "Étape 2 • Entreprise" : "Step 2 • Business"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {fr ? "Parlez-nous de votre entreprise" : "Tell us about your business"}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SECTORS.map((sec) => {
                  const Icon = sec.icon;
                  const selected = sector === sec.id;
                  return (
                    <button key={sec.id} type="button" onClick={() => setSector(sec.id)} className={`${choiceClass(selected)} flex flex-col gap-2.5`}>
                      <div className={`p-2 rounded-xl w-fit ${selected ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold leading-tight">{fr ? sec.labelFr : sec.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Depuis combien de temps êtes-vous en affaires?" : "Time in business"}
                  </label>
                  <select value={timeInBusiness} onChange={(e) => setTimeInBusiness(e.target.value)} className={selectClass}>
                    {TIME_IN_BUSINESS.map((t) => (
                      <option key={t.id} value={t.id}>{fr ? t.labelFr : t.labelEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Province" : "Province"}
                  </label>
                  <select value={province} onChange={(e) => setProvince(e.target.value)} className={selectClass}>
                    {PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => goTo(1)} className={backBtn} aria-label={fr ? "Retour" : "Back"}>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => goTo(3)} className={primaryBtn}>
                  <span>{fr ? "Continuer" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Revenue */}
          {!leadId && step === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {fr ? "Étape 3 • Revenus" : "Step 3 • Revenue"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {fr ? "Combien déposez-vous par mois dans votre compte d'entreprise?" : "How much do you deposit into your business account each month?"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {fr ? "Une estimation suffit. On vérifiera avec vos relevés bancaires." : "An estimate is fine. We'll confirm with your bank statements."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REVENUE_BRACKETS.map((rb) => (
                  <button key={rb.id} type="button" onClick={() => setRevenueBracket(rb.id)} className={`${choiceClass(revenueBracket === rb.id)} flex items-center justify-between`}>
                    <span className="text-sm font-black">{fr ? rb.labelFr : rb.labelEn}</span>
                    {revenueBracket === rb.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Paiements refusés (NSF) dans les 3 derniers mois" : "Bounced payments (NSF) in the last 3 months"}
                  </label>
                  <select value={nsfCount} onChange={(e) => setNsfCount(e.target.value)} className={selectClass}>
                    <option value="0">{fr ? "Aucun" : "None"}</option>
                    <option value="1-3">1 – 3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Avez-vous déjà une avance de fonds en cours?" : "Do you have a cash advance outstanding?"}
                  </label>
                  <select value={existingAdvance} onChange={(e) => setExistingAdvance(e.target.value)} className={selectClass}>
                    <option value="no">{fr ? "Non" : "No"}</option>
                    <option value="yes">{fr ? "Oui" : "Yes"}</option>
                  </select>
                </div>
              </div>

              <div className={`rounded-3xl p-5 border flex gap-3 text-sm ${meetsTypicalProfile ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-100" : "bg-slate-900/80 border-slate-700 text-slate-300"}`}>
                <Info className={`w-5 h-5 shrink-0 ${meetsTypicalProfile ? "text-emerald-400" : "text-amber-400"}`} />
                <p>
                  {meetsTypicalProfile
                    ? fr
                      ? "Votre profil correspond aux critères habituels de nos bailleurs de fonds. Dernière étape : vos coordonnées pour qu'on vous appelle."
                      : "Your profile matches our funders' usual criteria. Last step: your contact info so we can call you."
                    : fr
                    ? "Votre profil est en dehors des critères habituels, mais chaque dossier est différent. Laissez vos coordonnées et on vous dira franchement si on peut vous aider."
                    : "Your profile is outside the usual criteria, but every file is different. Leave your details and we'll tell you honestly whether we can help."}
                </p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => goTo(2)} className={backBtn} aria-label={fr ? "Retour" : "Back"}>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => goTo(4)} className={primaryBtn}>
                  <span>{fr ? "Dernière étape" : "Last step"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact & consent */}
          {!leadId && step === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  {fr ? "Étape 4 • Coordonnées" : "Step 4 • Contact"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {fr ? "Où peut-on vous joindre?" : "Where can we reach you?"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="cf-business" className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Nom de l'entreprise" : "Business name"}
                  </label>
                  <div className={fieldClass}>
                    <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                    <input id="cf-business" type="text" autoComplete="organization" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} placeholder={fr ? "ex. : Rénovations Tremblay inc." : "e.g. Tremblay Renovations Inc."} />
                  </div>
                </div>
                <div>
                  <label htmlFor="cf-name" className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Votre nom" : "Your name"}
                  </label>
                  <div className={fieldClass}>
                    <User className="w-5 h-5 text-slate-400 shrink-0" />
                    <input id="cf-name" type="text" autoComplete="name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={inputClass} placeholder={fr ? "Prénom et nom" : "First and last name"} />
                  </div>
                </div>
                <div>
                  <label htmlFor="cf-phone" className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Cellulaire" : "Mobile phone"}
                  </label>
                  <div className={fieldClass}>
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <input id="cf-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="(514) 555-1234" />
                  </div>
                  {phone && !isValidPhone(phone) && (
                    <span className="text-[11px] text-amber-400 mt-1 block">{fr ? "Entrez un numéro à 10 chiffres." : "Enter a 10-digit number."}</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-email" className="text-xs text-slate-300 font-bold uppercase tracking-wider block mb-2">
                    {fr ? "Courriel" : "Email"}
                  </label>
                  <div className={fieldClass}>
                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                    <input id="cf-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder={fr ? "vous@entreprise.ca" : "you@company.ca"} />
                  </div>
                  {email && !isValidEmail(email) && (
                    <span className="text-[11px] text-amber-400 mt-1 block">{fr ? "Courriel invalide." : "Invalid email."}</span>
                  )}
                </div>
              </div>

              <label className="flex gap-3 items-start text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-400 shrink-0" />
                <span>
                  {consentText}{" "}
                  <a href="/confidentialite" target="_blank" className="underline text-emerald-400">
                    {fr ? "Politique de confidentialité" : "Privacy policy"}
                  </a>
                </span>
              </label>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {fr
                  ? `${BRAND.name} est un intermédiaire, pas un prêteur. Remplir ce formulaire ne garantit pas l'obtention d'un financement : toute demande est soumise à l'approbation du bailleur de fonds.`
                  : `${BRAND.name} is an intermediary, not a lender. Submitting this form does not guarantee funding: every application is subject to the funder's approval.`}
              </p>

              {submitError && (
                <div className="flex gap-2 items-start text-sm text-rose-200 bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => goTo(3)} className={backBtn} aria-label={fr ? "Retour" : "Back"}>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={handleSubmit} disabled={isSubmitting || !contactValid} className={primaryBtn}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      {fr ? "Envoi..." : "Sending..."}
                    </span>
                  ) : (
                    <>
                      <span>{fr ? "Envoyer ma demande" : "Send my request"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {leadId && (
            <div className="py-6 space-y-8 animate-fadeIn">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto glow-emerald">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">
                  {fr ? `Merci${firstName ? " " + firstName : ""}, demande reçue!` : `Thanks${firstName ? " " + firstName : ""}, request received!`}
                </h3>
                <p className="text-slate-300 text-base max-w-lg mx-auto">
                  {submittedInHours
                    ? fr
                      ? `${founderFirstName} vous appelle dans les prochaines minutes au ${phone}. Gardez votre téléphone près de vous.`
                      : `${founderFirstName} will call you in the next few minutes at ${phone}. Keep your phone close.`
                    : fr
                    ? `Nous sommes présentement fermés. ${founderFirstName} vous appelle dès l'ouverture (${BRAND.hoursFr}) au ${phone}.`
                    : `We're currently closed. ${founderFirstName} will call you as soon as we open (${BRAND.hoursEn}) at ${phone}.`}
                </p>
                <p className="text-xs text-slate-500">
                  {fr ? "Numéro de référence : " : "Reference number: "}
                  <span className="font-mono text-slate-300">{leadId}</span>
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  {fr ? "Pour aller plus vite, préparez :" : "To speed things up, have ready:"}
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {(fr
                    ? [
                        "Vos relevés bancaires d'entreprise des 3 à 6 derniers mois (PDF)",
                        "Une pièce d'identité avec photo du propriétaire",
                        "Un spécimen de chèque de votre compte d'entreprise",
                      ]
                    : [
                        "Your last 3–6 months of business bank statements (PDF)",
                        "Photo ID of the owner",
                        "A void cheque from your business account",
                      ]
                  ).map((d) => (
                    <li key={d} className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center text-sm text-slate-400">
                {fr ? "Vous préférez appeler? " : "Prefer to call? "}
                <a href={`tel:${BRAND.phoneE164}`} className="text-emerald-400 font-bold hover:underline">
                  {BRAND.phoneDisplay}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
