"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FileText, Youtube, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { clearAllData } from "@/lib/db";

export function Footer() {
  const { t } = useLanguage();
  const [clearing, setClearing] = useState(false);
  const [clearedMsg, setClearedMsg] = useState(false);

  const handleClearData = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear your saved exporter and recipient profiles from this browser? This cannot be undone."
      )
    ) {
      setClearing(true);
      await clearAllData();
      setClearing(false);
      setClearedMsg(true);
      setTimeout(() => {
        setClearedMsg(false);
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-3">
            <Logo showTagline={false} size="small" />
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {t("tagline")}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
              {t("footerDisclaimerText")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t("footerQuickLinks")}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  {t("navHome")}
                </Link>
              </li>
              <li>
                <Link href="/#edf-guide" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  EDF Submission Guide
                </Link>
              </li>
              <li>
                <Link href="/#whats-new" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  What&apos;s New Changelog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  {t("navGuides")}
                </Link>
              </li>
              <li>
                <Link href="/guides#faqs" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  {t("navFaqs")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  About CreatorEDF
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Contact &amp; Feedback
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  My Downloads Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t("footerTools")}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/document-generator?tool=edf"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  {t("navEdf")}
                </Link>
              </li>
              <li>
                <Link
                  href="/document-generator?tool=invoice"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  {t("navInvoice")}
                </Link>
              </li>
              <li>
                <Link
                  href="/document-generator?tool=ad_letter"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  {t("navAdCode")}
                </Link>
              </li>
              <li>
                <Link
                  href="/document-generator"
                  className="hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition"
                >
                  {t("navAllTools")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: For Creators & YouTube Learn Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t("footerForCreators")}
            </h4>

            {/* YouTube Guide Card as in reference */}
            <Link
              href="/guides"
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                  <Youtube className="w-4 h-4 fill-red-600 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition">
                  {t("footerYoutubeGuide")}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
            </Link>

            {/* Clear Browser Storage Button */}
            <div className="pt-1">
              <button
                onClick={handleClearData}
                disabled={clearing}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearedMsg ? "Data Cleared!" : "Clear My Data from this Browser"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} CreatorEDF. {t("footerRights")}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              {t("footerPrivacy")}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              {t("footerTerms")}
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-slate-600 dark:hover:text-slate-300 transition">
              {t("footerDisclaimer")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
