# CreatorEDF — External Dependencies & Legacy Reference Audit

This document investigates the external workbook references, cached link data, and missing internal rows discovered within `Creator_Export_EDF_Invoice_Utility.xlsm`.

---

## 1. External Reference Inventory

Within the OpenXML package:
- **Relationship File**: `xl/_rels/workbook.xml.rels`
  - Relationship `rId5` targets `externalLinks/externalLink1.xml`
- **External Link Definition**: `xl/externalLinks/externalLink1.xml`
- **External Link Target**: `xl/externalLinks/_rels/externalLink1.xml.rels`
  - Relative Target: `Creator_Export_EDF_Invoice_Utility_with_AD_Request.xlsx`
  - Absolute URI: `file:///C:\Users\Vivek%20Awasthi\Desktop\Creator_Export_EDF_Invoice_Utility_with_AD_Request.xlsx`

---

## 2. Cached Sheet Data in `externalLink1.xml`

The OpenXML package stores cached copies of values retrieved from the external workbook:

```xml
<sheetDataSet>
  <sheetData sheetId="0">
    <row r="8">
      <cell r="C8" t="str"><v>FinTaxPro Advisory LLP</v></cell>
    </row>
    <row r="10">
      <cell r="C10" t="str"><v>AAHFF4001F</v></cell>
    </row>
  </sheetData>
</sheetDataSet>
```

Notice that only rows 8 and 10 were cached from `sheetId="0"` (`User Input`). Rows 52, 53, 54, and 55 were **not cached**, which is why opening `AD Code Letter` in standard Excel displays empty underscores `____________________________` for Account Number, IFSC, Mobile, and Email!

---

## 3. Cell-by-Cell External References in `AD Code Letter`

The worksheet `AD Code Letter` (`xl/worksheets/sheet4.xml`) contains four formulas that explicitly reference `[1]User Input`:

| Row | Cell | Existing Formula in Sheet 4 | Target Referenced | State in Active Workbook |
|---|---|---|---|---|
| 17 | `A17` | `="I/We, "&IF('[1]User Input'!$C$8="","________________",'[1]User Input'!$C$8)&", maintain a bank account..."` | `User Input!$C$8` (Exporter Name) | Present in active sheet at `C8` (`FinTaxPro Advisory LLP`) |
| 20 | `A20` | `="Account Holder / Exporter Name: "&IF('[1]User Input'!$C$8="","____________________________",'[1]User Input'!$C$8)&CHAR(10)&"Account Number: "&IF('[1]User Input'!$C$52="","____________________________",'[1]User Input'!$C$52)&CHAR(10)&"IFSC Code: "&IF('[1]User Input'!$C$53="","____________________________",'[1]User Input'!$C$53)&CHAR(10)&"PAN: "&IF('[1]User Input'!$C$10="","____________________________",'[1]User Input'!$C$10)` | `C8` (Name), `C52` (A/C No), `C53` (IFSC), `C10` (PAN) | `C8` and `C10` exist; `C52` and `C53` are **completely empty** in the active workbook |
| 52 | `A52` | `="Mobile: "&IF('[1]User Input'!$C$54="","________________",'[1]User Input'!$C$54)` | `C54` (Mobile) | **Completely empty** in the active workbook |
| 53 | `A53` | `="Email: "&IF('[1]User Input'!$C$55="","________________",'[1]User Input'!$C$55)` | `C55` (Email) | **Completely empty** in the active workbook |

---

## 4. Origin & Structural Evolution of the Workbook

1. **Phase 1 Utility**:
   The author initially created `Creator_Export_EDF_Invoice_Utility.xlsm` focusing exclusively on the 2-document workflow: `EDF Form` and `Export Invoice`. The VBA macro `ExportCombinedPDF` explicitly binds only those two sheets:
   ```vba
   ThisWorkbook.Worksheets(Array("EDF Form", "Export Invoice")).Copy
   ```
2. **Phase 2 Expansion (Fork)**:
   The author later developed an expanded workbook on their desktop titled:
   `Creator_Export_EDF_Invoice_Utility_with_AD_Request.xlsx`
   In that variant, rows 51–55 of `User Input` were added to collect:
   - Row 52: Bank Account Number
   - Row 53: Bank IFSC Code
   - Row 54: Exporter Mobile
   - Row 55: Exporter Email
3. **Imperfect Merge**:
   When the `AD Code Letter` sheet was copied into the `.xlsm` utility, Excel retained the external workbook link `[1]` to the author's desktop file instead of repointing the formulas to local cells. Furthermore, rows 52–55 in the active `.xlsm` `User Input` sheet were left blank and hidden.
4. **Hardcoded Cells**:
   In `AD Code Letter`:
   - Cell `A8` contains static text `"RBL BANK"` instead of referencing `User Input!C32` (`Authorised dealer / bank`).
   - Cell `A9` contains static text `"Prashant Vihar, Delhi, India"` instead of referencing `User Input!C33` (`AD branch / address`).
   - Cell `A4` contains static text `"Date:"` without a date value or reference to `User Input!C37`.

---

## 5. Architectural Migration Plan for CreatorEDF

In the web application:
1. **Zero External Dependencies**: All external links and `[1]` prefixes are eliminated.
2. **Unified Data Model**:
   The Exporter Profile and Bank Profile data stores in IndexedDB will natively include:
   - `bankAccountNumber` (string)
   - `bankIfscCode` (string, validated with regex `^[A-Z]{4}0[A-Z0-9]{6}$`)
   - `exporterMobile` (string, 10-digit mobile)
   - `exporterEmail` (string, valid email)
3. **Dynamic AD Code Letter Generation**:
   The `AD Code Letter` template will be rendered 100% dynamically from internal state:
   - Bank Name: from `bankName` (replaces hardcoded "RBL BANK")
   - Bank Branch: from `bankBranchAddress` (replaces hardcoded "Prashant Vihar...")
   - Date: dynamically set to current date or remittance declaration date
   - Signatory: dynamic name from `authorisedSignatory`
4. **Standalone & Combined Download**:
   Unlike the Excel macro which excluded the AD Code Letter from PDF export, CreatorEDF will allow users to:
   - Preview and download `AD Code Letter` as an independent PDF.
   - Download the combined 3-document compliance packet in a single click (or ZIP archive).

