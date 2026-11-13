"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * AdSlot Component
 * Google AdSense policy-compliant reserved ad slot.
 * - Clear "Advertisement" separation
 * - No deceptive fake ads or placeholder graphics
 * - Non-intrusive placement away from form buttons
 */
export function AdSlot({ slotId = "default-slot", format = "horizontal", className = "" }) {
  const { t } = useLanguage();

  return (
    <div
      className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}
      aria-label="Advertisement container"
    >
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 transition-colors">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
          {t("adSlotLabel") || "Advertisement"}
        </span>

        {/* Ad Container Box */}
        <div
          className={`w-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 font-mono select-none ${
            format === "horizontal"
              ? "min-h-[90px] sm:min-h-[100px]"
              : "min-h-[250px]"
          }`}
        >
          {/* Real AdSense <ins> tag structure */}
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", textAlign: "center" }}
            data-ad-client="ca-pub-CREATOREDF"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <span className="text-[11px] text-slate-400/80">
            Ad Space • Reserved for Google AdSense
          </span>
        </div>
      </div>
    </div>
  );
}

