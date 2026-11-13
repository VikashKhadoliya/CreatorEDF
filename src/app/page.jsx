"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  FileSpreadsheet,
  Landmark,
  ArrowRight,
  Check,
  Globe,
  Play,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Lock,
  Cpu,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AdSlot } from "@/components/ads/AdSlot";
import { EdfEducationGuide } from "@/components/home/EdfEducationGuide";
import { FindNextStepWizard } from "@/components/home/FindNextStepWizard";
import { WhatsNewSection } from "@/components/home/WhatsNewSection";
import { AdSenseIcon, YouTubeIcon, MetaIcon } from "@/components/ui/PlatformIcons";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 pb-16">
      {/* =========================================================================
          1. HERO SECTION: Clean American SaaS Workspace Layout (4K Ultra-HD)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:py-16 bg-ambient-glow bg-dot-matrix border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & CTA */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                {t("heroTitleLine1")} <br />
                <span className="bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-400 dark:to-teal-300 bg-clip-text text-transparent">
                  {t("heroTitleLine2")}
                </span>{" "}
                <br />
                {t("heroTitleLine3")}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                {t("heroDesc")}
              </p>

              {/* 3 Feature Checkmarks with Crisp Pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{t("featureSimple")}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{t("featureBrowser")}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{t("featureNoReg")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/document-generator"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-teal-600/25 border-t border-teal-300/40"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t("btnCreateDocs")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition shadow-2xs active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-slate-500" />
                  <span>{t("btnHowItWorks")}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Original 3D Workspace Illustration in 4K Framing */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-2">
              {/* Soft ambient teal backdrop glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-teal-500/15 via-teal-400/5 to-slate-200/20 dark:from-teal-500/20 dark:via-teal-400/5 dark:to-transparent rounded-3xl blur-2xl pointer-events-none"></div>

              {/* Main Workspace Visual Card */}
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-4k-card bg-white dark:bg-slate-900 group ring-1 ring-slate-900/5 dark:ring-white/10">
                <img
                  src="/assets/hero-workspace.png"
                  alt="CreatorEDF Export Document Generation Workspace"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Supported Platform Chips with Authentic Official Brand SVGs */}
              <div className="mt-5 w-full flex flex-wrap items-center justify-center gap-2.5 px-2 z-10">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <AdSenseIcon className="w-4 h-4 shrink-0" />
                  <span>Google AdSense</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <YouTubeIcon className="w-4 h-4 shrink-0" />
                  <span>YouTube</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <MetaIcon className="w-4 h-4 shrink-0" />
                  <span>Meta</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all text-xs font-medium text-slate-600 dark:text-slate-400">
                  <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Other Platforms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EDF EDUCATION & SUBMISSION GUIDE ("EDF Kya Hai Aur Ise Kahan Submit Karein?")
          ========================================================================= */}
      <EdfEducationGuide />

      {/* =========================================================================
          3. INTERACTIVE "FIND MY NEXT STEP" ADVISOR WIZARD
          ========================================================================= */}
      <section id="next-step-wizard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <FindNextStepWizard />
      </section>

      {/* =========================================================================
          4. WHAT'S NEW AT CREATOREDF (Chronological Website Update Changelog)
          ========================================================================= */}
      <WhatsNewSection />

      {/* =========================================================================
          AD SLOT 1: Below Educational Guide (Responsive Leaderboard)
          ========================================================================= */}
      <AdSlot slotId="hero-bottom-responsive" format="horizontal" />

      {/* =========================================================================
          2. MAIN TOOLS SECTION: 3 PROMINENT CARDS WITH ORIGINAL 3D ART (4K Studio)
          ========================================================================= */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("toolsSectionTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("toolsSectionDesc")}
          </p>
        </div>

        {/* 3 Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: RBI EDF Form Generator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-4k-card hover:shadow-4k-glow hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 flex flex-col justify-between group ring-1 ring-slate-900/5 dark:ring-white/5">
            <div className="space-y-4">
              {/* Tool Card Art Header with subtle inset gradient */}
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3 relative shadow-inner">
                <img
                  src="/assets/tool-edf.png"
                  alt="RBI Form EDF Generator"
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {t("edfTitle")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {t("edfDesc")}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/document-generator?tool=edf"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-50 hover:bg-teal-600 dark:bg-teal-950/60 dark:hover:bg-teal-600 text-teal-800 hover:text-white dark:text-teal-300 dark:hover:text-white font-bold text-xs transition-all duration-200 shadow-2xs group/btn active:scale-[0.98]"
              >
                <span>{t("edfBtn")}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Export Invoice Generator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-4k-card hover:shadow-4k-glow hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 flex flex-col justify-between group ring-1 ring-slate-900/5 dark:ring-white/5">
            <div className="space-y-4">
              {/* Tool Card Art Header */}
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3 relative shadow-inner">
                <img
                  src="/assets/tool-invoice.png"
                  alt="International Export Invoice Generator"
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {t("invoiceTitle")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {t("invoiceDesc")}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/document-generator?tool=invoice"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-50 hover:bg-teal-600 dark:bg-teal-950/60 dark:hover:bg-teal-600 text-teal-800 hover:text-white dark:text-teal-300 dark:hover:text-white font-bold text-xs transition-all duration-200 shadow-2xs group/btn active:scale-[0.98]"
              >
                <span>{t("invoiceBtn")}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 3: Bank AD Code Request Letter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-4k-card hover:shadow-4k-glow hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-300 flex flex-col justify-between group ring-1 ring-slate-900/5 dark:ring-white/5">
            <div className="space-y-4">
              {/* Tool Card Art Header */}
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3 relative shadow-inner">
                <img
                  src="/assets/tool-ad-code.png"
                  alt="Bank AD Code Request Letter"
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {t("adCodeTitle")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {t("adCodeDesc")}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/document-generator?tool=ad_letter"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-50 hover:bg-teal-600 dark:bg-teal-950/60 dark:hover:bg-teal-600 text-teal-800 hover:text-white dark:text-teal-300 dark:hover:text-white font-bold text-xs transition-all duration-200 shadow-2xs group/btn active:scale-[0.98]"
              >
                <span>{t("adCodeBtn")}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          AD SLOT 2: Mid-Page Banner (Above How It Works)
          ========================================================================= */}
      <AdSlot slotId="mid-tools-guides" format="horizontal" />

      {/* =========================================================================
          3. HOW IT WORKS & QUICK GUIDES (4K Studio)
          ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: 3-Step Process (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-4k-card flex flex-col justify-between ring-1 ring-slate-900/5 dark:ring-white/5">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("howTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-7">
                {t("howDesc")}
              </p>

              {/* 3 Steps with Dedicated Visual Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                {/* Step 1 */}
                <div className="space-y-3 flex flex-col items-start group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/60 p-2 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <img
                      src="/assets/step-fill.png"
                      alt="Step 1: Fill Details"
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>{t("step1Title")}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-normal">
                      {t("step1Desc")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-3 flex flex-col items-start group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/60 p-2 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <img
                      src="/assets/step-generate.png"
                      alt="Step 2: Generate Document"
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>{t("step2Title")}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-normal">
                      {t("step2Desc")}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-3 flex flex-col items-start group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/60 p-2 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <img
                      src="/assets/step-download.png"
                      alt="Step 3: Download PDF"
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span>{t("step3Title")}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-normal">
                      {t("step3Desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-6">
              <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>No signup or login required. Works entirely in your web browser.</span>
            </div>
          </div>

          {/* Right Side: Quick Guides Card with 3D Manuals Art (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-50/80 via-white to-slate-50 dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900 border border-teal-200/80 dark:border-teal-900/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-4k-card ring-1 ring-teal-500/10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("guidesCardTitle")}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {t("guidesCardDesc")}
              </p>

              {/* High-Quality 3D Reference Books Visual */}
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-teal-100 dark:border-teal-900/40 p-2.5 flex items-center justify-center shadow-inner group">
                <img
                  src="/assets/guides-knowledge.png"
                  alt="CreatorEDF Compliance Guides & Manuals"
                  className="h-full w-auto object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all duration-200 shadow-2xs active:scale-[0.98]"
              >
                <span>{t("guidesCardBtn")}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CLIENT-SIDE PRIVACY & SECURITY FEATURE SECTION (4K Studio Finish)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800/90 shadow-4k-card overflow-hidden relative ring-1 ring-white/10">
          {/* Subtle background ambient teal glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left 3D Privacy Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-900/80 p-3 ring-1 ring-slate-700/50">
                <img
                  src="/assets/privacy-security.png"
                  alt="100% Client-Side In-Browser Processing"
                  className="w-full h-auto object-contain filter drop-shadow-md"
                />
              </div>
            </div>

            {/* Right Information & Guarantees */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Your Financial Data Never Leaves Your Device
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                CreatorEDF generates compliance annexures, export invoices, and bank letters entirely inside your browser using client-side JavaScript. There are no cloud databases, no user accounts, and zero transmission of sensitive information like your PAN, bank account number, or earnings figures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition">
                  <div className="w-8 h-8 rounded-lg bg-teal-950/80 text-teal-400 flex items-center justify-center shrink-0 border border-teal-900/50">
                    <Lock className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">Saved in your browser</span>
                    <span className="text-[11px] text-slate-400 leading-normal">Your information is saved only on your device.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition">
                  <div className="w-8 h-8 rounded-lg bg-teal-950/80 text-teal-400 flex items-center justify-center shrink-0 border border-teal-900/50">
                    <Cpu className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">Direct PDF download</span>
                    <span className="text-[11px] text-slate-400 leading-normal">Documents are created locally and downloaded directly.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
