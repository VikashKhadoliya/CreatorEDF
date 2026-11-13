# CreatorEDF — Comprehensive Field Mapping Specification

This document maps every input field, calculated field, static legal boilerplate, and destination field across the four worksheets of the reference utility (`User Input`, `EDF Form`, `Export Invoice`, and `AD Code Letter`).

---

## 1. Master Input Fields (`User Input` Sheet)

| Row | Cell | Field Name | Type | Data Type | Validation / Constraints | Sample Value in Workbook | Production Default / Recommendation | Destination Documents |
|---|---|---|---|---|---|---|---|---|
| 8 | `C8` | Exporter / Supplier Name | Input | String | Mandatory, max 150 chars | `FinTaxPro Advisory LLP` | Empty (User must provide legal/business name) | EDF 1, Invoice, AD Letter |
| 9 | `C9` | Exporter Address | Input | Multi-line String | Mandatory, full address with PIN | `PLOT 92A KH NO 417, 1ST FLOOR... Delhi - 110086, India` | Empty (User address) | EDF 1, Invoice |
| 10 | `C10` | Exporter PAN | Input | String | 10 chars, regex `[A-Z]{5}[0-9]{4}[A-Z]{1}` | `AAHFF4001F` | Empty | EDF 1, Invoice, AD Letter |
| 11 | `C11` | Exporter GSTIN | Input | String | 15 chars, regex or "URP" / "Not Applicable" | `07AAHFF4001F1ZZ` | Empty (or "Not Registered" / "URP") | EDF 1, Invoice |
| 12 | `C12` | Import Export Code (IEC) | Input | String | 10 chars PAN-based or "Not Applicable" | `Not Applicable` | `Not Applicable` (Exempt under FTP for service exports under \$10k/specified categories) | EDF 1, Invoice |
| 13 | `C13` | Authorised Signatory | Input | String | Mandatory, person signing | `Vivek` | Empty (Creator full legal name) | EDF 4, Invoice |
| 16 | `C16` | Recipient / Platform Company | Input | String | Mandatory, contracting entity | `Google LLC` | Selectable / Editable Platform Entity | EDF 1 & 2B, Invoice |
| 17 | `C17` | Recipient Address | Input | Multi-line String | Mandatory, platform legal address | `1600 Amphitheatre Pkwy Mountain View, CA 94043 United States` | Auto-populated by Recipient Profile | EDF 1 & 2B, Invoice |
| 18 | `C18` | Recipient Country | Input | String | Mandatory, ISO country name | `United States` | Auto-populated by Recipient Profile | EDF 1 & 2B, Invoice |
| 21 | `C21` | Invoice Number | Input | String | Alphanumeric, max 16 chars per GST Rule 46 | `FTP_Sept_Google_26-27` | Generated sequential pattern or manual entry | EDF 2B, Invoice |
| 22 | `C22` | Invoice Date | Input | Date (ISO 8601) | Valid date, typically remittance issue date | `2026-09-21` (Excel serial `46286`) | Current / Payment Statement Date | EDF 2B, Invoice |
| 23 | `C23` | Invoice Currency | Input | String (ISO 4217) | 3-letter code (`USD`, `EUR`, `GBP`, etc.) | `USD` | `USD` (default for AdSense) | EDF 2B, Invoice |
| 24 | `C24` | Invoice Amount | Input | Decimal | Positive number, 2 decimal places | `652.30` | Parsed from AdSense Statement | EDF 2B, Invoice, Words |
| 25 | `C25` | Net Realisable Value | Input / Calc | Decimal | Positive number, defaults to `C24` | `652.30` (formula: `+C24`) | Equal to Invoice Amount unless bank deductions occur | EDF 2B |
| 26 | `C26` | Description of Services | Input | String | Mandatory description of monetisation | `YouTube AdSense / digital content monetisation services` | Preset library (e.g. YouTube Monetisation, App Monetisation) | EDF 1 & 2B, Invoice |
| 27 | `C27` | SAC Code | Input | String | 6-digit Services Accounting Code | `998361` | Configurable selection from CBIC SAC library (defaults to suggested code e.g. `998361` based on service description, subject to user confirmation) | EDF 2B, Invoice |
| 30 | `C30` | EDF Form Number | Input | String | Optional, assigned if pre-generated | Empty | Empty | EDF 1 |
| 31 | `C31` | Category of Exporter | Input | String | Mandatory category | `Custom (DTA units)` | `Custom (DTA units)` | EDF 1 |
| 32 | `C32` | Authorised Dealer / Bank | Input | String | Name of the AD Category-I Bank | `RBL BANK` | User's receiving bank name | EDF 1, AD Letter |
| 33 | `C33` | AD Branch / Address | Input | String | Physical address of forex/AD branch | `Prashant Vihar, Delhi, India` | User's bank branch address | EDF 1, AD Letter |
| 34 | `C34` | AD Code | Input | String | 7-digit numeric code issued by RBI | `6160104` | 7-digit code obtained from bank | EDF 1 |
| 35 | `C35` | Mode of Realisation | Input | String | Prescribed FEMA payment channel | `Others - bank transfer` | `Others - bank transfer` | EDF 1 |
| 36 | `C36` | Exchange Rate (INR per unit) | Input | Decimal | Positive exchange rate | `95.82` | Realized TT rate or CBIC reference rate | Calculation `C42`, Words `C43` |
| 37 | `C37` | Exporter Declaration Date | Input | Date (ISO 8601) | Date of signing | `2026-09-21` (Excel serial `46286`) | Invoice Date or Today | EDF 4 |
| 38 | `C38` | Realisation Deadline | Input | Date (ISO 8601) | Mandatory FEMA statutory period | `2026-09-30` (Excel serial `46295`) | 9 months from export date per RBI Master Direction | EDF 4 |

