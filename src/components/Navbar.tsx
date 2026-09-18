"use client";

import React, { useState } from "react";
import { ShieldCheck, PhoneCall, ArrowRight, Zap } from "lucide-react";

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
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              APEX <span className="text-emerald-400 font-light">CAPITAL</span>
            </span>
            <span className="text-[10px] block tracking-widest text-slate-400 uppercase font-semibold">
              Commercial Origination Desk
            </span>
          </div>
        </div>

        {/* Live Underwriting Pulse */}
        <div className="hidden md:flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{lang === "fr" ? "Souscription Directe 24H Active" : "24H Direct Underwriting Active"}</span>
        </div>

        {/* Client Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-300">
          <a href="#solutions" className="hover:text-emerald-400 transition-colors">
            {lang === "fr" ? "Solutions de Crédit" : "Credit Solutions"}
          </a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
            {lang === "fr" ? "Processus 24H" : "24H Process"}
          </a>
          <a href="#apply-wizard" className="hover:text-emerald-400 transition-colors">
            {lang === "fr" ? "Calculateur d'Admissibilité" : "Eligibility Calculator"}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Lang Toggle */}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          {/* Direct Phone Line */}
          <a
            href="tel:5145550199"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-600 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>(514) 800-APEX</span>
          </a>

          {/* Apply Button */}
          <button
            onClick={onApplyClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>{lang === "fr" ? "Obtenir du Capital" : "Get Funded"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
