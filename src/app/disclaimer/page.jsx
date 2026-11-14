"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ExternalLink, ArrowLeft, ShieldAlert } from "lucide-react";
import { STATUTORY_CITATIONS } from "@/lib/compliance";

export default function RegulatoryDisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Regulatory Notice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Statutory Regulatory &amp; Legal Disclaimer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last reviewed: November 13, 2026 (Reflecting RBI FEMA Regulations amended up to Nov 2, 2026)
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 space-y-2">
          <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200 m-0">
            Independent Utility — Not a Government Portal
          </h2>
          <p className="text-xs leading-relaxed m-0">
            CreatorEDF is an independent digital tool built to help Indian content creators, YouTubers, and digital service exporters prepare and format documents. <strong>CreatorEDF does not submit documents directly to the Reserve Bank of India (RBI), Directorate General of Foreign Trade (DGFT), customs authorities, or Authorised Dealer banks.</strong>
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            1. Statutory Framework &amp; Authority
          </h2>
          <p>
            The regulatory references on this website are based on:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong>Primary Authority:</strong> {STATUTORY_CITATIONS.femaNotification} — <em>Foreign Exchange Management (Export and Import of Goods and Services) Regulations, 2026</em> (Effective October 1, 2026).
            </li>
            <li>
              <strong>Amendments:</strong> Incorporating amendments up to {STATUTORY_CITATIONS.amendmentNotification}.
            </li>
            <li>
              <strong>Official Gazette:</strong>{" "}
              <a
                href={STATUTORY_CITATIONS.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-teal-400 underline inline-flex items-center gap-1 font-medium"
              >
                <span>RBI Gazette Notification User (Notification No. 13277)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            2. Distinction Between Legal Rules &amp; Bank Procedures
          </h2>
          <p>
            Visitors must understand the critical difference between RBI statutory regulations and individual bank operating procedures:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Deemed Submission (Regulation 3(2)(a)):</strong> Under RBI regulations, resident individual service exporters are deemed to have submitted the EDF when providing required payment information (purpose code and remittance reference) to their AD bank for crediting their account.
            </li>
            <li>
              <strong>Bank Internal Requirements:</strong> Notwithstanding statutory deemed submission, individual commercial banks (such as HDFC, ICICI, SBI, Axis, etc.) maintain internal operational risk policies and may request signed Form EDF Annexures, commercial invoices, or disposal mandate letters before releasing held remittances or issuing electronic Foreign Inward Remittance Advices (e-FIRA).
            </li>
            <li>
              <strong>No Universal Bank Portal:</strong> There is no single universal RBI website where citizens upload EDF forms. Exporters must contact their respective Authorised Dealer bank branch or use the bank&apos;s trade netbanking portal.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            3. Goods and Services Tax (GST) Declarations
          </h2>
          <p>
            References to Central Goods and Services Tax (CGST) Rule 46 and Rule 96A on this website are educational. Exporters with turnover below statutory registration thresholds are exempt from GST registration and should issue commercial invoices without Letter of Undertaking (LUT) endorsements. Registered exporters exporting zero-rated under LUT must ensure a valid LUT ARN has been filed on the GST portal for the relevant financial year.
          </p>
        </section>
      </div>
    </div>
  );
}

