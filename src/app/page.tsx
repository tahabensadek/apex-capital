"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SolutionsGrid } from "@/components/SolutionsGrid";
import { PreQualWizard } from "@/components/PreQualWizard";
import { ObjectionSection } from "@/components/ObjectionSection";
import { Testimonials } from "@/components/Testimonials";
import { MandateModal } from "@/components/MandateModal";
import { Footer } from "@/components/Footer";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { LiveFundingTicker } from "@/components/LiveFundingTicker";

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [selectedAmount, setSelectedAmount] = useState<number>(65000);
  const [selectedProduct, setSelectedProduct] = useState<string>("24H Cash Flow Financing");
  const [isMandateOpen, setIsMandateOpen] = useState<boolean>(false);
  const [currentLeadData, setCurrentLeadData] = useState<any>({});

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      const campaign = params.get("utm_campaign") || "";
      if (urlLang === "en" || campaign.toLowerCase().includes("en")) {
        setLang("en");
      } else if (urlLang === "fr" || campaign.toLowerCase().includes("fr")) {
        setLang("fr");
      }
    }
  }, []);

  const scrollToWizard = () => {
    const el = document.getElementById("apply-wizard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleApplyWithAmount = (amt: number) => {
    setSelectedAmount(amt);
    scrollToWizard();
  };

  const handleSelectSolution = (solutionTitle: string) => {
    setSelectedProduct(solutionTitle);
    scrollToWizard();
  };

  const handleOpenMandate = (leadData: any) => {
    setCurrentLeadData(leadData);
    setIsMandateOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-slate-950">
      {/* Fixed Luxury Navbar */}
      <Navbar onApplyClick={scrollToWizard} lang={lang} setLang={setLang} />

      {/* Hero with Embedded Calculator */}
      <Hero
        onApplyClick={scrollToWizard}
        onApplyWithAmount={handleApplyWithAmount}
        lang={lang}
      />

      {/* Solutions Grid */}
      <SolutionsGrid onSelectSolution={handleSelectSolution} lang={lang} />

      {/* Interactive 60s Pre-Qual Wizard */}
      <PreQualWizard
        initialAmount={selectedAmount}
        initialProduct={selectedProduct}
        onComplete={(lead) => setCurrentLeadData(lead)}
        onOpenMandate={handleOpenMandate}
        lang={lang}
      />

      {/* Objection / Market Reality Section */}
      <ObjectionSection onApplyClick={scrollToWizard} lang={lang} />

      {/* Verified Testimonials */}
      <Testimonials lang={lang} />

      {/* Institutional Compliance Footer */}
      <Footer lang={lang} />

      {/* Live Social Proof Deals Ticker */}
      <LiveFundingTicker lang={lang} />

      {/* Sticky Mobile Conversion Action Bar */}
      <StickyMobileBar onApplyClick={scrollToWizard} lang={lang} />

      {/* 1-Click Mandate E-Signature Modal */}
      <MandateModal
        isOpen={isMandateOpen}
        onClose={() => setIsMandateOpen(false)}
        leadData={currentLeadData}
        lang={lang}
      />
    </main>
  );
}
