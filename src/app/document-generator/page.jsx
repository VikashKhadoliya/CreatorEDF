"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getExporterProfile,
  saveExporterProfile,
  getRecipientProfiles,
  saveDownload,
} from "@/lib/db";
import {
  SAC_LIBRARY,
  VERIFIED_PLATFORMS,
  evaluateGstInvoiceEndorsement,
} from "@/lib/compliance";
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
import { useLanguage } from "@/context/LanguageContext";
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
  Save,
  Check,
  ChevronDown,
  Sparkles,
  Info,
} from "lucide-react";

export default function DocumentGeneratorPage() {
  const { t } = useLanguage();

  // Exporter Profile Details (Starts empty, pre-filled if existing profile is saved)
  const [exporterName, setExporterName] = useState("");
  const [exporterAddress, setExporterAddress] = useState("");
  const [exporterPan, setExporterPan] = useState("");
  const [exporterType, setExporterType] = useState("resident_individual");
  const [gstStatus, setGstStatus] = useState("unregistered");
  const [gstin, setGstin] = useState("");
  const [lutArn, setLutArn] = useState("");
  const [lutFinancialYear, setLutFinancialYear] = useState("2026-27");
  const [iec, setIec] = useState("Not Applicable");
  const [authorisedSignatory, setAuthorisedSignatory] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [adCode, setAdCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Recipient / Platform Details (Starts completely unselected and clean)
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("");

  // Invoice & Remittance Details (Starts completely clean and empty)
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [currency, setCurrency] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [netRealisableValue, setNetRealisableValue] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [sacCode, setSacCode] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");

  // UI State
  const [activeTab, setActiveTab] = useState("edf");
  const [validationErrors, setValidationErrors] = useState([]);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);

  // Load initial data from local browser IndexedDB
  useEffect(() => {
    async function init() {
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedTool = params.get("tool");
        if (
          requestedTool === "edf" ||
          requestedTool === "invoice" ||
          requestedTool === "ad_letter"
        ) {
          setActiveTab(requestedTool);
        }
      } catch (e) {}

      const [prof, recs] = await Promise.all([
        getExporterProfile(),
        getRecipientProfiles(),
      ]);

      if (prof && prof.name) {
        setHasSavedProfile(true);
        setExporterName(prof.name || "");
        setExporterAddress(prof.address || "");
        setExporterPan(prof.pan || "");
        setExporterType(prof.exporterType || "resident_individual");
        setGstStatus(prof.gstStatus || "unregistered");
        setGstin(prof.gstin || "");
        setLutArn(prof.lutArn || "");
        setLutFinancialYear(prof.lutFinancialYear || "2026-27");
        setIec(prof.iec || "Not Applicable");
        setAuthorisedSignatory(prof.signatoryName || prof.name || "");
        setBankName(prof.bankName || "");
        setBankBranch(prof.bankBranch || "");
        setAdCode(prof.adCode || "");
        setAccountNumber(prof.accountNumber || "");
        setIfscCode(prof.ifscCode || "");
        setMobile(prof.mobile || "");
        setEmail(prof.email || "");
      }

      setRecipients(recs && recs.length > 0 ? recs : VERIFIED_PLATFORMS);
    }
    init();
  }, []);

  // Handle Recipient selection from standard platform list or custom entry
  const handleRecipientSelect = (e) => {
    const val = e.target.value;
    setSelectedRecipientId(val);

    if (!val) {
      setRecipientName("");
      setRecipientAddress("");
      setRecipientCountry("");
      return;
    }

    if (val === "custom") {
      setRecipientName("");
      setRecipientAddress("");
      setRecipientCountry("");
      return;
    }

    const matched = recipients.find((r) => r.id === val);
    if (matched) {
      setRecipientName(matched.name || "");
      setRecipientAddress(matched.address || "");
      setRecipientCountry(matched.country || "");
    }
  };

  // Handle SAC Code selection
  const handleSacSelect = (e) => {
    const val = e.target.value;
    setSacCode(val);
    const matched = SAC_LIBRARY.find((s) => s.code === val);
    if (matched && !serviceDescription) {
      setServiceDescription(matched.name);
    }
  };

  // Compile active document data payload
  const documentData = useMemo(() => {
    return {
      exporterName: exporterName.trim(),
      exporterAddress: exporterAddress.trim(),
      exporterPan: exporterPan.trim().toUpperCase(),
      exporterType,
      gstStatus,
      gstin: gstin.trim().toUpperCase(),
      lutArn: lutArn.trim().toUpperCase(),
      lutFinancialYear,
      iec: iec.trim(),
      authorisedSignatory: (authorisedSignatory || exporterName).trim(),
      bankName: bankName.trim(),
      bankBranch: bankBranch.trim(),
      adCode: adCode.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      mobile: mobile.trim(),
      email: email.trim(),
      recipientName: recipientName.trim(),
      recipientAddress: recipientAddress.trim(),
      recipientCountry: recipientCountry.trim(),
      invoiceNumber: invoiceNumber.trim(),
      invoiceDate,
      currency,
      invoiceAmount,
      netRealisableValue: netRealisableValue || invoiceAmount,
      exchangeRate,
      sacCode: sacCode.trim(),
      serviceDescription: serviceDescription.trim(),
      declarationDate: declarationDate || invoiceDate,
    };
  }, [
    exporterName,
    exporterAddress,
    exporterPan,
    exporterType,
    gstStatus,
    gstin,
    lutArn,
    lutFinancialYear,
    iec,
    authorisedSignatory,
    bankName,
    bankBranch,
    adCode,
    accountNumber,
    ifscCode,
    mobile,
    email,
    recipientName,
    recipientAddress,
    recipientCountry,
    invoiceNumber,
    invoiceDate,
    currency,
    invoiceAmount,
    netRealisableValue,
    exchangeRate,
    sacCode,
    serviceDescription,
    declarationDate,
  ]);

  // Real-time validation status
  const validationResult = useMemo(() => {
    return validateDocumentInputs(documentData);
  }, [documentData]);

  const isFormValid = validationResult.isValid;

  // Real-time calculations
  const numAmount = parseFloat(invoiceAmount) || 0;
  const numRate = parseFloat(exchangeRate) || 0;
  const inrValue = calculateInrServicesValue(invoiceAmount, exchangeRate);
  const deadlineStr = invoiceDate ? computeStatutoryDeadline(invoiceDate, 9) : "—";
  const westernWords = amountToWesternWords(invoiceAmount, currency);
  const indianWords = amountToIndianWords(inrValue);

  // Optional: Save Profile to Browser IndexedDB without leaving page
  const handleSaveProfile = async () => {
    if (!exporterName.trim()) {
      alert("Please enter your Exporter / Supplier Legal Name first.");
      return;
    }
    await saveExporterProfile({
      name: exporterName.trim(),
      address: exporterAddress.trim(),
      pan: exporterPan.trim().toUpperCase(),
      exporterType,
      gstStatus,
      gstin: gstin.trim().toUpperCase(),
      lutArn: lutArn.trim().toUpperCase(),
      lutFinancialYear,
      iec: iec.trim(),
      signatoryName: (authorisedSignatory || exporterName).trim(),
      bankName: bankName.trim(),
      bankBranch: bankBranch.trim(),
      adCode: adCode.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      mobile: mobile.trim(),
      email: email.trim(),
    });
    setHasSavedProfile(true);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3500);
  };

  // Download Handlers
  const handleDownloadEdf = async () => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);
    const doc = generateEdfFormPdf(documentData);
    const fileName = `1_RBI_Form_EDF_${invoiceNumber.replace(/[/\\:*?"<>|]/g, "_")}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "edf", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const handleDownloadInvoice = async () => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);
    const doc = generateExportInvoicePdf(documentData);
    const fileName = `2_Export_Invoice_${invoiceNumber.replace(/[/\\:*?"<>|]/g, "_")}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "invoice", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const handleDownloadAdLetter = async () => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);
    const doc = generateAdCodeLetterPdf(documentData);
    const fileName = `3_Bank_AD_Code_Letter_${(documentData.bankName || "Bank").replace(/[/\\:*?"<>|]/g, "_")}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "ad_letter", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded ${fileName}`);
  };

  const handleDownloadZipBundle = async () => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);
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
    setTimeout(() => setDownloadSuccessMessage(""), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header Card */}
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
              Enter your details, preview live documents, and download clean A4 PDFs. No registration required.
            </p>
          </div>
        </div>

        {/* Global Batch Download ZIP Button */}
        <div className="flex flex-col items-end gap-1.5 w-full md:w-auto">
          <button
            onClick={handleDownloadZipBundle}
            disabled={!isFormValid}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition shadow-md shrink-0 ${
              isFormValid
                ? "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-teal-600/20 cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Download All 3 Documents (ZIP)</span>
          </button>
          {!isFormValid && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 text-center md:text-right">
              Fill required fields to enable download
            </span>
          )}
        </div>
      </div>

      {/* Validation Errors Notice */}
      {validationErrors.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 text-xs text-rose-900 dark:text-rose-200 space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Please complete the required details before downloading:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 text-rose-700 dark:text-rose-300">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Notification */}
      {downloadSuccessMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Profile Saved Toast Notification */}
      {profileSaveSuccess && (
        <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 rounded-2xl p-3 text-xs text-teal-900 dark:text-teal-200 font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Your exporter details have been saved to your browser&apos;s local storage.</span>
        </div>
      )}

      {/* Main Grid: Form Inputs (5 cols) vs Live Document Previews (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section 1: Exporter Details (Direct In-Place Input) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                <span>1. Exporter &amp; Bank Details</span>
              </h3>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 text-[11px] font-medium transition"
                title="Save exporter details to your browser's local storage for future visits"
              >
                <Save className="w-3 h-3" />
                <span>{hasSavedProfile ? "Update in Browser" : "Save for Next Time"}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Legal Name / Trade Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={exporterName}
                  onChange={(e) => setExporterName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Complete Registered Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={exporterAddress}
                  onChange={(e) => setExporterAddress(e.target.value)}
                  placeholder="e.g. 104, Green Heights, Ring Road, Jaipur, Rajasthan - 302015"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Permanent Account Number (PAN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={exporterPan}
                    onChange={(e) => setExporterPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exporter Classification
                  </label>
                  <select
                    value={exporterType}
                    onChange={(e) => setExporterType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="resident_individual">Resident Individual</option>
                    <option value="non_individual">Business (LLP / Pvt Ltd)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GST Status
                  </label>
                  <select
                    value={gstStatus}
                    onChange={(e) => setGstStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="unregistered">Unregistered Exporter</option>
                    <option value="lut_active">Registered with LUT</option>
                    <option value="igst_paid">Registered with IGST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GSTIN {gstStatus !== "unregistered" && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder={gstStatus === "unregistered" ? "Not Registered" : "08AAAAA0000A1Z5"}
                    disabled={gstStatus === "unregistered"}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:bg-slate-50 dark:disabled:bg-slate-900/40 text-slate-800 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {gstStatus === "lut_active" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      LUT ARN
                    </label>
                    <input
                      type="text"
                      value={lutArn}
                      onChange={(e) => setLutArn(e.target.value.toUpperCase())}
                      placeholder="AD080326000000X"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Financial Year
                    </label>
                    <input
                      type="text"
                      value={lutFinancialYear}
                      onChange={(e) => setLutFinancialYear(e.target.value)}
                      placeholder="2026-27"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Bank Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Authorised Dealer (AD) Bank Identifiers
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank, ICICI Bank"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Forex Branch &amp; City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      placeholder="e.g. M.I. Road, Jaipur"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank AD Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={adCode}
                      onChange={(e) => setAdCode(e.target.value.trim())}
                      placeholder="e.g. 0510008"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Confirm 7-14 character code with your bank branch
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.trim())}
                      placeholder="e.g. 50100012345678"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase().trim())}
                      placeholder="e.g. HDFC0000051"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Authorised Signatory
                    </label>
                    <input
                      type="text"
                      value={authorisedSignatory}
                      onChange={(e) => setAuthorisedSignatory(e.target.value)}
                      placeholder={exporterName || "Your Full Name"}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Overseas Platform / Payer Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>2. Overseas Platform / Payer</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Choose Known Platform or Enter Custom
                </label>
                <select
                  value={selectedRecipientId}
                  onChange={handleRecipientSelect}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Choose or Enter Custom Payer --</option>
                  {recipients.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.country})
                    </option>
                  ))}
                  <option value="custom">-- Enter Other Custom Payer Details --</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payer Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Google Asia Pacific Pte. Ltd."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country of Destination <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientCountry}
                    onChange={(e) => setRecipientCountry(e.target.value)}
                    placeholder="e.g. Singapore, Ireland, United States"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Payer Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="e.g. 70 Pasir Panjang Road, #03-01, Mapletree Business City II, Singapore 117371"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Remittance & Invoice Figures */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>3. Payment &amp; Invoice Figures</span>
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
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currency <span className="text-rose-500">*</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Select Currency --</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
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
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SAC Code <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sacCode}
                  onChange={handleSacSelect}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Select SAC Code --</option>
                  {SAC_LIBRARY.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description of Services <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="e.g. Digital advertising &amp; online video monetization"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 4: Calculation Summary */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Total Services Value in INR:</span>
              <span className="font-bold text-base text-teal-600 dark:text-teal-400 font-mono">
                {inrValue > 0 ? `₹${inrValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
              <span>FEMA Realisation Deadline:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{deadlineStr}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Invoice Amount in Words:</span>
                <span className="text-slate-700 dark:text-slate-300 italic">{westernWords || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">EDF INR Amount in Words:</span>
                <span className="text-slate-700 dark:text-slate-300 italic">{indianWords || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Document Previews & Single Downloads (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation & Individual Download Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tabs */}
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
                  disabled={!isFormValid}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition shadow-xs ${
                    isFormValid
                      ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download EDF (PDF)</span>
                </button>
              )}

              {activeTab === "invoice" && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={!isFormValid}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition shadow-xs ${
                    isFormValid
                      ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice (PDF)</span>
                </button>
              )}

              {activeTab === "ad_letter" && (
                <button
                  onClick={handleDownloadAdLetter}
                  disabled={!isFormValid}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition shadow-xs ${
                    isFormValid
                      ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
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
