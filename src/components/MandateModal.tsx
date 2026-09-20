"use client";

import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, FileText, Lock, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface MandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData: {
    businessName?: string;
    ownerName?: string;
    amount?: number;
    email?: string;
    phone?: string;
  };
  lang: "fr" | "en";
}

export const MandateModal: React.FC<MandateModalProps> = ({ isOpen, onClose, leadData, lang }) => {
  const [signature, setSignature] = useState<string>("");
  const [isSigned, setIsSigned] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSign = () => {
    if (!signature.trim()) return;
    setIsSigned(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const formattedAmount = leadData.amount ? `$${leadData.amount.toLocaleString()}` : "$65,000";
  const clientName = leadData.ownerName || "Le Client";
  const businessName = leadData.businessName || "Entreprise Emprunteuse";
  const feeAmount = leadData.amount ? `$${Math.round(leadData.amount * 0.07).toLocaleString()}` : "$4,550";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-white/15 glow-emerald relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold block">
              {lang === "fr" ? "Convention Officielle de Mandat" : "Official Advisory Mandate"}
            </span>
            <h3 className="text-xl font-black text-white">
              {lang === "fr" ? "Mandat de Courtage Financier Exclusif (7.0%)" : "Exclusive Brokerage Mandate (7.0%)"}
            </h3>
          </div>
        </div>

        {!isSigned ? (
          <div className="space-y-4 text-xs text-slate-300">
            
            {/* Agreement Summary Callout */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === "fr" ? "Mandataire :" : "Advisory Desk:"}</span>
                <span className="font-bold text-white">Apex Capital Inc. / 9486-9070 Québec Inc.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === "fr" ? "Client / Emprunteur :" : "Client / Borrower:"}</span>
                <span className="font-bold text-emerald-400">{businessName} ({clientName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === "fr" ? "Montant Cible Recherché :" : "Target Funding Amount:"}</span>
                <span className="font-extrabold text-white">{formattedAmount}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">{lang === "fr" ? "Honoraires de Succès (7.00%) :" : "Performance Fee (7.00%):"}</span>
                <span className="font-black text-emerald-400">
                  {feeAmount} {lang === "fr" ? "(Déduit du déboursement)" : "(Deducted at closing wire)"}
                </span>
              </div>
            </div>

            {/* Core Legal Clauses */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed text-[11px] text-slate-400">
              <p>
                <strong className="text-slate-200">1. {lang === "fr" ? "Objet du Mandat :" : "Mandate Scope:"}</strong>{" "}
                {lang === "fr"
                  ? "Le Client mandate irrévocablement Apex Capital pour négocier, structurer et obtenir auprès d'institutions et prêteurs commerciaux partenaires une facilité de financement pour un montant cible de " +
                    formattedAmount +
                    "."
                  : "The Client appoints Apex Capital as exclusive financing advisor to negotiate and secure commercial funding facilities for a target amount of " +
                    formattedAmount +
                    "."}
              </p>

              <p>
                <strong className="text-slate-200">2. {lang === "fr" ? "Structure de Rémunération (100% au Succès) :" : "Success-Only Fee Structure:"}</strong>{" "}
                {lang === "fr"
                  ? "Aucun frais d'ouverture de dossier ni avance n'est exigible. Les honoraires de 7.00% sont strictement exigibles lors du déboursement effectif des fonds et sont déduits directement à la source par le prêteur sur les montants avancés."
                  : "Zero upfront fees or retainer costs apply. The 7.00% brokerage fee is strictly earned upon successful loan disbursement and is deducted directly at closing from the gross funding wire."}
              </p>

              <p>
                <strong className="text-slate-200">3. {lang === "fr" ? "Directive de Paiement au Déboursement :" : "Direction to Pay at Closing:"}</strong>{" "}
                {lang === "fr"
                  ? "Le Client autorise expressément l'institution financière prêteuse à verser directement à Apex Capital ses honoraires de courtage convenus à même les fonds avancés le jour de la clôture."
                  : "The Client irrevocably instructs the funding lender to disburse the agreed advisory fee directly to Apex Capital upon loan wire execution."}
              </p>
            </div>

            {/* E-Signature Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs text-slate-300 font-bold block">
                {lang === "fr" ? "Signature Électronique (Tapez votre Nom Complet) :" : "E-Signature (Type Full Legal Name):"}
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder={clientName}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-base font-serif italic text-emerald-400 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-slate-500 block">
                {lang === "fr" ? "En signant, vous attestez être le dirigeant autorisé de l'entreprise." : "By typing your name, you confirm you are an authorized officer of the business."}
              </span>
            </div>

            {/* Sign Button */}
            <button
              onClick={handleSign}
              disabled={!signature.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 disabled:opacity-50 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === "fr" ? "Confirmer et Signer Électroniquement" : "Execute & Sign Mandate"}</span>
            </button>

          </div>
        ) : (
          /* Signed Confirmation */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto glow-emerald">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-white">
              {lang === "fr" ? "Mandat Signé avec Succès !" : "Mandate Executed Successfully!"}
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {lang === "fr"
                ? `Le mandat de performance pour ${businessName} a été validé électroniquement sous la signature de "${signature}". Votre dossier a été transmis au bureau de souscription prioritaire.`
                : `The performance agreement for ${businessName} has been executed by "${signature}". Your file is now in priority funding queue.`}
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs uppercase"
            >
              {lang === "fr" ? "Fermer" : "Close"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
