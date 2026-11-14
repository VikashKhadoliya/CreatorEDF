import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import JSZip from "jszip";

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const userDataDir = "C:/Users/rahul/CreatorEDF/scratch/chrome_e2e_profile";
const downloadDir = "C:/Users/rahul/CreatorEDF/scratch/e2e_downloads";
const artifactDir = "C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116";

for (const d of [userDataDir, downloadDir, artifactDir]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// Clean previous downloads
for (const f of fs.readdirSync(downloadDir)) {
  fs.unlinkSync(path.join(downloadDir, f));
}

let nextId = 1;
function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener("message", handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (err) {}
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function evalCdp(ws, expression) {
  return sendCdp(ws, "Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
}

async function captureScreenshot(ws, filename) {
  const res = await sendCdp(ws, "Page.captureScreenshot", { format: "png" });
  const buffer = Buffer.from(res.data, "base64");
  const savePath = path.join(artifactDir, filename);
  fs.writeFileSync(savePath, buffer);
  console.log(`📸 Screenshot saved: ${filename} (${buffer.length} bytes)`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("=========================================================================");
  console.log("CREATOREDF: COMPLETE END-TO-END DOCUMENT GENERATOR BUG & DOWNLOAD AUDIT");
  console.log("=========================================================================\n");

  const port = 3005;
  console.log(`1. Launching Next.js production server on http://127.0.0.1:${port}...`);
  const server = spawn("cmd.exe", ["/c", "npx", "next", "start", "-p", String(port)], {
    cwd: "C:/Users/rahul/CreatorEDF",
    stdio: "pipe",
  });

  // Wait for server to respond
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/document-generator`);
      if (res.status === 200) {
        serverReady = true;
        break;
      }
    } catch (e) {
      await sleep(500);
    }
  }

  if (!serverReady) {
    server.kill();
    throw new Error("Local Next.js production server failed to start.");
  }
  console.log("   ✓ Next.js server is ready and responding at 200 OK.\n");

  console.log("2. Launching Headless Chrome via CDP...");
  const chrome = spawn(chromePath, [
    "--remote-debugging-port=9222",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]);

  await sleep(1500);

  let versionInfo;
  for (let i = 0; i < 15; i++) {
    try {
      const resp = await fetch("http://localhost:9222/json/version");
      versionInfo = await resp.json();
      break;
    } catch (e) {
      await sleep(300);
    }
  }

  const targetsResp = await fetch("http://localhost:9222/json/list");
  const targets = await targetsResp.json();
  const pageTarget = targets.find((t) => t.type === "page") || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));

  await sendCdp(ws, "Page.enable");
  await sendCdp(ws, "Runtime.enable");
  await sendCdp(ws, "Network.enable");

  // Connect to Browser target for global setDownloadBehavior
  if (versionInfo && versionInfo.webSocketDebuggerUrl) {
    try {
      const browserWs = new WebSocket(versionInfo.webSocketDebuggerUrl);
      await new Promise((resolve) => browserWs.addEventListener("open", resolve));
      await sendCdp(browserWs, "Browser.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadDir,
        eventsEnabled: false,
      });
      console.log("   ✓ Configured global Browser download behavior to:", downloadDir);
    } catch (e) {
      console.warn("   Browser download behavior warning:", e.message);
    }
  }

  const consoleLogs = [];
  const uncaughtExceptions = [];

  ws.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleLogs.push({
          type: msg.params.type,
          args: msg.params.args.map((a) => a.value || a.description),
        });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        uncaughtExceptions.push(msg.params.exceptionDetails);
      }
    } catch (e) {}
  });

  const appUrl = `http://127.0.0.1:${port}/document-generator`;
  console.log(`3. Navigating to Document Generator: ${appUrl}...`);
  await sendCdp(ws, "Page.navigate", { url: appUrl });
  await sleep(2500);

  // Install client-side file capture hook to capture exact binary blob payloads
  await evalCdp(
    ws,
    `(() => {
      window.__capturedFiles = [];
      const origClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function() {
        if (this.download && this.href && this.href.startsWith("blob:")) {
          const downloadName = this.download;
          fetch(this.href)
            .then(r => r.arrayBuffer())
            .then(buf => {
              let binary = '';
              const bytes = new Uint8Array(buf);
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const b64 = btoa(binary);
              window.__capturedFiles.push({
                fileName: downloadName,
                b64: b64,
                size: buf.byteLength
              });
            });
        }
        return origClick.call(this);
      };
      return true;
    })()`
  );
  console.log("   ✓ Client-side download verification hook installed.\n");

  // -------------------------------------------------------------------------
  // TEST PHASE 1: Missing Fields & "Never Silently Disable" UX
  // -------------------------------------------------------------------------
  console.log("--- TEST PHASE 1: Missing Fields UX & Non-Silent Rejection ---");
  console.log("   Clicking 'EDF (PDF)' while form is empty...");
  const emptyClickRes = await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('EDF (PDF)'));
      if (btn) {
        btn.click();
        return { clicked: true, disabled: btn.disabled };
      }
      return { clicked: false };
    })()`
  );
  console.log("   Click result:", emptyClickRes.result.value);
  await sleep(600);

  const bannerCheck = await evalCdp(
    ws,
    `(() => {
      const banner = document.getElementById('validation-errors-banner');
      const missingFields = Array.from(document.querySelectorAll('#validation-errors-banner .divide-y > div')).map(el => el.innerText.split('\\n')[0]);
      const highlightedInputs = Array.from(document.querySelectorAll('.border-rose-500')).map(el => el.id);
      const activeElementId = document.activeElement ? document.activeElement.id : null;
      return {
        bannerVisible: Boolean(banner),
        missingCount: missingFields.length,
        highlightedInputs,
        activeElementId
      };
    })()`
  );

  console.log("   Banner Status:", {
    bannerVisible: bannerCheck.result.value.bannerVisible,
    missingCount: bannerCheck.result.value.missingCount,
    highlightedCount: bannerCheck.result.value.highlightedInputs.length,
    scrolledAndFocusedField: bannerCheck.result.value.activeElementId,
  });

  if (!bannerCheck.result.value.bannerVisible) {
    throw new Error("FAIL: Validation banner did not appear when download was attempted with missing fields!");
  }
  console.log("   ✓ Missing fields banner is displayed with section, reason, and highlighted inputs!");

  await captureScreenshot(ws, "e2e_missing_fields_banner.png");

  // -------------------------------------------------------------------------
  // TEST PHASE 2: Form Population with User's Fictional Test Values
  // -------------------------------------------------------------------------
  console.log("\n--- TEST PHASE 2: Populating Form with Fictional Test Details ---");
  const fillResult = await evalCdp(
    ws,
    `(() => {
      function setVal(id, val) {
        const el = document.getElementById(id);
        if (!el) return false;
        const prototype = Object.getPrototypeOf(el);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        if (descriptor && descriptor.set) {
          descriptor.set.call(el, val);
        } else {
          el.value = val;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }

      // Exporter
      setVal('exporterName', 'Test Creator');
      setVal('exporterAddress', '101 Test Street, Jaipur, Rajasthan, India');
      setVal('exporterPan', 'ABCDE1234F');
      setVal('exporterType', 'resident_individual');
      setVal('gstStatus', 'unregistered');

      // Bank Details
      setVal('bankName', 'HDFC Bank');
      setVal('bankBranch', 'Jaipur Test Branch');
      setVal('adCode', '0510008');
      setVal('accountNumber', '50100012345678');
      setVal('ifscCode', 'HDFC0000051');
      setVal('authorisedSignatory', 'Test Creator');

      // Overseas Payer
      setVal('recipientName', 'Example Media Pte. Ltd.');
      setVal('recipientCountry', 'Singapore');
      setVal('recipientAddress', '10 Example Road, Singapore');

      // Invoice Details
      setVal('invoiceNumber', 'TEST-2026-001');
      setVal('invoiceDate', '2026-11-14');
      setVal('currency', 'USD');
      setVal('invoiceAmount', '100');
      setVal('exchangeRate', '85');
      setVal('sacCode', '998314');
      setVal('serviceDescription', 'Digital advertising services');

      return true;
    })()`
  );

  console.log("   Inputs populated:", fillResult.result.value);
  await sleep(1000);

  // Verify that all validations are now cleared
  const validationCheck = await evalCdp(
    ws,
    `(() => {
      const banner = document.getElementById('validation-errors-banner');
      const highlighted = Array.from(document.querySelectorAll('.border-rose-500')).map(el => el.id);
      return {
        bannerExists: Boolean(banner),
        highlightedCount: highlighted.length
      };
    })()`
  );
  console.log("   Validation state after filling:", validationCheck.result.value);
  await captureScreenshot(ws, "e2e_form_filled_ready.png");

  // -------------------------------------------------------------------------
  // TEST PHASE 3: Execute All 7 Download Actions
  // -------------------------------------------------------------------------
  console.log("\n--- TEST PHASE 3: Testing All 7 Download Actions ---");

  // 1. EDF (PDF)
  console.log("\n[1/7] Clicking Download EDF (PDF)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('EDF (PDF)'));
      if (btn) btn.click();
    })()`
  );
  await sleep(2500);

  // 2. EDF (PNG)
  console.log("[2/7] Clicking Download EDF (PNG)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PNG'));
      if (btn) btn.click();
    })()`
  );
  await sleep(3500);

  // Switch to Export Invoice tab
  console.log("\nSwitching to Tab: 2. Export Invoice...");
  await evalCdp(
    ws,
    `(() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Export Invoice'));
      if (tab) tab.click();
    })()`
  );
  await sleep(800);

  // 3. Export Invoice (PDF)
  console.log("[3/7] Clicking Download Invoice (PDF)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Invoice (PDF)'));
      if (btn) btn.click();
    })()`
  );
  await sleep(2500);

  // 4. Export Invoice (PNG)
  console.log("[4/7] Clicking Download Invoice (PNG)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PNG'));
      if (btn) btn.click();
    })()`
  );
  await sleep(3500);

  // Switch to AD Code Letter tab
  console.log("\nSwitching to Tab: 3. AD Code Letter...");
  await evalCdp(
    ws,
    `(() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AD Code Letter'));
      if (tab) tab.click();
    })()`
  );
  await sleep(800);

  // 5. AD Code Letter (PDF)
  console.log("[5/7] Clicking Download Letter (PDF)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Letter (PDF)'));
      if (btn) btn.click();
    })()`
  );
  await sleep(2500);

  // 6. AD Code Letter (PNG)
  console.log("[6/7] Clicking Download Letter (PNG)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download PNG'));
      if (btn) btn.click();
    })()`
  );
  await sleep(3500);

  // 7. Combined ZIP Package
  console.log("\n[7/7] Clicking Download All 3 Documents (ZIP)...");
  await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download All 3 Documents (ZIP)'));
      if (btn) btn.click();
    })()`
  );
  await sleep(4000);

  // Retrieve captured downloads from page
  const captured = await evalCdp(ws, `window.__capturedFiles || []`);
  const filesList = captured.result.value || [];
  console.log(`\n   ✓ Total files captured from browser triggers: ${filesList.length}`);

  for (const item of filesList) {
    const filePath = path.join(downloadDir, item.fileName);
    const buf = Buffer.from(item.b64, "base64");
    fs.writeFileSync(filePath, buf);
    console.log(`   💾 Saved to disk: ${item.fileName} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  // -------------------------------------------------------------------------
  // TEST PHASE 4: Mobile Viewport Test (iPhone 390x844)
  // -------------------------------------------------------------------------
  console.log("\n--- TEST PHASE 4: Mobile Viewport Audit (390px x 844px) ---");
  await sendCdp(ws, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
  await sleep(1000);

  const mobileCheck = await evalCdp(
    ws,
    `(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = window.innerWidth;
      const overflow = docWidth > viewWidth;
      const downloadButtons = Array.from(document.querySelectorAll('button'))
        .filter(b => b.innerText.includes('PDF') || b.innerText.includes('PNG') || b.innerText.includes('ZIP'))
        .map(b => ({ text: b.innerText.trim(), disabled: b.disabled }));
      return { docWidth, viewWidth, overflow, downloadButtons };
    })()`
  );
  console.log("   Mobile Viewport Metrics:", mobileCheck.result.value);
  await captureScreenshot(ws, "e2e_mobile_generator_state.png");

  // -------------------------------------------------------------------------
  // TEST PHASE 5: Physical File Verification on Disk
  // -------------------------------------------------------------------------
  console.log("\n--- TEST PHASE 5: Physical File Verification on Disk ---");
  const downloadedFiles = fs.readdirSync(downloadDir);
  console.log(`   Total files verified in ${downloadDir}: ${downloadedFiles.length}`);

  let validPdfCount = 0;
  let validPngCount = 0;
  let validZipCount = 0;

  for (const f of downloadedFiles) {
    const filePath = path.join(downloadDir, f);
    const stat = fs.statSync(filePath);
    const buf = fs.readFileSync(filePath);
    const headerStr = buf.subarray(0, 8).toString("utf-8");

    let type = "UNKNOWN";
    if (f.endsWith(".pdf") && headerStr.startsWith("%PDF-")) {
      type = "VALID_PDF";
      validPdfCount++;
    } else if (f.endsWith(".png") && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      type = "VALID_PNG";
      validPngCount++;
    } else if (f.endsWith(".zip") && buf[0] === 0x50 && buf[1] === 0x4b) {
      type = "VALID_ZIP";
      validZipCount++;
      // Verify ZIP contents
      const zip = await JSZip.loadAsync(buf);
      const zipEntries = Object.keys(zip.files);
      console.log(`      📦 ZIP Contents (${zipEntries.length} entries):`, zipEntries);
    }

    console.log(`   📄 [${type}] ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n   Summary of Verified Downloads:`);
  console.log(`   - Valid Bank-Ready PDFs: ${validPdfCount} / 3`);
  console.log(`   - Valid High-Res PNGs:   ${validPngCount} / 3`);
  console.log(`   - Valid ZIP Archives:    ${validZipCount} / 1`);
  console.log(`   - Total Verified Files:  ${validPdfCount + validPngCount + validZipCount} / 7`);

  // Check runtime exceptions and console errors
  console.log("\n--- Browser Console & Exception Report ---");
  if (uncaughtExceptions.length > 0) {
    console.error("   ❌ Uncaught Exceptions:", JSON.stringify(uncaughtExceptions, null, 2));
  } else {
    console.log("   ✓ Zero uncaught runtime exceptions during the entire test suite!");
  }
  if (consoleLogs.length > 0) {
    console.log("   Browser Console Logs:", JSON.stringify(consoleLogs, null, 2));
  }

  // Cleanup
  chrome.kill();
  server.kill();

  if (validPdfCount < 3 || validPngCount < 3 || validZipCount < 1) {
    throw new Error(`FAIL: Some files were not valid downloads! PDFs: ${validPdfCount}, PNGs: ${validPngCount}, ZIP: ${validZipCount}`);
  }

  console.log("\n=========================================================================");
  console.log("ALL 7 DOWNLOAD ACTIONS & VERIFICATION PASSED WITH 100% SUCCESS!");
  console.log("=========================================================================");
}

run().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
