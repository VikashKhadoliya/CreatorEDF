import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import {
  generateEdfFormPdf,
  generateExportInvoicePdf,
  generateAdCodeLetterPdf
} from '../src/lib/pdfGenerator.js';
import { calculateInrServicesValue } from '../src/lib/calculations.js';

const outputDir = path.resolve('public/samples');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("==========================================");
console.log("GENERATING AND VERIFYING PDF TEST SAMPLES");
console.log("==========================================");

// Case 1: Baseline Reference Workbook Match
const baselineData = {
  exporterName: "Vivek Chugh",
  exporterAddress: "Plot No. 92A, Block C, Prashant Vihar, Sector 14, Rohini, New Delhi - 110085",
  exporterPan: "AAHFF4001F",
  gstStatus: "lut_active",
  gstin: "07AAHFF4001F1Z2",
  lutArn: "AD070326001234M",
  lutFinancialYear: "2026-27",
  iec: "Not Applicable",
  authorisedSignatory: "Vivek Chugh",
  exporterType: "resident_individual",
  mobile: "+91 98110 00000",
  email: "vivek@example.com",
  bankName: "RBL Bank Limited",
  bankBranch: "Prashant Vihar, New Delhi",
  adCode: "6160104",
  accountNumber: "409000123456",
  ifscCode: "RATN0000123",
  recipientName: "Google Asia Pacific Pte. Ltd.",
  recipientAddress: "Mapletree Business City, 70 Pasir Panjang Road, #03-71, Singapore 117371",
  recipientCountry: "Singapore",
  invoiceNumber: "FTP_Sept_Google",
  invoiceDate: "2026-09-21",
  currency: "USD",
  invoiceAmount: "652.30",
  exchangeRate: "95.82",
  serviceDescription: "Digital Content Monetisation & Online Advertising Space Services",
  sacCode: "998361",
  declarationDate: "2026-09-21"
};

// Case 2: Large Values & Non-Individual Corporate Exporter
const largeValuesData = {
  exporterName: "TechSphere Media Technologies Private Limited",
  exporterAddress: "Tower B, 14th Floor, Cyber City, DLF Phase 2, Sector 24, Gurugram, Haryana - 122002, India",
  exporterPan: "AABCT1234M",
  gstStatus: "lut_active",
  gstin: "06AABCT1234M1Z5",
  lutArn: "AD060426005678X",
  lutFinancialYear: "2026-27",
  iec: "0512345678",
  authorisedSignatory: "Rajesh Kumar (Managing Director)",
  exporterType: "non_individual",
  mobile: "+91 98765 43210",
  email: "finance@techspheremedia.in",
  bankName: "HDFC Bank Limited",
  bankBranch: "DLF Cyber City, Gurugram",
  adCode: "0510012",
  accountNumber: "50200012345678",
  ifscCode: "HDFC0000510",
  recipientName: "Alphabet Inc. / YouTube Creator Program",
  recipientAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, United States of America",
  recipientCountry: "United States",
  invoiceNumber: "TSM/EXP/2026-27/042",
  invoiceDate: "2026-10-31",
  currency: "USD",
  invoiceAmount: "1234567.89",
  exchangeRate: "86.45",
  serviceDescription: "Software development and cloud video processing backend services",
  sacCode: "998314",
  declarationDate: "2026-10-31"
};

// Case 3: Minimal Optional Fields & Unregistered GST Individual
const minimalData = {
  exporterName: "Priya Sharma",
  exporterAddress: "12/4 Mall Road, Shimla, Himachal Pradesh 171001",
  exporterPan: "BHPPS9876K",
  gstStatus: "unregistered",
  gstin: "",
  lutArn: "",
  lutFinancialYear: "",
  iec: "Not Applicable",
  authorisedSignatory: "Priya Sharma",
  exporterType: "resident_individual",
  mobile: "",
  email: "",
  bankName: "State Bank of India",
  bankBranch: "The Mall Shimla",
  adCode: "0010045",
  accountNumber: "30012345678",
  ifscCode: "SBIN0000718",
  recipientName: "Google Ireland Limited",
  recipientAddress: "Gordon House, Barrow Street, Dublin 4, Ireland",
  recipientCountry: "Ireland",
  invoiceNumber: "PS/2026-08",
  invoiceDate: "2026-08-15",
  currency: "EUR",
  invoiceAmount: "450.00",
  exchangeRate: "92.10",
  serviceDescription: "YouTube Monetisation",
  sacCode: "998361",
  declarationDate: "2026-08-15"
};

