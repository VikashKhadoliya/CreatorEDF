import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

console.log("==========================================");
console.log("VERIFYING GENERATED PDFS & ZIP ARCHIVE");
console.log("==========================================");

const samplesDir = path.resolve('public/samples');
const expectedPdfs = [
  'Baseline_1_RBI_Form_EDF.pdf',
  'Baseline_2_Export_Invoice.pdf',
  'Baseline_3_AD_Code_Letter.pdf',
  'LargeScale_1_RBI_Form_EDF.pdf',
  'LargeScale_2_Export_Invoice.pdf',
  'LargeScale_3_AD_Code_Letter.pdf',
  'MinimalUnregistered_1_RBI_Form_EDF.pdf',
  'MinimalUnregistered_2_Export_Invoice.pdf',
  'MinimalUnregistered_3_AD_Code_Letter.pdf'
];

let allValid = true;

for (const pdfName of expectedPdfs) {
  const p = path.join(samplesDir, pdfName);
  if (!fs.existsSync(p)) {
    console.error(`FAIL: File does not exist: ${pdfName}`);
    allValid = false;
    continue;
  }
  const size = fs.statSync(p).size;
  if (size <= 0) {
    console.error(`FAIL: File is empty (0 bytes): ${pdfName}`);
    allValid = false;
    continue;
  }
  const buf = fs.readFileSync(p);
  const header = buf.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    console.error(`FAIL: Invalid PDF header for ${pdfName}: ${header}`);
    allValid = false;
    continue;
  }
  console.log(`PASS: ${pdfName} | Size: ${size} bytes | Header: ${header}`);
}

// Check ZIP Archive
const zipPath = path.join(samplesDir, 'CreatorEDF_Compliance_Packet_Sample.zip');
if (!fs.existsSync(zipPath)) {
  console.error("FAIL: ZIP archive does not exist!");
  process.exit(1);
}
const zipSize = fs.statSync(zipPath).size;
console.log(`\nPASS: ZIP archive exists | Size: ${zipSize} bytes`);

const zipData = fs.readFileSync(zipPath);
const zip = await JSZip.loadAsync(zipData);
const zipEntries = Object.keys(zip.files);
console.log(`ZIP contains ${zipEntries.length} files:`);

let pdfCountInZip = 0;
let jsonCountInZip = 0;

for (const entryName of zipEntries) {
  const data = await zip.files[entryName].async('nodebuffer');
  console.log(` - Entry: ${entryName} | Size: ${data.length} bytes`);
  if (entryName.endsWith('.pdf')) {
    pdfCountInZip++;
    const head = data.slice(0, 5).toString('ascii');
    console.assert(head.startsWith('%PDF'), `Bad header in ${entryName}`);
    console.log(`   ✓ Valid PDF header: ${head}`);
  } else if (entryName.endsWith('.json')) {
    jsonCountInZip++;
    const json = JSON.parse(data.toString('utf-8'));
    console.log(`   ✓ Valid Metadata: invoice=${json.invoiceNumber}, INR=₹${json.financials.inrValue}`);
  }
}

console.assert(pdfCountInZip === 3, `Expected 3 PDFs in ZIP, got ${pdfCountInZip}`);
console.assert(jsonCountInZip === 1, `Expected 1 JSON in ZIP, got ${jsonCountInZip}`);

console.log("\nALL PDF FILES & ZIP INTEGRITY CHECKS PASSED! ✓");