---

## 2. Missing Fields Required for `AD Code Letter`

In the original workbook, `AD Code Letter` references broken external ranges (`[1]User Input!$C$52:$C$55`). These fields must be formalized in the Exporter / Bank schema:

| Extended ID | Field Label | Data Type | Validation | Sample / Target Value | Usage in AD Code Letter |
|---|---|---|---|---|---|
| `bank_account_number` | Bank Account Number | String | 9 to 18 digits alphanumeric | `____________________________` | Section 20 line 2 |
| `bank_ifsc_code` | Bank IFSC Code | String | 11 chars regex `^[A-Z]{4}0[A-Z0-9]{6}$` | `____________________________` | Section 20 line 3 |
| `exporter_mobile` | Exporter Mobile Number | String | 10 digits with country code | `________________` | Section 52 line 1 |
| `exporter_email` | Exporter Email Address | String | Standard email format | `________________` | Section 53 line 1 |

---

## 3. Destination Mapping: `EDF Form` Sheet (`$A$1:$O$144`)

| Section / Box | Cell Range | Visible Label / Header | Formula / Source Expression | Rendered Sample Content |
|---|---|---|---|---|
| Form Header | `A1:O1` | `Export Declaration Form` | Static | `Export Declaration Form` |
| Section 1 Header | `A3:O3` | `1. General Information:` | Static | `1. General Information:` |
| Export Type | `A4:G6` | `Type of export:` | `"Type of export: Services"` | `Type of export: Services` |
| Form No | `H4:O6` | `Form No.:` | `"Form No.: " & IF(C30="","",C30)` | `Form No.: ` |
| Shipping Bill | `A7:G11` | `Shipping Bill No. & Date:` | `"Shipping Bill No. & Date: Not applicable"` | `Shipping Bill No. & Date: Not applicable` |
| Delivery Mode | `H7:O11` | `Mode of Transport / Delivery:` | `"Mode of Transport / Delivery: Internet"` | `Mode of Transport / Delivery: Internet` |
| Exporter Category | `A12:G16` | `Category of Exporter:` | `"Category of Exporter: " & C31` | `Category of Exporter: Custom (DTA units)` |
| AD Code | `H12:O16` | `AD code:` | `"AD code: " & C34` | `AD code: 6160104` |
| Registrations | `A17:G22` | `IE Code: ... GSTIN: ... PAN: ...` | `"IE Code: " & C12 & CHAR(10) & "GSTIN: " & C11 & CHAR(10) & "PAN: " & C10` | `IE Code: Not Applicable\nGSTIN: 07AAHFF4001F1ZZ\nPAN: AAHFF4001F` |
| AD Bank & Branch | `H17:O22` | `AD Name & Address:` | `"AD Name & Address:" & CHAR(10) & C32 & CHAR(10) & C33` | `AD Name & Address:\nRBL BANK\nPrashant Vihar, Delhi, India` |
| Exporter Identity | `A23:G28` | `Exporter Name & Address:` | `"Exporter Name & Address:" & CHAR(10) & C8 & CHAR(10) & C9` | `Exporter Name & Address:\nFinTaxPro Advisory LLP\nPLOT 92A...` |
| Realisation Mode | `H23:O28` | `Mode of Realisation:` | `"Mode of Realisation: " & C35` | `Mode of Realisation: Others - bank transfer` |
| Consignee | `A29:G34` | `Consignee Name & Address:` | `"Consignee Name & Address:" & CHAR(10) & C16 & CHAR(10) & C17` | `Consignee Name & Address:\nGoogle LLC\n1600 Amphitheatre Pkwy...` |
| Source Port | `H29:O34` | `Port of Loading...` | `"Port of Loading / Source Port in case of SEZ: Not applicable"` | `Port of Loading / Source Port in case of SEZ: Not applicable` |
| Third Party Details | `A35:G41` | `Third Party Name...` | Static Not applicable boilerplate | `Third Party Name & Address: Not applicable\nRelationship: Not applicable` |
| Destination Country | `H35:K41` | `Country of Final Destination:`| `"Country of Final Destination: " & C18` | `Country of Final Destination: United States` |
| Port of Discharge | `L35:O41` | `Port of Discharge:` | `"Port of Discharge: Not applicable"` | `Port of Discharge: Not applicable` |
| LC / BG Details | `A42:G44` | `Name of the AD... in case of LC/BG`| Evaluates if `C35` is LC/BG, else "Not applicable" | `Name of the AD and AD code, in case of LC / BG: Not applicable / Not applicable` |
| LEO Date | `H42:O44` | `Date of Let Export Order:` | Static Not applicable | `Date of Let Export Order (LEO): Not applicable` |
| Services Description | `A45:O47` | `Description of Goods / Services:`| `"Description of Goods / Services: " & C26` | `Description of Goods / Services: YouTube AdSense / digital content monetisation services` |
| Total INR in Words | `A48:O50` | `Total FOB / Services value in words:`| `"Total FOB / Services value in words (INR): " & C43` | `Total FOB / Services value in words (INR): Indian Rupees Sixty Two Thousand...` |
| Section 2A Header | `A51:O53` | `2A. Details of Export Value^ of Goods` | Static | `2A. Details of Export Value^ of Goods (This part shall be repeated...)` |
| 2A Table Rows | `A54:O62` | Particulars / Currency / Amount | Static table rows with Net Realisable Value marked `Not applicable` | Table of goods elements marked Not applicable |
| Row 65 Spacer | `A65:O65` | Hidden spacer | None | Blank |
| Section 2B Header | `A66:O67` | `2B. Details of Export Value^ of Services` | Static | `2B. Details of Export Value^ of Services` / `2B. Details of Services Exported` |
| 2B S.No | `A74:A87` | S.No. | `1` | `1` |
| 2B Buyer | `B74:C87` | Name & Address of Buyer | `C16 & CHAR(10) & C17` | `Google LLC\n1600 Amphitheatre Pkwy...` |
| 2B Country | `D74:D87` | Country of Destination | `C18` | `United States` |
| 2B Invoice No | `E74:E87` | Invoice No. | `C21` | `FTP_Sept_Google_26-27` |
| 2B Invoice Date | `F74:F87` | Date | `TEXT(C22, "dd-mmm-yyyy")` | `21-Sep-2026` |
| 2B Currency | `G74:G87` | Currency | `C23` | `USD` |
| 2B Amount | `H74:H87` | Amount | `TEXT(C24, "#,##0.00")` | `652.30` |
| 2B Net Realisable | `I74:I87` | Net Realisable Value | `TEXT(C41, "#,##0.00")` | `652.30` |
| 2B Contract Ref | `J74:K87` | Contract Ref. and Date | `"Not applicable"` | `Not applicable` |
| 2B Description | `L74:M87` | Description of services | `C26` | `YouTube AdSense / digital content monetisation services` |
| 2B SAC Code | `N74:N87` | SAC Code | `C27` | `998361` |
| 2B Remarks | `O74:O87` | Remarks | `"Not applicable"` | `Not applicable` |
| Section 3 | `A89:O98` | `3. Applicable for Export under FPO / Couriers` | FPO/Courier details marked Not applicable; AD stamp space | Courier / FPO boilerplate |
| Section 4 Header | `A100:O100` | `4. Declaration by the Exporters (All types of exports)` | Static | `4. Declaration by the Exporters (All types of exports)` |
| Section 4 Text | `A101:O115` | Exporter Undertaking | Concatenation of FEMA undertaking + deadline date `C38` | Full legal declaration citing FEMA 1999 regulations |
| Exporter Signature | `A116:G120` | `Date:` | `"Date: " & TEXT(C37, "dd-mmm-yyyy")` | `Date: 21-Sep-2026` |
| Exporter Signature | `H116:O120` | `(Signature of Exporter)` | `C13 & CHAR(10) & "(Signature of Exporter)"` | `Vivek\n(Signature of Exporter)` |
| Section 5 | `A122:O135` | `5. Space for use of Specified Authority` | Static legal certificate for AD/Customs/STPI | Space for bank/customs endorsement |
| Footnotes | `A137:O144` | Footnotes 1, 2, 3 | Static RBI notes on strike-outs and market conditions | Footnotes 1, 2, 3 |

