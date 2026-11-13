"use client";

import React, { useState, useEffect } from "react";
import { getRevenueRecords, saveRevenueRecord, deleteRevenueRecord } from "@/lib/db";
import { TrendingUp, Plus, Trash2, DollarSign, Calculator, AlertCircle, ArrowUpDown, Filter } from "lucide-react";
import { RegulatoryNotice } from "@/components/layout/RegulatoryNotice";

export default function RevenueTrackerPage() {
  const [records, setRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
    platform: "Google AdSense / YouTube",
    currency: "USD",
    estimatedEarnings: "",
    finalizedEarnings: "",
    adjustments: "0.00",
    paymentIssuedAmount: "",
    paymentIssuedDate: "",
    bankCreditInr: "",
    realizedExchangeRate: "",
    bankChargesInr: "0.00",
    status: "finalized", // "estimated" | "finalized" | "issued" | "credited"
  });

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    const list = await getRevenueRecords();
    setRecords(list.sort((a, b) => (b.month > a.month ? 1 : -1)));
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const est = parseFloat(newRecord.estimatedEarnings) || 0;
    const fin = parseFloat(newRecord.finalizedEarnings) || 0;
    const adj = parseFloat(newRecord.adjustments) || 0;
    const issued = parseFloat(newRecord.paymentIssuedAmount) || 0;
    const creditInr = parseFloat(newRecord.bankCreditInr) || 0;
    const rate = parseFloat(newRecord.realizedExchangeRate) || 0;
    const charges = parseFloat(newRecord.bankChargesInr) || 0;

    await saveRevenueRecord({
      ...newRecord,
      estimatedEarnings: est,
      finalizedEarnings: fin,
      adjustments: adj,
      paymentIssuedAmount: issued,
      bankCreditInr: creditInr,
      realizedExchangeRate: rate,
      bankChargesInr: charges,
      paymentDifference: fin - issued,
    });

    setShowAddModal(false);
    await loadRecords();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this revenue entry?")) {
      await deleteRevenueRecord(id);
      await loadRecords();
    }
  };

  // Totals
  const totalFinalized = records.reduce((sum, r) => sum + (r.finalizedEarnings || 0), 0);
  const totalAdjustments = records.reduce((sum, r) => sum + (r.adjustments || 0), 0);
  const totalBankCreditInr = records.reduce((sum, r) => sum + (r.bankCreditInr || 0), 0);
  const totalBankChargesInr = records.reduce((sum, r) => sum + (r.bankChargesInr || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
            AdSense Revenue Tracker & Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain strict separation between estimated earnings, finalized revenue, invalid traffic adjustments, and bank credits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Month Record</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Total Finalized (USD)</span>
          <div className="text-xl font-bold text-navy-800 mt-1">
            $ {totalFinalized.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Audited month-end revenue</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Invalid Traffic Adjustments</span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            - $ {totalAdjustments.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Platform deductions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Actual Bank Credits (INR)</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            ₹ {totalBankCreditInr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Realized foreign exchange</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Intermediary Bank Charges</span>
          <div className="text-xl font-bold text-amber-700 mt-1">
            ₹ {totalBankChargesInr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Wire transfer & processing fees</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-navy-800 text-sm">Monthly Revenue Ledger</h3>
          <span className="text-xs text-slate-400">{records.length} records in IndexedDB</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4 text-right">Estimated</th>
                <th className="py-3 px-4 text-right">Finalized</th>
                <th className="py-3 px-4 text-right">Adjustments</th>
                <th className="py-3 px-4 text-right">Issued Payout</th>
                <th className="py-3 px-4 text-right">Bank Credit (INR)</th>
                <th className="py-3 px-4 text-right">TT Rate</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No revenue records yet. Click "Add Month Record" to log your first payment statement.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-medium text-navy-800">{r.month}</td>
                    <td className="py-3 px-4 text-slate-600">{r.platform}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      ${r.estimatedEarnings?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-navy-900">
                      ${r.finalizedEarnings?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600">
                      -${r.adjustments?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">
                      ${r.paymentIssuedAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                      ₹{r.bankCreditInr?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {r.realizedExchangeRate ? `₹${r.realizedExchangeRate}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase">
                        {r.status || "finalized"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-navy-800 text-base">Log Monthly Payment Record</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Month Period <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="month"
                    required
                    value={newRecord.month}
                    onChange={(e) => setNewRecord({ ...newRecord, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                  <input
                    type="text"
                    value={newRecord.platform}
                    onChange={(e) => setNewRecord({ ...newRecord, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Earnings ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newRecord.estimatedEarnings}
                    onChange={(e) => setNewRecord({ ...newRecord, estimatedEarnings: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Finalized Earnings ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newRecord.finalizedEarnings}
                    onChange={(e) => setNewRecord({ ...newRecord, finalizedEarnings: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invalid Traffic / Adjustments ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newRecord.adjustments}
                    onChange={(e) => setNewRecord({ ...newRecord, adjustments: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Issued Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newRecord.paymentIssuedAmount}
                    onChange={(e) => setNewRecord({ ...newRecord, paymentIssuedAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Bank Credit (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newRecord.bankCreditInr}
                    onChange={(e) => setNewRecord({ ...newRecord, bankCreditInr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Realized TT Rate (INR/USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 95.82"
                    value={newRecord.realizedExchangeRate}
                    onChange={(e) => setNewRecord({ ...newRecord, realizedExchangeRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-semibold shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <RegulatoryNotice compact={true} />
    </div>
  );
}

