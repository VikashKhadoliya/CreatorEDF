"use client";

import React from "react";
import {
  amountToIndianWords,
  calculateInrServicesValue,
  formatTradeDocumentDate,
  computeStatutoryDeadline,
} from "@/lib/calculations";

export function EdfFormPreview({ data }) {
  const inrVal = calculateInrServicesValue(data.invoiceAmount, data.exchangeRate);
  const inrWords = amountToIndianWords(inrVal);
  const formattedInvDate = formatTradeDocumentDate(data.invoiceDate);
  const deadlineStr = computeStatutoryDeadline(data.invoiceDate, 9);
  const declDateStr = data.declarationDate ? formatTradeDocumentDate(data.declarationDate) : formattedInvDate;

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 text-[11px] font-sans text-navy-900 max-w-[210mm] mx-auto space-y-3 leading-tight select-none">
      {/* Title */}
      <div className="border border-slate-500 py-1.5 text-center font-bold text-sm tracking-wide text-navy-800">
        Export Declaration Form
      </div>

      {/* Section 1 Header */}
      <div className="font-bold text-xs text-navy-800 mt-2">
        1. General Information:
      </div>

      {/* Section 1 Table */}
      <div className="border border-slate-400 divide-y divide-slate-400 text-[10px]">
        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5 font-medium">Type of export: Services</div>
          <div className="p-1.5">Form No.: {data.edfFormNo || ""}</div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5 text-slate-600">Shipping Bill No. & Date: Not applicable</div>
          <div className="p-1.5 text-slate-600">Mode of Transport / Delivery: Internet</div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5">Category of Exporter: {data.exporterCategory || "Custom (DTA units)"}</div>
          <div className="p-1.5 font-bold">AD code: {data.adCode || "—"}</div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5 space-y-0.5">
            <div>IE Code: {data.iec || "Not Applicable"}</div>
            <div>GSTIN: {data.gstin || "Not Applicable"}</div>
            <div>PAN: {data.exporterPan || "—"}</div>
          </div>
          <div className="p-1.5 space-y-0.5">
            <div className="font-semibold text-slate-500">AD Name & Address:</div>
            <div className="font-medium text-navy-900">{data.bankName || "—"}</div>
            <div className="text-slate-600">{data.bankBranch || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5 space-y-0.5">
            <div className="font-semibold text-slate-500">Exporter Name & Address:</div>
            <div className="font-bold text-navy-900">{data.exporterName || "—"}</div>
            <div className="text-slate-600 whitespace-pre-line">{data.exporterAddress || "—"}</div>
          </div>
          <div className="p-1.5">
            Mode of Realisation: {data.modeOfRealisation || "Others - bank transfer"}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5 space-y-0.5">
            <div className="font-semibold text-slate-500">Consignee Name & Address:</div>
            <div className="font-bold text-navy-900">{data.recipientName || "—"}</div>
            <div className="text-slate-600 whitespace-pre-line">{data.recipientAddress || "—"}</div>
          </div>
          <div className="p-1.5 text-slate-600">
            Port of Loading / Source Port in case of SEZ: Not applicable
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-400">
          <div className="p-1.5 text-slate-600 col-span-1">
            Third Party Name & Address: Not applicable<br />
            Relationship between Exporter & Third Party: Not applicable
          </div>
          <div className="p-1.5">
            <span className="text-slate-500 block">Country of Final Destination:</span>
            <span className="font-semibold text-navy-900">{data.recipientCountry || "—"}</span>
          </div>
          <div className="p-1.5 text-slate-600">
            Port of Discharge: Not applicable
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-400">
          <div className="p-1.5 text-slate-600">
            Name of the AD and AD code, in case of LC / BG: Not applicable / Not applicable
          </div>
          <div className="p-1.5 text-slate-600">
            Date of Let Export Order (LEO): Not applicable
          </div>
        </div>

        <div className="p-1.5">
          <span className="font-semibold text-slate-500">Description of Goods / Services:</span>{" "}
          <span className="text-navy-900">{data.serviceDescription || "—"}</span>
        </div>

        <div className="p-1.5 bg-slate-50 font-bold text-navy-900 text-[10.5px]">
          Total FOB / Services value in words (INR): {inrWords || "—"}
        </div>
      </div>

      {/* Section 2A: Goods (Marked NA) */}
      <div className="pt-1">
        <div className="font-bold text-[10.5px] text-navy-800 mb-1">
          2A. Details of Export Value^ of Goods (This part shall be repeated for each invoice drawn under a shipping bill)
        </div>
        <div className="border border-slate-400 text-[9.5px]">
          <div className="grid grid-cols-3 bg-navy-200 border-b border-slate-400 p-1 font-bold text-navy-900">
            <div>Particulars</div>
            <div>Currency</div>
            <div>Amount</div>
          </div>
          <div className="grid grid-cols-3 p-1 border-b border-slate-300 text-slate-600">
            <div>FOB / Services Value</div>
            <div>-</div>
            <div>-</div>
          </div>
          <div className="grid grid-cols-3 p-1 text-slate-600 bg-slate-50">
            <div>Full export value / Net Realisable export value</div>
            <div>-</div>
            <div className="font-medium">Not applicable</div>
          </div>
        </div>
      </div>

      {/* Section 2B: Services */}
      <div className="pt-1">
        <div className="font-bold text-[10.5px] text-navy-800 mb-1">
          2B. Details of Export Value^ of Services Exported
        </div>
        <div className="border border-slate-400 text-[9px] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-200 border-b border-slate-400 text-navy-900 font-bold">
                <th className="p-1 border-r border-slate-400">S.No</th>
                <th className="p-1 border-r border-slate-400">Buyer Name & Address</th>
                <th className="p-1 border-r border-slate-400">Country</th>
                <th className="p-1 border-r border-slate-400">Invoice No</th>
                <th className="p-1 border-r border-slate-400">Date</th>
                <th className="p-1 border-r border-slate-400">Curr</th>
                <th className="p-1 border-r border-slate-400">Amount</th>
                <th className="p-1 border-r border-slate-400">Net Value</th>
                <th className="p-1 border-r border-slate-400">Contract Ref</th>
                <th className="p-1 border-r border-slate-400">Description</th>
                <th className="p-1 border-r border-slate-400">SAC</th>
                <th className="p-1">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr className="divide-x divide-slate-400">
                <td className="p-1 text-center font-bold">1</td>
                <td className="p-1 font-medium">{data.recipientName}<br />{data.recipientAddress}</td>
                <td className="p-1">{data.recipientCountry}</td>
                <td className="p-1 font-mono font-medium">{data.invoiceNumber}</td>
                <td className="p-1 font-mono">{formattedInvDate}</td>
                <td className="p-1 font-mono">{data.currency || "USD"}</td>
                <td className="p-1 font-mono font-bold">{parseFloat(data.invoiceAmount || 0).toFixed(2)}</td>
                <td className="p-1 font-mono">{parseFloat(data.netRealisableValue || data.invoiceAmount || 0).toFixed(2)}</td>
                <td className="p-1 text-slate-500">Not applicable</td>
                <td className="p-1">{data.serviceDescription}</td>
                <td className="p-1 font-mono">{data.sacCode || "998361"}</td>
                <td className="p-1 text-slate-500">Not applicable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Couriers */}
      <div className="pt-1">
        <div className="font-bold text-[10px] text-navy-800 mb-1">
          3. Applicable for Export under FPO / Couriers
        </div>
        <div className="border border-slate-400 grid grid-cols-2 divide-x divide-slate-400 p-2 text-[9.5px] text-slate-600">
          <div>
            Name of the Foreign Post Office / Courier: Not applicable<br />
            Number & date of Parcel receipts: Not applicable
          </div>
          <div className="font-medium text-slate-500">
            Stamp & Signature of Authorised Dealer
          </div>
        </div>
      </div>

      {/* Section 4: Declaration */}
      <div className="pt-1">
        <div className="font-bold text-[10.5px] text-navy-800 mb-1">
          4. Declaration by the Exporters (All types of exports)
        </div>
        <div className="border border-slate-400 p-2 text-[9px] leading-relaxed text-slate-700 bg-slate-50 space-y-2">
          <p>
            I / We hereby declare that I / we am / are the seller / consignor of the goods / provider of services in respect of which this declaration is made and that the particulars given above are true and that the value to be received from the buyer / third party represents the export value^ contracted and declared above. I / We undertake that I / we have delivered / will deliver to the authorised dealer named above the foreign exchange / Indian Rupees representing the full value of the goods / services exported as above on or before{" "}
            <strong className="text-navy-900 font-bold underline">{deadlineStr}</strong> (i.e. within the period of realisation stipulated by RBI from time to time) in the manner specified in the Regulations made under the Foreign Exchange Management Act, 1999.
          </p>
          <p>
            I / We also undertake to submit the documents pertaining to exports declared in this form, to the Authorised Dealer named above, as may be required under the Act.
          </p>
        </div>

        <div className="border-x border-b border-slate-400 grid grid-cols-2 divide-x divide-slate-400 p-2 text-[10px]">
          <div className="font-medium">Date: {declDateStr}</div>
          <div className="text-right">
            <span className="font-bold text-navy-900 block">{data.authorisedSignatory || "—"}</span>
            <span className="text-slate-500 text-[9px]">(Signature of Exporter)</span>
          </div>
        </div>
      </div>

      {/* Section 5: Specified Authority */}
      <div className="pt-1">
        <div className="font-bold text-[10px] text-navy-800 mb-1">
          5. Space for use of Specified Authority (Custom / SEZ / AD / STPI):
        </div>
        <div className="border border-slate-400 p-2 text-[9px] text-slate-600 space-y-2">
          <p>
            Certified, on the basis of above declaration at 4, that the goods / services described above and the export value^ declared by the exporter in this form is as per the corresponding invoice / gist of invoices submitted and declared by the exporter.
          </p>
          <div className="flex justify-between items-end pt-1">
            <span>Date: ____________________</span>
            <span className="text-slate-500">(Signature of Designated / Authorised officials of Custom / SEZ / AD / STPI)</span>
          </div>
        </div>
      </div>

      {/* Footnotes */}
      <div className="text-[8px] text-slate-500 italic pt-1 space-y-0.5">
        <div>1. @ Strike out whichever is not applicable.</div>
        <div>2. ^ If the full export value is not ascertainable at the time of export, the value which the exporter expects to receive.</div>
        <div>3. Export value may be indicated as nil in case the goods/services are sent without any consideration.</div>
      </div>
    </div>
  );
}

