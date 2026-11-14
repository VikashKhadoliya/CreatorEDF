/**
 * CreatorEDF — Core Calculation Engine & Number-to-Words Parser
 * Pure JavaScript implementation matching the reference Excel workbook specifications.
 */

const UNITS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
];

const TENS = [
  "Zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

const CURRENCY_DICTIONARY = {
  USD: { major: "US Dollars", minor: "Cents" },
  EUR: { major: "Euros", minor: "Cents" },
  GBP: { major: "Pounds Sterling", minor: "Pence" },
  SGD: { major: "Singapore Dollars", minor: "Cents" },
  AED: { major: "UAE Dirhams", minor: "Fils" },
  INR: { major: "Indian Rupees", minor: "Paise" },
  AUD: { major: "Australian Dollars", minor: "Cents" },
  CAD: { major: "Canadian Dollars", minor: "Cents" },
};

/**
 * Converts a 3-digit number (0-999) into English words.
 */
function convertThreeDigitChunk(num) {
  if (num === 0) return "";
  let words = "";
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    words += UNITS[hundreds] + " Hundred";
    if (remainder > 0) words += " ";
  }

  if (remainder > 0) {
    if (remainder < 20) {
      words += UNITS[remainder];
    } else {
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;
      words += TENS[ten];
      if (unit > 0) words += " " + UNITS[unit];
    }
  }

  return words;
}

/**
 * Converts a 2-digit number (0-99) into English words.
 */
function convertTwoDigitChunk(num) {
  if (num === 0) return "";
  if (num < 20) return UNITS[num];
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  return unit > 0 ? `${TENS[ten]} ${UNITS[unit]}` : TENS[ten];
}

/**
 * Western Number-to-Words Engine (Millions, Thousands, Units)
 * Exact reverse engineering of User Input sheet rows 112-141.
 * Used for Export Invoice Total Value in Words.
 */
export function amountToWesternWords(amount, currency = "USD") {
  if (amount === null || amount === undefined || isNaN(amount) || amount === "") {
    return "";
  }

  const num = Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
  if (num <= 0) return "";

  const intPart = Math.floor(num);
  const decimalPart = Math.round((num - intPart) * 100);

  const billions = Math.floor(intPart / 1000000000);
  const millions = Math.floor((intPart % 1000000000) / 1000000);
  const thousands = Math.floor((intPart % 1000000) / 1000);
  const units = intPart % 1000;

  const chunks = [];
  if (billions > 0) chunks.push(`${convertThreeDigitChunk(billions)} Billion`);
  if (millions > 0) chunks.push(`${convertThreeDigitChunk(millions)} Million`);
  if (thousands > 0) chunks.push(`${convertThreeDigitChunk(thousands)} Thousand`);
  if (units > 0) chunks.push(convertThreeDigitChunk(units));

  const intWords = chunks.length > 0 ? chunks.join(" ") : "Zero";

  const curr = CURRENCY_DICTIONARY[currency] || {
    major: currency,
    minor: "Cents",
  };

  const decWords =
    decimalPart > 0
      ? ` and ${convertTwoDigitChunk(decimalPart)} ${curr.minor}`
      : "";

  return `${curr.major} ${intWords}${decWords} Only.`;
}

/**
 * Indian Number-to-Words Engine (Crores, Lakhs, Thousands, Units, Paise)
 * Exact reverse engineering of User Input sheet rows 134-142.
 * Used for RBI Form EDF Section 1 Total FOB / Services Value (INR).
 */
