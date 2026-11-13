import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const shotDir = 'C:/Users/rahul/CreatorEDF/public/samples/screenshots';
const artifactDir = 'C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116';

async function capture(url, outName, width = 1280, height = 2400) {
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

capture('http://localhost:3001', 'redesigned_homepage_full.png', 1280, 2400).catch(console.error);

