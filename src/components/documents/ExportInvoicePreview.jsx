"use client";

import React from "react";
import { amountToWesternWords, formatTradeDocumentDate } from "@/lib/calculations";
import { evaluateGstInvoiceEndorsement } from "@/lib/compliance";

export function ExportInvoicePreview({ data }) {
  const formattedInvDate = formatTradeDocumentDate(data.invoiceDate);
  const westernWords = amountToWesternWords(data.invoiceAmount, data.currency || "USD");

  const gstStatusEval = evaluateGstInvoiceEndorsement({
    isGstRegistered: data.gstStatus !== "unregistered" && Boolean(data.gstin),
    gstin: data.gstin,
    gstStatus: data.gstStatus || "unregistered",
    lutArn: data.lutArn,
    financialYear: data.lutFinancialYear || "2026-27",
  });

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-8 text-xs font-sans text-navy-900 max-w-[210mm] mx-auto space-y-5 leading-normal select-none">
      {/* Header Block */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-4">
        <div className="space-y-1 max-w-sm">
          <h2 className="text-base font-bold text-navy-800 tracking-tight">
            {data.exporterName || "Exporter Legal Name"}
          </h2>
          <p className="text-slate-600 text-[11px] whitespace-pre-line leading-relaxed">
            {data.exporterAddress || "Exporter Registered Address"}
          </p>

          <div className="flex flex-wrap gap-x-4 pt-1 text-[11px] text-slate-700">
            <span>
              <strong>GSTIN:</strong> {data.gstin || (data.gstStatus === "unregistered" ? "Not Registered (URP)" : "—")}
            </span>
            <span>
              <strong>PAN:</strong> {data.exporterPan || "—"}
            </span>
            <span>
              <strong>IEC:</strong> {data.iec || "Not Applicable"}
            </span>
          </div>
        </div>

        <div className="text-right space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-navy-800">
            EXPORT INVOICE
          </h1>
          <div className="text-xs font-semibold text-slate-800">
            Invoice no.: <span className="font-mono">{data.invoiceNumber || "—"}</span>
          </div>
          <div className="text-xs text-slate-600">
            Invoice date: <span className="font-mono">{formattedInvDate || "—"}</span>
          </div>
        </div>
      </div>

      {/* Conditional GST LUT Banner */}
      {gstStatusEval.showEndorsement && (
        <div className="bg-navy-100/70 border border-navy-200 rounded-lg p-2.5 text-center space-y-0.5">
          <div className="font-bold text-[11px] text-navy-800">
            {gstStatusEval.endorsementText}
          </div>
          {gstStatusEval.lutArnText && (
            <div className="text-[10px] text-navy-600 font-mono">
              {gstStatusEval.lutArnText}
            </div>
          )}
        </div>
      )}

      {/* Service Recipient Box */}
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <div className="bg-navy-200 px-3 py-1.5 font-bold text-xs text-navy-900 border-b border-slate-300 tracking-wide uppercase">
          Service Recipient
        </div>
        <div className="p-3 bg-white space-y-0.5 text-xs">
          <div className="font-bold text-navy-900 text-sm">
            {data.recipientName || "Recipient Platform Company Name"}
          </div>
          <div className="text-slate-600 whitespace-pre-line leading-relaxed">
            {data.recipientAddress || "Recipient Address Line 1\nRecipient Address Line 2"}
          </div>
          <div className="text-slate-700 font-medium pt-1">
            Country: {data.recipientCountry || "—"}
          </div>
        </div>
      </div>

      {/* Services Line Item Table */}
      <div className="border border-slate-400 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-navy-100 border-b border-slate-400 text-navy-900 font-bold">
              <th className="p-2.5 w-[60%] border-r border-slate-300">Description of services</th>
              <th className="p-2.5 w-[12%] text-center border-r border-slate-300">SAC</th>
              <th className="p-2.5 w-[10%] text-center border-r border-slate-300">Currency</th>
              <th className="p-2.5 w-[18%] text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="divide-x divide-slate-300 border-b border-slate-300 h-28 align-top">
              <td className="p-3 text-slate-800 leading-relaxed">
                <span className="font-semibold block text-navy-900 mb-1">
                  {data.serviceDescription || "Digital Monetisation Services"}
                </span>
                <span className="text-[11px] text-slate-500">
                  Electronic delivery via Internet. Monetisation proceeds under platform publisher terms.
                </span>
              </td>
              <td className="p-3 text-center font-mono text-slate-700">
                {data.sacCode || "998361"}
              </td>
              <td className="p-3 text-center font-mono font-medium text-slate-700">
                {data.currency || "USD"}
              </td>
              <td className="p-3 text-right font-mono font-bold text-navy-900 text-sm">
                {parseFloat(data.invoiceAmount || 0).toFixed(2)}
              </td>
            </tr>

            {/* Total Row */}
            <tr className="divide-x divide-slate-300 bg-slate-50 font-bold text-navy-900 border-b border-slate-300">
              <td colSpan={3} className="p-2.5 text-right uppercase tracking-wide text-[11px]">
                Total invoice value ({data.currency || "USD"})
              </td>
              <td className="p-2.5 text-right font-mono text-sm">
                {parseFloat(data.invoiceAmount || 0).toFixed(2)}
              </td>
            </tr>

            {/* Amount in words */}
            <tr className="bg-white">
              <td colSpan={4} className="p-2.5 text-slate-800 font-semibold text-xs leading-normal">
                Amount in words: <span className="font-bold text-navy-900">{westernWords || "—"}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatory Footer */}
      <div className="pt-8 flex justify-end">
        <div className="text-right space-y-1 max-w-xs">
          <div className="text-xs font-bold text-navy-900">
            For {data.exporterName || "Exporter Legal Name"}
          </div>
          <div className="h-10"></div>
          <div className="font-bold text-navy-900 text-xs border-t border-slate-300 pt-1">
            {data.authorisedSignatory || "Authorised Signatory"}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Authorised signatory
          </div>
        </div>
      </div>
    </div>
  );
}

