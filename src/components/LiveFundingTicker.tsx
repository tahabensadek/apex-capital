"use client";

import React, { useState, useEffect } from "react";
import { Zap, CheckCircle2, ShieldCheck } from "lucide-react";

interface LiveFundingTickerProps {
  lang: "fr" | "en";
}

const DEALS_FEED_FR = [
  { amount: "85 000 $", city: "Montréal", sector: "Construction RBQ", timeAgo: "il y a 14 min" },
  { amount: "120 000 $", city: "Québec", sector: "Transport & Fret", timeAgo: "il y a 42 min" },
  { amount: "45 000 $", city: "Laval", sector: "Garage & Pneus", timeAgo: "il y a 1h" },
  { amount: "175 000 $", city: "Gatineau", sector: "Manufacturier", timeAgo: "il y a 2h" },
  { amount: "35 000 $", city: "Brossard", sector: "Clinique Santé", timeAgo: "il y a 3h" },
];

const DEALS_FEED_EN = [
  { amount: "$85,000", city: "Montreal", sector: "General Construction", timeAgo: "14m ago" },
  { amount: "$120,000", city: "Quebec City", sector: "Freight & Transport", timeAgo: "42m ago" },
  { amount: "$45,000", city: "Laval", sector: "Auto Repair Trade", timeAgo: "1h ago" },
  { amount: "$175,000", city: "Ottawa / Gatineau", sector: "Manufacturing", timeAgo: "2h ago" },
  { amount: "$35,000", city: "Brossard", sector: "Healthcare Clinic", timeAgo: "3h ago" },
];

export const LiveFundingTicker: React.FC<LiveFundingTickerProps> = ({ lang }) => {
  const feed = lang === "fr" ? DEALS_FEED_FR : DEALS_FEED_EN;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % feed.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, [feed.length]);

  const currentDeal = feed[currentIndex];

  return (
    <aside aria-label="Live Funding Notifications" className="fixed bottom-16 md:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm pointer-events-none">
      <div
        className={`glass-card bg-slate-950/95 border border-emerald-500/40 rounded-2xl p-3 shadow-2xl transition-all duration-500 glow-emerald flex items-center gap-3 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Zap className="w-4 h-4 fill-emerald-400" />
        </div>
        <div className="text-left overflow-hidden">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>{lang === "fr" ? "Déboursement 24H Récent" : "Recent 24H Wire"}</span>
            <span className="text-slate-500">• {currentDeal.timeAgo}</span>
          </div>
          <p className="text-xs font-black text-white truncate">
            <span className="text-emerald-400">{currentDeal.amount} CAD</span> • {currentDeal.city} ({currentDeal.sector})
          </p>
        </div>
      </div>
    </aside>
  );
};
