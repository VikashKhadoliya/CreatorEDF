"use client";

import React, { useState, useEffect } from "react";
import { getDownloads } from "@/lib/db";
import { Download, FileText, Archive, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { RegulatoryNotice } from "@/components/layout/RegulatoryNotice";
import Link from "next/link";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const list = await getDownloads();
      setDownloads(list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1)));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
            Generated Document Downloads
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your generated compliance PDFs and combined ZIP archives stored locally in your browser.
          </p>
        </div>

        <Link
          href="/document-generator"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Generate New PDF</span>
        </Link>
      </div>

      {/* Downloads List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-navy-800 text-sm">Download Archive</h3>
          <span className="text-xs text-slate-400">{downloads.length} files saved</span>
        </div>

        <div className="divide-y divide-slate-100">
          {downloads.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-2 flex items-center justify-center shadow-xs">
                <img
                  src="/assets/pdf-download.png"
                  alt="No Downloads Generated Yet"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">No Downloads Generated Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Generated Form EDF Annexures, Export Invoices, and AD Code Letters will be recorded here for instant retrieval.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/document-generator"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition shadow-xs"
                >
                  <span>Go to Document Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            downloads.map((d) => (
              <div key={d.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-xs">
                    {d.documentType === "bundle" ? <Archive className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-800 text-xs">{d.fileName}</h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Generated {new Date(d.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 uppercase">
                  {d.documentType}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <RegulatoryNotice compact={true} />
    </div>
  );
}