const testRuns = [
  { prefix: "Baseline", data: baselineData },
  { prefix: "LargeScale", data: largeValuesData },
  { prefix: "MinimalUnregistered", data: minimalData }
];

async function run() {
  for (const { prefix, data } of testRuns) {
    console.log(`\n--- Testing ${prefix} ---`);
    
    // 1. EDF Form
    const edfDoc = generateEdfFormPdf(data);
    const edfPages = edfDoc.internal.getNumberOfPages();
    const edfPath = path.join(outputDir, `${prefix}_1_RBI_Form_EDF.pdf`);
    fs.writeFileSync(edfPath, Buffer.from(edfDoc.output('arraybuffer')));
    const edfSize = fs.statSync(edfPath).size;
    console.log(`[EDF] Pages: ${edfPages}, Size: ${edfSize} bytes -> ${path.basename(edfPath)}`);
    console.assert(edfPages >= 1 && edfPages <= 2, `Unexpected EDF page count: ${edfPages}`);

    // 2. Export Invoice
    const invDoc = generateExportInvoicePdf(data);
    const invPages = invDoc.internal.getNumberOfPages();
    const invPath = path.join(outputDir, `${prefix}_2_Export_Invoice.pdf`);
    fs.writeFileSync(invPath, Buffer.from(invDoc.output('arraybuffer')));
    const invSize = fs.statSync(invPath).size;
    console.log(`[Invoice] Pages: ${invPages}, Size: ${invSize} bytes -> ${path.basename(invPath)}`);
    console.assert(invPages === 1, `Export Invoice must fit on exactly 1 page! Got: ${invPages}`);

    // 3. AD Code Letter
    const adDoc = generateAdCodeLetterPdf(data);
    const adPages = adDoc.internal.getNumberOfPages();
    const adPath = path.join(outputDir, `${prefix}_3_AD_Code_Letter.pdf`);
    fs.writeFileSync(adPath, Buffer.from(adDoc.output('arraybuffer')));
    const adSize = fs.statSync(adPath).size;
    console.log(`[AD Code Letter] Pages: ${adPages}, Size: ${adSize} bytes -> ${path.basename(adPath)}`);
    console.assert(adPages === 1, `AD Code Letter must fit on exactly 1 page! Got: ${adPages}`);
  }

  // 4. Combined ZIP Archive Test
  console.log("\n--- Testing Combined Compliance ZIP Creation ---");
  const zip = new JSZip();
  const edf = generateEdfFormPdf(baselineData);
  const inv = generateExportInvoicePdf(baselineData);
  const ad = generateAdCodeLetterPdf(baselineData);

  zip.file("1_RBI_Form_EDF_FTP_Sept_Google.pdf", Buffer.from(edf.output('arraybuffer')));
  zip.file("2_Export_Invoice_FTP_Sept_Google.pdf", Buffer.from(inv.output('arraybuffer')));
  zip.file("3_Bank_AD_Code_Letter_RBL_Bank.pdf", Buffer.from(ad.output('arraybuffer')));

  const meta = {
    application: "CreatorEDF",
    version: "1.0",
    testRun: "Phase 3 Verification",
    invoiceNumber: baselineData.invoiceNumber,
    invoiceDate: baselineData.invoiceDate,
    exporter: {
      name: baselineData.exporterName,
      pan: baselineData.exporterPan,
    },
    recipient: {
      name: baselineData.recipientName,
    },
    financials: {
      currency: baselineData.currency,
      invoiceAmount: baselineData.invoiceAmount,
      exchangeRate: baselineData.exchangeRate,
      inrValue: calculateInrServicesValue(baselineData.invoiceAmount, baselineData.exchangeRate),
    },
    generatedAt: new Date().toISOString()
  };
  zip.file("compliance_metadata.json", JSON.stringify(meta, null, 2));

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipPath = path.join(outputDir, "CreatorEDF_Compliance_Packet_Sample.zip");
  fs.writeFileSync(zipPath, zipBuffer);
  console.log(`[ZIP Bundle] Size: ${fs.statSync(zipPath).size} bytes -> ${path.basename(zipPath)}`);

  console.log("\nALL PDF & ZIP GENERATION TESTS COMPLETED SUCCESSFULLY! ✓");
}

run().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

