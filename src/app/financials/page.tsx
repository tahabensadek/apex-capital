"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  Building2, 
  PieChart, 
  ArrowUpRight, 
  Download, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  RefreshCw,
  Wallet,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

export default function FinancialModelPage() {
  // --- Realistic Dynamic Model Variables ---
  const [startingCapital, setStartingCapital] = useState<number>(10000);
  const [baseCostToFund, setBaseCostToFund] = useState<number>(1000);
  const [monthlySpendExpansion, setMonthlySpendExpansion] = useState<number>(2500);
  const [cacDriftPerMonth, setCacDriftPerMonth] = useState<number>(50);
  const [avgFacilitySize, setAvgFacilitySize] = useState<number>(55000);
  const [brokerFeePct, setBrokerFeePct] = useState<number>(7.0);
  const [monthlyDealCapacity, setMonthlyDealCapacity] = useState<number>(20);
  
  // Startup Immobilization / Setup Costs (CapEx)
  const [incorpLegalCost, setIncorpLegalCost] = useState<number>(1250);
  const [contractLegalReserve, setContractLegalReserve] = useState<number>(1500);
  const [eoInsuranceAnnual, setEoInsuranceAnnual] = useState<number>(1800);
  const [leaseDeposit, setLeaseDeposit] = useState<number>(350);
  const [hardwareSetup, setHardwareSetup] = useState<number>(1500);
  const [bankingFloat, setBankingFloat] = useState<number>(1000);

  // Ongoing Monthly Fixed SG&A
  const [officeRent, setOfficeRent] = useState<number>(175);
  const [telephonySms, setTelephonySms] = useState<number>(180);
  const [cloudHosting, setCloudHosting] = useState<number>(95);
  const [cpaBookkeeping, setCpaBookkeeping] = useState<number>(650);
  const [insuranceAmort, setInsuranceAmort] = useState<number>(150);
  const [businessSoftware, setBusinessSoftware] = useState<number>(150);

  // Variable Fulfillment Costs Per Deal
  const [plaidApiPerDeal, setPlaidApiPerDeal] = useState<number>(45);
  const [padProcessingPerDeal, setPadProcessingPerDeal] = useState<number>(35);
  const [esignPerDeal, setEsignPerDeal] = useState<number>(10);

  // --- Calculations ---
  const totalStartupImmobilization = useMemo(() => {
    return incorpLegalCost + contractLegalReserve + eoInsuranceAnnual + leaseDeposit + hardwareSetup + bankingFloat;
  }, [incorpLegalCost, contractLegalReserve, eoInsuranceAnnual, leaseDeposit, hardwareSetup, bankingFloat]);

  const totalMonthlyFixedOpex = useMemo(() => {
    return officeRent + telephonySms + cloudHosting + cpaBookkeeping + insuranceAmort + businessSoftware;
  }, [officeRent, telephonySms, cloudHosting, cpaBookkeeping, insuranceAmort, businessSoftware]);

  const totalVarCostPerDeal = useMemo(() => {
    return plaidApiPerDeal + padProcessingPerDeal + esignPerDeal;
  }, [plaidApiPerDeal, padProcessingPerDeal, esignPerDeal]);

  const feePerDeal = useMemo(() => {
    return avgFacilitySize * (brokerFeePct / 100);
  }, [avgFacilitySize, brokerFeePct]);

  const sixMonthSchedule = useMemo(() => {
    let cumRetained = 0;
    let cumRevenue = 0;
    let cumTotalProfit = 0;
    let cumVolume = 0;
    const months = [];

    for (let m = 1; m <= 6; m++) {
      const currentAdSpend = startingCapital + (m - 1) * monthlySpendExpansion;
      const effectiveCac = baseCostToFund + (m - 1) * cacDriftPerMonth;
      
      const uncappedDeals = Math.floor(currentAdSpend / (effectiveCac || 1));
      const fundedDeals = Math.min(monthlyDealCapacity, uncappedDeals);
      
      const loanVolume = fundedDeals * avgFacilitySize;
      const grossRevenue = fundedDeals * feePerDeal;
      const varOpex = fundedDeals * totalVarCostPerDeal;
      const totalOpex = totalMonthlyFixedOpex + varOpex;
      const totalExpenses = currentAdSpend + totalOpex;
      const netProfit = grossRevenue - totalExpenses;
      
      cumRetained += netProfit;
      cumRevenue += grossRevenue;
      cumTotalProfit += netProfit;
      cumVolume += loanVolume;

      months.push({
        month: m,
        adSpend: currentAdSpend,
        effectiveCac,
        fundedDeals,
        loanVolume,
        grossRevenue,
        fixedOpex: totalMonthlyFixedOpex,
        varOpex,
        totalOpex,
        totalExpenses,
        netProfit,
        profitMargin: grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0,
        cumRetained
      });
    }
    return { months, cumRetained, cumRevenue, cumTotalProfit, cumVolume };
  }, [
    startingCapital, 
    baseCostToFund, 
    monthlySpendExpansion,
    cacDriftPerMonth,
    monthlyDealCapacity,
    avgFacilitySize, 
    feePerDeal, 
    totalVarCostPerDeal, 
    totalMonthlyFixedOpex
  ]);

  const porscheGoalTarget = 240000;
  const porscheProgress = Math.min(100, Math.round((sixMonthSchedule.cumRetained / porscheGoalTarget) * 100));

  const exportCSV = () => {
    const headers = [
      "Month",
      "Ad Spend ($)",
      "Effective CAC ($)",
      "Funded Deals",
      "Originated Volume ($)",
      "Gross Brokerage Revenue ($)",
      "Fixed SG&A ($)",
      "Variable Ops ($)",
      "Total OpEx ($)",
      "Net Take-Home Profit ($)",
      "Cumulative Cash Banked ($)"
    ];

    const rows = sixMonthSchedule.months.map(r => [
      `Month ${r.month}`,
      r.adSpend.toFixed(2),
      r.effectiveCac.toFixed(2),
      r.fundedDeals,
      r.loanVolume.toFixed(2),
      r.grossRevenue.toFixed(2),
      r.fixedOpex.toFixed(2),
      r.varOpex.toFixed(2),
      r.totalOpex.toFixed(2),
      r.netProfit.toFixed(2),
      r.cumRetained.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_capital_realistic_financial_model.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-400 to-teal-400 flex items-center justify-center font-black text-black shadow-lg shadow-emerald-500/20">
                A
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                APEX CAPITAL
              </span>
            </Link>
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Realistic Brokerage Model (~$4.7M Disbursed)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/crm"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              Trading CRM
            </Link>
            <Link
              href="/board"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              War Room
            </Link>
            <button
              onClick={exportCSV}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Audit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Realistic Solo/Boutique Brokerage Trajectory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              6-Month Capacity-Constrained Financial Plan
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Calibrated on real Canadian B2B merchant bridge lending: <span className="text-slate-200 font-semibold">10 to 18 funded deals/month</span> ($550k–$1.0M/mo volume), 
              realistic CAC growth curve ($1,000 → $1,250), and direct 7.0% mandate fee collection via PAD.
            </p>
          </div>

          {/* Porsche Progress Card */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center space-x-4 min-w-[260px]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              🏎️
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Porsche Net Reserve</span>
                <span className="text-amber-400">{porscheProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, porscheProgress)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                ${Math.round(sixMonthSchedule.cumRetained).toLocaleString()} CAD Retained / $240,000 CAD Target
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
            <div className="flex justify-between items-start text-slate-400 text-xs font-mono uppercase">
              <span>6-Mo Disbursed Volume</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              ${(sixMonthSchedule.cumVolume / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Realistic total capital disbursed (86 deals)
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
            <div className="flex justify-between items-start text-slate-400 text-xs font-mono uppercase">
              <span>Gross Fee Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              ${Math.round(sixMonthSchedule.cumRevenue).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              7.0% Mandate fee collected upon wire
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
            <div className="flex justify-between items-start text-slate-400 text-xs font-mono uppercase">
              <span>Total Retained Bank Cash</span>
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2">
              ${Math.round(sixMonthSchedule.cumRetained).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Net cash in bank after all ads & expenses
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
            <div className="flex justify-between items-start text-slate-400 text-xs font-mono uppercase">
              <span>Month 6 Run Rate Profit</span>
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              ${Math.round(sixMonthSchedule.months[5]?.netProfit || 0).toLocaleString()}
              <span className="text-xs text-slate-400 font-normal"> /mo</span>
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{Math.round(sixMonthSchedule.months[5]?.profitMargin || 0)}% Operating Margin</span>
            </div>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Core Drivers & Operational Ceiling */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Realistic Constraints</h3>
              </div>
              <button
                onClick={() => {
                  setStartingCapital(10000);
                  setBaseCostToFund(1000);
                  setMonthlySpendExpansion(2500);
                  setCacDriftPerMonth(50);
                  setAvgFacilitySize(55000);
                  setBrokerFeePct(8.0);
                  setMonthlyDealCapacity(20);
                }}
                className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Average Advance Size */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Average Advance Size</span>
                <span className="font-mono font-bold text-white">${avgFacilitySize.toLocaleString()} CAD</span>
              </div>
              <input
                type="range"
                min="30000"
                max="100000"
                step="5000"
                value={avgFacilitySize}
                onChange={(e) => setAvgFacilitySize(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Starting Ad Spend */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Month 1 Ad Spend</span>
                <span className="font-mono font-bold text-emerald-400">${startingCapital.toLocaleString()} CAD</span>
              </div>
              <input
                type="range"
                min="5000"
                max="20000"
                step="1000"
                value={startingCapital}
                onChange={(e) => setStartingCapital(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Monthly Budget Expansion Step */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Ad Budget Growth Step</span>
                <span className="font-mono font-bold text-teal-400">+${monthlySpendExpansion.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={monthlySpendExpansion}
                onChange={(e) => setMonthlySpendExpansion(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            {/* Base CAC */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Base Cost to Fund (CAC)</span>
                <span className="font-mono font-bold text-amber-400">${baseCostToFund.toLocaleString()} CAD</span>
              </div>
              <input
                type="range"
                min="600"
                max="2000"
                step="50"
                value={baseCostToFund}
                onChange={(e) => setBaseCostToFund(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Solo Broker Deal Capacity Cap */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Solo Broker Processing Cap</span>
                <span className="font-mono font-bold text-purple-400">{monthlyDealCapacity} Deals / Month</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={monthlyDealCapacity}
                onChange={(e) => setMonthlyDealCapacity(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Card 2: Initial Startup Immobilization */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Startup Immobilization</h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ${totalStartupImmobilization.toLocaleString()} Total
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <span className="text-slate-300">Federal/Provincial Incorp (REQ) + Minute Book</span>
                <span className="font-mono font-bold text-slate-200">${incorpLegalCost}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <span className="text-slate-300">Commercial Contract Retainer (Mandate & PAD)</span>
                <span className="font-mono font-bold text-slate-200">${contractLegalReserve}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <span className="text-slate-300">E&O Brokerage Liability Insurance (Annual)</span>
                <span className="font-mono font-bold text-slate-200">${eoInsuranceAnnual}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <span className="text-slate-300">Regus Quartier DIX30 Office Deposit</span>
                <span className="font-mono font-bold text-slate-200">${leaseDeposit}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <span className="text-slate-300">Workstation & Odin Hardware Terminal</span>
                <span className="font-mono font-bold text-slate-200">${hardwareSetup}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-800/80">
                <span className="text-slate-300">Corporate Bank Operating Reserve</span>
                <span className="font-mono font-bold text-slate-200">${bankingFloat}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Monthly Fixed SG&A & Unit Fulfillment */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recurring SG&A & COGS</h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                ${totalMonthlyFixedOpex.toLocaleString()}/mo Fixed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Regus DIX30 Office & Mail Handling</span>
                <span className="font-mono text-slate-200 font-bold">${officeRent}/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">CPA Monthly Bookkeeping & Tax Prep</span>
                <span className="font-mono text-slate-200 font-bold">${cpaBookkeeping}/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Telephony & SMS 10DLC (Twilio/Dialpad)</span>
                <span className="font-mono text-slate-200 font-bold">${telephonySms}/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cloud Infra (Vercel, Supabase, Cloudflare)</span>
                <span className="font-mono text-slate-200 font-bold">${cloudHosting}/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">E&O Insurance Amortization & G-Suite</span>
                <span className="font-mono text-slate-200 font-bold">${insuranceAmort + businessSoftware}/mo</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Variable Fulfillment (${totalVarCostPerDeal}/funded deal):
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Plaid / Flinks</div>
                  <div className="text-emerald-400 font-bold">${plaidApiPerDeal}</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">PAD / EFT</div>
                  <div className="text-emerald-400 font-bold">${padProcessingPerDeal}</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">e-Signature</div>
                  <div className="text-emerald-400 font-bold">${esignPerDeal}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Month Realistic Income Statement Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Realistic 6-Month Compounding Income Statement</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total 6-Month Volume: <strong className="text-white">${(sixMonthSchedule.cumVolume / 1000000).toFixed(2)}M CAD</strong> across 86 packaged files.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">LibreOffice File:</span>
              <span className="text-amber-400 font-bold">Apex_Capital_Financial_Model_Accountant.ods</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Period</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Ad Spend</th>
                  <th className="py-3.5 px-3 font-semibold text-right">CAC</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Funded Deals</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Disbursed Volume</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Gross Revenue (8%)</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Misc OpEx</th>
                  <th className="py-3.5 px-3 font-semibold text-right text-emerald-400">Net Monthly Profit</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-amber-400">Cumulative Bank Cash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {sixMonthSchedule.months.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                      <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] text-slate-300">
                        M{row.month}
                      </span>
                      <span>Month {row.month}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      ${Math.round(row.adSpend).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right text-amber-400">
                      ${Math.round(row.effectiveCac).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {row.fundedDeals} deals
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      ${(row.loanVolume / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-100">
                      ${Math.round(row.grossRevenue).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      ${Math.round(row.totalOpex).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                      ${Math.round(row.netProfit).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-amber-400 text-sm">
                      ${Math.round(row.cumRetained).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 font-mono font-bold text-xs border-t-2 border-slate-700">
                <tr>
                  <td className="py-4 px-4 text-white uppercase">6-Month Totals</td>
                  <td className="py-4 px-3 text-right text-slate-300">
                    ${Math.round(sixMonthSchedule.months.reduce((a, b) => a + b.adSpend, 0)).toLocaleString()}
                  </td>
                  <td className="py-4 px-3 text-right text-amber-400">
                    ~${Math.round(sixMonthSchedule.months.reduce((a, b) => a + b.effectiveCac, 0) / 6)} avg
                  </td>
                  <td className="py-4 px-3 text-center text-emerald-400">
                    {sixMonthSchedule.months.reduce((a, b) => a + b.fundedDeals, 0)} Deals
                  </td>
                  <td className="py-4 px-3 text-right text-slate-200">
                    ${(sixMonthSchedule.cumVolume / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-4 px-3 text-right text-emerald-400">
                    ${Math.round(sixMonthSchedule.cumRevenue).toLocaleString()}
                  </td>
                  <td className="py-4 px-3 text-right text-slate-400">
                    ${Math.round(sixMonthSchedule.months.reduce((a, b) => a + b.totalOpex, 0)).toLocaleString()}
                  </td>
                  <td className="py-4 px-3 text-right text-emerald-400 text-sm">
                    ${Math.round(sixMonthSchedule.cumTotalProfit).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right text-amber-400 text-base font-black">
                    ${Math.round(sixMonthSchedule.cumRetained).toLocaleString()} CAD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
