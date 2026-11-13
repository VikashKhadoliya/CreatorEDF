import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const shotDir = 'C:/Users/rahul/CreatorEDF/public/samples/screenshots';
const artifactDir = 'C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116';

for (const d of [shotDir, artifactDir]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

async function capture(url, outName, width = 1280, height = 900) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(shotDir, outName);
    const chrome = spawn(chromePath, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--incognito',
      '--disable-application-cache',
      `--window-size=${width},${height}`,
      `--screenshot=${outPath}`,
      url
    ]);
    chrome.on('close', (code) => {
      if (code === 0 && fs.existsSync(outPath)) {
        fs.copyFileSync(outPath, path.join(artifactDir, outName));
        console.log(`✓ Captured ${outName} (${fs.statSync(outPath).size} bytes)`);
        resolve(outPath);
      } else {
        reject(new Error(`Failed with code ${code}`));
      }
    });
  });
}

async function main() {
  console.log("Capturing high-resolution screenshots with original studio visual assets...");

  // 1. Homepage Desktop View
  await capture('http://localhost:3001', 'studio_homepage_desktop.png', 1280, 950);

  // 2. Full Homepage (Extended height to capture EDF Education Guide, Wizard & Changelog)
  await capture('http://localhost:3001', 'studio_homepage_full.png', 1280, 4400);

  // 3. Homepage Mobile View
  await capture('http://localhost:3001', 'studio_homepage_mobile.png', 390, 844);

  // 4. Document Generator Page
  await capture('http://localhost:3001/document-generator', 'studio_generator_desktop.png', 1280, 950);

  // 5. Downloads Page
  await capture('http://localhost:3001/downloads', 'studio_downloads_desktop.png', 1280, 850);

  // 6. Guides Page
  await capture('http://localhost:3001/guides', 'studio_guides_desktop.png', 1280, 950);

  console.log("All studio visual screenshots successfully captured!");
}

main().catch(console.error);

