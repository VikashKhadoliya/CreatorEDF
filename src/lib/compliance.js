/**
 * CreatorEDF — Statutory Compliance Constants & Decision Framework
 * Primary Legal Authority: RBI Notification No. FEMA 23(R)/2026-RB (Effective Oct 1, 2026)
 * Incorporating amendments up to Notification No. FEMA 23(R)/(2)/2026-RB (Nov 2, 2026)
 * Consolidated Gazette Reference: https://www.rbi.org.in/scriptS/NotificationUser.aspx?Id=13277&Mode=0
 * Last Verified: November 13, 2026
 */

export const STATUTORY_CITATIONS = {
  femaNotification: "Notification No. FEMA 23(R)/2026-RB",
  amendmentNotification: "Notification No. FEMA 23(R)/(2)/2026-RB (Nov 2, 2026)",
  officialUrl: "https://www.rbi.org.in/scriptS/NotificationUser.aspx?Id=13277&Mode=0",
  normalRealisationMonths: 9, // Regulation 5(1): Normal realisation period from date of invoice
  inrSettlementMonths: 12,    // Regulation 5(1): Applicable when exports are invoiced and/or settled in Indian Rupees
  nonIndividualThresholdInr: 1000000, // ₹10 Lakhs [Regulation 3(2)(b)]
};

/**
 * Regulation 3(2)(c) Provision Note:
 * Consolidated Monthly EDF Submission:
 * Under Regulation 3(2)(c), a service exporter may submit a consolidated declaration
 * for multiple invoices/recipients within a calendar month.
 */
export const REGULATION_3_2_C_PROVISION = {
  code: "FEMA_23R_REG_3_2_C",
  title: "Consolidated Monthly EDF Permitted",
  description: "Under Regulation 3(2)(c), a service exporter may submit one consolidated declaration form covering multiple clients or invoices within a calendar month.",
};

/**
 * Regulation 2(1)(f) Specified Authorities:
 * Distinguishes authority for services other than software vs software exports.
 */
export const SPECIFIED_AUTHORITIES = {
  nonSoftwareDta: "Authorised Dealer (AD) Bank branch handling the inward remittance",
  softwareDta: "Authorised Dealer (AD) Bank or Software Technology Parks of India (STPI) under SOFTEX scheme",
  sezUnits: "Designated Development Commissioner of the applicable Special Economic Zone",
};

/**
 * Service Classification Guidance Note:
 * RBI definition of software is broad and includes computer software, recorded media,
 * and audio-visual digital transmissions. Creators must determine classification based
 * on the actual nature of their contract and bank's instructions.
 */
export const CLASSIFICATION_GUIDANCE = {
  note: "Do not automatically classify every creator earning as non-software. The regulatory definition of software can include custom code, web applications, and digital media files. Verify whether your bank requires standard AD disposal or an STPI SOFTEX filing.",
};

/**
 * Regulation 3(2)(d) Provision Note:
 * Exporters of services other than software may submit the Export Declaration Form (EDF)
 * on or before the receipt of payment.
 */
export const REGULATION_3_2_D_PROVISION = {
  code: "FEMA_23R_REG_3_2_D",
  title: "Advance / Pre-Payment EDF Submission Permitted",
  description: "Under Regulation 3(2)(d), an exporter of services other than software is permitted to submit the EDF on or before receipt of payment, allowing creators to file documentation in advance of bank credit.",
};

/**
 * Standard Verified Platform Contracting Entities
 * Non-negotiable rule: Google LLC must never be hardcoded as sole default.
 */
export const VERIFIED_PLATFORMS = [
  {
    id: "google_apac",
    name: "Google Asia Pacific Pte. Ltd.",
    address: "70 Pasir Panjang Road, #03-01, Mapletree Business City II\nSingapore 117371",
    country: "Singapore",
    description: "Standard contracting entity for Indian AdSense, YouTube & Google Cloud creators.",
    isDefault: true,
  },
  {
    id: "google_ireland",
    name: "Google Ireland Limited",
    address: "Gordon House, Barrow Street\nDublin 4",
    country: "Ireland",
    description: "Contracting entity for EMEA region and specific international contracts.",
    isDefault: false,
  },
  {
    id: "google_us",
    name: "Google LLC",
    address: "1600 Amphitheatre Pkwy\nMountain View, CA 94043",
    country: "United States",
    description: "Legacy US entity or direct US-based partner contracts.",
    isDefault: false,
  },
  {
    id: "meta_ireland",
    name: "Meta Platforms Ireland Limited",
    address: "4 Grand Canal Square, Grand Canal Harbour\nDublin 2",
    country: "Ireland",
    description: "Contracting entity for Facebook and Instagram monetization in India/APAC.",
    isDefault: false,
  },
  {
    id: "patreon_us",
    name: "Patreon, Inc.",
    address: "600 Townsend Street, Suite 500\nSan Francisco, CA 94103",
    country: "United States",
    description: "Creator subscription platform payout entity.",
    isDefault: false,
  },
];

/**
 * Configurable Services Accounting Codes (SAC) Library
 * Non-negotiable rule: Never assign 998361 universally without user confirmation.
 */
