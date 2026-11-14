"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Cookie, Eye, Trash2, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Policy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Privacy &amp; Data Security
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: November 13, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            1. In-Browser Data Processing Architecture
          </h2>
          <p>
            CreatorEDF is designed from the ground up as a private, client-side utility. When you enter information into our document generator — including your legal name, address, Permanent Account Number (PAN), bank account details, IFSC code, foreign earnings, and invoice records — this information is processed entirely inside your own web browser using client-side JavaScript.
          </p>
          <p>
            We do not operate backend servers, cloud databases, or remote filing endpoints to store your financial or personal records. No sensitive documents or calculations are transmitted to our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            2. Local Browser Storage (IndexedDB &amp; LocalStorage)
          </h2>
          <p>
            If you choose to use the optional &quot;Save for Next Time&quot; feature, your exporter profile details and download history are stored strictly in your browser&apos;s local <strong>IndexedDB</strong> storage. This data never leaves your computer or mobile device.
          </p>
          <p>
            We use browser <strong>localStorage</strong> solely to remember your user interface preferences:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Your chosen color theme (light or dark mode)</li>
            <li>Your selected interface language preference</li>
            <li>Your acknowledgment of the privacy notice banner</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            3. Third-Party Advertising &amp; Google AdSense
          </h2>
          <p>
            CreatorEDF is a free utility supported by online advertising through Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the internet.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 underline font-medium"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 underline font-medium"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            4. Shared Computers &amp; Public Devices
          </h2>
          <p>
            Because data is saved locally on your current device, if you access CreatorEDF from an internet café, shared office PC, or public computer, we recommend:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Using Private or Incognito browser mode, which clears local storage upon closing.</li>
            <li>Clicking the &quot;Clear My Data from this Browser&quot; button in the website footer before ending your session.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            5. Contacting Us About Privacy
          </h2>
          <p>
            If you have questions about our privacy practices, please contact us via our{" "}
            <Link href="/contact" className="text-teal-600 dark:text-teal-400 underline font-medium">
              Contact Page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

