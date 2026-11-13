"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";

export function PrivacyBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if user previously acknowledged the privacy cookie toast
    const isDismissed = localStorage.getItem("creatoredf_privacy_cookie_ack");
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("creatoredf_privacy_cookie_ack", "true");
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Privacy notice"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl p-4 sm:p-5 ring-1 ring-slate-900/5 dark:ring-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-2xs border border-teal-100 dark:border-teal-900/50">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>100% In-Browser Privacy</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              </h4>
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-lg"
                aria-label="Dismiss privacy notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                Your details stay in your browser.
              </strong>{" "}
              CreatorEDF creates your documents locally and never uploads your personal or bank information to any server.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={handleDismiss}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs transition shadow-sm shadow-teal-600/25"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