---

## 4. Destination Mapping: `Export Invoice` Sheet (`$A$1:$O$65`)

| Cell Range | Label / Component | Source Field | Output Format / Expression | Sample Output |
|---|---|---|---|---|
| `A3:H4` | Supplier Legal Name | `User Input!C8` | String (Bold 11pt) | `FinTaxPro Advisory LLP` |
| `I3:O4` | Document Title | Static | `EXPORT INVOICE` (Bold 16pt Right) | `EXPORT INVOICE` |
| `A5:H8` | Supplier Address | `User Input!C9` | Multi-line String (9.5pt) | `PLOT 92A KH NO 417, 1ST FLOOR...` |
| `I5:O6` | Invoice Number | `User Input!C21` | `"Invoice no.: " & C21` | `Invoice no.: FTP_Sept_Google_26-27` |
| `I7:O8` | Invoice Date | `User Input!C22` | `"Invoice date: " & TEXT(C22, "dd-mmm-yyyy")` | `Invoice date: 21-Sep-2026` |
| `A10:D10` | GSTIN Label | Static | `GSTIN:` | `GSTIN:` |
| `E10:H10` | GSTIN Value | `User Input!C11` | String | `07AAHFF4001F1ZZ` |
| `A11:D11` | PAN Label | Static | `PAN:` | `PAN:` |
| `E11:H11` | PAN Value | `User Input!C10` | String | `AAHFF4001F` |
| `A12:D12` | IEC Label | Static | `IEC:` | `IEC:` |
| `E12:H12` | IEC Value | `User Input!C12` | String | `Not Applicable` |
| `A14:O14` | Recipient Banner | Static | `SERVICE RECIPIENT` (Light Blue fill `D9EAF7`, Bold 9.5pt) | `SERVICE RECIPIENT` |
| `A15:O22` | Recipient Block | `C16`, `C17`, `C18` | `C16 & CHAR(10) & C17 & CHAR(10) & "Country: " & C18` | `Google LLC\n1600 Amphitheatre Pkwy...\nCountry: United States` |
| `A25:I27` | Header: Description | Static | `Description of services` | `Description of services` |
| `J25:K27` | Header: SAC | Static | `SAC` | `SAC` |
| `L25:M27` | Header: Currency | Static | `Currency` | `Currency` |
| `N25:O27` | Header: Amount | Static | `Amount` | `Amount` |
| `A28:I37` | Line Item: Description | `User Input!C26` | String | `YouTube AdSense / digital content monetisation services` |
| `J28:K37` | Line Item: SAC | `User Input!C27` | String | `998361` |
| `L28:M37` | Line Item: Currency | `User Input!C23` | String | `USD` |
| `N28:O37` | Line Item: Amount | `User Input!C24` | Decimal formatted `#,##0.00` | `652.30` |
| `A39:M41` | Total Label | `User Input!C23` | `"Total invoice value (" & C23 & ")"` | `Total invoice value (USD)` |
| `N39:O41` | Total Amount | `User Input!C24` | Decimal formatted `#,##0.00` | `652.30` |
| `A43:O47` | Amount in Words | `User Input!Q141` | `"Amount in words: " & Q141` | `Amount in words: US Dollars Six Hundred Fifty Two and Thirty Cents Only.` |
| `A58:H58` | Supplier Signoff | `User Input!C8` | `"For " & C8` | `For FinTaxPro Advisory LLP` |
| `A60:H61` | Signatory Name | `User Input!C13` | String | `Vivek` |
| `A63:H63` | Signatory Title | Static | `Authorised signatory` | `Authorised signatory` |

