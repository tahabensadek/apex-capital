"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import confetti from "canvas-confetti";

interface PreQualWizardProps {
  initialAmount?: number;
  initialProduct?: string;
  onComplete: (leadData: any) => void;
  onOpenMandate: (leadData: any) => void;
  lang: "fr" | "en";
}

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

  // Form State
  const [amount, setAmount] = useState<number>(initialAmount);
  const [purpose, setPurpose] = useState<string>("Working Capital / Inventory");
  const [businessName, setBusinessName] = useState<string>("");
  const [province, setProvince] = useState<string>("QC");
  const [timeInBusiness, setTimeInBusiness] = useState<string>("1-2 Years");
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("$25,000 - $50,000");
  const [ownerName, setOwnerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hasFlinksConnected, setHasFlinksConnected] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const leadPayload = {
      businessName,
      ownerName,
      phone,
      email,
      province,
      amount,
      purpose,
      timeInBusiness,
      monthlyRevenue,
      hasFlinksConnected,
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
      console.log("Lead created:", data);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onComplete(leadPayload);
    }
  };

  return (
    <div id="apply-wizard" className="py-16 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 glow-emerald relative overflow-hidden">
          
          {/* Top Progress Indicator */}
          {!isSubmitted && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span>{lang === "fr" ? `Étape ${step} sur 4` : `Step ${step} of 4`}</span>
                <span className="text-emerald-400 font-extrabold">{step * 25}% {lang === "fr" ? "Complété" : "Complete"}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${step * 25}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* STEP 1: Capital Amount & Funding Purpose */}
          {!isSubmitted && step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block">
                  {lang === "fr" ? "Étape 1 : Votre Besoin de Financement" : "Step 1: Your Capital Target"}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {lang === "fr" ? "Combien souhaitez-vous obtenir en 24H ?" : "How much capital do you need in 24H?"}
                </h3>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Montant souhaité :" : "Requested Amount:"}
                </label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4">
                  <DollarSign className="w-6 h-6 text-emerald-400 shrink-0" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-transparent text-2xl font-black text-white focus:outline-none"
                    placeholder="65000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Objectif principal des fonds :" : "Primary Purpose for Funds:"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    lang === "fr" ? "Fonds de Roulement / Paie" : "Working Capital / Payroll",
                    lang === "fr" ? "Achat d'Équipement / Camion" : "Equipment / Vehicle Purchase",
                    lang === "fr" ? "Achat de Stock / Matériaux" : "Bulk Inventory / Materials",
                    lang === "fr" ? "Règlement Dettes / Fournisseurs" : "Pay Suppliers / Refinance",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`p-3.5 rounded-xl text-xs font-bold text-left transition-all ${
                        purpose === p
                          ? "bg-emerald-500/20 border-2 border-emerald-400 text-white glow-emerald"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98"
              >
                <span>{lang === "fr" ? "Continuer" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Business Information */}
          {!isSubmitted && step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block">
                  {lang === "fr" ? "Étape 2 : Profil de l'Entreprise" : "Step 2: Business Profile"}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {lang === "fr" ? "Informations de votre commerce" : "Your Business Details"}
                </h3>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Nom légal de l'entreprise :" : "Legal Business Name:"}
                </label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4">
                  <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-white focus:outline-none"
                    placeholder="ex: Transport & Toiture Express Inc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-2">
                    {lang === "fr" ? "Province :" : "Province:"}
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-sm font-bold focus:outline-none"
                  >
                    <option value="QC">Québec (QC)</option>
                    <option value="ON">Ontario (ON)</option>
                    <option value="BC">British Columbia (BC)</option>
                    <option value="AB">Alberta (AB)</option>
                    <option value="MB">Manitoba (MB)</option>
                    <option value="OTHER">Other Province</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-2">
                    {lang === "fr" ? "Ancienneté :" : "Time in Business:"}
                  </label>
                  <select
                    value={timeInBusiness}
                    onChange={(e) => setTimeInBusiness(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-sm font-bold focus:outline-none"
                  >
                    <option value="6-12 Months">6 - 12 Mois</option>
                    <option value="1-2 Years">1 - 2 Ans</option>
                    <option value="2-5 Years">2 - 5 Ans</option>
                    <option value="5+ Years">5+ Ans</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Revenu Brut Mensuel (Dépôts Bancaires) :" : "Gross Monthly Bank Revenue:"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "$10,000 - $25,000 / mo",
                    "$25,000 - $50,000 / mo",
                    "$50,000 - $100,000 / mo",
                    "$100,000+ / mo",
                  ].map((rev) => (
                    <button
                      key={rev}
                      type="button"
                      onClick={() => setMonthlyRevenue(rev)}
                      className={`p-3.5 rounded-xl text-xs font-bold text-left transition-all ${
                        monthlyRevenue === rev
                          ? "bg-emerald-500/20 border-2 border-emerald-400 text-white glow-emerald"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {rev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={!businessName}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{lang === "fr" ? "Continuer" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Fast Bank Sync (Flinks / Statement Upload) */}
          {!isSubmitted && step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block">
                  {lang === "fr" ? "Étape 3 : Vérification Rapide des Dépôts" : "Step 3: Fast Revenue Verification"}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {lang === "fr" ? "Validation Instantanée 24H" : "Instant 24H Pre-Underwriting"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {lang === "fr"
                    ? "Connectez votre compte d'entreprise via Flinks ou déposez vos 3 derniers relevés bancaires pour recevoir votre offre formelle aujourd'hui."
                    : "Connect your business bank account via Flinks or upload 3 months PDF statements for immediate priority funding."}
                </p>
              </div>

              {/* Flinks Direct Connect Box */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 glow-emerald flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white block">
                      {lang === "fr" ? "Connexion Bancaire Sécurisée Flinks" : "Flinks Instant Bank Connect"}
                    </span>
                    <span className="text-[11px] text-emerald-300 font-medium block">
                      {lang === "fr" ? "Offre formelle garantie sous 2 heures" : "Formal offer ready in 2 hours"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHasFlinksConnected(!hasFlinksConnected)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    hasFlinksConnected
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  {hasFlinksConnected ? "✓ Connecté" : "Connecter Flinks"}
                </button>
              </div>

              {/* OR File Drag & Drop */}
              <div className="text-center py-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                — {lang === "fr" ? "OU UPLOADER VOS RELEVÉS PDF" : "OR UPLOAD 3 MONTHS PDF STATEMENTS"} —
              </div>

              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-200">
                  {uploadedFileName || (lang === "fr" ? "Glissez vos relevés bancaires (PDF)" : "Drag & Drop 3 Months Bank Statements (PDF)")}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  {lang === "fr" ? "Relevés de compte entreprise 100% confidentiels" : "100% encrypted & confidential"}
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

              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <span>{lang === "fr" ? "Dernière Étape" : "Final Step"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Owner Contact Details & 3-Min Call Lock */}
          {!isSubmitted && step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block">
                  {lang === "fr" ? "Étape 4 : Coordonnées du Dirigeant" : "Step 4: Owner Contact"}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {lang === "fr" ? "Où devons-nous envoyer votre approbation ?" : "Where should we send your pre-approval?"}
                </h3>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Nom & Prénom du Dirigeant :" : "Full Name of Owner / Director:"}
                </label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4">
                  <User className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-white focus:outline-none"
                    placeholder="Marc Tremblay"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Numéro de Cellulaire Direct :" : "Direct Cell Phone Number:"}
                </label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-white focus:outline-none"
                    placeholder="(514) 555-0199"
                  />
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  {lang === "fr" ? "⚡ Un conseiller vous contactera sous 3 minutes." : "⚡ Our senior desk will text/call you within 3 minutes."}
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">
                  {lang === "fr" ? "Adresse Courriel Professionnelle :" : "Business Email:"}
                </label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-4">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-base font-bold text-white focus:outline-none"
                    placeholder="direction@votre-entreprise.ca"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 font-bold text-xs uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !ownerName || !phone}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{lang === "fr" ? "Transmission au souscripteur..." : "Connecting to Desk..."}</span>
                  ) : (
                    <>
                      <span>{lang === "fr" ? `Débloquer mon $${amount.toLocaleString()} en 24H` : `Fund My $${amount.toLocaleString()} in 24H`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN: Pre-Approval Certificate + Mandate Trigger */}
          {isSubmitted && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto glow-emerald">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest block mb-1">
                  {lang === "fr" ? "Dossier Transmis avec Succès" : "Pre-Approval Verified"}
                </span>
                <h3 className="text-3xl font-black text-white">
                  {lang === "fr" ? `Pré-Approbation Confirmée pour ${businessName}` : `Pre-Approval Locked for ${businessName}`}
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto mt-2">
                  {lang === "fr"
                    ? `Votre demande de $${amount.toLocaleString()} a été assignée à notre directeur de souscription (Taha Bensadek). Vous allez recevoir un appel/SMS dans les 3 prochaines minutes.`
                    : `Your $${amount.toLocaleString()} facility is assigned to our senior origination desk. Expect a direct call/SMS within 3 minutes.`}
                </p>
              </div>

              {/* 1-Click Mandate Review CTA */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    {lang === "fr" ? "Mandat de Courtage Succès (5%)" : "Performance Advisory Mandate (5%)"}
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    0$ D'avance
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === "fr"
                    ? "Pour accélérer le déboursement immédiat, vous pouvez signer le mandat de performance dès maintenant en 1 clic."
                    : "To expedite same-day wiring, you can review and e-sign your performance mandate right now."}
                </p>
                <button
                  onClick={() =>
                    onOpenMandate({
                      businessName,
                      ownerName,
                      phone,
                      email,
                      amount,
                    })
                  }
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>{lang === "fr" ? "Consulter & Signer le Mandat en 1 Clic" : "Review & E-Sign Mandate (1-Click)"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
