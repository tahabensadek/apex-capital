"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BRAND, HAS_CLIENT_FEE, feeLabel, feeOn, money } from "@/lib/brand";

interface FaqProps {
  lang: "fr" | "en";
}

export const Faq: React.FC<FaqProps> = ({ lang }) => {
  const [open, setOpen] = useState<number | null>(0);
  const example = 50000;

  const items =
    lang === "fr"
      ? [
          {
            q: `Est-ce que ${BRAND.name} est un prêteur?`,
            a: `Non. ${BRAND.name} est un intermédiaire : on prépare votre dossier et on le présente à notre réseau de bailleurs de fonds. C'est le bailleur de fonds qui analyse la demande, décide d'approuver ou non, fixe les conditions et verse les fonds.`,
          },
          {
            q: "Est-ce un prêt?",
            a: "Le plus souvent, non. Le financement prend généralement la forme d'un achat d'une partie de vos revenus futurs (avance de fonds commerciale) : le bailleur de fonds vous verse un montant maintenant, et vous remettez un montant fixe plus élevé par des prélèvements réguliers sur votre compte d'entreprise. Les conditions exactes sont dans l'entente du bailleur de fonds, que vous lisez avant de signer.",
          },
          {
            q: "Combien ça coûte?",
            a: HAS_CLIENT_FEE
              ? `Deux choses : (1) le coût du financement, fixé par le bailleur de fonds et indiqué dans son offre écrite; (2) nos honoraires de ${feeLabel("fr")} du montant financé. Exemple : pour ${money(example, "fr")} financés, nos honoraires sont de ${money(feeOn(example), "fr")}. Ce type de financement coûte plus cher qu'un prêt bancaire; on vous montre les chiffres avant que vous décidiez.`
              : "Le coût du financement est fixé par le bailleur de fonds et indiqué dans son offre écrite. Ce type de financement coûte plus cher qu'un prêt bancaire; on vous montre les chiffres avant que vous décidiez.",
          },
          ...(HAS_CLIENT_FEE
            ? [
                {
                  q: "Quand payez-vous vos honoraires?",
                  a: `Seulement si vous acceptez une offre et que les fonds sont déposés dans votre compte. Nos honoraires sont payables directement à ${BRAND.name} après le déboursement, selon le mandat que vous signez avec nous avant qu'on présente votre dossier. Aucuns frais d'ouverture, aucuns frais si vous n'êtes pas financé ou si vous refusez l'offre.`,
                },
              ]
            : []),
          {
            q: "Est-ce que ma demande affecte mon crédit?",
            a: "Remplir notre formulaire n'a aucun impact sur votre crédit. Si votre dossier est présenté, le bailleur de fonds peut faire une vérification de crédit, seulement avec votre autorisation.",
          },
          {
            q: "Faut-il une garantie?",
            a: "En général, aucune hypothèque ni garantie immobilière n'est exigée : l'analyse repose surtout sur vos dépôts bancaires. Le bailleur de fonds peut toutefois demander une garantie personnelle du propriétaire. On vous le dit avant que vous signiez.",
          },
          {
            q: "C'est rapide comment?",
            a: "On vous appelle en moins de 5 minutes pendant nos heures d'ouverture. Une fois le dossier complet, la décision et le versement dépendent du bailleur de fonds, souvent en quelques jours ouvrables. On ne peut garantir ni l'approbation ni un délai précis.",
          },
          {
            q: "Mes renseignements sont-ils protégés?",
            a: `Oui. Vos renseignements servent uniquement à évaluer votre demande et, avec votre consentement, à la présenter au bailleur de fonds. Pour toute question ou pour retirer votre consentement : ${BRAND.email}.`,
          },
        ]
      : [
          {
            q: `Is ${BRAND.name} a lender?`,
            a: `No. ${BRAND.name} is an intermediary: we prepare your file and present it to our funding network. The funder reviews the application, decides whether to approve it, sets the terms and sends the funds.`,
          },
          {
            q: "Is this a loan?",
            a: "Usually not. Funding is generally structured as a purchase of part of your future revenue (merchant cash advance): the funder pays you an amount now, and you remit a larger fixed amount through regular debits from your business account. The exact terms are in the funder's agreement, which you read before signing.",
          },
          {
            q: "How much does it cost?",
            a: HAS_CLIENT_FEE
              ? `Two things: (1) the cost of funding, set by the funder and shown in its written offer; (2) our fee of ${feeLabel("en")} of the amount funded. Example: on ${money(example, "en")} funded, our fee is ${money(feeOn(example), "en")}. This kind of funding costs more than a bank loan; we show you the numbers before you decide.`
              : "The cost of funding is set by the funder and shown in its written offer. This kind of funding costs more than a bank loan; we show you the numbers before you decide.",
          },
          ...(HAS_CLIENT_FEE
            ? [
                {
                  q: "When is your fee paid?",
                  a: `Only if you accept an offer and the funds land in your account. Our fee is paid directly to ${BRAND.name} after disbursement, under the mandate you sign with us before we present your file. No application fee, and nothing owed if you aren't funded or decline the offer.`,
                },
              ]
            : []),
          {
            q: "Does applying affect my credit?",
            a: "Filling out our form has no impact on your credit. If your file is presented, the funder may run a credit check, only with your authorization.",
          },
          {
            q: "Do I need collateral?",
            a: "Generally no mortgage or real-estate collateral is required: the review is mostly based on your bank deposits. The funder may, however, ask for a personal guarantee from the owner. We'll tell you before you sign.",
          },
          {
            q: "How fast is it?",
            a: "We call you within 5 minutes during business hours. Once your file is complete, the decision and funding depend on the funder, often within a few business days. We can't guarantee approval or a specific timeline.",
          },
          {
            q: "Is my information protected?",
            a: `Yes. Your information is used only to assess your request and, with your consent, to present it to the funder. Questions or to withdraw consent: ${BRAND.email}.`,
          },
        ];

  return (
    <section id="faq" className="py-24 bg-slate-950/90 relative border-t border-slate-900 scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-center mb-10">
          {lang === "fr" ? "Questions fréquentes" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="glass-card rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
                >
                  <span className="font-bold text-white text-sm sm:text-base">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm text-slate-300 leading-relaxed">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