---

## 5. Destination Mapping: `AD Code Letter` Sheet (`$A$1:$H$58`)

| Cell Range | Label / Component | Source Field | Clean Architecture Source | Rendered Sample Content |
|---|---|---|---|---|
| `A1:H2` | Letter Header | Static | Static Title (Bold 14pt Center) | `REQUEST FOR RBI AUTHORISED DEALER (AD) CODE` |
| `A4:B4` | Date Label | Static | Static | `Date:` |
| `C4:H4` | Date Value | Missing in Excel | Exporter Declaration Date (`C37`) / Current Date | `21-Sep-2026` |
| `A6:H6` | Addressee Salutation | Static | Static | `To,` |
| `A7:H7` | Addressee Title | Static | Static | `The Branch Manager / Forex Department` |
| `A8:H8` | Bank Name | Hardcoded `RBL BANK` | Dynamic from `User Input!C32` | `RBL BANK` |
| `A9:H10` | Bank Branch Address | Hardcoded `Prashant Vihar...` | Dynamic from `User Input!C33` | `Prashant Vihar, Delhi, India` |
| `A12:H13` | Subject Line | Static | Static Subject | `Subject: Request for confirmation / provision of RBI Authorised Dealer (AD) Code for Export Declaration Form (EDF)` |
| `A15:H15` | Salutation | Static | Static | `Dear Sir/Madam,` |
| `A17:H18` | Opening Paragraph | `[1]User Input!$C$8` | Exporter Name (`User Input!C8`) | `I/We, FinTaxPro Advisory LLP, maintain a bank account with your branch and receive...` |
| `A20:H23` | Bank Account Box | `C8`, `C52`, `C53`, `C10` | Exporter Profile + Bank Account Profile | `Account Holder / Exporter Name: FinTaxPro Advisory LLP\nAccount Number: [Account]\nIFSC Code: [IFSC]\nPAN: AAHFF4001F` |
| `A25:H27` | Regulatory Purpose | Static | Static FEMA / EDF purpose clause | `For the purpose of completing the Export Declaration Form (EDF)...` |
| `A29:H31` | Centralized Forex Clause | Static | Static forex branch routing clause | `If our account-holding branch is not itself an authorised forex / AD branch...` |
| `A33:H33` | Request Action Header | Static | Static | `Kindly confirm the following:` |
| `A35:H35` | Item 1: AD Code | Blank lines | Space for Bank Response / Endorsement | `1. RBI Authorised Dealer (AD) Code: ______________________________________________` |
| `A37:H37` | Item 2: Forex Branch | Blank lines | Space for Bank Response / Endorsement | `2. Name / Address of designated AD / Forex Branch: ________________________________` |
| `A39:H39` | Item 3: SWIFT / BIC | Blank lines | Space for Bank Response / Endorsement | `3. SWIFT / BIC Code (if applicable): ______________________________________________` |
| `A41:H41` | Item 4: Quoting Permission| Static | Confirmation request clause | `4. Confirmation that the above AD Code may be quoted in the EDF...` |
| `A43:H45` | Closing Statement | Static | Static delivery request clause | `The information is required for regulatory documentation...` |
| `A47:H47` | Thank you | Static | Static | `Thank you.` |
| `A49:H49` | Signoff | Static | Static | `Yours faithfully,` |
| `A52:H52` | Mobile Number | `[1]User Input!$C$54` | Exporter Contact Profile | `Mobile: [User Mobile Number]` |
| `A53:H53` | Email Address | `[1]User Input!$C$55` | Exporter Contact Profile | `Email: [User Email Address]` |
| `A55:H55` | Signature Block | Static line | Signatory Name (`C13`) + Signature Line | `Signature: ______________________________ (Vivek)` |
| `A57:H58` | Printing Guidance Note | Static instruction | Guidance text | `Print note: This letter auto-picks details from the User Input sheet...` |

