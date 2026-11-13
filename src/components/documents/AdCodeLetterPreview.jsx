"use client";

import React from "react";
import { formatTradeDocumentDate } from "@/lib/calculations";

export function AdCodeLetterPreview({ data }) {
  const formattedDate = data.invoiceDate ? formatTradeDocumentDate(data.invoiceDate) : formatTradeDocumentDate(new Date());

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-10 text-xs font-sans text-navy-900 max-w-[210mm] mx-auto space-y-5 leading-relaxed select-none">
      {/* Title */}
      <div className="text-center font-bold text-sm tracking-wider uppercase text-navy-800 border-b border-slate-200 pb-3">
        Request for RBI Authorised Dealer (AD) Code
      </div>

      {/* Date */}
      <div className="text-right text-xs text-slate-600 font-mono">
        Date: {formattedDate}
      </div>

      {/* Addressee Block */}
      <div className="space-y-0.5 text-xs">
        <div className="font-semibold text-slate-800">To,</div>
        <div className="text-slate-700">The Branch Manager / Forex Department</div>
        <div className="font-bold text-navy-900 text-sm">{data.bankName || "Your Bank Name"}</div>
        <div className="text-slate-600">{data.bankBranch || "Bank Branch Address"}</div>
      </div>

      {/* Subject Line */}
      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-bold text-xs text-navy-900">
        Subject: Request for confirmation / provision of RBI Authorised Dealer (AD) Code for Export Declaration Form (EDF)
      </div>

      {/* Salutation & Opening */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-800">Dear Sir/Madam,</div>
        <p className="text-slate-700">
          I/We, <strong>{data.exporterName || "Exporter Legal Name"}</strong>, maintain a bank account with your branch and receive / intend to receive foreign exchange remittances against export of services / eligible export transactions.
        </p>
      </div>

      {/* Account Details Box */}
      <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50 space-y-1.5 font-mono text-[11px]">
        <div className="grid grid-cols-3">
          <span className="font-bold text-slate-700 font-sans">Account Holder / Exporter Name:</span>
          <span className="col-span-2 font-semibold text-navy-900">{data.exporterName || "—"}</span>
        </div>
        <div className="grid grid-cols-3">
          <span className="font-bold text-slate-700 font-sans">Account Number:</span>
          <span className="col-span-2 text-navy-900">{data.accountNumber || "____________________________"}</span>
        </div>
        <div className="grid grid-cols-3">
          <span className="font-bold text-slate-700 font-sans">IFSC Code:</span>
          <span className="col-span-2 text-navy-900 uppercase">{data.ifscCode || "____________________________"}</span>
        </div>
        <div className="grid grid-cols-3">
          <span className="font-bold text-slate-700 font-sans">PAN:</span>
          <span className="col-span-2 text-navy-900 uppercase">{data.exporterPan || "—"}</span>
        </div>
      </div>

      {/* Body Clauses */}
      <div className="space-y-2.5 text-slate-700 text-xs">
        <p>
          For the purpose of completing the Export Declaration Form (EDF) and related foreign exchange / FEMA documentation, I/we request you to kindly provide and confirm the RBI Authorised Dealer (AD) Code applicable to the bank branch / designated forex branch through which the above foreign exchange transactions are handled.
        </p>
        <p>
          If our account-holding branch is not itself an authorised forex / AD branch, kindly provide the AD Code and details of the linked / centralised / designated forex branch through which our foreign exchange transactions are processed.
        </p>
      </div>

      {/* Enumerated Confirmation Requests */}
      <div className="space-y-1.5 pt-1">
        <div className="font-bold text-navy-900">Kindly confirm the following:</div>
        <div className="pl-3 space-y-1 text-slate-700 text-xs font-mono">
          <div>1. RBI Authorised Dealer (AD) Code: ______________________________________________</div>
          <div>2. Name / Address of designated AD / Forex Branch: ________________________________</div>
          <div>3. SWIFT / BIC Code (if applicable): ______________________________________________</div>
          <div>4. Confirmation that the above AD Code may be quoted in the EDF for export proceeds.</div>
        </div>
      </div>

      {/* Closing */}
      <div className="space-y-3 pt-2 text-xs text-slate-700">
        <p>
          The information is required for regulatory documentation relating to export proceeds. Kindly provide the above details by email / stamped letter, as applicable.
        </p>

        <div>
          <div>Thank you.</div>
          <div className="font-medium mt-1">Yours faithfully,</div>
        </div>

        <div className="space-y-1 text-slate-600 font-mono text-[11px] pt-1">
          <div>Mobile: {data.mobile || "________________"}</div>
          <div>Email: {data.email || "________________"}</div>
        </div>

        <div className="pt-4">
          <div className="font-bold text-navy-900">
            Signature: ______________________________ ({data.authorisedSignatory || "Signatory"})
          </div>
        </div>
      </div>
    </div>
  );
}

