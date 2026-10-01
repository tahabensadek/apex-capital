"use client";

import React from "react";
import { PhoneCall, ArrowRight, Zap } from "lucide-react";
import { BRAND } from "@/lib/brand";

interface NavbarProps {
  onApplyClick: () => void;
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, lang, setLang }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] glow-emerald">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center">
              Capital<span className="text-emerald-400 font-light">Facile</span>
            </span>
            <span className="text-[10px] block tracking-widest text-slate-400 uppercase font-semibold">
              {lang === "fr" ? "Financement d'entreprise" : "Business Funding"}
            </span>
          </div>
        </div>

        {/* Client Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-300">
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
            {lang === "fr" ? "Comment ça marche" : "How It Works"}
          </a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">
            {lang === "fr" ? "Questions fréquentes" : "FAQ"}
          </a>
          <a href="#apply-wizard" className="hover:text-emerald-400 transition-colors">
            {lang === "fr" ? "Faire une demande" : "Apply"}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            aria-label={lang === "fr" ? "Switch to English" : "Passer au français"}
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          <a
            href={`tel:${BRAND.phoneE164}`}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-600 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>{BRAND.phoneDisplay}</span>
          </a>

          <button
            onClick={onApplyClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>{lang === "fr" ? "Faire une demande" : "Apply Now"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
