"use client";

import React, { useState, useEffect } from "react";
import { getRevenueRecords, getInvoices } from "@/lib/db";
import { Receipt, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { RegulatoryNotice } from "@/components/layout/RegulatoryNotice";

export default function PaymentReconciliationPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const revs = await getRevenueRecords();
      setRecords(revs);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
            Payment Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track foreign remittances, compare bank receipts, and keep records for tax filing.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Bank Realisation</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-navy-800">
            {records.filter((r) => !r.bankCreditInr).length} Remittances
          </div>
          <p className="text-[11px] text-slate-400">
            Issued by platform, awaiting Indian bank credit
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reconciled Remittances</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-navy-800">
            {records.filter((r) => r.bankCreditInr > 0).length} Remittances
          </div>
          <p className="text-[11px] text-slate-400">
            Matched against bank credit & e-FIRS
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">FEMA Statutory Period</span>
            <ShieldCheck className="w-4 h-4 text-navy-700" />
          </div>
          <div className="text-xl font-bold text-navy-800">
            9 Calendar Months
          </div>
          <p className="text-[11px] text-slate-400">
            Regulation 5(1) FEMA 23(R)/2026-RB
          </p>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-navy-800 text-sm">Remittance Reconciliation Queue</h3>
          <span className="text-xs text-slate-400">Matching Platform vs Bank Statement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Platform Issued</th>
                <th className="py-3 px-4">Actual Bank Credit</th>
                <th className="py-3 px-4 text-right">Realized Rate</th>
                <th className="py-3 px-4 text-center">FEMA Realisation</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No remittance entries logged yet. Records added in the Revenue Tracker will appear here for reconciliation.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-medium text-navy-800">{r.month}</td>
                    <td className="py-3 px-4 text-slate-700 font-mono">
                      ${r.paymentIssuedAmount ? r.paymentIssuedAmount.toFixed(2) : r.finalizedEarnings?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                      {r.bankCreditInr ? `₹${r.bankCreditInr.toLocaleString("en-IN")}` : "Awaiting Bank Credit"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {r.realizedExchangeRate ? `₹${r.realizedExchangeRate}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Within 9 Months
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          r.bankCreditInr
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.bankCreditInr ? "Reconciled" : "Pending Credit"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RegulatoryNotice compact={true} />
    </div>
  );
}

