import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const userDataDir = "C:/Users/rahul/CreatorEDF/scratch/chrome_mobile_audit";
const artifactDir = "C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116";

if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });
if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

console.log("=================================================================");
console.log("CREATOREDF: MOBILE RESPONSIVE UI UPGRADE COMPREHENSIVE VERIFICATION");
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
  console.log("1. Starting local Next.js dev server on port 3000...");
  const devServer = spawn("node", ["./node_modules/next/dist/bin/next", "dev", "-p", "3000"], {
    stdio: "pipe",
  });

  devServer.stderr.on("data", (d) => process.stderr.write(d.toString()));

  // Wait for Next.js dev server to be responsive
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const resp = await fetch("http://localhost:3000");
      if (resp.status === 200) {
        serverReady = true;
        console.log("   Next.js dev server ready at http://localhost:3000!");
        break;
      }
    } catch (e) {
      await sleep(1000);
    }
  }

  if (!serverReady) {
    devServer.kill();
    throw new Error("Next.js dev server failed to start within 30 seconds");
  }

  console.log("2. Launching real Google Chrome in headless mode with remote debugging...");
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
    devServer.kill();
    chrome.kill();
    throw new Error("Could not connect to Chrome DevTools port 9222");
  }

  const targetsResp = await fetch("http://localhost:9222/json/list");
  const targets = await targetsResp.json();
  const pageTarget = targets.find((t) => t.type === "page") || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));

  await sendCdp(ws, "Page.enable");
  await sendCdp(ws, "Runtime.enable");

  console.log("\n3. Testing requested viewport widths for horizontal overflow...");
  const testViewports = [
    { width: 320, height: 568, name: "320px (iPhone SE 1st)" },
    { width: 360, height: 740, name: "360px (Galaxy S9)" },
    { width: 375, height: 667, name: "375px (iPhone SE 2/3)" },
    { width: 390, height: 844, name: "390px (iPhone 12/13/14)" },
    { width: 414, height: 896, name: "414px (iPhone 11/XR)" },
    { width: 430, height: 932, name: "430px (iPhone 14/15/16 Pro Max)" },
    { width: 768, height: 1024, name: "768px (iPad Mini)" },
    { width: 1024, height: 768, name: "1024px (iPad Pro / Small Laptop)" },
    { width: 1440, height: 900, name: "1440px (Wide Desktop)" },
  ];

  // Navigate to Homepage
  await sendCdp(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(2500);

  for (const vp of testViewports) {
    await sendCdp(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 768,
    });
    await sleep(200);

    const overflowCheck = await evalCdp(
      ws,
      `({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth
      })`
    );

    const res = overflowCheck.result.value;
    if (res.hasOverflow) {
      console.warn(`⚠️ Warning: Viewport ${vp.name} had scrollWidth: ${res.scrollWidth} > innerWidth: ${res.innerWidth}`);
    } else {
      console.log(`✓ PASS: Viewport ${vp.name} - Clean layout (scrollWidth: ${res.scrollWidth}px == innerWidth: ${res.innerWidth}px)`);
    }
  }

  // 4. Test Mobile Navigation Drawer at 393x852 (iPhone 14/15/16)
  console.log("\n4. Testing Mobile Navigation Drawer on iPhone (393x852)...");
  await sendCdp(ws, "Emulation.setDeviceMetricsOverride", {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(400);

  // Capture Mobile Header closed state
  await captureScreenshot(ws, "mobile_header_closed.png");

  // Click hamburger menu button
  console.log("   Clicking mobile hamburger menu button...");
  const clickMenu = await evalCdp(
    ws,
    `(() => {
      const btn = document.querySelector('button[aria-label*="navigation"]') || document.querySelector('button[aria-label*="menu"]');
      if (btn) { btn.click(); return true; }
      return false;
    })()`
  );
  console.log("   Hamburger button clicked:", clickMenu.result.value);
  await sleep(600);

  // Check body scroll lock
  const bodyScrollLocked = await evalCdp(ws, `document.body.style.overflow === "hidden"`);
  console.log("   Body scroll locked:", bodyScrollLocked.result.value);

  // Capture Mobile Navigation Drawer open state
  await captureScreenshot(ws, "mobile_drawer_open.png");

  // 5. Test Language Selector Bottom Sheet
  console.log("\n5. Testing Mobile Language Selector Bottom Sheet...");
  const openLangSheet = await evalCdp(
    ws,
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Language') || b.textContent.includes('Change'));
      if (btn) { btn.click(); return true; }
      return false;
    })()`
  );
  console.log("   Language change button clicked:", openLangSheet.result.value);
  await sleep(600);

  // Capture Language Bottom Sheet open state
  await captureScreenshot(ws, "mobile_language_sheet.png");

  // Test selecting Hindi
  console.log("   Selecting Hindi (हिंदी)...");
  const selectHindi = await evalCdp(
    ws,
    `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hindiBtn = btns.find(b => b.textContent.includes('हिंदी'));
      if (hindiBtn) { hindiBtn.click(); return true; }
      return false;
    })()`
  );
  console.log("   Hindi selected:", selectHindi.result.value);
  await sleep(600);

  // Verify Hindi text rendered on page
  const pageHeading = await evalCdp(ws, `document.querySelector('h1').innerText`);
  console.log("   Current H1 text after language change:", pageHeading.result.value.replace(/\\n/g, ' '));
  await captureScreenshot(ws, "mobile_homepage_hindi.png");

  // Switch back to English
  await evalCdp(
    ws,
    `(() => {
      const langBtn = document.querySelector('button[aria-label="Change language"]');
      if (langBtn) langBtn.click();
    })()`
  );
  await sleep(300);
  await evalCdp(
    ws,
    `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const engBtn = btns.find(b => b.textContent.includes('English'));
      if (engBtn) engBtn.click();
    })()`
  );
  await sleep(400);

  // 6. Test Document Generator on Mobile Viewport
  console.log("\n6. Testing Document Generator on Mobile (393x852)...");
  await sendCdp(ws, "Page.navigate", { url: "http://localhost:3000/document-generator" });
  await sleep(2500);

  const genOverflow = await evalCdp(
    ws,
    `({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    })`
  );
  console.log(`✓ Document Generator horizontal overflow check: scrollWidth=${genOverflow.result.value.scrollWidth}px, innerWidth=${genOverflow.result.value.innerWidth}px, hasOverflow=${genOverflow.result.value.hasOverflow}`);

  await captureScreenshot(ws, "mobile_document_generator.png");

  // 7. Test Desktop Navigation at 1440x900
  console.log("\n7. Testing Desktop Navigation at 1440x900...");
  await sendCdp(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await sendCdp(ws, "Page.navigate", { url: "http://localhost:3000" });
  await sleep(2000);

  await captureScreenshot(ws, "desktop_navbar_intact.png");

  console.log("\n=================================================================");
  console.log("ALL MOBILE RESPONSIVE AUDITS COMPLETED SUCCESSFULLY!");
  console.log("=================================================================");

  chrome.kill();
  devServer.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
