"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  Scale,
  Landmark,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

export default function GuidesPage() {
  const faqs = [
    {
      q: "What is RBI Form EDF and do I need it for AdSense or YouTube payments?",
      a: "Form EDF (Export Declaration Form) is an RBI document required for exporting goods or services from India. Under RBI FEMA 23(R)/2026-RB regulations, resident individual creators who provide their bank with payment details (such as disposal instructions and foreign remittance advice) are deemed to have complied. However, many Indian bank trade desks still request a signed Form EDF Annexure to release wire payouts and issue your e-FIRS certificate.",
    },
    {
      q: "What is an AD Code and how do I get one?",
      a: "An AD Code (Authorised Dealer Code) is a 7-digit numeric code assigned to a specific bank branch by the Reserve Bank of India to process foreign exchange transactions. You can request your branch to provide their AD Code letter using our free 'Bank AD Code Letter' generator, which formats a standard request letter on your behalf.",
    },
    {
      q: "Do I need to be registered for GST to make an export invoice?",
      a: "No. If your annual turnover from all sources is below the GST registration threshold (typically ₹20 Lakhs in most states), you do not need GST registration. You can issue a Commercial Export Invoice with GSTIN marked as 'Not Registered (URP)'. If you are GST-registered, you must file a Letter of Undertaking (LUT) to export without paying IGST.",
    },
    {
      q: "Does CreatorEDF submit my documents to the RBI, government, or banks?",
      a: "No. CreatorEDF is a free document preparation tool. It does not submit filings to RBI, CBIC, or any bank, and does not have access to any government portal. You download the PDF files and provide them directly to your bank when requested.",
    },
    {
      q: "Where is my personal and banking information stored?",
      a: "Your details stay strictly inside your own web browser's local storage (IndexedDB). CreatorEDF does not have a database, login, or cloud server. No sensitive information (such as your PAN or bank account number) is ever sent over the internet to us.",
    },
    {
      q: "Is CreatorEDF completely free to use?",
      a: "Yes! CreatorEDF is 100% free for all Indian creators, YouTubers, and freelancers. We do not require any paid subscription, login, or payment details. The website is supported by clean, unobtrusive Google AdSense advertisements.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Card with 3D Manuals Illustration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple Compliance Guides for Indian Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Everything you need to know about RBI Form EDF, foreign inward remittances, GST export invoices, and bank AD code procedures.
          </p>
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 p-2 shrink-0 flex items-center justify-center shadow-xs">
          <img
            src="/assets/guides-knowledge.png"
            alt="Creator Compliance Reference Guides"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Guide 1: Form EDF */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Understanding RBI Form EDF for Service Exports
            </h2>
            <span className="text-[11px] text-slate-400">
              RBI Notification No. FEMA 23(R)/2026-RB Guidelines
            </span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p>
            When you earn revenue from overseas platforms like Google (AdSense / YouTube), Meta (Facebook / Instagram), or international freelance clients, this money enters India as foreign currency and is classified as an <strong>export of services</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Resident Individuals (Creators & Freelancers)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Under Regulation 3(2)(a), resident individuals are deemed to have submitted the EDF when providing remittance information to their bank. There is no monetary ceiling.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Non-Individuals (LLP / Private Limited)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Under Regulation 3(2)(b), deemed submission applies to inward remittances up to ₹10 Lakhs. For amounts above ₹10L, banks may require an official signed EDF Annexure.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Realisation Period:</strong> The statutory realization period under Regulation 5(1) of FEMA 23(R)/2026-RB is 9 months from the date of invoice, or 12 months where exports are invoiced and/or settled in Indian Rupees.
          </p>
        </div>
      </div>

      {/* Guide 2: Export Invoices & GST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Export Invoices and GST Rules 46 & 96A
            </h2>
            <span className="text-[11px] text-slate-400">
              Tax Invoices vs Commercial Bills for Exporters
            </span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p>
            Every export transaction requires an invoice. The required format depends on your GST status:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <strong>Unregistered Creators:</strong> If your total turnover is below the GST registration threshold (typically ₹20 Lakhs in standard states and ₹10 Lakhs in special category states), you can issue a Commercial Export Invoice with GSTIN marked as "Not Registered (URP)" without an LUT endorsement.
            </li>
            <li>
              <strong>GST Registered with LUT:</strong> Under CGST Rule 96A, registered exporters must file a Letter of Undertaking (LUT) on the GST portal to export zero-rated without paying IGST, and the invoice must bear the statutory endorsement: <em>"SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX"</em> along with your LUT ARN and financial year.
            </li>
          </ul>
        </div>
      </div>

      {/* Ad slot in guides */}
      <AdSlot slotId="guides-middle" format="horizontal" />

      {/* Section: Frequently Asked Questions (#faqs) */}
      <div id="faqs" className="space-y-6 pt-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Clear, honest answers to common questions about creator export documents.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Ready to prepare your documents?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Enter your details, preview the live PDF, and download in seconds. Free for all creators.
        </p>
        <Link
          href="/document-generator"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
        >
          <span>Open Document Generator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
