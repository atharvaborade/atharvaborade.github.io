import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'inherit', env: { ...process.env, PORT: '4174' } });
let browser;
try {
  let ready = false;
  for (let attempt=0; attempt<50; attempt++) {
    try { if ((await fetch('http://127.0.0.1:4174/')).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('Preview server did not become ready');
  browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {});
  const page = await browser.newPage({ viewport: {width:1440,height:1000}, reducedMotion:'reduce' });
  await page.goto('http://127.0.0.1:4174/');
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  mkdirSync('docs/previews', { recursive: true });
  await page.screenshot({ path:'docs/previews/desktop.png', fullPage:true });
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({ path:'docs/previews/mobile.png', fullPage:true });
  console.log('Captured desktop and mobile previews.');
} finally {
  if (browser) await browser.close();
  const exited = new Promise(resolve => server.once('exit', resolve));
  server.kill('SIGTERM'); await exited;
}
