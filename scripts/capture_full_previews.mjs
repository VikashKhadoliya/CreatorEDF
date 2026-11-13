import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const userDataDir = 'C:/Users/rahul/CreatorEDF/scratch/chrome_full_previews';
const screenshotsDir = 'C:/Users/rahul/CreatorEDF/public/samples/screenshots';
const artifactDir = 'C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116';

for (const dir of [userDataDir, screenshotsDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

console.log("==================================================");
console.log("CAPTURING PIXEL-PERFECT FULL PREVIEW SCREENSHOTS");
console.log("==================================================");

let nextId = 1;
function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (err) {}
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function evalCdp(ws, expression) {
  return sendCdp(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
}

async function run() {
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9230',
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:3001/document-generator'
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const listRes = await fetch('http://127.0.0.1:9230/json/list');
  const targets = await listRes.json();
  const pageWs = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise(r => pageWs.addEventListener('open', r, { once: true }));

  await sendCdp(pageWs, 'Page.enable');
  await sendCdp(pageWs, 'Runtime.enable');
  await sendCdp(pageWs, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log("1. Injecting complete verified Exporter & Recipient profile into IndexedDB...");
  await evalCdp(pageWs, `
    new Promise((resolve) => {
      const req = indexedDB.open('CreatorEDF_DB', 1);
      req.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(['exporter_profile', 'recipient_profiles'], 'readwrite');
        
        // Exporter Profile
        tx.objectStore('exporter_profile').put({
          id: 'current',
          name: 'Vivek Chugh',
          address: 'Plot No. 92A, Block C, Prashant Vihar, Sector 14, Rohini, New Delhi - 110085',
          pan: 'AAHFF4001F',
          gstStatus: 'lut_active',
          gstin: '07AAHFF4001F1Z2',
          lutArn: 'AD070326001234M',
          lutFinancialYear: '2026-27',
          iec: 'Not Applicable',
          signatoryName: 'Vivek Chugh',
          exporterType: 'resident_individual',
          bankName: 'RBL Bank Limited',
          bankBranch: 'Prashant Vihar, New Delhi',
          adCode: '6160104',
          accountNumber: '409000123456',
          ifscCode: 'RATN0000123',
          mobile: '+91 98110 00000',
          email: 'vivek@example.com',
          updatedAt: new Date().toISOString()
        });

        // Ensure Recipient Profile exists
        tx.objectStore('recipient_profiles').put({
          id: 'google_apac',
          name: 'Google Asia Pacific Pte. Ltd.',
          address: '70 Pasir Panjang Road, #03-01, Mapletree Business City II\\nSingapore 117371',
          country: 'Singapore',
          description: 'Standard contracting entity for Indian AdSense, YouTube & Google Cloud creators.',
          isVerified: true,
          updatedAt: new Date().toISOString()
        });

        tx.oncomplete = () => resolve('Stored');
      };
    })
  `);
  console.log("✓ Profile data directly written to IndexedDB!");

  // Reload page so React component loads the profile on mount
  console.log("2. Reloading page to load newly written profile...");
  await sendCdp(pageWs, 'Page.reload');
  await new Promise(r => setTimeout(r, 2500));

  // Set form inputs
  console.log("3. Setting financial parameters in the form...");
  await evalCdp(pageWs, `
    (async () => {
      const numSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const selectSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;

      const selects = Array.from(document.querySelectorAll('select'));
      const recipientSelect = selects[0];
      if (recipientSelect) {
        for (let i = 0; i < recipientSelect.options.length; i++) {
          if (recipientSelect.options[i].text.includes('Google Asia Pacific')) {
            recipientSelect.selectedIndex = i;
            recipientSelect.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      }

      const inputs = Array.from(document.querySelectorAll('input'));
      numSetter.call(inputs[0], 'FTP_Sept_Google');
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));

      numSetter.call(inputs[1], '2026-09-21');
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

      numSetter.call(inputs[2], '652.30');
      inputs[2].dispatchEvent(new Event('input', { bubbles: true }));

      numSetter.call(inputs[3], '95.82');
      inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));

  // Capture Screenshots function
  async function saveScreenshot(name) {
    const res = await sendCdp(pageWs, 'Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(screenshotsDir, name), buf);
    fs.writeFileSync(path.join(artifactDir, name), buf);
    console.log(`✓ Saved ${name} (${buf.length} bytes)`);
  }

  // 1. Full Page with Form & EDF Preview
  console.log("4. Capturing Form EDF Preview...");
  await evalCdp(pageWs, `
    const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1. Form EDF'));
    if (tab) tab.click();
  `);
  await new Promise(r => setTimeout(r, 800));
  await saveScreenshot('1_verified_rbi_form_edf_preview.png');

  // 2. Tab: Export Invoice
  console.log("5. Capturing Export Invoice Preview...");
  await evalCdp(pageWs, `
    const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2. Export Invoice'));
    if (tab) tab.click();
  `);
  await new Promise(r => setTimeout(r, 800));
  await saveScreenshot('2_verified_export_invoice_preview.png');

  // 3. Tab: AD Code Letter
  console.log("6. Capturing Bank AD Code Letter Preview...");
  await evalCdp(pageWs, `
    const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('3. AD Code Letter'));
    if (tab) tab.click();
  `);
  await new Promise(r => setTimeout(r, 800));
  await saveScreenshot('3_verified_bank_ad_code_letter_preview.png');

  // 7. Test Download Button Click & Save Download in My Downloads
  console.log("7. Testing in-browser download click & download history recording...");
  const dlResult = await evalCdp(pageWs, `
    (async () => {
      const edfTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1. Form EDF'));
      if (edfTab) edfTab.click();
      await new Promise(r => setTimeout(r, 300));

      const dlBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Download EDF (PDF)'));
      if (dlBtn) dlBtn.click();
      await new Promise(r => setTimeout(r, 1000));

      // Check My Downloads in DB
      return new Promise((res) => {
        const req = indexedDB.open('CreatorEDF_DB', 1);
        req.onsuccess = (e) => {
          const db = e.target.result;
          const tx = db.transaction('document_downloads', 'readonly');
          const getReq = tx.objectStore('document_downloads').getAll();
          getReq.onsuccess = (ev) => res(ev.target.result);
        };
      });
    })()
  `);
  console.log("✓ My Downloads recorded after click:", dlResult.result.value);

  pageWs.close();
  chrome.kill();
  console.log("\nALL VERIFIED PREVIEWS & AUDIT CAPTURES COMPLETED! ✓");
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});

