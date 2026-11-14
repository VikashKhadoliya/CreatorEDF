"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
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
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms &amp; Conditions of Use
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: November 13, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            1. Nature of Service
          </h2>
          <p>
            CreatorEDF is a free, self-service web utility provided to assist Indian digital content creators, freelancers, and online publishers with formatting standard trade documents:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>RBI Export Declaration Form (EDF) Annexure (Section 2B: Services)</li>
            <li>Commercial Export Invoices and GST Rule 46/96A Tax Invoices</li>
            <li>Bank Authorised Dealer (AD) Code Request Letters</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            2. User Responsibility for Accuracy
          </h2>
          <p>
            You are solely responsible for ensuring that all information entered into CreatorEDF — including your legal name, permanent address, Permanent Account Number (PAN), GSTIN, bank details, foreign client details, and invoice amounts — is truthful, accurate, and supported by bona fide transaction records (such as bank remittance receipts and platform earning statements).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            3. No Professional Legal or Tax Advice
          </h2>
          <p>
            The educational guides, calculations, and document templates provided on CreatorEDF do not constitute chartered accountancy, legal, tax, or investment advice. Foreign Exchange Management Act (FEMA) regulations and Central Goods and Services Tax (CGST) provisions are subject to frequent regulatory updates. You are advised to consult a qualified Chartered Accountant (CA) or tax consultant regarding your specific situation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p>
            CreatorEDF and its operators shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from delays in bank remittance clearance, rejection of documents by an Authorised Dealer bank, GST audit assessments, or reliance on information provided on this website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            5. Modifications to the Service
          </h2>
          <p>
            We reserve the right to improve, update, or modify any aspect of CreatorEDF at any time without prior notice. Continued use of the website following any update signifies your acceptance of the amended terms.
          </p>
        </section>
      </div>
    </div>
  );
}

