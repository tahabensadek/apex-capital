"use client";

import React from "react";
import { Shield, Lock, Zap, PhoneCall, Mail, MapPin } from "lucide-react";

interface FooterProps {
  lang: "fr" | "en";
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                APEX <span className="text-emerald-400 font-light">CAPITAL</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === "fr"
                ? "Bureau de courtage et d'origination financière commerciale pour les PME et travailleurs autonomes à travers le Canada."
                : "Commercial financial advisory and loan origination desk serving small-to-medium Canadian enterprises nationwide."}
            </p>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              {lang === "fr" ? "Solutions" : "Financing Solutions"}
            </span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>{lang === "fr" ? "Avance de Trésorerie 24H (MCA)" : "24H Cash Flow Advances"}</li>
              <li>{lang === "fr" ? "Financement d'Équipement Lourd" : "Heavy Equipment Leasing"}</li>
              <li>{lang === "fr" ? "Marge de Crédit Commerciale" : "Revolving Line of Credit"}</li>
              <li>{lang === "fr" ? "Affacturage Factures B2B" : "Accounts Receivable Factoring"}</li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              {lang === "fr" ? "Bureau des Opérations" : "Operations Desk"}
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-semibold">(514) 800-APEX / (514) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">direction@apexcapital.ca</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Montréal / Vancouver / Canada-Wide</span>
              </div>
            </div>
          </div>

          {/* Col 4: Institutional Security */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              {lang === "fr" ? "Sécurité & Conformité" : "Security & Standards"}
            </span>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Cryptage SSL Bancaire 256-Bit</span>
              </div>
              <p className="text-[10px] text-slate-500">
                {lang === "fr"
                  ? "Conforme aux normes canadiennes de protection des renseignements personnels (LPRPDE / Flinks Open-Banking)."
                  : "Compliant with Canadian PIPEDA regulations and Flinks open banking security protocols."}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Apex Capital Inc. / 9486-9070 Québec Inc. All Rights Reserved.
          </p>
          <p className="text-[10px] max-w-xl text-center sm:text-right">
            {lang === "fr"
              ? "Apex Capital agit en qualité d'intermédiaire et conseiller en financement commercial. Tous les octrois de crédit sont sujets à l'approbation finale des institutions et bailleurs de fonds partenaires."
              : "Apex Capital acts as a commercial financing intermediary. All funding facilities are subject to final underwriting approval by institutional lender partners."}
          </p>
        </div>

      </div>
    </footer>
  );
};
