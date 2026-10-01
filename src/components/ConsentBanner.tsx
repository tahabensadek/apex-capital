"use client";

import React, { useSyncExternalStore } from "react";
import { CONSENT_STORAGE_KEY, GOOGLE_ADS_ID, updateConsent } from "@/lib/ads";

interface ConsentBannerProps {
  lang: "fr" | "en";
}

const listeners = new Set<() => void>();
const readChoice = () => {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return "unavailable";
  }
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

/** Cookie consent for Google Ads measurement. Hidden when no Ads tag is configured. */
export const ConsentBanner: React.FC<ConsentBannerProps> = ({ lang }) => {
  // "pending" on the server so the banner never flashes before we know the saved choice.
  const choice = useSyncExternalStore(subscribe, readChoice, () => "pending");

  if (!GOOGLE_ADS_ID || choice !== null) return null;

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // Storage blocked: apply for this page view only.
    }
    updateConsent(granted);
    listeners.forEach((l) => l());
  };

  const fr = lang === "fr";
  return (
    <div
      role="dialog"
      aria-label={fr ? "Témoins (cookies)" : "Cookies"}
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl text-xs text-slate-300"
    >
      <p className="mb-3 leading-relaxed">
        {fr
          ? "On utilise des témoins de Google Ads pour mesurer l'efficacité de nos publicités. Ils sont désactivés tant que vous ne les acceptez pas. "
          : "We use Google Ads cookies to measure how well our ads work. They stay off unless you accept them. "}
        <a href="/confidentialite" className="underline text-emerald-400">
          {fr ? "Politique de confidentialité" : "Privacy policy"}
        </a>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => decide(false)}
          className="flex-1 py-2 rounded-xl border border-slate-600 text-slate-200 font-bold cursor-pointer hover:bg-slate-800"
        >
          {fr ? "Refuser" : "Decline"}
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer hover:bg-emerald-400"
        >
          {fr ? "Accepter" : "Accept"}
        </button>
      </div>
    </div>
  );
};
