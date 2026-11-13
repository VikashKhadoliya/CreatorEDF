"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Code2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Landmark,
  FileText,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

const BANKS_LIST = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India (SBI)",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Other Authorised Dealer (AD) Bank",
];

export function FindNextStepWizard() {
  const [step, setStep] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Form State
  const [entityType, setEntityType] = useState("resident_individual");
  const [exportCategory, setExportCategory] = useState("non_software");
  const [paymentStatus, setPaymentStatus] = useState("received");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const resetWizard = () => {
    setStep(1);
    setEntityType("resident_individual");
    setExportCategory("non_software");
    setPaymentStatus("received");
    setSelectedBank("HDFC Bank");
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Generate Bank Questions
  const getBankQuestions = () => {
    const isSoftware = exportCategory === "software";
    const isIndividual = entityType === "resident_individual";

    const questions = [
      {
        q: "Inward Remittance Disposal Process",
        text: `What is ${selectedBank}'s preferred mode (netbanking portal, email, or physical form) for submitting foreign remittance disposal instructions and purpose code?`,
      },
      {
        q: "Deemed Submission & EDF Annexure Requirement",
        text: isIndividual
          ? `As a resident individual exporting digital ${isSoftware ? "software" : "content/services"}, does ${selectedBank} treat this as deemed submission upon purpose code declaration, or do you require a signed Form EDF Annexure?`
          : `For our business export remittance, do you require a physical/scanned Form EDF Annexure or is electronic purpose code disposal sufficient?`,
      },
      {
        q: isSoftware ? "STPI / SOFTEX Requirement" : "Purpose Code Classification",
        text: isSoftware
          ? `Does ${selectedBank} require an STPI SOFTEX registration number for this software export payout, or does your branch process it directly under AD bank authority?`
          : `Can you confirm the recommended purpose code for this remittance (e.g. P0802 for AdSense/advertising or P1007 for digital content)?`,
      },
      {
        q: "e-FIRA / Remittance Certificate Issuance",
        text: `Once the funds are credited in INR, how and within what timeline can I download the e-FIRA (Foreign Inward Remittance Advice) from ${selectedBank}?`,
      },
    ];

    return questions;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-4k-card p-6 sm:p-8 relative overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
      {/* Subtle ambient accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-[11px] font-bold text-teal-700 dark:text-teal-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Interactive Diagnostic Tool</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find My Next Step: Interactive EDF Advisor
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Answer 4 simple questions to receive customized regulatory guidance and questions for your bank.
          </p>
        </div>

        {step > 1 && (
          <button
            onClick={resetWizard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-4 gap-2 py-4">
        {[
          { num: 1, label: "Entity" },
          { num: 2, label: "Export Type" },
          { num: 3, label: "Payment Status" },
          { num: 4, label: "Bank & Results" },
        ].map((s) => (
          <div key={s.num} className="space-y-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s.num
                  ? "bg-teal-500"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            />
            <div className="text-[10px] font-semibold text-slate-400 hidden sm:block">
              {s.num}. {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="py-4">
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Question 1 of 4
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                Are you an individual creator or a registered business entity?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Indian foreign exchange regulations distinguish between individual resident service exporters and commercial business entities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setEntityType("resident_individual");
                  setStep(2);
                }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  entityType === "resident_individual"
                    ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                      Resident Individual
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      YouTuber, digital creator, freelance designer, independent blogger, or developer receiving foreign wire transfers in your personal savings/current account.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Select Individual</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEntityType("business_entity");
                  setStep(2);
                }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  entityType === "business_entity"
                    ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                      Business Entity
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Sole Proprietorship with GST, LLP, Private Limited Company, or Partnership Firm operating an entity bank account.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Select Business</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Question 2 of 4
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                What is the nature of your export services?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Under RBI regulations in DTA, software exports may involve STPI / AD bank guidelines, while other digital services are handled directly by AD banks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setExportCategory("non_software");
                  setStep(3);
                }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  exportCategory === "non_software"
                    ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                      Content, Ads & Other Services
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Google AdSense advertising, YouTube Partner Program, Meta payouts, affiliate marketing, writing, graphic design, and consulting.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Select Content / Services</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExportCategory("software");
                  setStep(3);
                }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  exportCategory === "software"
                    ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                      Software / IT Code Development
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Custom software programming, SaaS platform licensing, mobile application code, and IT consulting services.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Select Software</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to Entity Type
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Question 3 of 4
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                Have you already received the foreign payment in your Indian bank?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Timing dictates whether you need disposal instructions for an active inward wire or are pre-generating documentation for an upcoming payout.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setPaymentStatus("received");
                  setStep(4);
                }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  paymentStatus === "received"
                    ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                      Yes, Funds Received / On Hold
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Wire transfer has reached the bank. Funds are either credited in INR or held pending purpose code and disposal declaration.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentStatus("pending");
                  setStep(4);
                }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  paymentStatus === "pending"
                    ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                      No, Upcoming Payout
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Preparing paperwork in advance before Google, YouTube, Meta, or an international client triggers the wire payout.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to Export Type
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: BANK SELECTION & TAILORED ADVICE ================= */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Bank Selector Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Your Authorised Dealer (AD) Bank:
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Select your bank to see tailored submission recommendations.
                  </span>
                </div>
              </div>

              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {BANKS_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Regulatory Finding Card */}
            <div className="bg-gradient-to-br from-teal-50/60 via-white to-slate-50 dark:from-teal-950/30 dark:via-slate-900 dark:to-slate-900 border border-teal-200/80 dark:border-teal-800/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Your Tailored Guidance
                  </span>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    {entityType === "resident_individual"
                      ? "Resident Individual Service Exporter"
                      : "Registered Business Entity Exporter"}{" "}
                    — {exportCategory === "non_software" ? "Content & Digital Services" : "Software & IT Development"}
                  </h5>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed pt-1">
                {entityType === "resident_individual" && exportCategory === "non_software" && (
                  <p>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      Deemed Submission Likely Applies:
                    </strong>{" "}
                    Under RBI's Foreign Exchange Management (Export of Goods & Services) Regulations, resident individuals exporting services (like YouTube earnings, AdSense, or freelancing) may qualify for deemed submission when they declare the prescribed Purpose Code (e.g. <code>P0802</code> or <code>P1007</code>) and payment transaction reference to their AD bank ({selectedBank}). However, banks frequently request a signed Form EDF Annexure and Commercial Invoice if an audit flag is raised or for high-value remittances.
                  </p>
                )}

                {entityType === "business_entity" && exportCategory === "non_software" && (
                  <p>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      Commercial Entity Regulatory Terms:
                    </strong>{" "}
                    For non-individual service exporters, deemed submission conditions may apply to remittances up to ₹10 lakh (approx. $12,000 USD) subject to the bank’s internal risk policy. For larger transfers or corporate profiles, {selectedBank} typically mandates an official Form EDF Annexure, GST Export Invoice under LUT, and inward disposal mandate.
                  </p>
                )}

                {exportCategory === "software" && (
                  <p>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      Software Exports Specifics:
                    </strong>{" "}
                    In the Domestic Tariff Area (DTA), software export authorities may be either the AD Bank or STPI (under the SOFTEX scheme). You must verify with {selectedBank} whether they require an STPI registration number or process small software wire payouts directly through bank disposal instructions.
                  </p>
                )}

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs">
                  <strong>Important Rule:</strong> Do not search for a universal RBI public upload portal. Submissions and regularization are handled exclusively by your <strong>Authorised Dealer ({selectedBank})</strong> branch or portal, not directly through the RBI.
                </div>
              </div>
            </div>

            {/* Questions for Your Bank Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-500" />
                  <span>Exact Questions to Ask {selectedBank}&apos;s Forex / Branch Desk</span>
                </h5>
                <span className="text-[11px] text-slate-400">Click to copy question</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {getBankQuestions().map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-400 transition flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                        {idx + 1}. {item.q}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono select-all">
                        &ldquo;{item.text}&rdquo;
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.text, idx)}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-600 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-300 transition shrink-0 flex items-center gap-1 shadow-2xs"
                      title="Copy question text"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-teal-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Back to Payment Status
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href="/document-generator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-xs transition shadow-sm shadow-teal-600/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Your Form EDF & Invoice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regulatory Footer & Citation */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span>Official Reference:</span>
          <a
            href="https://www.rbi.org.in/scriptS/NotificationUser.aspx?Id=13277&Mode=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-0.5 font-medium"
          >
            <span>RBI Notification FEMA Export of Goods and Services Regulations</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="text-[10px]">
          Last reviewed against RBI amendments: November 2026
        </div>
      </div>
    </div>
  );
}
