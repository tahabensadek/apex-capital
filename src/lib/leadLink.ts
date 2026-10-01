import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed one-tap links (sent in the admin SMS) to a lead's page. The signature means
 * the page can skip the admin password without exposing client data to anyone who
 * guesses a lead id. Set LEAD_LINK_SECRET to a long random string in production.
 */
const secret = () =>
  process.env.LEAD_LINK_SECRET || (process.env.NODE_ENV !== "production" ? "dev-only-lead-link-secret" : "");

export const hasLeadLinkSecret = () => Boolean(secret());

export const signLeadId = (id: string) =>
  createHmac("sha256", secret()).update(id).digest("base64url").slice(0, 24);

export const verifyLeadSignature = (id: string, sig: string | null | undefined) => {
  if (!secret() || !sig) return false;
  const expected = Buffer.from(signLeadId(id));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
};

export const leadLinkPath = (id: string) => `/l/${encodeURIComponent(id)}?k=${signLeadId(id)}`;
