"use client";

import React from "react";
import { Info, ExternalLink } from "lucide-react";
import { STATUTORY_CITATIONS } from "@/lib/compliance";

export function RegulatoryNotice({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-navy-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-navy-800">Statutory Notice:</span>{" "}
          CreatorEDF prepares documents and guidance for presentation to your bank. It does not file documents with the RBI or banks, nor does it guarantee remittance acceptance.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs text-slate-600">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-navy-700 shrink-0" />
        <h4 className="font-semibold text-navy-800 text-sm">
          Regulatory Status & Legal Boundary
        </h4>
      </div>
      <p className="leading-relaxed mb-2">
        CreatorEDF is an independent workflow automation utility for Indian content creators and digital service exporters.{" "}
        <strong className="text-navy-900">
          It does not submit Export Declaration Forms (EDF) directly to the Reserve Bank of India (RBI), Directorate General of Foreign Trade (DGFT), or banks, nor does it claim government endorsement or guarantee remittance clearance.
        </strong>
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
        <span>Framework: <strong className="text-slate-700">{STATUTORY_CITATIONS.femaNotification}</strong></span>
        <span>Amendments up to: <strong className="text-slate-700">Nov 2, 2026</strong></span>
        <a
          href={STATUTORY_CITATIONS.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-700 hover:text-navy-900 underline inline-flex items-center gap-0.5"
        >
          Official RBI Gazette <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

