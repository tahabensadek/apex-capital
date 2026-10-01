import type { Metadata } from "next";
import Link from "next/link";
import { feeOn, money } from "@/lib/brand";
import { leadLinkPath } from "@/lib/leadLink";
import { STATUS_LABELS, hasDurableStore, listLeads, minutesToCall, type LeadRecord } from "@/lib/leadStore";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads — CapitalFacile", robots: { index: false, follow: false } };

const median = (xs: number[]) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const speedClass = (m: number | null) =>
  m === null ? "text-slate-500" : m <= 5 ? "text-emerald-400" : m <= 30 ? "text-amber-400" : "text-rose-400";

function stats(leads: LeadRecord[]) {
  const since = Date.now() - 30 * 24 * 3600 * 1000;
  const recent = leads.filter((l) => Date.parse(l.createdAt) >= since);
  const inHours = recent.filter((l) => l.createdInBusinessHours);
  const inHoursTimes = inHours.map(minutesToCall).filter((m): m is number => m !== null);
  const funded = recent.filter((l) => l.status === "FUNDED" && l.fundedAmount);
  const fundedVolume = funded.reduce((sum, l) => sum + (l.fundedAmount || 0), 0);
  return {
    leads: recent.length,
    within5: inHours.length ? inHoursTimes.filter((m) => m <= 5).length / inHours.length : null,
    medianMins: median(inHoursTimes),
    notCalled: recent.filter((l) => !l.firstCalledAt).length,
    funded: funded.length,
    fundedRate: recent.length ? funded.length / recent.length : null,
    fundedVolume,
    fees: funded.reduce((sum, l) => sum + feeOn(l.fundedAmount || 0), 0),
  };
}

export default async function LeadsPage() {
  const leads = await listLeads(500);
  const s = stats(leads);
  const pct = (x: number | null) => (x === null ? "—" : `${Math.round(x * 100)} %`);

  const tiles = [
    { label: "Leads (30 j)", value: String(s.leads) },
    { label: "Rappelés en ≤ 5 min*", value: pct(s.within5) },
    { label: "Délai médian*", value: s.medianMins === null ? "—" : `${Math.round(s.medianMins)} min` },
    { label: "Jamais appelés", value: String(s.notCalled) },
    { label: "Financés", value: `${s.funded} (${pct(s.fundedRate)})` },
    { label: "Volume financé", value: money(s.fundedVolume, "fr") },
    { label: "Honoraires 6 % estimés", value: money(s.fees, "fr") },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black">Leads CapitalFacile</h1>
          <a href="/api/leads/google-ads-conversions" className="text-xs px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-900">
            Exporter les financés pour Google Ads (CSV)
          </a>
        </div>

        {!hasDurableStore && (
          <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
            Stockage local (fichier). En production sur Vercel, ajoutez Upstash Redis (Storage) sinon les leads ne sont pas conservés ici.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
              <div className="text-[11px] text-slate-400">{t.label}</div>
              <div className="text-lg font-black">{t.value}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">* Leads reçus pendant les heures d&apos;ouverture seulement (lun–ven, 8 h–18 h HE).</p>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400 text-xs">
              <tr>
                <th className="text-left p-3">Reçu</th>
                <th className="text-left p-3">Entreprise</th>
                <th className="text-left p-3">Contact</th>
                <th className="text-right p-3">Demande</th>
                <th className="text-left p-3">Prov.</th>
                <th className="text-right p-3">Rappel</th>
                <th className="text-left p-3">Statut</th>
                <th className="text-left p-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((l) => {
                const m = minutesToCall(l);
                return (
                  <tr key={l.id} className="hover:bg-slate-900/60">
                    <td className="p-3 whitespace-nowrap text-slate-300">{fmtDate(l.createdAt)}</td>
                    <td className="p-3">
                      <Link href={leadLinkPath(l.id)} className="font-bold text-emerald-400 hover:underline">
                        {l.businessName}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-300">{l.ownerName}</td>
                    <td className="p-3 text-right">{money(l.amount, "fr")}</td>
                    <td className="p-3">{l.province}</td>
                    <td className={`p-3 text-right font-bold ${speedClass(m)}`}>
                      {m === null ? "—" : `${Math.round(m)} min`}
                      {!l.createdInBusinessHours && <span className="text-slate-500 font-normal"> (hors h.)</span>}
                    </td>
                    <td className="p-3">
                      {STATUS_LABELS[l.status]}
                      {l.status === "FUNDED" && l.fundedAmount ? ` · ${money(l.fundedAmount, "fr")}` : ""}
                    </td>
                    <td className="p-3 text-xs text-slate-400">
                      {l.attribution?.gclid ? "Google Ads" : l.attribution?.utm_source || "Direct"}
                    </td>
                  </tr>
                );
              })}
              {!leads.length && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    Aucun lead pour l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