export function amountToIndianWords(inrAmount) {
  if (inrAmount === null || inrAmount === undefined || isNaN(inrAmount) || inrAmount === "") {
    return "";
  }

  const num = Math.round((Number(inrAmount) + Number.EPSILON) * 100) / 100;
  if (num <= 0) return "";

  const intPart = Math.floor(num);
  const paise = Math.round((num - intPart) * 100);

  const crores = Math.floor(intPart / 10000000);
  const lakhs = Math.floor((intPart % 10000000) / 100000);
  const thousands = Math.floor((intPart % 100000) / 1000);
  const units = intPart % 1000;

  const chunks = [];
  if (crores > 0) chunks.push(`${convertThreeDigitChunk(crores)} Crore`);
  if (lakhs > 0) chunks.push(`${convertTwoDigitChunk(lakhs)} Lakh`);
  if (thousands > 0) chunks.push(`${convertTwoDigitChunk(thousands)} Thousand`);
  if (units > 0) chunks.push(convertThreeDigitChunk(units));

  const intWords = chunks.length > 0 ? chunks.join(" ") : "Zero";
  const paiseWords = paise > 0 ? ` and ${convertTwoDigitChunk(paise)} Paise` : "";

  return `Indian Rupees ${intWords}${paiseWords} Only.`;
}

/**
 * Calculate Services Value in INR (Rounding to 2 decimal places)
 */
export function calculateInrServicesValue(invoiceAmount, exchangeRate) {
  const amt = parseFloat(invoiceAmount);
  const rate = parseFloat(exchangeRate);
  if (isNaN(amt) || isNaN(rate) || amt < 0 || rate <= 0) return 0;
  return Math.round((amt * rate + Number.EPSILON) * 100) / 100;
}

/**
 * Format date into standard trade document format: dd-mmm-yyyy (e.g. 21-Sep-2026)
 * Uses UTC and component parsing to avoid timezone-induced day shifts.
 */
