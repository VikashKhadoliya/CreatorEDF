"use client";

import React from "react";
import Link from "next/link";
import { Info, ArrowLeft, Heart, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
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
          <Info className="w-4 h-4" />
          <span>About CreatorEDF</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simplifying Export Paperwork for Indian Creators
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          A free, privacy-first document utility for Indian digital publishers and freelancers.
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Our Mission
          </h2>
          <p>
            Every month, thousands of Indian creators, YouTubers, app developers, and freelancers receive foreign currency wire transfers from international companies like Google Asia Pacific, Google Ireland, Meta, and overseas clients.
          </p>
          <p>
            Often, Indian bank forex desks put foreign remittances on temporary hold, asking creators for an <strong>&quot;RBI Form EDF&quot;</strong>, an <strong>&quot;Export Invoice under GST Rule 46/96A&quot;</strong>, or an <strong>&quot;Authorised Dealer (AD) Code Letter&quot;</strong>. For most creators, finding the official format and understanding legal terms is confusing and intimidating.
          </p>
          <p>
            CreatorEDF was created to solve this problem: a free, fast web tool that formats bank-ready, standard trade documents in minutes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                1. 100% Free for Everyone
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                No subscription plans, no paywalls, and no hidden fees. We believe basic compliance utilities should be freely accessible to all Indian creators.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                2. Privacy-First (In-Browser)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Your PAN, bank account number, IFSC code, and earnings are processed locally inside your web browser. Nothing is uploaded to remote servers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                3. Zero Registration Hassle
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                No user accounts, no passwords, and no email verification. You open the site, enter your details, preview, and download your PDF.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                4. Honest &amp; Transparent
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                We clearly state what documents are required, where they must be submitted, and that CreatorEDF is a preparation tool, not a government portal.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            How We Sustain the Project
          </h2>
          <p>
            CreatorEDF is monetized solely through Google AdSense online advertising. We place clean, non-intrusive advertisements across the website to cover hosting and domain costs, keeping the tool free for all Indian digital creators.
          </p>
        </section>
      </div>
    </div>
  );
}

