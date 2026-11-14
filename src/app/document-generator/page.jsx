"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { exportElementToPng } from "@/lib/imageExporter";
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
  Image as ImageIcon,
  Loader2,
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
  const [isExporting, setIsExporting] = useState(null); // 'edf_png' | 'invoice_png' | 'ad_letter_png' | 'zip' | null

  // Element Refs for high-res PNG export
  const edfPreviewRef = useRef(null);
  const invoicePreviewRef = useRef(null);
  const adLetterPreviewRef = useRef(null);

  const edfHiddenRef = useRef(null);
  const invoiceHiddenRef = useRef(null);
  const adLetterHiddenRef = useRef(null);

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

  // Sanitized filename slugs
  const sanitizedInvoice = (invoiceNumber || "Form").trim().replace(/[\s/\\:*?"<>|]+/g, "_");
  const sanitizedBank = (bankName || "Bank").trim().replace(/[\s/\\:*?"<>|]+/g, "_");

  // Format-aware EDF Download (PDF & High-Res PNG)
  const handleDownloadEdf = async (format = "pdf") => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);

    if (format === "png") {
      try {
        setIsExporting("edf_png");
        const el = activeTab === "edf" ? edfPreviewRef.current : edfHiddenRef.current;
        const fileName = `CreatorEDF_EDF_Form_${sanitizedInvoice}.png`;
        await exportElementToPng(el, fileName);
        await saveDownload({ documentType: "edf", format: "png", fileName, invoiceId: invoiceNumber });
        notifySuccess(`Downloaded high-resolution PNG: ${fileName}`);
      } catch (err) {
        console.error("EDF PNG export failed:", err);
        alert("Failed to export PNG image. Please download PDF instead.");
      } finally {
        setIsExporting(null);
      }
      return;
    }

    // PDF format
    const doc = generateEdfFormPdf(documentData);
    const fileName = `CreatorEDF_EDF_Form_${sanitizedInvoice}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "edf", format: "pdf", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded bank-ready PDF: ${fileName}`);
  };

  // Format-aware Invoice Download (PDF & High-Res PNG)
  const handleDownloadInvoice = async (format = "pdf") => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);

    if (format === "png") {
      try {
        setIsExporting("invoice_png");
        const el = activeTab === "invoice" ? invoicePreviewRef.current : invoiceHiddenRef.current;
        const fileName = `CreatorEDF_Export_Invoice_${sanitizedInvoice}.png`;
        await exportElementToPng(el, fileName);
        await saveDownload({ documentType: "invoice", format: "png", fileName, invoiceId: invoiceNumber });
        notifySuccess(`Downloaded high-resolution PNG: ${fileName}`);
      } catch (err) {
        console.error("Invoice PNG export failed:", err);
        alert("Failed to export PNG image. Please download PDF instead.");
      } finally {
        setIsExporting(null);
      }
      return;
    }

    // PDF format
    const doc = generateExportInvoicePdf(documentData);
    const fileName = `CreatorEDF_Export_Invoice_${sanitizedInvoice}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "invoice", format: "pdf", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded bank-ready PDF: ${fileName}`);
  };

  // Format-aware AD Code Letter Download (PDF & High-Res PNG)
  const handleDownloadAdLetter = async (format = "pdf") => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);

    if (format === "png") {
      try {
        setIsExporting("ad_letter_png");
        const el = activeTab === "ad_letter" ? adLetterPreviewRef.current : adLetterHiddenRef.current;
        const fileName = `CreatorEDF_AD_Code_Letter_${sanitizedBank}.png`;
        await exportElementToPng(el, fileName);
        await saveDownload({ documentType: "ad_letter", format: "png", fileName, invoiceId: invoiceNumber });
        notifySuccess(`Downloaded high-resolution PNG: ${fileName}`);
      } catch (err) {
        console.error("AD Letter PNG export failed:", err);
        alert("Failed to export PNG image. Please download PDF instead.");
      } finally {
        setIsExporting(null);
      }
      return;
    }

    // PDF format
    const doc = generateAdCodeLetterPdf(documentData);
    const fileName = `CreatorEDF_AD_Code_Letter_${sanitizedBank}.pdf`;
    doc.save(fileName);
    await saveDownload({ documentType: "ad_letter", format: "pdf", fileName, invoiceId: invoiceNumber });
    notifySuccess(`Downloaded bank-ready PDF: ${fileName}`);
  };

  // Combined ZIP Package Download (All 3 PDFs)
  const handleDownloadZipBundle = async () => {
    if (!isFormValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    setValidationErrors([]);
    try {
      setIsExporting("zip");
      const zipBlob = await generateCombinedComplianceZip(documentData);
      const fileName = `CreatorEDF_All_Documents_${sanitizedInvoice}.zip`;
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
      await saveDownload({ documentType: "bundle", format: "zip", fileName, invoiceId: invoiceNumber });
      notifySuccess(`Downloaded compliance package: ${fileName}`);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("Failed to create ZIP package. Please download individual PDFs.");
    } finally {
      setIsExporting(null);
    }
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
            disabled={!isFormValid || Boolean(isExporting)}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition shadow-md shrink-0 ${
              isFormValid && !isExporting
                ? "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-teal-600/20 cursor-pointer"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            {isExporting === "zip" ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            ) : (
              <Archive className="w-4 h-4" />
            )}
            <span>{isExporting === "zip" ? "Compressing Package..." : "Download All 3 Documents (ZIP)"}</span>
          </button>
          {!isFormValid && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 text-center md:text-right">
              Complete required details to enable downloads
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tabs (Horizontal scroll on mobile, flex on desktop) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("edf")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition ${
                  activeTab === "edf"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <img src="/assets/tool-edf.png" alt="" className="w-4 h-4 object-contain rounded-xs shrink-0" />
                <span>1. Form EDF</span>
              </button>

              <button
                onClick={() => setActiveTab("invoice")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition ${
                  activeTab === "invoice"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <img src="/assets/tool-invoice.png" alt="" className="w-4 h-4 object-contain rounded-xs shrink-0" />
                <span>2. Export Invoice</span>
              </button>

              <button
                onClick={() => setActiveTab("ad_letter")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition ${
                  activeTab === "ad_letter"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <img src="/assets/tool-ad-code.png" alt="" className="w-4 h-4 object-contain rounded-xs shrink-0" />
                <span>3. AD Code Letter</span>
              </button>
            </div>

            {/* Action Bar for Active Document: Dual PDF & PNG Buttons */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => {
                  if (activeTab === "edf") handleDownloadEdf("pdf");
                  if (activeTab === "invoice") handleDownloadInvoice("pdf");
                  if (activeTab === "ad_letter") handleDownloadAdLetter("pdf");
                }}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl font-bold text-xs transition shadow-xs ${
                  isFormValid && !isExporting
                    ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {activeTab === "edf" ? "EDF" : activeTab === "invoice" ? "Invoice" : "Letter"} (PDF)
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeTab === "edf") handleDownloadEdf("png");
                  if (activeTab === "invoice") handleDownloadInvoice("png");
                  if (activeTab === "ad_letter") handleDownloadAdLetter("png");
                }}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl font-bold text-xs transition border ${
                  isFormValid && !isExporting
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isExporting?.endsWith("_png") ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                )}
                <span>
                  {isExporting?.endsWith("_png") ? "Exporting..." : "Download PNG"}
                </span>
              </button>
            </div>
          </div>

          {/* Document Preview Frame (with Ref for Active Document) */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center sm:hidden flex items-center justify-center gap-1 py-0.5">
              <span>← Swipe sideways to inspect full A4 print layout →</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950/60 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto min-h-[550px]">
              {activeTab === "edf" && (
                <div ref={edfPreviewRef}>
                  <EdfFormPreview data={documentData} />
                </div>
              )}
              {activeTab === "invoice" && (
                <div ref={invoicePreviewRef}>
                  <ExportInvoicePreview data={documentData} />
                </div>
              )}
              {activeTab === "ad_letter" && (
                <div ref={adLetterPreviewRef}>
                  <AdCodeLetterPreview data={documentData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen Previews for Instant High-Res PNG Capture of Non-Active Tabs */}
      <div
        style={{
          position: "absolute",
          left: "-99999px",
          top: 0,
          width: "210mm",
          pointerEvents: "none",
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <div ref={edfHiddenRef}>
          <EdfFormPreview data={documentData} />
        </div>
        <div ref={invoiceHiddenRef}>
          <ExportInvoicePreview data={documentData} />
        </div>
        <div ref={adLetterHiddenRef}>
          <AdCodeLetterPreview data={documentData} />
        </div>
      </div>

      {/* Dedicated Document Download Center: Individual Document Cards & ZIP Package */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-teal-600" />
              <span>Document Download Center</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your preferred format for individual compliance documents, or download the full submission package.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800/60">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF (Bank-Ready A4)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>PNG (Crisp 2x Image)</span>
            </span>
          </div>
        </div>

        {/* 3 Individual Document Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Form EDF */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Document 1
                </span>
                <span className="text-[10px] font-mono text-slate-400">Section 2B</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                RBI Form EDF Annexure
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Prescribed declaration for service exports under FEMA 23(R)/2026-RB regulations.
              </p>
              <div className="text-[10px] font-mono text-slate-400 truncate pt-1">
                CreatorEDF_EDF_Form_{sanitizedInvoice}.pdf
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleDownloadEdf("pdf")}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                  isFormValid && !isExporting
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadEdf("png")}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                  isFormValid && !isExporting
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isExporting === "edf_png" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>PNG</span>
              </button>
            </div>
          </div>

          {/* Card 2: Export Invoice */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Document 2
                </span>
                <span className="text-[10px] font-mono text-slate-400">GST Zero-Rated</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Commercial Export Invoice
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Full commercial invoice with SAC classification, currency valuation and LUT statement.
              </p>
              <div className="text-[10px] font-mono text-slate-400 truncate pt-1">
                CreatorEDF_Export_Invoice_{sanitizedInvoice}.pdf
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleDownloadInvoice("pdf")}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                  isFormValid && !isExporting
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadInvoice("png")}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                  isFormValid && !isExporting
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isExporting === "invoice_png" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>PNG</span>
              </button>
            </div>
          </div>

          {/* Card 3: Bank AD Code Letter */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Document 3
                </span>
                <span className="text-[10px] font-mono text-slate-400">Forex Desk</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Bank AD Code Request Letter
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Formal request letter to your Authorised Dealer branch forex department for AD code provision.
              </p>
              <div className="text-[10px] font-mono text-slate-400 truncate pt-1">
                CreatorEDF_AD_Code_Letter_{sanitizedBank}.pdf
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleDownloadAdLetter("pdf")}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                  isFormValid && !isExporting
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadAdLetter("png")}
                disabled={!isFormValid || Boolean(isExporting)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                  isFormValid && !isExporting
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isExporting === "ad_letter_png" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>PNG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full ZIP Package Banner Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Download All 3 Documents Package (ZIP Archive)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Bundles all 3 print-ready PDFs and statutory compliance metadata into <span className="font-mono font-medium text-teal-700 dark:text-teal-300">CreatorEDF_All_Documents_{sanitizedInvoice}.zip</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadZipBundle}
            disabled={!isFormValid || Boolean(isExporting)}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm shrink-0 ${
              isFormValid && !isExporting
                ? "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white cursor-pointer shadow-teal-600/20"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            {isExporting === "zip" ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Archive className="w-4 h-4" />
            )}
            <span>{isExporting === "zip" ? "Compressing Archive..." : "Download All 3 PDFs (ZIP)"}</span>
          </button>
        </div>
      </div>

      {/* Ad slot at bottom of Document Generator */}
      <AdSlot slotId="generator-bottom" format="horizontal" />
    </div>
  );
}
