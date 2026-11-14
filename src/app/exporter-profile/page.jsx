"use client";

import React, { useState, useEffect } from "react";
import { getExporterProfile, saveExporterProfile } from "@/lib/db";
import { User, Building, ShieldCheck, Check, Save, AlertCircle } from "lucide-react";
import { RegulatoryNotice } from "@/components/layout/RegulatoryNotice";

export default function ExporterProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pan: "",
    gstStatus: "unregistered", // "unregistered" | "lut_active" | "igst_paid"
    gstin: "",
    lutArn: "",
    lutFinancialYear: "2026-27",
    iec: "Not Applicable",
    signatoryName: "",
    exporterType: "resident_individual", // "resident_individual" | "non_individual"
    mobile: "",
    email: "",
    bankName: "",
    bankBranch: "",
    adCode: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getExporterProfile();
      if (data) {
        setFormData((prev) => ({ ...prev, ...data }));
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveExporterProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 tracking-tight">
            Exporter Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your details for Form EDF, Export Invoices, and bank letters. Information stays on your device.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Entity Classification */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <User className="w-4 h-4 text-navy-700" />
              1. Legal Entity & Exporter Classification
            </h3>
            <span className="text-[11px] text-slate-400">
              FEMA 23(R)/2026-RB Reg 2(1)(da)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exporter Classification <span className="text-rose-500">*</span>
              </label>
              <select
                name="exporterType"
                value={formData.exporterType}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
              >
                <option value="resident_individual">Resident Individual (Creator / Freelancer)</option>
                <option value="non_individual">Non-Individual (LLP / Pvt Ltd / Partnership)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {formData.exporterType === "resident_individual"
                  ? "Eligible for deemed EDF submission under Regulation 3(2)(a) with no monetary limit."
                  : "Subject to ₹10 Lakh threshold under Regulation 3(2)(b) for deemed submission."}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Legal Name / Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma or Tech Studio LLP"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Exact legal name matching your bank account and PAN.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complete Registered Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Door No, Street, City, State, PIN Code, India"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorised Signatory Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="signatoryName"
                value={formData.signatoryName}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exporter PAN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="pan"
                maxLength={10}
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: GST & Tax Registration */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-navy-700" />
              2. GST Status & Export Under LUT (Rule 46 / 96A)
            </h3>
            <span className="text-[11px] text-slate-400">Strict Conditional Logic</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GST Registration Status <span className="text-rose-500">*</span>
              </label>
              <select
                name="gstStatus"
                value={formData.gstStatus}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
              >
                <option value="unregistered">Unregistered Creator (Below ₹20L / ₹10L Threshold)</option>
                <option value="lut_active">Registered under GST with Active LUT (Zero-Rated)</option>
                <option value="igst_paid">Registered under GST (Export with IGST Payment)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN (if registered)
              </label>
              <input
                type="text"
                name="gstin"
                maxLength={15}
                disabled={formData.gstStatus === "unregistered"}
                value={formData.gstStatus === "unregistered" ? "Not Applicable" : formData.gstin}
                onChange={handleChange}
                placeholder="07AAAAA0000A1Z5"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-navy-600 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            {formData.gstStatus === "lut_active" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Letter of Undertaking (LUT) ARN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lutArn"
                    value={formData.lutArn}
                    onChange={handleChange}
                    placeholder="e.g. AD070326001234F"
                    required={formData.gstStatus === "lut_active"}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LUT Financial Year
                  </label>
                  <input
                    type="text"
                    name="lutFinancialYear"
                    value={formData.lutFinancialYear}
                    onChange={handleChange}
                    placeholder="2026-27"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Import Export Code (IEC)
              </label>
              <input
                type="text"
                name="iec"
                value={formData.iec}
                onChange={handleChange}
                placeholder="Not Applicable"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Service exporters under ₹10L/specified threshold are exempt under FTP. Default: "Not Applicable".
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Banking & AD Code Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-navy-700" />
              3. Banking & RBI Authorised Dealer (AD) Code Details
            </h3>
            <span className="text-[11px] text-slate-400">Replaces Broken Excel Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorised Dealer / Bank Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. HDFC Bank, ICICI Bank, RBL Bank"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                AD Forex Branch & Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="bankBranch"
                value={formData.bankBranch}
                onChange={handleChange}
                placeholder="Branch name and city"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                7-Digit RBI AD Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="adCode"
                maxLength={7}
                value={formData.adCode}
                onChange={handleChange}
                placeholder="e.g. 6160104"
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Confirm with your bank forex desk or generate an AD Code Request Letter.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account where remittance is credited"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                maxLength={11}
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="e.g. RATN0000104"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="creator@example.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            {saved ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile saved to browser IndexedDB!
              </span>
            ) : (
              "Data will be saved locally in IndexedDB."
            )}
          </p>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Exporter Profile</span>
          </button>
        </div>
      </form>

      <div className="pt-4">
        <RegulatoryNotice compact={true} />
      </div>
    </div>
  );
}

