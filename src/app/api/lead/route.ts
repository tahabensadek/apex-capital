import { NextResponse } from "next/server";
import { BRAND, newLeadId } from "@/lib/brand";
import { isWithinBusinessHours } from "@/lib/hours";
import { saveLead, type Attribution, type LeadRecord } from "@/lib/leadStore";
import { hasLeadLinkSecret, leadLinkPath } from "@/lib/leadLink";

export const dynamic = "force-dynamic";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const toE164 = (raw: string) => {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return "";
};

async function sendSms(to: string, text: string) {
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_FROM_NUMBER;
  if (!apiKey || !from || !to) return false;
  const res = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to, text }),
  });
  if (!res.ok) console.error("Telnyx error", res.status, await res.text());
  return res.ok;
}

/** Optional durable copy of every lead (e.g. a Make/Zapier webhook that appends to a Google Sheet). */
async function postToWebhook(lead: Record<string, unknown>) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) console.error("Lead webhook error", res.status);
  return res.ok;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 });
  }

  const businessName = str(body.businessName);
  const ownerName = str(body.ownerName);
  const phone = toE164(str(body.phone, 30));
  const email = str(body.email);
  const amount = Math.round(Number(body.amount) || 0);
  const lang = body.lang === "en" ? "en" : "fr";

  const missing = [
    !businessName && "businessName",
    !ownerName && "ownerName",
    !phone && "phone",
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && "email",
    amount <= 0 && "amount",
    body.consentToContact !== true && "consentToContact",
  ].filter(Boolean);
  if (missing.length) {
    return NextResponse.json({ success: false, error: "missing_fields", fields: missing }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rawAttribution = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
  const attribution: Attribution = {};
  for (const key of ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
    const v = str(rawAttribution[key], 300);
    if (v) attribution[key] = v;
  }
  const inHours = isWithinBusinessHours();

  const lead: LeadRecord = {
    id: newLeadId(),
    businessName,
    ownerName,
    phone,
    email,
    province: str(body.province, 10),
    amount,
    purpose: str(body.purpose),
    sector: str(body.sector, 40),
    timeInBusiness: str(body.timeInBusiness, 40),
    monthsInBusiness: Number(body.monthsInBusiness) || null,
    monthlyRevenue: Number(body.monthlyRevenue) || null,
    monthlyRevenueLabel: str(body.monthlyRevenueLabel, 60),
    nsfCount: str(body.nsfCount, 10),
    existingAdvance: body.existingAdvance === true,
    lang,
    consent: { toContact: true, text: str(body.consentText, 600), at: now },
    landingUrl: str(body.landingUrl, 500),
    attribution,
    createdAt: now,
    createdInBusinessHours: inHours,
    status: "NEW",
    firstCalledAt: null,
    callAttempts: 0,
    fundedAmount: null,
    fundedAt: null,
    updatedAt: now,
  };

  const founderFirstName = BRAND.founder.split(" ")[0];
  const amountLabel = lang === "fr" ? `${amount.toLocaleString("fr-CA")} $` : `$${amount.toLocaleString("en-CA")}`;

  const adminAlert =
    `NOUVEAU LEAD ${BRAND.name} ${lead.id}\n` +
    `${businessName} — ${ownerName} ${phone}\n` +
    `Demande: ${amountLabel} | Revenus: ${lead.monthlyRevenueLabel || "?"} | ${lead.timeInBusiness || "?"} | NSF: ${lead.nsfCount || "?"}` +
    `${lead.existingAdvance ? " | AVANCE EN COURS" : ""} [${lang.toUpperCase()}]\n` +
    (hasLeadLinkSecret()
      ? `Appeler (1 clic, chronomètre le rappel) : ${process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin}${leadLinkPath(lead.id)}`
      : `APPELER MAINTENANT`);

  const customerSms =
    lang === "fr"
      ? `Bonjour ${ownerName.split(" ")[0]}, ici ${founderFirstName} de ${BRAND.name}. J'ai bien reçu votre demande de ${amountLabel} pour ${businessName}. ` +
        (inHours ? `Je vous appelle dans quelques minutes du ${BRAND.phoneDisplay}.` : `Je vous appelle dès l'ouverture du ${BRAND.phoneDisplay}.`) +
        " Répondez ARRET pour ne plus recevoir de textos."
      : `Hi ${ownerName.split(" ")[0]}, this is ${founderFirstName} from ${BRAND.name}. I received your ${amountLabel} request for ${businessName}. ` +
        (inHours ? `I'll call you in a few minutes from ${BRAND.phoneDisplay}.` : `I'll call you first thing when we open, from ${BRAND.phoneDisplay}.`) +
        " Reply STOP to opt out.";

  // Always leave a copy in the server logs so a lead is never fully lost.
  console.log("NEW_LEAD", JSON.stringify(lead));

  let stored = false;
  try {
    await saveLead(lead);
    stored = true;
  } catch (err) {
    console.error("Lead store unavailable:", (err as Error).message);
  }

  const [adminSmsOk, customerSmsOk, webhookOk] = await Promise.all([
    sendSms(process.env.ADMIN_PHONE || BRAND.phoneE164, adminAlert).catch(() => false),
    sendSms(phone, customerSms).catch(() => false),
    postToWebhook({ event: "lead.created", ...lead }).catch(() => false),
  ]);

  if (!adminSmsOk && !webhookOk && !stored) {
    // Nothing durable happened: tell the visitor to call instead of showing a fake success.
    return NextResponse.json({ success: false, error: "lead_not_delivered" }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    leadId: lead.id,
    delivery: { adminSmsOk, customerSmsOk, webhookOk, stored },
  });
}
