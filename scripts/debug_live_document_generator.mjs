import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const userDataDir = "C:/Users/rahul/CreatorEDF/scratch/chrome_live_debug";
const downloadDir = "C:/Users/rahul/CreatorEDF/scratch/browser_downloads";
const artifactDir = "C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116";

for (const d of [userDataDir, downloadDir, artifactDir]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// Clear previous test downloads
for (const f of fs.readdirSync(downloadDir)) {
  fs.unlinkSync(path.join(downloadDir, f));
}

console.log("=================================================================");
console.log("CREATOREDF: LIVE BROWSER-BASED END-TO-END DOCUMENT GENERATOR TEST");
console.log("=================================================================\n");

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
  console.log("1. Starting Chrome with remote debugging on port 9222...");
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
      await sleep(400);
    }
  }

  if (!versionInfo) {
    chrome.kill();
    throw new Error("Could not connect to Chrome DevTools on port 9222");
  }

  const targetsResp = await fetch("http://localhost:9222/json/list");
  const targets = await targetsResp.json();
  const pageTarget = targets.find((t) => t.type === "page") || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));

  // Enable CDP domains
  await sendCdp(ws, "Page.enable");
  await sendCdp(ws, "Runtime.enable");
  await sendCdp(ws, "Network.enable");

  // Configure file download behavior in Chrome
  await sendCdp(ws, "Browser.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDir,
    eventsEnabled: true,
  });

  // Track console and error events
  const consoleMessages = [];
  const runtimeExceptions = [];
  const networkErrors = [];
  const downloadedFiles = [];

  ws.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleMessages.push({
          type: msg.params.type,
          args: msg.params.args.map((a) => a.value || a.description),
        });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        runtimeExceptions.push(msg.params.exceptionDetails);
      }
      if (msg.method === "Network.loadingFailed") {
        networkErrors.push(msg.params);
      }
      if (msg.method === "Browser.downloadWillBegin") {
        downloadedFiles.push(msg.params.suggestedFilename);
        console.log(`📥 Browser download initiated: ${msg.params.suggestedFilename}`);
      }
    } catch (e) {}
  });

  const targetUrl = "https://creator-edf-lovat.vercel.app/document-generator";
  console.log(`2. Navigating to live target: ${targetUrl}...`);
  await sendCdp(ws, "Page.navigate", { url: targetUrl });
  await sleep(3500);

  // Set viewport to 1280x900 desktop
  await sendCdp(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await sleep(500);

  console.log("3. Inspecting initial page state and input fields...");
  const initialValidation = await evalCdp(
    ws,
    `(() => {
      const alerts = Array.from(document.querySelectorAll('.text-rose-700 li, .text-rose-300 li')).map(el => el.innerText);
      const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim(),
        disabled: b.disabled
      }));
      return { alerts, buttons };
    })()`
  );
  console.log("   Initial buttons status:", initialValidation.result.value.buttons.filter(b => b.text.includes("Download")));

  console.log("\n4. Populating form with EXACT required test data...");
  const fillResult = await evalCdp(
    ws,
    `(() => {
      function setVal(selector, value) {
        const el = document.querySelector(selector);
        if (!el) return false;
        // React 16+ input value setter trigger
        const prototype = Object.getPrototypeOf(el);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        if (descriptor && descriptor.set) {
          descriptor.set.call(el, value);
        } else {
          el.value = value;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }

      // 1. Exporter Legal Name
      setVal('input[placeholder*="Rahul Sharma"]', 'Test Creator');

      // 2. Exporter Address
      setVal('textarea[placeholder*="Green Heights"]', '101 Test Street, Jaipur, Rajasthan, India');

      // 3. Exporter PAN
      setVal('input[placeholder="ABCDE1234F"]', 'ABCDE1234F');

      // 4. Exporter Classification (select)
      const typeSelect = Array.from(document.querySelectorAll('select')).find(s => s.innerHTML.includes('Resident Individual'));
      if (typeSelect) {
        typeSelect.value = 'resident_individual';
        typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 5. GST Status
      const gstSelect = Array.from(document.querySelectorAll('select')).find(s => s.innerHTML.includes('Unregistered Exporter'));
      if (gstSelect) {
        gstSelect.value = 'unregistered';
        gstSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 6. Bank Name
      setVal('input[placeholder*="HDFC Bank, ICICI Bank"]', 'HDFC Bank');

      // 7. Branch
      setVal('input[placeholder*="M.I. Road, Jaipur"]', 'Jaipur Test Branch');

      // 8. Bank AD Code
      setVal('input[placeholder*="0510008"]', '0510008');

      // 9. Account Number
      setVal('input[placeholder*="50100012345678"]', '50100012345678');

      // 10. IFSC
      setVal('input[placeholder*="HDFC0000051"]', 'HDFC0000051');

      // 11. Authorised Signatory
      const sigInput = Array.from(document.querySelectorAll('input')).find(i => i.placeholder.includes('Full Name') || i.previousElementSibling?.textContent?.includes('Signatory'));
      if (sigInput) {
        sigInput.value = 'Test Creator';
        sigInput.dispatchEvent(new Event('input', { bubbles: true }));
        sigInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 12. Payer Company Name
      setVal('input[placeholder*="Google Asia Pacific"]', 'Example Media Pte. Ltd.');

      // 13. Payer Country
      setVal('input[placeholder*="Singapore, Ireland"]', 'Singapore');

      // 14. Payer Address
      setVal('textarea[placeholder*="Pasir Panjang Road"]', '10 Example Road, Singapore');

      // 15. Invoice Number
      setVal('input[placeholder*="INV-2026-01"]', 'TEST-2026-001');

      // 16. Invoice Date
      setVal('input[type="date"]', '2026-11-14');

      // 17. Currency
      const currSelect = Array.from(document.querySelectorAll('select')).find(s => s.innerHTML.includes('USD - US Dollar'));
      if (currSelect) {
        currSelect.value = 'USD';
        currSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 18. Invoice Amount
      setVal('input[placeholder*="650.00"]', '100');

      // 19. Exchange Rate
      setVal('input[placeholder*="86.50"]', '85');

      // 20. SAC Code
      const sacSelect = Array.from(document.querySelectorAll('select')).find(s => s.innerHTML.includes('Select SAC Code'));
      if (sacSelect && sacSelect.options.length > 1) {
        sacSelect.selectedIndex = 1; // Pick first valid SAC code (e.g. 998314 or 998313)
        sacSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 21. Service Description
      setVal('input[placeholder*="advertising"]', 'Digital advertising services');

      return true;
    })()`
  );
  console.log("   Form population executed:", fillResult.result.value);

  await sleep(1500);

  // Inspect validation state after filling
  console.log("\n5. Checking validation state and button status after filling form...");
  const postFillValidation = await evalCdp(
    ws,
    `(() => {
      const errorList = Array.from(document.querySelectorAll('.text-rose-700 li, .text-rose-300 li')).map(el => el.innerText);
      const downloadButtons = Array.from(document.querySelectorAll('button'))
        .filter(b => b.innerText.includes('Download') || b.innerText.includes('PDF') || b.innerText.includes('ZIP'))
        .map(b => ({
          text: b.innerText.trim().replace(/\\n/g, ' '),
          disabled: b.disabled,
          classes: b.className
        }));
      return { errorList, downloadButtons };
    })()`
  );

  console.log("   Validation errors remaining:", postFillValidation.result.value.errorList);
  console.log("   Download buttons state:");
  postFillValidation.result.value.downloadButtons.forEach((b) => {
    console.log(`     - [${b.disabled ? "DISABLED" : "ENABLED"}] "${b.text}"`);
  });

  await captureScreenshot(ws, "debug_filled_form_state.png");

  // 6. Test Clicking Each Download Action
  console.log("\n6. Triggering Download Actions in real browser...");

  // Action A: Download EDF (PDF)
  console.log("   A. Clicking 'Download EDF (PDF)'...");
  const clickEdf = await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download EDF (PDF)') || b.innerText.includes('EDF (PDF)'));
      if (btn && !btn.disabled) { btn.click(); return { clicked: true, text: btn.innerText }; }
      return { clicked: false, found: Boolean(btn), disabled: btn?.disabled };
    })()`
  );
  console.log("      Result:", clickEdf.result.value);
  await sleep(2000);

  // Action B: Switch tab to Invoice and Download Invoice (PDF)
  console.log("   B. Switching to Invoice tab & clicking 'Download Invoice (PDF)'...");
  await evalCdp(
    ws,
    `(() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Export Invoice'));
      if (tab) tab.click();
    })()`
  );
  await sleep(600);
  const clickInv = await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Invoice (PDF)'));
      if (btn && !btn.disabled) { btn.click(); return { clicked: true, text: btn.innerText }; }
      return { clicked: false, found: Boolean(btn), disabled: btn?.disabled };
    })()`
  );
  console.log("      Result:", clickInv.result.value);
  await sleep(2000);

  // Action C: Switch tab to AD Code Letter and Download AD Code Letter (PDF)
  console.log("   C. Switching to AD Code Letter tab & clicking 'Download Letter (PDF)'...");
  await evalCdp(
    ws,
    `(() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AD Code Letter'));
      if (tab) tab.click();
    })()`
  );
  await sleep(600);
  const clickAd = await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Letter (PDF)'));
      if (btn && !btn.disabled) { btn.click(); return { clicked: true, text: btn.innerText }; }
      return { clicked: false, found: Boolean(btn), disabled: btn?.disabled };
    })()`
  );
  console.log("      Result:", clickAd.result.value);
  await sleep(2000);

  // Action D: Click "Download All 3 Documents (ZIP)"
  console.log("   D. Clicking 'Download All 3 Documents (ZIP)'...");
  const clickZip = await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download All 3') || b.innerText.includes('(ZIP)'));
      if (btn && !btn.disabled) { btn.click(); return { clicked: true, text: btn.innerText }; }
      return { clicked: false, found: Boolean(btn), disabled: btn?.disabled };
    })()`
  );
  console.log("      Result:", clickZip.result.value);
  await sleep(4000);

  // 7. Check Downloaded Files in downloadDir
  console.log("\n7. Inspecting physical downloaded files in download folder...");
  const filesOnDisk = fs.readdirSync(downloadDir);
  console.log(`   Files found in ${downloadDir}:`, filesOnDisk);

  // Check console messages and errors
  console.log("\n8. Browser Console & Runtime Exceptions Report:");
  if (runtimeExceptions.length > 0) {
    console.error("   ❌ Uncaught Runtime Exceptions:", JSON.stringify(runtimeExceptions, null, 2));
  } else {
    console.log("   ✓ Zero uncaught runtime exceptions.");
  }

  if (consoleMessages.length > 0) {
    console.log("   Console messages logged:", consoleMessages.slice(-10));
  }

  chrome.kill();
  console.log("\n=== DEBUG SCRIPT FINISHED ===");
}

run().catch((err) => {
  console.error("Debug test failed:", err);
  process.exit(1);
});

