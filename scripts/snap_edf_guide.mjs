import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const shotDir = 'C:/Users/rahul/CreatorEDF/public/samples/screenshots';
const artifactDir = 'C:/Users/rahul/.gemini/antigravity/brain/1f559b46-65fa-46de-acb6-8897bff6c116';

async function main() {
  const outPath = path.join(shotDir, 'studio_edf_guide_focus.png');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--incognito',
    '--window-size=1280,1800',
    `--screenshot=${outPath}`,
    'http://localhost:3001/#edf-guide'
  ]);
  chrome.on('close', (code) => {
    if (code === 0 && fs.existsSync(outPath)) {
      fs.copyFileSync(outPath, path.join(artifactDir, 'studio_edf_guide_focus.png'));
      console.log(`✓ Captured studio_edf_guide_focus.png (${fs.statSync(outPath).size} bytes)`);
    } else {
      console.error(`Failed with code ${code}`);
    }
  });
}

main().catch(console.error);
