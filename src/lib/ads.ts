/**
 * Google Ads tag (gtag.js) helpers. Everything is a no-op until
 * NEXT_PUBLIC_GOOGLE_ADS_ID (e.g. "AW-123456789") is set.
 *
 * Consent: tracking is denied by default (Quebec Law 25) and only granted when the
 * visitor accepts the banner. With consent denied, Google still receives cookieless
 * conversion pings it uses for modelled conversions.
 */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "";
export const CONSENT_STORAGE_KEY = "cf_consent_v1";

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | null =>
  typeof window !== "undefined" && typeof (window as unknown as { gtag?: Gtag }).gtag === "function"
    ? (window as unknown as { gtag: Gtag }).gtag
    : null;

export const CONSENT_GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

export const CONSENT_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

export function updateConsent(granted: boolean) {
  gtag()?.("consent", "update", granted ? CONSENT_GRANTED : CONSENT_DENIED);
}

/** Fires the "Lead" conversion once per lead (transaction_id dedupes double submits). */
export function trackLeadConversion(leadId: string) {
  if (!GOOGLE_ADS_ID || !GOOGLE_ADS_LEAD_LABEL) return;
  gtag()?.("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
    transaction_id: leadId,
  });
}

/** Ad click ids and UTM tags from the landing URL, sent with the lead for offline conversion import. */
export function readAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

/**
 * Inline bootstrap: defines gtag, applies default-denied consent (or the visitor's saved
 * choice), then loads gtag.js. One script so the consent default always runs first.
 */
export const gtagBootstrap = (adsId: string) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var saved = null;
try { saved = localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}); } catch (e) {}
gtag('consent', 'default', ${JSON.stringify({ ...CONSENT_DENIED, wait_for_update: 500 })});
if (saved === 'granted') { gtag('consent', 'update', ${JSON.stringify(CONSENT_GRANTED)}); }
gtag('set', 'url_passthrough', true);
gtag('js', new Date());
gtag('config', ${JSON.stringify(adsId)});
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(${JSON.stringify(adsId)});
document.head.appendChild(s);
`;