export const SAC_LIBRARY = [
  {
    code: "998361",
    name: "Advertising Services",
    description: "Display ads, YouTube video monetization, sponsorship integrations, ad networks.",
    recommendedFor: ["AdSense", "YouTube Ads", "Sponsored Videos"],
  },
  {
    code: "998365",
    name: "Internet Advertising Space",
    description: "Selling website banner space, newsletter sponsorship slots, promotional links.",
    recommendedFor: ["Website Ads", "Newsletter Sponsorships"],
  },
  {
    code: "998439",
    name: "Online Content Supply (Other)",
    description: "Paid digital newsletters, downloadable templates, digital guides, paywalled articles.",
    recommendedFor: ["Digital Downloads", "Substack", "Course Assets"],
  },
  {
    code: "999611",
    name: "Sound Recording & Music Licensing",
    description: "Podcast streaming royalties, music sync licensing, voiceover services.",
    recommendedFor: ["Podcasts", "Music Royalties"],
  },
  {
    code: "999612",
    name: "Motion Picture & Video Production",
    description: "Custom commissioned video production, documentary editing, post-production.",
    recommendedFor: ["Production Commissions", "Brand Video Projects"],
  },
  {
    code: "998314",
    name: "Software & Web Development Services",
    description: "Custom software plugins, website development, API integrations.",
    recommendedFor: ["Software Consulting", "Developer Payouts"],
  },
];

/**
 * Evaluates whether an EDF Form is legally mandated or conditionally recommended.
 * Based on FEMA 23(R)/2026-RB (as amended up to November 2, 2026).
 */
export function evaluateEdfRequirement({
  exporterType = "resident_individual", // "resident_individual" | "non_individual"
  remittanceInrValue = 0,
  bankHasRequestedEdf = false,
  isAdvanceSubmission = false, // Regulation 3(2)(d)
}) {
  // Check 1: Explicit bank request / internal hold
  if (bankHasRequestedEdf) {
    return {
      isMandatory: true,
      category: "BANK_MANDATED",
      badgeText: "Required by Bank",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      headline: "EDF Submission Required by Your AD Bank",
      description:
        "Your Authorised Dealer bank's trade desk has requested a completed Form EDF Annexure to release your inward remittance and issue an e-FIRS.",
    };
  }

  // Check 2: Resident Individual [Regulation 3(2)(a)] - NO monetary cap
  if (exporterType === "resident_individual") {
    return {
      isMandatory: false,
      category: "DEEMED_SUBMISSION_INDIVIDUAL",
      badgeText: "Deemed Submitted (Exempt)",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      headline: "Deemed EDF Submission — Regulation 3(2)(a)",
      description:
        "Under Regulation 3(2)(a) of FEMA 23(R)/2026-RB (Second Amendment), resident individuals are deemed to have submitted the EDF upon providing remittance details (Purpose Code and invoice reference) to their AD bank. A separate EDF is not required unless requested by your bank.",
      advanceNote: isAdvanceSubmission
        ? "Regulation 3(2)(d) permits submitting in advance if required by bank."
        : null,
    };
  }

  // Check 3: Non-Individual Exporter <= ₹10 Lakhs [Regulation 3(2)(b)]
  if (
    exporterType === "non_individual" &&
    remittanceInrValue <= STATUTORY_CITATIONS.nonIndividualThresholdInr
  ) {
    return {
      isMandatory: false,
      category: "DEEMED_SUBMISSION_SMALL_VALUE",
      badgeText: "Deemed Submitted (<= ₹10L)",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      headline: "Deemed Submission (Remittance <= ₹10 Lakhs) — Regulation 3(2)(b)",
      description:
        "Under Regulation 3(2)(b), non-individual exporters receiving service export remittances up to ₹10 Lakhs receive deemed-submission treatment upon providing payment info to the bank.",
    };
  }

  // Check 4: Non-Individual Exporter > ₹10 Lakhs [Regulation 3(2)]
  return {
    isMandatory: true,
    category: "NORMAL_EDF_OBLIGATION",
    badgeText: "Normal EDF Obligation (> ₹10L)",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    headline: "Normal EDF Obligation (> ₹10 Lakhs) — Regulation 3(2)",
    description:
      "Under Regulation 3(2), non-individual exporters receiving trade remittances exceeding ₹10 Lakhs are subject to the normal EDF declaration obligation. Prepare the EDF (Section 2B) and submit per your AD bank's trade guidelines.",
  };
}

/**
 * Evaluates GST Invoice Endorsement per CGST Rule 46 and Rule 96A.
 */
export function evaluateGstInvoiceEndorsement({
  isGstRegistered = false,
  gstin = "",
  gstStatus = "unregistered", // "unregistered" | "lut_active" | "igst_paid"
  lutArn = "",
  financialYear = "2026-27",
}) {
  if (!isGstRegistered || gstStatus === "unregistered" || !gstin) {
    return {
      showEndorsement: false,
      invoiceType: "Commercial Export Invoice",
      endorsementText: null,
      notes: "Unregistered exporter. Issued under turnover exemption (₹20 Lakhs in standard states, ₹10 Lakhs in special category states). Does not carry GSTIN or LUT endorsement. Consult a chartered accountant for individual tax applicability.",
    };
  }

  if (gstStatus === "lut_active") {
    return {
      showEndorsement: true,
      invoiceType: "Export Tax Invoice (Zero-Rated under LUT)",
      endorsementText:
        "SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX",
      lutArnText: lutArn ? `LUT ARN: ${lutArn} (FY ${financialYear})` : `LUT Active (FY ${financialYear})`,
      notes: "Zero-rated supply under Section 16 of the IGST Act read with CGST Rule 96A.",
    };
  }

  if (gstStatus === "igst_paid") {
    return {
      showEndorsement: true,
      invoiceType: "Export Tax Invoice (With Payment of Tax)",
      endorsementText: "SUPPLY MEANT FOR EXPORT ON PAYMENT OF INTEGRATED TAX",
      lutArnText: null,
      notes: "Export with payment of IGST under claim for refund under Section 54.",
    };
  }

  return {
    showEndorsement: false,
    invoiceType: "Export Invoice",
    endorsementText: null,
    notes: "",
  };
}

