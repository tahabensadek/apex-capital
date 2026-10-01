/** Lead types and labels, safe to import from client components (no Node APIs). */

export const LEAD_STATUSES = [
  "NEW",
  "NO_ANSWER",
  "NOT_A_FIT",
  "MANDATE_SENT",
  "SUBMITTED",
  "FUNDED",
  "LOST",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nouveau",
  NO_ANSWER: "Pas de réponse",
  NOT_A_FIT: "Pas admissible",
  MANDATE_SENT: "Mandat envoyé",
  SUBMITTED: "Soumis au bailleur",
  FUNDED: "Financé",
  LOST: "Perdu",
};

export interface Attribution {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadRecord {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  province: string;
  amount: number;
  purpose: string;
  sector: string;
  timeInBusiness: string;
  monthsInBusiness: number | null;
  monthlyRevenue: number | null;
  monthlyRevenueLabel: string;
  nsfCount: string;
  existingAdvance: boolean;
  lang: "fr" | "en";
  consent: { toContact: boolean; text: string; at: string };
  landingUrl: string;
  attribution: Attribution;
  createdAt: string;
  createdInBusinessHours: boolean;
  status: LeadStatus;
  firstCalledAt: string | null;
  callAttempts: number;
  fundedAmount: number | null;
  fundedAt: string | null;
  updatedAt: string;
}
