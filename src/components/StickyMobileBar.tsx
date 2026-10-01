"use client";

import React from "react";
import { PhoneCall, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";

interface StickyMobileBarProps {
  onApplyClick: () => void;
  lang: "fr" | "en";
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onApplyClick, lang }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-950/90 backdrop-blur-xl border-t border-emerald-500/30 md:hidden shadow-2xl">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href={`tel:${BRAND.phoneE164}`}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0 hover:bg-slate-800 transition-colors"
          aria-label={lang === "fr" ? `Appeler ${BRAND.name}` : `Call ${BRAND.name}`}
        >
          <PhoneCall className="w-5 h-5" />
        </a>

        <button
          type="button"
          onClick={onApplyClick}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
        >
          <span>{lang === "fr" ? "Vérifier mon admissibilité" : "Check My Eligibility"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
