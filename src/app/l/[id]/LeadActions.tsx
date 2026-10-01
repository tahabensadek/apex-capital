"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { feeOn, money } from "@/lib/brand";
import { STATUS_LABELS, type LeadRecord, type LeadStatus } from "@/lib/leadTypes";

const STATUS_BUTTONS: LeadStatus[] = ["NO_ANSWER", "NOT_A_FIT", "MANDATE_SENT", "SUBMITTED", "FUNDED", "LOST"];

const formatPhone = (e164: string) => {
  const d = e164.replace(/\D/g, "").slice(-10);
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : e164;
};

const elapsed = (fromIso: string, to: number) => {
  const mins = Math.max(0, Math.floor((to - Date.parse(fromIso)) / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  return h < 48 ? `${h} h ${mins % 60} min` : `${Math.floor(h / 24)} j`;
};

export function LeadActions({ initialLead, sig }: { initialLead: LeadRecord; sig: string }) {
  const [lead, setLead] = useState(initialLead);
  const [now, setNow] = useState(() => Date.now());
  const [fundedAmount, setFundedAmount] = useState<string>(String(initialLead.fundedAmount ?? initialLead.amount));
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const post = async (payload: Record<string, unknown>, keepalive = false) => {
    setError("");
    const res = await fetch(`/api/l/${encodeURIComponent(lead.id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ k: sig, ...payload }),
      keepalive,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error === "funded_amount_required" ? "Entrez le montant financé." : "Erreur, réessayez.");
      return;
    }
    if (data.lead) setLead(data.lead);
  };

  const call = () => {
    // keepalive lets the request finish while the phone app takes over.
    void post({ action: "call" }, true);
    window.location.href = `tel:${lead.phone}`;
  };

  const minsToCall = lead.firstCalledAt
    ? Math.round((Date.parse(lead.firstCalledAt) - Date.parse(lead.createdAt)) / 60000)
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">{lead.id}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> reçu il y a {elapsed(lead.createdAt, now)}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black">{lead.businessName}</h1>
          <p className="text-slate-300">{lead.ownerName}</p>
        </div>

        {minsToCall === null ? (
          <button
            type="button"
            onClick={call}
            className="w-full py-5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Phone className="w-6 h-6" /> Appeler {formatPhone(lead.phone)}
          </button>
        ) : (
          <div className="space-y-2">
            <div
              className={`rounded-2xl p-3 text-sm font-bold flex items-center gap-2 ${
                minsToCall <= 5 ? "bg-emerald-950 text-emerald-300" : minsToCall <= 30 ? "bg-amber-950 text-amber-300" : "bg-rose-950 text-rose-300"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Rappelé en {minsToCall} min{lead.createdInBusinessHours ? "" : " (reçu hors heures)"} · {lead.callAttempts} appel
              {lead.callAttempts > 1 ? "s" : ""}
            </div>
            <button
              type="button"
              onClick={call}
              className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Rappeler {formatPhone(lead.phone)}
            </button>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-sm grid grid-cols-2 gap-y-2">
          <span className="text-slate-400">Demande</span>
          <span className="font-bold text-right">{money(lead.amount, "fr")}</span>
          <span className="text-slate-400">Revenus / mois</span>
          <span className="text-right">{lead.monthlyRevenueLabel || "?"}</span>
          <span className="text-slate-400">En affaires</span>
          <span className="text-right">{lead.timeInBusiness || "?"}</span>
          <span className="text-slate-400">NSF (3 mois)</span>
          <span className="text-right">{lead.nsfCount || "?"}</span>
          <span className="text-slate-400">Avance en cours</span>
          <span className={`text-right ${lead.existingAdvance ? "text-amber-300 font-bold" : ""}`}>{lead.existingAdvance ? "Oui" : "Non"}</span>
          <span className="text-slate-400">Utilisation</span>
          <span className="text-right">{lead.purpose || "?"}</span>
          <span className="text-slate-400">Secteur / province</span>
          <span className="text-right">{[lead.sector, lead.province].filter(Boolean).join(" · ") || "?"}</span>
          <span className="text-slate-400">Langue</span>
          <span className="text-right">{lead.lang.toUpperCase()}</span>
        </div>

        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-emerald-400">
          <Mail className="w-4 h-4" /> {lead.email}
        </a>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
          <p className="text-xs text-slate-400">
            Statut : <span className="font-bold text-white">{STATUS_LABELS[lead.status]}</span>
            {lead.status === "FUNDED" && lead.fundedAmount
              ? ` · ${money(lead.fundedAmount, "fr")} (honoraires ${money(feeOn(lead.fundedAmount), "fr")})`
              : ""}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_BUTTONS.filter((s) => s !== "FUNDED").map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => post({ action: "status", status: s })}
                className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  lead.status === s ? "bg-emerald-500 text-slate-950 border-emerald-500" : "border-slate-700 text-slate-200"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={fundedAmount}
              onChange={(e) => setFundedAmount(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm"
              aria-label="Montant financé"
            />
            <button
              type="button"
              onClick={() => post({ action: "status", status: "FUNDED", fundedAmount: Number(fundedAmount) })}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer"
            >
              Financé
            </button>
          </div>
          {error && <p className="text-xs text-rose-300">{error}</p>}
        </div>
      </div>
    </main>
  );
}
