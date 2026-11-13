"use client";

import React, { useState } from "react";
import { changelogEntries } from "@/data/changelog";
import { Sparkles, Calendar, Tag, ChevronDown, CheckCircle2, History } from "lucide-react";

export function WhatsNewSection() {
  const [expandedCount, setExpandedCount] = useState(3);
  const visibleEntries = changelogEntries.slice(0, expandedCount);
  const hasMore = expandedCount < changelogEntries.length;

  return (
    <section id="whats-new" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-4k-card ring-1 ring-slate-900/5 dark:ring-white/5 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What&apos;s New at CreatorEDF
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Recent updates, document fixes, and feature additions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>Current Release: {changelogEntries[0]?.version}</span>
          </div>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-6">
          {visibleEntries.map((entry, index) => (
            <div
              key={entry.version}
              className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-3 group"
            >
              {/* Timeline Pin Indicator */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                  index === 0
                    ? "bg-teal-500 ring-4 ring-teal-500/20"
                    : "bg-slate-300 dark:bg-slate-700 group-hover:bg-teal-500"
                }`}
              />

              {/* Version & Date Metadata */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-mono text-xs font-bold">
                  {entry.version}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{entry.date}</span>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] font-semibold">
                  {entry.category}
                </span>

                {index === 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide">
                    Latest Update
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {entry.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {entry.description}
                </p>
              </div>

              {/* Detailed Highlights Bullet Points */}
              {entry.highlights && entry.highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {entry.highlights.map((highlight, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Expand / Show More Button */}
        {hasMore && (
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setExpandedCount((prev) => prev + 3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
            >
              <span>View Earlier Updates ({changelogEntries.length - expandedCount} more)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