export function formatTradeDocumentDate(dateInput) {
  if (!dateInput) return "";
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split("-");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${day}-${months[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}

/**
 * Compute Statutory Realisation Deadline (9 months per FEMA 23(R)/2026-RB Reg 5(1))
 * Uses UTC date calculations to prevent local timezone drift.
 */
export function computeStatutoryDeadline(invoiceDate, months = 9) {
  if (!invoiceDate) return "";
  let y, m, d;
  if (typeof invoiceDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
    const parts = invoiceDate.split("-").map(Number);
    y = parts[0];
    m = parts[1] - 1;
    d = parts[2];
  } else {
    const dt = new Date(invoiceDate);
    if (isNaN(dt.getTime())) return "";
    y = dt.getUTCFullYear();
    m = dt.getUTCMonth();
    d = dt.getUTCDate();
  }
  const deadline = new Date(Date.UTC(y, m + months, d));
  const day = String(deadline.getUTCDate()).padStart(2, "0");
  const monthsArr = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${day}-${monthsArr[deadline.getUTCMonth()]}-${deadline.getUTCFullYear()}`;
}

/**
 * Document-Specific Validation Architecture
 * Separate validation engines for:
 * 1. Export Invoice
 * 2. RBI Form EDF
 * 3. Bank AD Code Request Letter
 * 4. Combined ZIP Bundle
 *
 * Each error returns a structured object:
 * { field, fieldName, section, reason, message }
 */

// 1. Export Invoice Validation
export function validateInvoiceInputs(data) {
  const errors = [];

  // Section 1: Exporter Details
  if (!data.exporterName?.trim()) {
    errors.push({
      field: "exporterName",
      fieldName: "Legal Name / Trade Name",
      section: "Section 1: Exporter Details",
      reason: "Required to identify the seller / service provider on the export invoice",
      message: "Exporter Legal Name is required",
    });
  }
  if (!data.exporterAddress?.trim()) {
    errors.push({
      field: "exporterAddress",
      fieldName: "Complete Registered Address",
      section: "Section 1: Exporter Details",
      reason: "Required under GST & trade rules to declare the exporter's registered address",
      message: "Exporter Complete Address is required",
    });
  }
  if (!data.exporterPan?.trim()) {
    errors.push({
      field: "exporterPan",
      fieldName: "Permanent Account Number (PAN)",
      section: "Section 1: Exporter Details",
      reason: "Required for Indian tax compliance and cross-border trade identification",
      message: "Exporter PAN is required",
    });
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.exporterPan.trim().toUpperCase())) {
    errors.push({
      field: "exporterPan",
      fieldName: "Permanent Account Number (PAN)",
      section: "Section 1: Exporter Details",
      reason: "Must be a valid 10-character alphanumeric PAN format (e.g. ABCDE1234F)",
      message: "Exporter PAN must be valid 10-character format (e.g. ABCDE1234F)",
    });
  }
  if (data.gstStatus && data.gstStatus !== "unregistered") {
    if (!data.gstin?.trim()) {
      errors.push({
        field: "gstin",
        fieldName: "GSTIN",
        section: "Section 1: Exporter Details",
        reason: "Required on tax invoices when exporter is registered under GST",
        message: "GSTIN is required for registered exporters",
      });
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin.trim().toUpperCase())) {
      errors.push({
        field: "gstin",
        fieldName: "GSTIN",
        section: "Section 1: Exporter Details",
        reason: "Must be a valid 15-character GST identification number",
        message: "GSTIN must be 15-character alphanumeric format (e.g. 08AAAAA0000A1Z5)",
      });
    }
  }

  // Section 2: Overseas Platform / Payer
  if (!data.recipientName?.trim()) {
    errors.push({
      field: "recipientName",
      fieldName: "Payer Company Name",
      section: "Section 2: Overseas Platform / Payer",
      reason: "Required to identify the overseas client or platform entity receiving services",
      message: "Payer Company Name is required",
    });
  }
  if (!data.recipientCountry?.trim()) {
    errors.push({
      field: "recipientCountry",
      fieldName: "Country of Destination",
      section: "Section 2: Overseas Platform / Payer",
      reason: "Required to establish place of supply outside India for zero-rated export",
      message: "Recipient Country is required",
    });
  }
  if (!data.recipientAddress?.trim()) {
    errors.push({
      field: "recipientAddress",
      fieldName: "Full Payer Address",
      section: "Section 2: Overseas Platform / Payer",
      reason: "Required for overseas customer billing address on the export invoice",
      message: "Recipient Address is required",
    });
  }

  // Section 3: Payment & Invoice Figures
  if (!data.invoiceNumber?.trim()) {
    errors.push({
      field: "invoiceNumber",
      fieldName: "Invoice Number",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required unique document sequence number for trade accounting",
      message: "Invoice Number is required",
    });
  }
  if (!data.invoiceDate) {
    errors.push({
      field: "invoiceDate",
      fieldName: "Invoice Date",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required issuance date of the export invoice",
      message: "Invoice Date is required",
    });
  }
  if (!data.currency) {
    errors.push({
      field: "currency",
      fieldName: "Currency",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required foreign currency denomination (e.g. USD, EUR, GBP)",
      message: "Currency is required",
    });
  }
  const amt = parseFloat(String(data.invoiceAmount || "").replace(/,/g, ""));
  if (isNaN(amt) || amt <= 0) {
    errors.push({
      field: "invoiceAmount",
      fieldName: "Invoice Amount",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Must be a positive numeric value greater than 0 representing billed services",
      message: "Invoice Amount must be greater than 0",
    });
  }
  if (!data.sacCode?.trim()) {
    errors.push({
      field: "sacCode",
      fieldName: "SAC Code",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required 6-digit Services Accounting Code for Indian service classification",
      message: "SAC Code is required",
    });
  }
  if (!data.serviceDescription?.trim()) {
    errors.push({
      field: "serviceDescription",
      fieldName: "Description of Services",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required description of digital or professional services rendered",
      message: "Description of Services is required",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 2. Bank AD Code Request Letter Validation
export function validateAdLetterInputs(data) {
  const errors = [];

  // Section 1: Exporter & Bank Details
  if (!data.exporterName?.trim()) {
    errors.push({
      field: "exporterName",
      fieldName: "Legal Name / Trade Name",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required to identify the applicant account holder in the bank request letter",
      message: "Applicant Legal Name is required",
    });
  }
  if (!data.exporterAddress?.trim()) {
    errors.push({
      field: "exporterAddress",
      fieldName: "Complete Registered Address",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required for formal bank correspondence and KYC verification",
      message: "Applicant Address is required",
    });
  }
  if (!data.exporterPan?.trim()) {
    errors.push({
      field: "exporterPan",
      fieldName: "Permanent Account Number (PAN)",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required by the bank trade desk to verify account KYC records",
      message: "Exporter PAN is required",
    });
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.exporterPan.trim().toUpperCase())) {
    errors.push({
      field: "exporterPan",
      fieldName: "Permanent Account Number (PAN)",
      section: "Section 1: Exporter & Bank Details",
      reason: "Must be a valid 10-character alphanumeric PAN format (e.g. ABCDE1234F)",
      message: "Exporter PAN must be valid 10-character format",
    });
  }
  if (!data.bankName?.trim()) {
    errors.push({
      field: "bankName",
      fieldName: "Bank Name",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required to address the request letter to your specific banking institution",
      message: "Bank Name is required",
    });
  }
  if (!data.bankBranch?.trim()) {
    errors.push({
      field: "bankBranch",
      fieldName: "Forex Branch & City",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required to direct the request to the branch holding your account",
      message: "Bank Branch is required",
    });
  }
  if (!data.accountNumber?.trim()) {
    errors.push({
      field: "accountNumber",
      fieldName: "Bank Account Number",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required for the branch manager to locate your commercial or savings account",
      message: "Bank Account Number is required",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 3. RBI Form EDF Validation
export function validateEdfInputs(data) {
  const errors = [];

  // Section 1: Exporter & Bank Details
  if (!data.exporterName?.trim()) {
    errors.push({
      field: "exporterName",
      fieldName: "Legal Name / Trade Name",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required under RBI FEMA trade regulations to identify the declaring exporter",
      message: "Exporter Legal Name is required",
    });
  }
  if (!data.exporterAddress?.trim()) {
    errors.push({
      field: "exporterAddress",
      fieldName: "Complete Registered Address",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required in Section 1 of Form EDF for exporter place of business",
      message: "Exporter Address is required",
    });
  }
  if (!data.exporterPan?.trim()) {
    errors.push({
      field: "exporterPan",
      fieldName: "Permanent Account Number (PAN)",
      section: "Section 1: Exporter & Bank Details",
      reason: "Mandatory identifier for RBI EDPMS remittance tracking and bank disposal",
      message: "Exporter PAN is required",
    });
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.exporterPan.trim().toUpperCase())) {
    errors.push({
      field: "exporterPan",
      fieldName: "Permanent Account Number (PAN)",
      section: "Section 1: Exporter & Bank Details",
      reason: "Must be a valid 10-character alphanumeric PAN format (e.g. ABCDE1234F)",
      message: "Exporter PAN must be valid 10-character format",
    });
  }
  if (!data.bankName?.trim()) {
    errors.push({
      field: "bankName",
      fieldName: "Bank Name",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required to specify Authorised Dealer bank processing the inward remittance",
      message: "Bank Name is required",
    });
  }
  if (!data.bankBranch?.trim()) {
    errors.push({
      field: "bankBranch",
      fieldName: "Forex Branch & City",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required to declare designated AD branch in Section 1 of Form EDF",
      message: "Forex Branch is required",
    });
  }
  if (!data.adCode?.trim()) {
    errors.push({
      field: "adCode",
      fieldName: "Bank AD Code",
      section: "Section 1: Exporter & Bank Details",
      reason: "Required 7-14 character RBI Authorised Dealer Code for Form EDF Section 1",
      message: "Bank AD Code is required",
    });
  } else if (!/^[0-9A-Za-z]{7,14}$/.test(data.adCode.trim())) {
    errors.push({
      field: "adCode",
      fieldName: "Bank AD Code",
      section: "Section 1: Exporter & Bank Details",
      reason: "Must be 7 to 14 alphanumeric characters as issued by your bank branch",
      message: "AD Code must be 7 to 14 alphanumeric characters",
    });
  }

  // Section 2: Overseas Platform / Payer
  if (!data.recipientName?.trim()) {
    errors.push({
      field: "recipientName",
      fieldName: "Payer Company Name",
      section: "Section 2: Overseas Platform / Payer",
      reason: "Required in Section 2B of Form EDF to declare the foreign buyer",
      message: "Payer Company Name is required",
    });
  }
  if (!data.recipientCountry?.trim()) {
    errors.push({
      field: "recipientCountry",
      fieldName: "Country of Destination",
      section: "Section 2: Overseas Platform / Payer",
      reason: "Required for country of export destination under FEMA regulations",
      message: "Recipient Country is required",
    });
  }
  if (!data.recipientAddress?.trim()) {
    errors.push({
      field: "recipientAddress",
      fieldName: "Full Payer Address",
      section: "Section 2: Overseas Platform / Payer",
      reason: "Required for full address of overseas consignee / payer in Section 2B",
      message: "Recipient Address is required",
    });
  }

  // Section 3: Payment & Invoice Figures
  if (!data.invoiceNumber?.trim()) {
    errors.push({
      field: "invoiceNumber",
      fieldName: "Invoice Number",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required to link Form EDF Section 2B declaration to the commercial invoice",
      message: "Invoice Number is required",
    });
  }
  if (!data.invoiceDate) {
    errors.push({
      field: "invoiceDate",
      fieldName: "Invoice Date",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required to calculate the 9-month statutory FEMA realisation deadline",
      message: "Invoice Date is required",
    });
  }
  if (!data.currency) {
    errors.push({
      field: "currency",
      fieldName: "Currency",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required contracted remittance currency (e.g. USD, EUR, GBP)",
      message: "Currency is required",
    });
  }
  const amt = parseFloat(String(data.invoiceAmount || "").replace(/,/g, ""));
  if (isNaN(amt) || amt <= 0) {
    errors.push({
      field: "invoiceAmount",
      fieldName: "Invoice Amount",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Must be a positive value greater than 0 declared in Section 2B",
      message: "Invoice Amount must be greater than 0",
    });
  }
  const rate = parseFloat(String(data.exchangeRate || "").replace(/,/g, ""));
  if (isNaN(rate) || rate <= 0) {
    errors.push({
      field: "exchangeRate",
      fieldName: "Exchange Rate (INR)",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required to calculate Total FOB / Services Value in INR for Form EDF Section 1",
      message: "Exchange Rate must be greater than 0",
    });
  }
  if (!data.sacCode?.trim()) {
    errors.push({
      field: "sacCode",
      fieldName: "SAC Code",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required 6-digit classification code for services export",
      message: "SAC Code is required",
    });
  }
  if (!data.serviceDescription?.trim()) {
    errors.push({
      field: "serviceDescription",
      fieldName: "Description of Services",
      section: "Section 3: Payment & Invoice Figures",
      reason: "Required description of exported services in Form EDF Section 2B",
      message: "Description of Services is required",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 4. Combined ZIP Package Validation (Requires all three documents to be valid)
export function validateZipBundleInputs(data) {
  const edfRes = validateEdfInputs(data);
  const invRes = validateInvoiceInputs(data);
  const adRes = validateAdLetterInputs(data);

  const seen = new Set();
  const errors = [];
  [...edfRes.errors, ...invRes.errors, ...adRes.errors].forEach((err) => {
    if (!seen.has(err.field)) {
      seen.add(err.field);
      errors.push(err);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Universal Document Inputs Validation (Backward Compatible)
 */
export function validateDocumentInputs(data) {
  return validateZipBundleInputs(data);
}
