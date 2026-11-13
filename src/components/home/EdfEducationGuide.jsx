"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Landmark,
  Building2,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Download,
  Info,
  Clock,
  BookOpen,
  Send,
  Layers,
} from "lucide-react";

export function EdfEducationGuide() {
  const [activeStep, setActiveStep] = useState(1);

  const stepsData = [
    {
      id: 1,
      title: "Identify Your Export Category",
      hindiTitle: "Apni Export Category Pehchanein",
      asset: "/assets/tool-edf.png",
      badge: "Classification",
      summary: "Understand whether your foreign earnings qualify as software or non-software digital services under RBI regulations.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Before filling out any compliance paperwork, Indian creators must accurately identify their export category under the Foreign Exchange Management Act (FEMA).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <strong className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wide">
                  Non-Software Digital Services
                </strong>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Covers YouTube Partner Program, Google AdSense, Meta advertising payouts, digital marketing, graphic design, content writing, and consulting. In the Domestic Tariff Area (DTA), these are submitted directly to your <strong>Authorised Dealer (AD) Bank</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <strong className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wide">
                  Software / IT Services
                </strong>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Covers custom software development, mobile app code, and SaaS licensing. In DTA, software exports may be monitored by <strong>STPI (under the SOFTEX scheme)</strong> or directly by designated AD bank branches depending on specific values.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong>Why classification matters:</strong> Wrong classification can cause delays in inward remittance clearance or confusion over whether an STPI SOFTEX filing is required.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Prepare Your Information",
      hindiTitle: "Zaroori Information Ready Rakhein",
      asset: "/assets/step-fill.png",
      badge: "Preparation",
      summary: "Gather your legal profile, foreign payer details, invoice records, and bank identifiers.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            To generate a valid RBI Form EDF and Export Invoice, assemble the following verified details from your bank advice and overseas client dashboard:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Exporter Legal Profile</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-0.5 pl-1">
                <li>Legal Name (as per PAN & Bank Account)</li>
                <li>PAN Number & Permanent Address</li>
                <li>Import Export Code (IEC) if registered</li>
                <li>GSTIN & Letter of Undertaking (LUT) reference if applicable</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Overseas Payer Information</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-0.5 pl-1">
                <li>Foreign entity name (e.g., Google Asia Pacific Pte Ltd / Meta Platforms Ireland)</li>
                <li>Overseas corporate address & country of destination</li>
                <li>Foreign currency (USD, EUR, GBP) and gross payment value</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Transaction & Realization</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-0.5 pl-1">
                <li>Invoice Number & Invoice Date</li>
                <li>Payment remittance UTR or SWIFT reference (MT103)</li>
                <li>Realized exchange rate & net amount credited in INR</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Bank & AD Code Identifiers</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-0.5 pl-1">
                <li>14-digit Authorised Dealer (AD) Code of your bank branch</li>
                <li>Bank Name, Branch Name & IFSC Code</li>
                <li>Account Number receiving the foreign wire transfer</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Generate Your EDF Document",
      hindiTitle: "CreatorEDF Se Documents Generate Karein",
      asset: "/assets/step-generate.png",
      badge: "Creation",
      summary: "Enter your information into CreatorEDF's free client-side tool, preview the document, and download the PDF.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            CreatorEDF creates the three standardized documents you need in minutes without uploading your data to any remote server:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>1. Form EDF Annexure</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Standardized Export Declaration Form containing your exporter profile, invoice breakdown, currency values, and FEMA declaration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>2. Export Commercial Invoice</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Compliant commercial bill featuring required GST Rule 46/96A zero-rated export declarations under LUT without tax payment.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" />
                <span>3. Bank AD Code Letter</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Formal request letter addressed to your branch manager requesting remittance disposal or AD Code registration.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/document-generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-sm"
            >
              <span>Open Document Generator Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Where to Submit the EDF?",
      hindiTitle: "EDF Kahan Aur Kise Submit Karein?",
      asset: "/assets/tool-ad-code.png",
      badge: "Submission Authority",
      summary: "Understand the designated authority for your scenario: AD Bank, STPI, or SEZ Development Commissioner.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* CRITICAL WARNING NOTICE: NEVER CLAIM UNIVERSAL RBI PORTAL */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Important Regulatory Notice: No Universal RBI Public Upload Portal</span>
            </div>
            <p>
              The Reserve Bank of India (RBI) <strong>does not have a direct public upload website</strong> where creators upload EDF documents. All export realizations and regulatory filings are handled through designated banking channels or export development authorities.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Official Submission Channels under RBI FEMA Regulations:
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <strong className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                  1. Services other than Software in DTA
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  The relevant <strong>Authorised Dealer (AD) Bank</strong> receiving your inward foreign wire is the specified regulatory authority. You provide the required disposal details to your bank branch or via their forex netbanking portal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <strong className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                  2. Software Exports in DTA
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  The applicable authority may be the designated <strong>AD Bank</strong> or <strong>STPI (Software Technology Parks of India)</strong> under the SOFTEX filing scheme. Check your bank branch&apos;s specific threshold rules.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <strong className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                  3. SEZ Exporters
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Exporters operating from Special Economic Zones (SEZs) must follow the specific submission and certification process prescribed by the applicable <strong>Development Commissioner</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <strong className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                  4. Deemed Submission Provisions
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Resident Individuals:</strong> May qualify for deemed submission when they declare required payment info (purpose code, remittance reference) to their AD bank.<br />
                  <strong>Non-Individuals:</strong> Certain entities qualify for deemed submission for remittances up to ₹10 lakh, subject to applicable conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "After Submission: Post-Filing Steps",
      hindiTitle: "Submission Ke Baad: Records Aur Follow-Up",
      asset: "/assets/step-download.png",
      badge: "Compliance",
      summary: "Follow your bank's instructions, collect the e-FIRA / advice, and retain records for regulatory audits.",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Once you submit your documents or disposal instructions to your Authorised Dealer bank, complete these four essential post-submission actions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>1. Follow Bank Specific Instructions</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Each bank (HDFC, ICICI, SBI, Axis) has its own inward remittance portal or email desk. Respond promptly if the forex branch requests supplementary clarifications.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>2. Retain Bank Acknowledgement</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save an official timestamped copy of your submitted Form EDF, disposal mandate email, or portal acknowledgment reference number.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>3. Collect e-FIRA / Foreign Inward Advice</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download your electronic Foreign Inward Remittance Advice (e-FIRA) or Bank Credit Advice from net banking as conclusive proof of foreign inward remittance.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>4. Maintain 21-Month Statutory Audit Trail</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Under FEMA and GST regulations, preserve all export invoices, bank realization certificates, and disposal forms for at least 21 months for income tax and GST scrutiny.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = stepsData.find((s) => s.id === activeStep) || stepsData[0];

  return (
    <section id="edf-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      {/* =========================================================================
          SECTION HEADER: Bilingual "EDF Kya Hai Aur Ise Kahan Submit Karein?"
          ========================================================================= */}
      <div className="bg-gradient-to-b from-white via-teal-50/30 to-white dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-4k-card ring-1 ring-slate-900/5 dark:ring-white/5 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EDF Kya Hai Aur Ise Kahan Submit Karein?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Everything you need to know about the <strong>Export Declaration Form (EDF)</strong>, why Indian digital creators need it, where to submit it, and what to do after downloading.
          </p>
        </div>

        {/* =========================================================================
            BILINGUAL 4-PILLAR KNOWLEDGE CARDS
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              What is Form EDF?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export Declaration Form (EDF) is an official declaration prescribed by the RBI under FEMA regulations confirming export of goods or services realized through authorized banking channels.
            </p>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700/60">
              Hindi: Yeh foreign payment export declare karne ka statutory document hai.
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Why Do Creators Need It?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When Google, YouTube, Meta, or international clients send foreign currency wire payouts, your bank requires documentation to justify the purpose code, issue your e-FIRA, and prove zero-rated export.
            </p>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700/60">
              Hindi: Bank foreign wire release karne aur e-FIRA dene ke liye mangti hai.
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Who Handles the Process?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In DTA, your <strong>Authorised Dealer (AD) Bank</strong> (e.g. HDFC, ICICI, SBI) processes the inward remittance. For software, STPI may oversee the SOFTEX process. In SEZ, the Development Commissioner governs.
            </p>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700/60">
              Hindi: Aapka bank branch forex desk is process ko handle karta hai.
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              What to Prepare First?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Before contacting your bank, prepare your legal PAN/name, foreign client name & address, payment remittance advice (UTR/SWIFT reference), invoice breakdown, and 14-digit bank AD code.
            </p>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700/60">
              Hindi: PAN, payment reference, overseas address aur invoice ready rakhein.
            </div>
          </div>
        </div>

        {/* =========================================================================
            VISUAL FLOW: Understand Category → Prepare → Generate → Contact Bank → Follow
            ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center sm:text-left">
            How the Process Works
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
            {[
              { num: "01", title: "Understand Category", sub: "Software vs Services" },
              { num: "02", title: "Prepare Details", sub: "PAN, UTR, Payer info" },
              { num: "03", title: "Generate Documents", sub: "Form EDF & Invoice" },
              { num: "04", title: "Contact AD Bank", sub: "Branch or Forex Portal" },
              { num: "05", title: "Follow Instructions", sub: "Obtain e-FIRA & Records" },
            ].map((stepItem, i) => (
              <div
                key={stepItem.num}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between space-y-1 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400">
                    STEP {stepItem.num}
                  </span>
                  {i < 4 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:block" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stepItem.title}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {stepItem.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE 5-STEP EDF SUBMISSION GUIDE
            ========================================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Step-by-Step Submission Guide
              </h3>
            </div>
            <span className="text-xs text-slate-400">Select any step to view details</span>
          </div>

          {/* Step Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
            {stepsData.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
                  activeStep === s.id
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  activeStep === s.id ? "bg-white text-teal-700" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {s.id}
                </span>
                <span>STEP {s.id}: {s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Explanations */}
              <div className="lg:col-span-8 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    STEP {currentStepData.id} — {currentStepData.title}
                  </h4>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    Hindi: {currentStepData.hindiTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
                    {currentStepData.summary}
                  </p>
                </div>

                <div className="pt-2">
                  {currentStepData.content}
                </div>
              </div>

              {/* Right Column: Original 3D Asset Framing */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3">
                <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800 dark:to-slate-900 border border-slate-200/90 dark:border-slate-700/80 p-3 shadow-inner">
                  <img
                    src={currentStepData.asset}
                    alt={currentStepData.title}
                    className="w-full h-auto object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="text-[11px] text-slate-400 text-center font-medium">
                  Step {currentStepData.id} Visual Guide Reference
                </div>

                {/* Step Switcher Controls */}
                <div className="flex items-center gap-2 pt-2 w-full justify-between">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      activeStep === 1
                        ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    ← Previous Step
                  </button>

                  <button
                    disabled={activeStep === stepsData.length}
                    onClick={() => setActiveStep((prev) => Math.min(stepsData.length, prev + 1))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      activeStep === stepsData.length
                        ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400"
                        : "bg-teal-600 text-white hover:bg-teal-700 border-teal-600"
                    }`}
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

