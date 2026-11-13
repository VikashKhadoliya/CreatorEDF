"use client";

import React, { useState, useEffect } from "react";
import { getRecipientProfiles, saveRecipientProfile, deleteRecipientProfile } from "@/lib/db";
import { Building2, Plus, CheckCircle2, AlertTriangle, Trash2, Edit2, ShieldAlert } from "lucide-react";
import { RegulatoryNotice } from "@/components/layout/RegulatoryNotice";

export default function RecipientProfilesPage() {
  const [recipients, setRecipients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: "",
    address: "",
    country: "",
    description: "",
  });

  useEffect(() => {
    loadRecipients();
  }, []);

  async function loadRecipients() {
    const list = await getRecipientProfiles();
    setRecipients(list);
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newRecipient.name || !newRecipient.address || !newRecipient.country) return;
    await saveRecipientProfile({
      ...newRecipient,
      isVerified: false,
    });
    setNewRecipient({ name: "", address: "", country: "", description: "" });
    setShowAddModal(false);
    await loadRecipients();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipient platform profile?")) {
      await deleteRecipientProfile(id);
      await loadRecipients();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
            Recipient / Platform Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage overseas contracting entities that issue foreign inward remittances.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Payer / Platform</span>
        </button>
      </div>

      {/* Critical Platform Entity Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Important: Verify the Contracting Entity on Your Payment Statement
          </p>
          <p className="leading-relaxed text-amber-800">
            Never default blindly to Google LLC. Most Indian YouTubers and AdSense creators receive remittances from{" "}
            <strong>Google Asia Pacific Pte. Ltd. (Singapore)</strong> or{" "}
            <strong>Google Ireland Limited (Dublin)</strong>. Check the top of your monthly payment receipt before generating export invoices.
          </p>
        </div>
      </div>

      {/* Recipients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recipients.map((rec) => (
          <div
            key={rec.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-800 text-sm">{rec.name}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{rec.country}</span>
                  </div>
                </div>

                {rec.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Entity
                  </span>
                ) : (
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                    title="Delete custom platform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 font-mono whitespace-pre-line leading-relaxed">
                {rec.address}
              </div>

              {rec.description && (
                <p className="text-[11px] text-slate-500 italic">
                  {rec.description}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Country of Destination: <strong>{rec.country}</strong></span>
              {rec.isDefault && (
                <span className="text-navy-700 font-medium">Default APAC Payer</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Recipient Modal / Drawer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-navy-800 text-base">
                Add Custom Recipient / Sponsor
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Legal Entity Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brand Sponsor Inc. or ByteDance Ltd"
                  value={newRecipient.name}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, name: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Country <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States, Singapore, United Kingdom"
                  value={newRecipient.country}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, country: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complete Registered Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Building, Street, City, Postal Code, Country"
                  value={newRecipient.address}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, address: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Direct brand sponsorship contract"
                  value={newRecipient.description}
                  onChange={(e) =>
                    setNewRecipient({ ...newRecipient, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white transition shadow-sm"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pt-4">
        <RegulatoryNotice compact={true} />
      </div>
    </div>
  );
}

