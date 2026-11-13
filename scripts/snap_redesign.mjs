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
  console.log("Capturing screenshots of redesigned pages...");
  // 1. Desktop Homepage (Hero, Navbar, Tools)
  await capture('http://localhost:3001', 'redesigned_homepage_desktop.png', 1280, 950);
  // 2. Mobile Homepage
  await capture('http://localhost:3001', 'redesigned_homepage_mobile.png', 390, 844);
  // 3. Document Generator
  await capture('http://localhost:3001/document-generator', 'redesigned_generator_desktop.png', 1280, 900);
  console.log("All screenshots captured successfully!");
}

main().catch(console.error);

