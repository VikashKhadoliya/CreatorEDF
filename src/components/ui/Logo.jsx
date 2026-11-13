"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Logo({ showTagline = true, className = "", size = "normal" }) {
  const { t } = useLanguage();

  const heightClass =
    size === "small"
      ? "h-7 sm:h-8"
      : size === "large"
      ? "h-11 sm:h-12"
      : "h-9 sm:h-10";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official CreatorEDF Logo Lockup */}
      <div className="relative flex items-center bg-white dark:bg-white dark:px-1.5 dark:py-0.5 dark:rounded-lg transition-transform group-hover:scale-[1.02]">
        <img
          src="/logo.jpg"
          alt="CreatorEDF"
          className={`${heightClass} w-auto object-contain`}
        />
      </div>

      {showTagline && (
        <div className="hidden lg:block border-l border-slate-200 dark:border-slate-700 pl-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block leading-tight max-w-[170px]">
            {t("tagline")}
          </span>
        </div>
      )}
    </Link>
  );
}
