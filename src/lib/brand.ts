/**
 * Single source of truth for CapitalFacile's identity, contact info and fee.
 *
 * Everything client-facing (site copy, SMS, mandate, CRM math) reads from here so
 * a change to the fee or contact info is a one-line edit (or an env var) instead
 * of a hunt through every component.
 */

const envNumber = (raw: string | undefined, fallback: number) => {
  const n = Number(raw);
  return Number.isFinite(n) && raw !== undefined && raw !== "" ? n : fallback;
};

export const BRAND = {
  /** Trade name shown to clients. Must be declared as a "nom d'emprunt" at the Registraire des entreprises. */
  name: "CapitalFacile",
  domain: "capitalfacile.ca",
  url: "https://capitalfacile.ca",
  legalName: "9576-7406 Québec inc.",
  neq: "1182595141",
  address: "154 av. Jacques-Martin, La Prairie (Québec) J5R 6V1",
  founder: "Taha Bensadek",

  phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "(514) 824-8618",
  phoneE164: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+15148248618",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@capitalfacile.ca",

  /** Business hours used in the "we'll call you in X minutes" promise. */
  hoursFr: "Lun–Ven, 8 h à 18 h (HE)",
  hoursEn: "Mon–Fri, 8 a.m.–6 p.m. ET",
} as const;

/**
 * Client success fee, in percent of the gross amount funded.
 * Set NEXT_PUBLIC_SUCCESS_FEE_PCT=0 to switch the whole site to "no client fee"
 * (e.g. if the funder's written approval is ever withdrawn).
 */
export const SUCCESS_FEE_PCT = envNumber(process.env.NEXT_PUBLIC_SUCCESS_FEE_PCT, 6);
export const HAS_CLIENT_FEE = SUCCESS_FEE_PCT > 0;

export const feeOn = (amount: number) => Math.round(amount * (SUCCESS_FEE_PCT / 100));
export const netAfterFee = (amount: number) => amount - feeOn(amount);

/** "6 %" in French typography, "6%" in English. */
export const feeLabel = (lang: "fr" | "en") =>
  lang === "fr" ? `${SUCCESS_FEE_PCT} %` : `${SUCCESS_FEE_PCT}%`;

export const money = (n: number, lang: "fr" | "en") =>
  lang === "fr"
    ? `${Math.round(n).toLocaleString("fr-CA")} $`
    : `$${Math.round(n).toLocaleString("en-CA")}`;

/**
 * Typical profile for revenue-based funding. These are guidelines shown to
 * prospects, not an approval rule — the funder sets the final criteria.
 * Update to match the funder's current buy box.
 */
export const TYPICAL_PROFILE = {
  minMonthlyRevenue: 20000,
  minMonthsInBusiness: 6,
  minAmount: 10000,
  maxAmount: 500000,
};

/**
 * Legal disclosure shown in the footer and next to the application form.
 * TODO: get the exact funder-agent wording approved by the funder (partner agreement s. 3–5)
 * before running paid traffic.
 */
export const disclosure = (lang: "fr" | "en") => {
  const fee = HAS_CLIENT_FEE
    ? lang === "fr"
      ? ` Des honoraires de succès de ${feeLabel("fr")} du montant financé sont payables par le client uniquement si le financement est accepté et déboursé; aucuns frais ne sont exigibles autrement.`
      : ` A success fee of ${feeLabel("en")} of the amount funded is payable by the client only if funding is accepted and disbursed; nothing is owed otherwise.`
    : "";
  return lang === "fr"
    ? `${BRAND.name} (${BRAND.legalName}, NEQ ${BRAND.neq}) est un intermédiaire indépendant en financement commercial et agent d'un réseau de bailleurs de fonds partenaire. ${BRAND.name} n'est pas un prêteur et ne prend aucune décision de financement : chaque demande est soumise à l'analyse et à l'approbation finale du bailleur de fonds, qui fixe seul les montants, coûts et conditions. Le financement offert prend généralement la forme d'un achat de revenus futurs (avance de fonds commerciale) et non d'un prêt.${fee} ${BRAND.name} peut aussi être rémunéré par le bailleur de fonds. Réservé aux entreprises; non offert aux consommateurs.`
    : `${BRAND.name} (${BRAND.legalName}, NEQ ${BRAND.neq}) is an independent commercial financing intermediary and agent of a partner funding network. ${BRAND.name} is not a lender and makes no funding decisions: every application is subject to the funder's review and final approval, and the funder alone sets amounts, costs and terms. Funding is generally structured as a purchase of future receivables (merchant cash advance), not a loan.${fee} ${BRAND.name} may also be compensated by the funder. Business purposes only; not available to consumers.`;
};

export const newLeadId = () => "CF-" + Date.now().toString(36).toUpperCase();
