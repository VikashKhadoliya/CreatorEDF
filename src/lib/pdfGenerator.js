import { jsPDF } from "jspdf";
import JSZip from "jszip";
import {
  amountToWesternWords,
  amountToIndianWords,
  calculateInrServicesValue,
  formatTradeDocumentDate,
  computeStatutoryDeadline,
} from "./calculations.js";
import { evaluateGstInvoiceEndorsement } from "./compliance.js";

// Design Palette Constants matching the approved workbook layout
const COLORS = {
  navyText: [23, 37, 54],       // #172536
  navyTitle: [36, 61, 89],      // #243D59
  navyAccent: [31, 78, 120],    // #1F4E78
  softBlueHeader: [217, 234, 247], // #D9EAF7
  altRowFill: [238, 242, 246],  // #EEF2F6
  tableBorder: [96, 114, 134],  // #607286
  lightBorder: [203, 213, 225], // #CBD5E1
  white: [255, 255, 255],
};

/**
 * 1. Generate RBI Form EDF Annexure (Section 2B: Services)
 * Margins: 6.35 mm (0.25 inch), A4 Portrait (210 x 297 mm)
 */
export function generateEdfFormPdf(data) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const m = 6.35; // 0.25" margin
  const w = pageWidth - 2 * m; // 197.3 mm printable width

  const inrVal = calculateInrServicesValue(data.invoiceAmount, data.exchangeRate);
  const inrWords = amountToIndianWords(inrVal);
  const formattedInvDate = formatTradeDocumentDate(data.invoiceDate);
  const deadlineStr = computeStatutoryDeadline(data.invoiceDate, 9);
  const declDateStr = data.declarationDate ? formatTradeDocumentDate(data.declarationDate) : formattedInvDate;

  let y = m;

  // Header Title Box
  doc.setDrawColor(...COLORS.tableBorder);
  doc.setLineWidth(0.4);
  doc.rect(m, y, w, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("Export Declaration Form", pageWidth / 2, y + 6.2, { align: "center" });
  y += 11;

  // Section 1 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("1. General Information:", m, y);
  y += 2.5;

  // Section 1 Box Grid (width w = 197.3mm)
  // Left col: 100mm, Right col: 97.3mm
  const colW1 = 100;
  const colW2 = w - colW1;

  doc.setLineWidth(0.25);
  doc.setTextColor(...COLORS.navyText);
  doc.setFontSize(8);

  function drawRow(h, leftText, rightText, isBoldLeft = false, isBoldRight = false) {
    doc.rect(m, y, colW1, h);
    doc.rect(m + colW1, y, colW2, h);

    doc.setFont("helvetica", isBoldLeft ? "bold" : "normal");
    const lLines = doc.splitTextToSize(leftText, colW1 - 3);
    doc.text(lLines, m + 1.5, y + 3.5);

    doc.setFont("helvetica", isBoldRight ? "bold" : "normal");
    const rLines = doc.splitTextToSize(rightText, colW2 - 3);
    doc.text(rLines, m + colW1 + 1.5, y + 3.5);

    y += h;
  }

  drawRow(6, `Type of export: Services`, `Form No.: ${data.edfFormNo || ""}`);
  drawRow(6, `Shipping Bill No. & Date: Not applicable`, `Mode of Transport / Delivery: Internet`);
  drawRow(6, `Category of Exporter: ${data.exporterCategory || "Custom (DTA units)"}`, `AD code: ${data.adCode || ""}`, false, true);

  const regText = `IE Code: ${data.iec || "Not Applicable"}\nGSTIN: ${data.gstin || "Not Applicable"}\nPAN: ${data.exporterPan || ""}`;
  const adText = `AD Name & Address:\n${data.bankName || ""}\n${data.bankBranch || ""}`;
  drawRow(14, regText, adText);

  const expText = `Exporter Name & Address:\n${data.exporterName || ""}\n${data.exporterAddress || ""}`;
  const modeText = `Mode of Realisation: ${data.modeOfRealisation || "Others - bank transfer"}`;
  drawRow(14, expText, modeText);

  const consigneeText = `Consignee Name & Address:\n${data.recipientName || ""}\n${data.recipientAddress || ""}`;
  drawRow(14, consigneeText, `Port of Loading / Source Port in case of SEZ: Not applicable`);

  // Row with 3 parts: Third party (100mm), Dest Country (50mm), Port Discharge (47.3mm)
  const tpHeight = 11;
  doc.rect(m, y, colW1, tpHeight);
  doc.rect(m + colW1, y, 50, tpHeight);
  doc.rect(m + colW1 + 50, y, colW2 - 50, tpHeight);
  doc.setFont("helvetica", "normal");
  doc.text(`Third Party Name & Address: Not applicable\nRelationship between Exporter & Third Party: Not applicable`, m + 1.5, y + 3.5);
  doc.text(`Country of Final Destination:\n${data.recipientCountry || ""}`, m + colW1 + 1.5, y + 3.5);
  doc.text(`Port of Discharge:\nNot applicable`, m + colW1 + 51.5, y + 3.5);
  y += tpHeight;

  drawRow(6, `Name of the AD and AD code, in case of LC / BG: Not applicable / Not applicable`, `Date of Let Export Order (LEO): Not applicable`);

  // Description of goods / services
  doc.rect(m, y, w, 7);
  doc.setFont("helvetica", "normal");
  doc.text(`Description of Goods / Services: ${data.serviceDescription || ""}`, m + 1.5, y + 4.5);
  y += 7;

  // Services Value in Words in INR
  doc.rect(m, y, w, 7);
  doc.setFont("helvetica", "bold");
  doc.text(`Total FOB / Services value in words (INR): ${inrWords}`, m + 1.5, y + 4.5);
  y += 8.5;

  // Section 2A Header (Goods)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("2A. Details of Export Value^ of Goods (This part shall be repeated for each invoice drawn under a shipping bill)", m, y);
  y += 2.5;

  // 2A Goods Table (marked Not applicable)
  doc.setFillColor(...COLORS.softBlueHeader);
  doc.rect(m, y, 70, 4.5, "FD");
  doc.rect(m + 70, y, 35, 4.5, "FD");
  doc.rect(m + 105, y, w - 105, 4.5, "FD");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.navyText);
  doc.text("Particulars", m + 2, y + 3.2);
  doc.text("Currency", m + 72, y + 3.2);
  doc.text("Amount", m + 107, y + 3.2);
  y += 4.5;

  doc.rect(m, y, 70, 4);
  doc.rect(m + 70, y, 35, 4);
  doc.rect(m + 105, y, w - 105, 4);
  doc.setFont("helvetica", "normal");
  doc.text("FOB / Services Value", m + 2, y + 2.8);
  doc.text("-", m + 72, y + 2.8);
  doc.text("-", m + 107, y + 2.8);
  y += 4;

  doc.rect(m, y, 70, 4);
  doc.rect(m + 70, y, 35, 4);
  doc.rect(m + 105, y, w - 105, 4);
  doc.text("Full export value / Net Realisable export value", m + 2, y + 2.8);
  doc.text("Not applicable", m + 107, y + 2.8);
  y += 5.5;

  // Section 2B: Details of Services Exported
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("2B. Details of Export Value^ of Services Exported", m, y);
  y += 2.5;

  // Multi-column table layout for 2B
  const cols2B = [
    { title: "S.No", width: 9 },
    { title: "Buyer Name & Address", width: 44 },
    { title: "Country", width: 17 },
    { title: "Invoice No", width: 25 },
    { title: "Date", width: 18 },
    { title: "Curr", width: 11 },
    { title: "Amount", width: 16 },
    { title: "Net Value", width: 16 },
    { title: "Contract Ref", width: 15 },
    { title: "Description of services", width: 26 },
  ];

  doc.setFillColor(...COLORS.softBlueHeader);
  let curX = m;
  doc.setFontSize(6.8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.navyText);
  cols2B.forEach((c) => {
    doc.rect(curX, y, c.width, 5, "FD");
    doc.text(c.title, curX + 1, y + 3.3);
    curX += c.width;
  });
  y += 5;

  // Data Row for 2B
  const row2BH = 13;
  curX = m;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  const values2B = [
    "1",
    `${data.recipientName || ""}\n${data.recipientAddress || ""}`.slice(0, 80),
    data.recipientCountry || "",
    data.invoiceNumber || "",
    formattedInvDate,
    data.currency || "USD",
    parseFloat(data.invoiceAmount || 0).toFixed(2),
    parseFloat(data.netRealisableValue || data.invoiceAmount || 0).toFixed(2),
    "Not applicable",
    data.serviceDescription || "",
  ];

  cols2B.forEach((c, idx) => {
    doc.rect(curX, y, c.width, row2BH);
    const lines = doc.splitTextToSize(values2B[idx], c.width - 1.5);
    doc.text(lines, curX + 1, y + 3.2);
    curX += c.width;
  });
  y += row2BH + 2;

  // Section 3: Couriers (marked NA)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("3. Applicable for Export under FPO / Couriers", m, y);
  y += 2;

  doc.rect(m, y, colW1, 8);
  doc.rect(m + colW1, y, colW2, 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...COLORS.navyText);
  doc.text("Name of the Foreign Post Office / Courier: Not applicable\nNumber & date of Parcel receipts: Not applicable", m + 1.5, y + 3);
  doc.text("Stamp & Signature of Authorised Dealer", m + colW1 + 1.5, y + 3);
  y += 10;

  // Section 4: Declaration by Exporters
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("4. Declaration by the Exporters (All types of exports)", m, y);
  y += 2.5;

  const declText = `I / We hereby declare that I / we am / are the seller / consignor of the goods / provider of services in respect of which this declaration is made and that the particulars given above are true and that the value to be received from the buyer / third party represents the export value^ contracted and declared above. I / We undertake that I / we have delivered / will deliver to the authorised dealer named above the foreign exchange / Indian Rupees representing the full value of the goods / services exported as above on or before ${deadlineStr} (i.e. within the period of realisation stipulated by RBI from time to time) in the manner specified in the Regulations made under the Foreign Exchange Management Act, 1999. I / We also undertake to submit the documents pertaining to exports declared in this form, to the Authorised Dealer named above, as may be required under the Act.`;

  doc.rect(m, y, w, 19);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.navyText);
  const declLines = doc.splitTextToSize(declText, w - 3);
  doc.text(declLines, m + 1.5, y + 3);
  y += 19;

  // Signature Block
  doc.rect(m, y, colW1, 8);
  doc.rect(m + colW1, y, colW2, 8);
  doc.text(`Date: ${declDateStr}`, m + 1.5, y + 5);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.authorisedSignatory || ""}`, m + colW1 + 1.5, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(`(Signature of Exporter)`, m + colW1 + 1.5, y + 6.8);
  y += 9.5;

  // Section 5: Specified Authority Endorsement Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("5. Space for use of Specified Authority (Custom / SEZ / AD / STPI):", m, y);
  y += 2;

  doc.rect(m, y, w, 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.navyText);
  doc.text(
    "Certified, on the basis of above declaration at 4, that the goods / services described above and the export value^ declared by the exporter in this form is as per the corresponding invoice / gist of invoices submitted and declared by the exporter.",
    m + 1.5,
    y + 3.2,
    { maxWidth: w - 3 }
  );
  doc.text("Date: _____________", m + 1.5, y + 8.5);
  doc.text("(Signature of Designated / Authorised officials of Custom / SEZ / Authorised Dealer / STPI)", m + colW1 - 10, y + 8.5);
  y += 12;

  // Footnotes
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text("1. @ Strike out whichever is not applicable.", m, y);
  doc.text("2. ^ If the full export value is not ascertainable at the time of export, the value which the exporter expects to receive.", m, y + 2.5);
  doc.text("3. Export value may be indicated as nil in case the goods/services are sent without any consideration.", m, y + 5);

  return doc;
}

/**
 * 2. Generate Commercial Export Invoice
 * Single page A4 Portrait, Margins: 6.35 mm (0.25"), Scale 93%
 */
export function generateExportInvoicePdf(data) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const m = 6.35; // 0.25"
  const w = pageWidth - 2 * m; // 197.3 mm

  const formattedInvDate = formatTradeDocumentDate(data.invoiceDate);
  const westernWords = amountToWesternWords(data.invoiceAmount, data.currency || "USD");

  const gstStatusEval = evaluateGstInvoiceEndorsement({
    isGstRegistered: data.gstStatus !== "unregistered" && Boolean(data.gstin),
    gstin: data.gstin,
    gstStatus: data.gstStatus || "unregistered",
    lutArn: data.lutArn,
    financialYear: data.lutFinancialYear || "2026-27",
  });

  let y = m + 2;

  // Header Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text(data.exporterName || "Exporter Legal Name", m, y + 5);

  doc.setFontSize(16);
  doc.text("EXPORT INVOICE", pageWidth - m, y + 5, { align: "right" });
  y += 8;

  // Exporter Address & Invoice Meta
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navyText);

  const addrLines = doc.splitTextToSize(data.exporterAddress || "", 110);
  doc.text(addrLines, m, y + 3);

  doc.setFont("helvetica", "bold");
  doc.text(`Invoice no.: ${data.invoiceNumber || ""}`, pageWidth - m, y + 3, { align: "right" });
  doc.text(`Invoice date: ${formattedInvDate}`, pageWidth - m, y + 7.5, { align: "right" });
  y += Math.max(addrLines.length * 4, 12) + 2;

  // Tax Registrations Bar
  doc.setDrawColor(...COLORS.lightBorder);
  doc.setLineWidth(0.3);
  doc.line(m, y, pageWidth - m, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`GSTIN:`, m, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.gstin || (data.gstStatus === "unregistered" ? "Not Registered (URP)" : "-")}`, m + 14, y);

  doc.setFont("helvetica", "bold");
  doc.text(`PAN:`, m + 70, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.exporterPan || "-"}`, m + 80, y);

  doc.setFont("helvetica", "bold");
  doc.text(`IEC:`, m + 130, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.iec || "Not Applicable"}`, m + 140, y);
  y += 6;

  // Conditional GST LUT Endorsement Banner
  if (gstStatusEval.showEndorsement && gstStatusEval.endorsementText) {
    doc.setFillColor(...COLORS.altRowFill);
    doc.rect(m, y, w, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.navyAccent);
    doc.text(gstStatusEval.endorsementText, pageWidth / 2, y + 3.8, { align: "center" });
    if (gstStatusEval.lutArnText) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.text(gstStatusEval.lutArnText, pageWidth / 2, y + 6.8, { align: "center" });
    }
    y += 10;
  }

  // Service Recipient Section Box
  doc.setFillColor(...COLORS.softBlueHeader);
  doc.rect(m, y, w, 5.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("SERVICE RECIPIENT", m + 3, y + 4);
  y += 5.5;

  doc.rect(m, y, w, 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.navyText);
  doc.text(data.recipientName || "", m + 3, y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const recAddrLines = doc.splitTextToSize(data.recipientAddress || "", w - 6);
  doc.text(recAddrLines, m + 3, y + 8.5);
  doc.text(`Country: ${data.recipientCountry || ""}`, m + 3, y + 18);
  y += 25;

  // Table of Services Header
  const tableTop = y;
  const colDescW = 115;
  const colSacW = 25;
  const colCurrW = 20;
  const colAmtW = w - colDescW - colSacW - colCurrW; // 37.3 mm

  doc.setFillColor(...COLORS.altRowFill);
  doc.rect(m, y, colDescW, 6, "FD");
  doc.rect(m + colDescW, y, colSacW, 6, "FD");
  doc.rect(m + colDescW + colSacW, y, colCurrW, 6, "FD");
  doc.rect(m + colDescW + colSacW + colCurrW, y, colAmtW, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("Description of services", m + 3, y + 4.2);
  doc.text("SAC", m + colDescW + 3, y + 4.2);
  doc.text("Currency", m + colDescW + colSacW + 3, y + 4.2);
  doc.text("Amount", pageWidth - m - 3, y + 4.2, { align: "right" });
  y += 6;

  // Service Item Row
  const itemH = 32;
  doc.rect(m, y, colDescW, itemH);
  doc.rect(m + colDescW, y, colSacW, itemH);
  doc.rect(m + colDescW + colSacW, y, colCurrW, itemH);
  doc.rect(m + colDescW + colSacW + colCurrW, y, colAmtW, itemH);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.navyText);
  const descLines = doc.splitTextToSize(data.serviceDescription || "", colDescW - 6);
  doc.text(descLines, m + 3, y + 6);
  doc.text(data.sacCode || "998361", m + colDescW + 3, y + 6);
  doc.text(data.currency || "USD", m + colDescW + colSacW + 3, y + 6);
  doc.text(parseFloat(data.invoiceAmount || 0).toFixed(2), pageWidth - m - 3, y + 6, { align: "right" });
  y += itemH;

  // Total Row
  doc.rect(m, y, colDescW + colSacW + colCurrW, 7);
  doc.rect(m + colDescW + colSacW + colCurrW, y, colAmtW, 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`Total invoice value (${data.currency || "USD"})`, m + 3, y + 4.8);
  doc.text(parseFloat(data.invoiceAmount || 0).toFixed(2), pageWidth - m - 3, y + 4.8, { align: "right" });
  y += 7;

  // Amount in Words
  doc.rect(m, y, w, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`Amount in words: ${westernWords}`, m + 3, y + 5.5);
  y += 18;

  // Signatory Block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`For ${data.exporterName || "Exporter Legal Name"}`, pageWidth - m, y, { align: "right" });
  y += 16;

  doc.text(data.authorisedSignatory || "", pageWidth - m, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Authorised signatory", pageWidth - m, y + 4.5, { align: "right" });

  return doc;
}

/**
 * 3. Generate Bank AD Code Request Letter
 * Margins: 17.78 mm (0.7 inch), A4 Portrait (210 x 297 mm)
 * Replaces all broken external Excel links with internal dynamic application state.
 */
export function generateAdCodeLetterPdf(data) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const m = 17.78; // 0.7" margin
  const w = pageWidth - 2 * m; // 174.44 mm

  const formattedDate = data.invoiceDate ? formatTradeDocumentDate(data.invoiceDate) : formatTradeDocumentDate(new Date());

  let y = m + 2;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.navyTitle);
  doc.text("REQUEST FOR RBI AUTHORISED DEALER (AD) CODE", pageWidth / 2, y, { align: "center" });
  y += 10;

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.navyText);
  doc.text(`Date: ${formattedDate}`, m, y);
  y += 7;

  // Addressee Block (Dynamic bank name and branch)
  doc.text("To,", m, y);
  y += 4.5;
  doc.text("The Branch Manager / Forex Department", m, y);
  y += 4.5;
  doc.setFont("helvetica", "bold");
  doc.text(data.bankName || "Your Bank Name", m, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.text(data.bankBranch || "Bank Branch Address", m, y);
  y += 8;

  // Subject
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Subject: Request for confirmation / provision of RBI Authorised Dealer (AD) Code for Export Declaration Form (EDF)", m, y, { maxWidth: w });
  y += 10;

  // Salutation
  doc.setFont("helvetica", "normal");
  doc.text("Dear Sir/Madam,", m, y);
  y += 6;

  // Opening Paragraph
  const p1 = `I/We, ${data.exporterName || "Exporter Legal Name"}, maintain a bank account with your branch and receive / intend to receive foreign exchange remittances against export of services / eligible export transactions.`;
  const p1Lines = doc.splitTextToSize(p1, w);
  doc.text(p1Lines, m, y);
  y += p1Lines.length * 4.5 + 2;

  // Account Details Card Box (Dynamic!)
  doc.setFillColor(...COLORS.altRowFill);
  doc.setDrawColor(...COLORS.lightBorder);
  doc.rect(m, y, w, 24, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`Account Holder / Exporter Name:`, m + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(data.exporterName || "-", m + 58, y + 5);

  doc.setFont("helvetica", "bold");
  doc.text(`Account Number:`, m + 4, y + 10);
  doc.setFont("helvetica", "normal");
  doc.text(data.accountNumber || "____________________________", m + 58, y + 10);

  doc.setFont("helvetica", "bold");
  doc.text(`IFSC Code:`, m + 4, y + 15);
  doc.setFont("helvetica", "normal");
  doc.text(data.ifscCode || "____________________________", m + 58, y + 15);

  doc.setFont("helvetica", "bold");
  doc.text(`PAN:`, m + 4, y + 20);
  doc.setFont("helvetica", "normal");
  doc.text(data.exporterPan || "-", m + 58, y + 20);
  y += 28;

  // Purpose Paragraphs
  const p2 = "For the purpose of completing the Export Declaration Form (EDF) and related foreign exchange / FEMA documentation, I/we request you to kindly provide and confirm the RBI Authorised Dealer (AD) Code applicable to the bank branch / designated forex branch through which the above foreign exchange transactions are handled.";
  const p2Lines = doc.splitTextToSize(p2, w);
  doc.text(p2Lines, m, y);
  y += p2Lines.length * 4.5 + 2;

  const p3 = "If our account-holding branch is not itself an authorised forex / AD branch, kindly provide the AD Code and details of the linked / centralised / designated forex branch through which our foreign exchange transactions are processed.";
  const p3Lines = doc.splitTextToSize(p3, w);
  doc.text(p3Lines, m, y);
  y += p3Lines.length * 4.5 + 3;

  doc.setFont("helvetica", "bold");
  doc.text("Kindly confirm the following:", m, y);
  y += 5.5;

  doc.setFont("helvetica", "normal");
  doc.text("1. RBI Authorised Dealer (AD) Code: ______________________________________________", m + 2, y);
  y += 5;
  doc.text("2. Name / Address of designated AD / Forex Branch: ________________________________", m + 2, y);
  y += 5;
  doc.text("3. SWIFT / BIC Code (if applicable): ______________________________________________", m + 2, y);
  y += 5;
  doc.text("4. Confirmation that the above AD Code may be quoted in the EDF for export proceeds.", m + 2, y);
  y += 7;

  const p4 = "The information is required for regulatory documentation relating to export proceeds. Kindly provide the above details by email / stamped letter, as applicable.";
  const p4Lines = doc.splitTextToSize(p4, w);
  doc.text(p4Lines, m, y);
  y += p4Lines.length * 4.5 + 4;

  doc.text("Thank you.", m, y);
  y += 5;
  doc.text("Yours faithfully,", m, y);
  y += 7;

  doc.text(`Mobile: ${data.mobile || "________________"}`, m, y);
  y += 4.5;
  doc.text(`Email: ${data.email || "________________"}`, m, y);
  y += 6;

  doc.text(`Signature: ______________________________ (${data.authorisedSignatory || "Signatory"})`, m, y);

  return doc;
}

/**
 * 4. Generate Combined Compliance ZIP Archive
 * Packages all 3 PDFs and structured JSON metadata.
 */
export async function generateCombinedComplianceZip(data) {
  const zip = new JSZip();

  const edfDoc = generateEdfFormPdf(data);
  const invDoc = generateExportInvoicePdf(data);
  const adDoc = generateAdCodeLetterPdf(data);

  const edfBlob = edfDoc.output("blob");
  const invBlob = invDoc.output("blob");
  const adBlob = adDoc.output("blob");

  const sanitizedInv = (data.invoiceNumber || "Invoice").replace(/[/\\:*?"<>|]/g, "_");
  const sanitizedBank = (data.bankName || "Bank").replace(/[/\\:*?"<>|]/g, "_");

  zip.file(`1_RBI_Form_EDF_${sanitizedInv}.pdf`, edfBlob);
  zip.file(`2_Export_Invoice_${sanitizedInv}.pdf`, invBlob);
  zip.file(`3_Bank_AD_Code_Letter_${sanitizedBank}.pdf`, adBlob);

  const metadata = {
    application: "CreatorEDF",
    version: "1.0",
    generatedAt: new Date().toISOString(),
    invoiceNumber: data.invoiceNumber,
    invoiceDate: data.invoiceDate,
    exporter: {
      name: data.exporterName,
      pan: data.exporterPan,
      gstin: data.gstin,
      signatory: data.authorisedSignatory,
    },
    recipient: {
      name: data.recipientName,
      country: data.recipientCountry,
    },
    financials: {
      currency: data.currency,
      invoiceAmount: data.invoiceAmount,
      exchangeRate: data.exchangeRate,
      inrValue: calculateInrServicesValue(data.invoiceAmount, data.exchangeRate),
      sacCode: data.sacCode,
    },
    statutoryNotice:
      "CreatorEDF is an independent utility. It does not submit filings to RBI or guarantee bank acceptance.",
  };

  zip.file("compliance_metadata.json", JSON.stringify(metadata, null, 2));

  return await zip.generateAsync({ type: "blob" });
}

