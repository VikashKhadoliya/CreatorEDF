"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getExporterProfile, getRecipientProfiles, saveDownload } from "@/lib/db";
import { SAC_LIBRARY, evaluateGstInvoiceEndorsement } from "@/lib/compliance";
import {
  amountToWesternWords,
  amountToIndianWords,
  calculateInrServicesValue,
  formatTradeDocumentDate,
  computeStatutoryDeadline,
  validateDocumentInputs,
} from "@/lib/calculations";
import {
  generateEdfFormPdf,
  generateExportInvoicePdf,
  generateAdCodeLetterPdf,
  generateCombinedComplianceZip,
} from "@/lib/pdfGenerator";
import { EdfFormPreview } from "@/components/documents/EdfFormPreview";
import { ExportInvoicePreview } from "@/components/documents/ExportInvoicePreview";
import { AdCodeLetterPreview } from "@/components/documents/AdCodeLetterPreview";
import { AdSlot } from "@/components/ads/AdSlot";
import {
  FileText,
  Building2,
  Calendar,
  Calculator,
  Download,
  AlertCircle,
  Archive,
  CheckCircle2,
  User,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function DocumentGeneratorPage() {
  const [profile, setProfile] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Inputs (All starting clean and empty)
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState("USD");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [netRealisableValue, setNetRealisableValue] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [sacCode, setSacCode] = useState("998361");
  const [serviceDescription, setServiceDescription] = useState("Digital content monetisation & online services");
  const [declarationDate, setDeclarationDate] = useState(new Date().toISOString().slice(0, 10));

  // Active Preview Tab: "edf" | "invoice" | "ad_letter"
  const [activeTab, setActiveTab] = useState("edf");
  const [validationErrors, setValidationErrors] = useState([]);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState("");

  useEffect(() => {
    async function init() {
      // Check query parameter (e.g. ?tool=invoice or ?tool=ad_letter)
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedTool = params.get("tool");
        if (requestedTool === "edf" || requestedTool === "invoice" || requestedTool === "ad_letter") {
          setActiveTab(requestedTool);
        }
      } catch (e) {}

      const [prof, recs] = await Promise.all([
        getExporterProfile(),
        getRecipientProfiles(),
      ]);
      setProfile(prof);
      setRecipients(recs);
      setLoading(false);
    }
    init();
  }, []);

  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId) || null;

  // Compile full document payload
  const documentData = {
    exporterName: profile?.name || "",
    exporterAddress: profile?.address || "",
    exporterPan: profile?.pan || "",
    gstStatus: profile?.gstStatus || "unregistered",
    gstin: profile?.gstin || "",
    lutArn: profile?.lutArn || "",
    lutFinancialYear: profile?.lutFinancialYear || "2026-27",
    iec: profile?.iec || "Not Applicable",
    authorisedSignatory: profile?.signatoryName || "",
    exporterType: profile?.exporterType || "resident_individual",
    bankName: profile?.bankName || "",
    bankBranch: profile?.bankBranch || "",
    adCode: profile?.adCode || "",
    accountNumber: profile?.accountNumber || "",
    ifscCode: profile?.ifscCode || "",
    mobile: profile?.mobile || "",
    email: profile?.email || "",
    recipientName: selectedRecipient?.name || "",
    recipientAddress: selectedRecipient?.address || "",
    recipientCountry: selectedRecipient?.country || "",
    invoiceNumber,
    invoiceDate,
    currency,
    invoiceAmount,
    netRealisableValue: netRealisableValue || invoiceAmount,
    exchangeRate,
    sacCode,
    serviceDescription,
    declarationDate,
  };

  // Real-time calculations
  const numAmount = parseFloat(invoiceAmount) || 0;
  const numRate = parseFloat(exchangeRate) || 0;
  const inrValue = calculateInrServicesValue(invoiceAmount, exchangeRate);
  const deadlineStr = computeStatutoryDeadline(invoiceDate, 9);
  const westernWords = amountToWesternWords(invoiceAmount, currency);
  const indianWords = amountToIndianWords(inrValue);

  // Download Handlers
  const triggerValidation = () => {
    const res = validateDocumentInputs(documentData);
    setValidationErrors(res.errors);
    return res.isValid;
  };

  const handleDownloadEdf = async () => {
    if (!triggerValidation()) return;
    const doc = generateEdfFormPdf(documentData);
    const fileName = `1_RBI_Form_EDF_${invoiceNumber.replace(/[/\\:*?"<>|]/g, "_")}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "edf", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const handleDownloadInvoice = async () => {
    if (!triggerValidation()) return;
    const doc = generateExportInvoicePdf(documentData);
    const fileName = `2_Export_Invoice_${invoiceNumber.replace(/[/\\:*?"<>|]/g, "_")}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "invoice", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const handleDownloadAdLetter = async () => {
    if (!triggerValidation()) return;
    const doc = generateAdCodeLetterPdf(documentData);
    const fileName = `3_Bank_AD_Code_Letter_${(documentData.bankName || "Bank").replace(/[/\\:*?"<>|]/g, "_")}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "ad_letter", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const handleDownloadZipBundle = async () => {
    if (!triggerValidation()) return;
    const zipBlob = await generateCombinedComplianceZip(documentData);
    const fileName = `CreatorEDF_Compliance_Packet_${invoiceNumber.replace(/[/\\:*?"<>|]/g, "_")}.zip`;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
    await saveDownload({ documentType: "bundle", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const notifySuccess = (msg) => {
    setDownloadSuccessMessage(msg);
    setTimeout(() => setDownloadSuccessMessage(""), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header Card with 3D Bundle Asset */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0 p-1 flex items-center justify-center">
            <img
              src="/assets/pdf-download.png"
              alt="Compliance PDF Download Bundle"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Export Document Generator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill details, preview documents live, and download clean bank-ready A4 PDFs.
            </p>
          </div>
        </div>

        {/* Global Batch Download ZIP Button */}
        <button
          onClick={handleDownloadZipBundle}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs transition shadow-md shadow-teal-600/20 shrink-0"
        >
          <Archive className="w-4 h-4 text-teal-100" />
          <span>Download All 3 Documents (ZIP)</span>
        </button>
      </div>

      {/* Validation Errors Alert Box */}
      {validationErrors.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 text-xs text-rose-900 dark:text-rose-200 space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Please complete the required fields before downloading:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 text-rose-700 dark:text-rose-300">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Download Banner */}
      {downloadSuccessMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{downloadSuccessMessage} (saved to your local downloads history)</span>
        </div>
      )}

      {/* Exporter Profile Missing Banner */}
      {!profile?.name && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1.5">
              <span>Your Exporter Profile is not saved yet</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Save your legal name, PAN, and bank details once so you don't have to retype them every time.
            </p>
          </div>
          <Link
            href="/exporter-profile"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition self-start sm:self-auto shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span>Set Up Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Main Grid: Form Inputs (5 cols) vs Live Document Previews (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Box 1: Payer Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Overseas Platform / Payer</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overseas Platform Entity <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select Confirmed Platform Entity --</option>
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.country})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Select your confirmed overseas paying company (e.g. Google Asia Pacific for Indian AdSense/YouTube).
              </p>
            </div>
          </div>

          {/* Box 2: Remittance & Invoice Figures */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>2. Payment & Invoice Figures</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-01"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currency <span className="text-rose-500">*</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Amount <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  placeholder="e.g. 650.00"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exchange Rate (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="e.g. 86.50"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SAC Code <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sacCode}
                  onChange={(e) => setSacCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SAC_LIBRARY.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description of Services
              </label>
              <input
                type="text"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="e.g. Digital content monetisation & online services"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Box 3: Calculation Summary */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Total Services Value in INR:</span>
              <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{inrValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
              <span>FEMA Realisation Deadline:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{deadlineStr}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Invoice Words (Western):</span>
                <span className="text-slate-700 dark:text-slate-300 italic">{westernWords || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">EDF INR Words (Indian):</span>
                <span className="text-slate-700 dark:text-slate-300 italic">{indianWords || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Document Previews & Single Downloads (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation & Individual Download Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tabs with Visual Mark */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveTab("edf")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "edf"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <img src="/assets/tool-edf.png" alt="" className="w-4 h-4 object-contain rounded-xs" />
                <span>1. Form EDF</span>
              </button>

              <button
                onClick={() => setActiveTab("invoice")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "invoice"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <img src="/assets/tool-invoice.png" alt="" className="w-4 h-4 object-contain rounded-xs" />
                <span>2. Export Invoice</span>
              </button>

              <button
                onClick={() => setActiveTab("ad_letter")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "ad_letter"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <img src="/assets/tool-ad-code.png" alt="" className="w-4 h-4 object-contain rounded-xs" />
                <span>3. AD Code Letter</span>
              </button>
            </div>

            {/* Individual Download Button */}
            <div>
              {activeTab === "edf" && (
                <button
                  onClick={handleDownloadEdf}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download EDF (PDF)</span>
                </button>
              )}

              {activeTab === "invoice" && (
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice (PDF)</span>
                </button>
              )}

              {activeTab === "ad_letter" && (
                <button
                  onClick={handleDownloadAdLetter}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Letter (PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* Document Preview Frame */}
          <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto min-h-[550px]">
            {activeTab === "edf" && <EdfFormPreview data={documentData} />}
            {activeTab === "invoice" && <ExportInvoicePreview data={documentData} />}
            {activeTab === "ad_letter" && <AdCodeLetterPreview data={documentData} />}
          </div>
        </div>
      </div>

      {/* Ad slot at bottom of Document Generator */}
      <AdSlot slotId="generator-bottom" format="horizontal" />
    </div>
  );
}
