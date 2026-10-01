"use client";

import React from "react";
import { Lock, Zap, PhoneCall, Mail, MapPin, Clock } from "lucide-react";
import { BRAND, disclosure } from "@/lib/brand";

interface FooterProps {
  lang: "fr" | "en";
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-28 md:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Capital<span className="text-emerald-400 font-light">Facile</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === "fr"
                ? "Nous aidons les PME canadiennes refusées par la banque à trouver du financement basé sur leurs revenus."
                : "We help Canadian small businesses that were turned down by their bank find revenue-based funding."}
            </p>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              {lang === "fr" ? "Nous joindre" : "Contact"}
            </span>
            <div className="space-y-2 text-xs">
              <a href={`tel:${BRAND.phoneE164}`} className="flex items-center gap-2 hover:text-white">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-semibold">{BRAND.phoneDisplay}</span>
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">{BRAND.email}</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === "fr" ? BRAND.hoursFr : BRAND.hoursEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === "fr" ? "La Prairie (Québec) · partout au Canada" : "La Prairie, Quebec · serving all of Canada"}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Privacy */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              {lang === "fr" ? "Confidentialité" : "Privacy"}
            </span>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === "fr" ? "Vos renseignements sont protégés" : "Your information is protected"}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {lang === "fr"
                  ? `Vos renseignements servent uniquement à évaluer votre demande et à la transmettre au bailleur de fonds, avec votre consentement (Loi 25). Responsable de la protection des renseignements personnels : ${BRAND.founder}, ${BRAND.email}.`
                  : `Your information is used only to assess your request and submit it to the funder, with your consent (Quebec Law 25). Privacy officer: ${BRAND.founder}, ${BRAND.email}.`}
              </p>
              <a href="/confidentialite" className="text-[11px] text-emerald-400 underline block">
                {lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-slate-900 pt-8 space-y-4 text-[11px] text-slate-500">
          <p className="text-[10px] leading-relaxed max-w-4xl">{disclosure(lang)}</p>
          <p>
            © {new Date().getFullYear()} {BRAND.legalName} ({BRAND.name}) — NEQ {BRAND.neq}.{" "}
            {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}
          </p>
        </div>

      </div>
    </footer>
  );
};
