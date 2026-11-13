// Dependency-free local browser check. Requires Edge and a running Astro server.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-qa-'));
const browser = spawn(edge, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
try {
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
  if (!fs.existsSync(portFile)) throw new Error('Edge debugging endpoint did not start');
  const [port, browserId] = fs.readFileSync(portFile, 'utf8').trim().split('\n');
  socket = new WebSocket(`ws://127.0.0.1:${port}${browserId}`);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const next = ++id;
    pending.set(next, { resolve, reject });
    socket.send(JSON.stringify({ id: next, method, params, ...(sessionId && { sessionId }) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  let failures = 0;
  for (const route of ['/', '/projects/futureme-ai/']) {
    for (const width of [360, 390, 768, 1280, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 }, sessionId);
      await send('Page.navigate', { url: new URL(route, base).href }, sessionId);
      for (let i = 0; i < 50; i++) {
        const ready = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true }, sessionId);
        if (ready.result.value === 'complete') break;
        await sleep(100);
      }
      const result = await send('Runtime.evaluate', {
        expression: `({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, title: document.title, h1: document.querySelector('h1')?.textContent, bad: [...document.querySelectorAll('body *')].filter(e => { const r=e.getBoundingClientRect(); return r.width && r.right > innerWidth + 2 && getComputedStyle(e).position !== 'absolute'; }).slice(0,5).map(e => e.tagName.toLowerCase()+'.'+e.className) })`,
        returnByValue: true,
      }, sessionId);
      const data = result.result.value;
      const passed = data.width === width && data.scrollWidth <= width + 1 && Boolean(data.h1);
      if (!passed) failures++;
      console.log(`${passed ? 'PASS' : 'FAIL'} ${route} ${width}px: viewport=${data.width}, document=${data.scrollWidth}, h1=${Boolean(data.h1)}${passed ? '' : `, candidates=${data.bad.join(',')}`}`);
      if ((width === 390 || width === 1440) && route === '/') {
        const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
        const file = path.join(os.tmpdir(), `portfolio-${width}.png`);
        fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
        console.log(`Screenshot: ${file}`);
        await send('Runtime.evaluate', { expression: `document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, document.querySelector('.projects').getBoundingClientRect().top + scrollY - 24)` }, sessionId);
        await sleep(100);
        const workShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
        const workFile = path.join(os.tmpdir(), `portfolio-work-${width}.png`);
        fs.writeFileSync(workFile, Buffer.from(workShot.data, 'base64'));
        console.log(`Screenshot: ${workFile}`);
      }
    }
  }
  console.log(`Responsive audit: ${failures} failure(s).`);
  if (failures) process.exitCode = 1;
} finally {
  socket?.close();
  browser.kill();
  await sleep(250);
  const tempRoot = path.resolve(os.tmpdir());
  if (path.resolve(profile).startsWith(tempRoot + path.sep)) {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch { /* Edge may still be releasing files. */ }
  }
}
