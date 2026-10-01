"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PreQualWizard } from "@/components/PreQualWizard";
import { FitSection } from "@/components/FitSection";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { ConsentBanner } from "@/components/ConsentBanner";

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [selectedAmount, setSelectedAmount] = useState<number>(65000);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    const campaign = (params.get("utm_campaign") || "").toLowerCase();
    if (urlLang === "en" || (!urlLang && campaign.includes("_en"))) {
      // One-time read of the URL after hydration (the page is prerendered in French).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang("en");
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
  }, [lang]);

  const scrollToWizard = () => {
    document.getElementById("apply-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleApplyWithAmount = (amt: number) => {
    setSelectedAmount(amt);
    scrollToWizard();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-slate-950">
      <Navbar onApplyClick={scrollToWizard} lang={lang} setLang={setLang} />
      <Hero onApplyClick={scrollToWizard} onApplyWithAmount={handleApplyWithAmount} lang={lang} />
      <HowItWorks lang={lang} />
      <PreQualWizard initialAmount={selectedAmount} onComplete={() => {}} lang={lang} />
      <FitSection onApplyClick={scrollToWizard} lang={lang} />
      <Faq lang={lang} />
      <Footer lang={lang} />
      <StickyMobileBar onApplyClick={scrollToWizard} lang={lang} />
      <ConsentBanner lang={lang} />
    </main>
  );
}
