import { feeOn } from "@/lib/brand";
import { listLeads } from "@/lib/leadStore";

export const dynamic = "force-dynamic";

/**
 * Funded deals in Google Ads' offline-conversion CSV format, so Ads learns which clicks
 * became funded clients (not just form fills). In Google Ads: Goals > Conversions >
 * Uploads, using a conversion action whose name matches GOOGLE_ADS_FUNDED_CONVERSION_NAME.
 * Value = the 6% success fee on the funded amount.
 */
const formatTime = (iso: string) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value])
  );
  return `${p.year}-${p.month}-${p.day} ${p.hour === "24" ? "00" : p.hour}:${p.minute}:${p.second}`;
};

const csv = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export async function GET() {
  const name = process.env.GOOGLE_ADS_FUNDED_CONVERSION_NAME || "Funded deal";
  const rows = (await listLeads(5000)).filter(
    (l) => l.status === "FUNDED" && l.fundedAmount && l.fundedAt && l.attribution?.gclid
  );
  const lines = [
    "Parameters:TimeZone=America/Toronto",
    "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency",
    ...rows.map((l) =>
      [csv(l.attribution.gclid!), csv(name), csv(formatTime(l.fundedAt!)), feeOn(l.fundedAmount!), "CAD"].join(",")
    ),
  ];
  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="capitalfacile-funded-conversions.csv"',
      "Cache-Control": "no-store",
    },
  });
}
