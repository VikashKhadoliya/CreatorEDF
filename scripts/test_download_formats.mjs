import assert from "node:assert";
import {
  generateEdfFormPdf,
  generateExportInvoicePdf,
  generateAdCodeLetterPdf,
  generateCombinedComplianceZip,
} from "../src/lib/pdfGenerator.js";
import { validateDocumentInputs } from "../src/lib/calculations.js";
import JSZip from "jszip";

console.log("=== CREATOREDF DOWNLOAD SYSTEM COMPREHENSIVE VERIFICATION ===\n");

// 1. Test Input Validation
console.log("1. Testing Input Validation Rules...");
const emptyData = {
  exporterName: "",
  exporterPan: "",
  bankName: "",
  adCode: "",
  invoiceNumber: "",
  invoiceDate: "",
  currency: "",
  invoiceAmount: "",
  exchangeRate: "",
  sacCode: "",
  serviceDescription: "",
};

const emptyValidation = validateDocumentInputs(emptyData);
assert.strictEqual(emptyValidation.isValid, false, "Empty inputs must be invalid");
console.log(`✓ Confirmed: Empty form blocked with ${emptyValidation.errors.length} validation errors:`);
emptyValidation.errors.forEach((err) => console.log(`   - ${err}`));

const sampleValidData = {
  exporterName: "Rohit Sharma",
  exporterAddress: "Flat 402, Sea View Apartments, Bandra West, Mumbai, Maharashtra 400050",
  exporterPan: "ABCDE1234F",
  exporterType: "resident_individual",
  gstStatus: "registered_lut",
  gstin: "27ABCDE1234F1Z5",
  lutArn: "AD2703260019284",
  lutFinancialYear: "2026-27",
  iec: "Not Applicable",
  authorisedSignatory: "Rohit Sharma",
  bankName: "HDFC Bank",
  bankBranch: "Bandra West Branch, Mumbai",
  adCode: "0510012",
  accountNumber: "50100234567890",
  ifscCode: "HDFC0000123",
  mobile: "+91 98200 12345",
  email: "rohit@example.com",
  recipientName: "Google Asia Pacific Pte. Ltd.",
  recipientAddress: "70 Pasir Panjang Road, #03-01, Mapletree Business City, Singapore 117371",
  recipientCountry: "Singapore",
  invoiceNumber: "INV-2026-001",
  invoiceDate: "2026-11-10",
  currency: "USD",
  invoiceAmount: "1250.00",
  netRealisableValue: "1250.00",
  exchangeRate: "86.50",
  sacCode: "998314",
  serviceDescription: "Digital advertising display services & online video monetization",
  declarationDate: "2026-11-10",
};

const validValidation = validateDocumentInputs(sampleValidData);
assert.strictEqual(validValidation.isValid, true, "Fully populated form must be valid");
console.log("✓ Confirmed: Valid form passes validation cleanly.\n");

// 2. Test Individual PDF Generation & Byte Integrity
console.log("2. Testing Individual PDF Generation & Header Verification...");

// Form EDF PDF
const edfDoc = generateEdfFormPdf(sampleValidData);
const edfOutput = edfDoc.output("arraybuffer");
const edfHeader = Buffer.from(edfOutput.slice(0, 5)).toString("utf-8");
assert.strictEqual(edfHeader, "%PDF-", "EDF document must begin with %PDF- header");
console.log(`✓ Form EDF PDF generated successfully (${edfOutput.byteLength} bytes, header: ${edfHeader})`);

// Export Invoice PDF
const invDoc = generateExportInvoicePdf(sampleValidData);
const invOutput = invDoc.output("arraybuffer");
const invHeader = Buffer.from(invOutput.slice(0, 5)).toString("utf-8");
assert.strictEqual(invHeader, "%PDF-", "Invoice document must begin with %PDF- header");
console.log(`✓ Export Invoice PDF generated successfully (${invOutput.byteLength} bytes, header: ${invHeader})`);

// Bank AD Code Letter PDF
const adDoc = generateAdCodeLetterPdf(sampleValidData);
const adOutput = adDoc.output("arraybuffer");
const adHeader = Buffer.from(adOutput.slice(0, 5)).toString("utf-8");
assert.strictEqual(adHeader, "%PDF-", "AD Letter document must begin with %PDF- header");
console.log(`✓ Bank AD Code Letter PDF generated successfully (${adOutput.byteLength} bytes, header: ${adHeader})\n`);

// 3. Test Combined ZIP Generation & File Inspection
console.log("3. Testing Combined ZIP Generation & Archive Contents...");
const zipBlob = await generateCombinedComplianceZip(sampleValidData);
const zipBuffer = Buffer.from(await zipBlob.arrayBuffer());
assert(zipBuffer.length > 5000, "ZIP archive must be non-empty and reasonably sized");

const unzipped = await JSZip.loadAsync(zipBuffer);
const fileNames = Object.keys(unzipped.files);
console.log(`✓ ZIP Archive created successfully (${zipBuffer.length} bytes). Contains ${fileNames.length} files:`);
fileNames.forEach((name) => console.log(`   - ${name}`));

assert(fileNames.includes("CreatorEDF_EDF_Form_INV-2026-001.pdf"), "Must contain CreatorEDF_EDF_Form PDF");
assert(fileNames.includes("CreatorEDF_Export_Invoice_INV-2026-001.pdf"), "Must contain CreatorEDF_Export_Invoice PDF");
assert(fileNames.includes("CreatorEDF_AD_Code_Letter_HDFC_Bank.pdf"), "Must contain CreatorEDF_AD_Code_Letter PDF");
assert(fileNames.includes("compliance_metadata.json"), "Must contain compliance_metadata.json");

const metadataStr = await unzipped.file("compliance_metadata.json").async("text");
const metadata = JSON.parse(metadataStr);
assert.strictEqual(metadata.invoiceNumber, "INV-2026-001");
assert.strictEqual(metadata.exporter.name, "Rohit Sharma");
console.log("✓ Compliance metadata verified inside ZIP.\n");

console.log("=================================================");
console.log("ALL TESTS PASSED! DOWNLOAD SYSTEM 100% OPERATIONAL");
console.log("=================================================");

