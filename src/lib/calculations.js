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
  if (num < 0) return "Negative amounts not supported";

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
  if (num < 0) return "Negative amounts not supported";

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
 * Replaces and extends VBA ValidateInputs()
 * Checks all mandatory fields across Exporter, Recipient, Bank, and Invoice.
 */
export function validateDocumentInputs(data) {
  const errors = [];

  // Exporter Profile Validations
  if (!data.exporterName?.trim()) errors.push("Exporter / Supplier Legal Name is required");
  if (!data.exporterAddress?.trim()) errors.push("Exporter Complete Address is required");
  if (!data.exporterPan?.trim()) {
    errors.push("Exporter PAN is required");
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.exporterPan.trim().toUpperCase())) {
    errors.push("Exporter PAN must be valid 10-character alphanumeric format (e.g. ABCDE1234F)");
  }
  if (!data.authorisedSignatory?.trim()) errors.push("Authorised Signatory Name is required");

  // Recipient Profile Validations
  if (!data.recipientName?.trim()) errors.push("Recipient Platform Company Name is required");
  if (!data.recipientAddress?.trim()) errors.push("Recipient Address is required");
  if (!data.recipientCountry?.trim()) errors.push("Recipient Country is required");

  // Invoice Validations
  if (!data.invoiceNumber?.trim()) errors.push("Invoice Number is required");
  if (!data.invoiceDate) errors.push("Invoice Date is required");
  const amt = parseFloat(data.invoiceAmount);
  if (isNaN(amt) || amt <= 0) {
    errors.push("Invoice Amount must be a positive number greater than 0");
  } else if (amt >= 1000000000000) {
    errors.push("Invoice Amount exceeds supported range (1 Trillion)");
  }
  const rate = parseFloat(data.exchangeRate);
  if (isNaN(rate) || rate <= 0) {
    errors.push("Exchange Rate must be a positive number greater than 0");
  }

  // Bank & AD Code Validations
  if (!data.bankName?.trim()) errors.push("Authorised Dealer / Bank Name is required");
  if (!data.bankBranch?.trim()) errors.push("AD Branch Address is required");
  if (!data.adCode?.trim()) {
    errors.push("7-digit RBI AD Code is required");
  } else if (!/^\d{7}$/.test(data.adCode.trim())) {
    errors.push("RBI AD Code must be exactly 7 numeric digits");
  }

  // Service Description & SAC
  if (!data.serviceDescription?.trim()) errors.push("Description of Services is required");
  if (!data.sacCode?.trim()) errors.push("SAC Code is required");

  return {
    isValid: errors.length === 0,
    errors,
  };
}
