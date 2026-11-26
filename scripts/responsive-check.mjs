// Chromium regression checks against a running build preview.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';

const executable = process.env.CHROME_PATH ?? (process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'google-chrome');
const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-qa-'));
const browser = spawn(executable, [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  // Headless Linux may have no pointing device. Give the desktop profile a mouse.
  '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
  '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank',
], { stdio: 'ignore', windowsHide: true });
let launchError;
browser.on('error', (error) => { launchError = error; });
let socket;

async function until(probe, label) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await probe()) return;
    await wait(80);
  }
  throw new Error('Timed out: ' + label);
}
try {
  const portFile = path.join(profile, 'DevToolsActivePort');
  await until(() => {
    if (launchError) throw launchError;
    assert.equal(browser.exitCode, null, 'Chromium exited before debugging was ready');
    return fs.existsSync(portFile);
  }, 'Chromium debugging endpoint');
  const [port, browserId] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
  socket = new WebSocket('ws://127.0.0.1:' + port + browserId);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  let sessionId;
  const pending = new Map();
  const failures = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') {
      const detail = message.params.exceptionDetails;
      failures.push(detail.exception?.description ?? detail.text);
    }
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const next = ++id;
    const timer = setTimeout(() => { pending.delete(next); reject(new Error('CDP timeout: ' + method)); }, 8000);
    pending.set(next, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: next, method, params, ...(sessionId && { sessionId }) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  ({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }));
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: "window.cspViolations=[]; addEventListener('securitypolicyviolation', e=>cspViolations.push(e.effectiveDirective+' '+e.blockedURI));",
  });

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true });
    assert(!res.exceptionDetails, res.exceptionDetails?.exception?.description);
    return res.result.value;
  };
  const viewport = async (width, height = 900, mobile = width < 768) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    await send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
  };
  let navigation = 0;
  const visit = async (route, width, height, mobile) => {
    await viewport(width, height, mobile);
    const url = new URL(route, base);
    url.searchParams.set('browser-check', String(++navigation));
    const loaded = await send('Page.navigate', { url: url.href });
    assert(!loaded.errorText, loaded.errorText);
    await until(() => evaluate('location.search===' + JSON.stringify(url.search) + ' && document.readyState==="complete"').catch(() => false), url.href);
  };
  const csp = async () => assert.deepEqual(await evaluate('window.cspViolations'), [], 'CSP violations in page');
  const key = async (name, modifiers = 0) => {
    const code = { Tab: 9, Escape: 27, Enter: 13, ArrowRight: 39 }[name];
    const event = { key: name, code: name, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code, modifiers };
    await send('Input.dispatchKeyEvent', { ...event, type: 'keyDown', ...(name === 'Enter' && { text: '\r', unmodifiedText: '\r' }) });
    await send('Input.dispatchKeyEvent', { ...event, type: 'keyUp' });
  };

  const routes = ['/', '/projects/futureme-ai/', '/projects/pytorch-forecasting-tft/', '/projects/ego-ai-studio/', '/projects/ictavo/'];
  const widths = [320, 360, 390, 768, 1280, 1440];
  for (const route of routes) {
    for (const width of widths) {
      await visit(route, width);
      const layout = await evaluate("({ width: innerWidth, scroll: document.documentElement.scrollWidth, heading: !!document.querySelector('h1') })");
      assert(layout.width === width && layout.scroll <= width + 1 && layout.heading, route + ' ' + width + 'px ' + JSON.stringify(layout));
      await csp();
    }
  }
  console.log('Responsive layout: ' + routes.length * widths.length + ' viewport checks passed.');

  await visit('/', 390, 320);
  await until(() => evaluate("document.querySelector('[data-menu-ready]') !== null"), 'enhanced mobile menu');
  await evaluate("document.querySelector('.menu-btn').focus()");
  await key('Enter');
  await until(() => evaluate("document.querySelector('#mobile-menu').matches(':modal') && document.activeElement.classList.contains('close')"), 'opened dialog focuses Close');
  await key('Tab', 8);
  assert(await evaluate("document.activeElement.matches('#mobile-menu p a:last-child') && document.querySelector('#mobile-menu').scrollTop > 0"));
  await key('Tab');
  assert(await evaluate("document.activeElement.classList.contains('close')"));
  await key('Escape');
  assert(await evaluate("!document.querySelector('#mobile-menu').open && document.activeElement.matches('.menu-btn') && document.activeElement.getAttribute('aria-expanded') === 'false'"));
  await key('Enter');
  await evaluate("document.querySelector('#mobile-menu a[href=\"/#contact\"]').focus()");
  await key('Enter');
  await until(() => evaluate("location.hash==='#contact' && document.activeElement.id==='contact' && !document.querySelector('#mobile-menu').open"), 'contact anchor focus');
  await csp();
  await visit('/', 680, 500, false);
  await evaluate("document.querySelector('.menu-btn').click()");
  await viewport(900, 500, false);
  await until(() => evaluate("!document.querySelector('#mobile-menu').open && document.activeElement.matches('.nav-links a')"), 'menu closes at desktop breakpoint');
  console.log('Mobile dialog: short-height scrolling, focus wrapping, Escape, hash navigation and resize passed.');

  await send('Emulation.setScriptExecutionDisabled', { value: true });
  await visit('/projects/futureme-ai/', 390);
  await evaluate("document.querySelector('.menu-fallback summary').focus()");
  await key('Enter');
  assert(await evaluate("getComputedStyle(document.querySelector('.menu-btn')).display === 'none' && document.querySelector('.menu-fallback[open] a[href=\"/#work\"]') !== null"));
  await send('Emulation.setScriptExecutionDisabled', { value: false });
  console.log('Mobile navigation without JavaScript passed.');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await visit('/projects/ego-ai-studio/', 390);
  assert(await evaluate("document.querySelector('[data-replay]').hidden && document.querySelectorAll('[data-step]:not([hidden])').length === 9"));
  await csp();
  await visit('/projects/pytorch-forecasting-tft/', 320);
  await evaluate("const slider=document.querySelector('#hz-range'); slider.value='22'; slider.focus()");
  await key('ArrowRight');
  assert(await evaluate("document.querySelector('[data-o=verdict]').textContent.startsWith('Persistence ') && document.querySelector('#hz-range').getAttribute('aria-valuetext') === '23 hours ahead' && document.querySelector('.ledger').textContent.includes('Persistence wins at 1–3 h and 22–24 h')"));
  await csp();
  await send('Emulation.setEmulatedMedia', { features: [] });
  console.log('Reduced-motion transcript and keyboard-operated forecast chart passed.');

  const resources = "performance.getEntriesByType('resource').some(r=>r.name.includes('/home-motion.'))";
  await visit('/', 390);
  assert.equal(await evaluate(resources), false, 'Animation chunk loaded on the initial viewport');
  await evaluate("document.querySelector('[data-marquee]').scrollIntoView({block:'center'})");
  await until(() => evaluate(resources), 'deferred motion chunk');
  await until(() => evaluate("getComputedStyle(document.querySelector('[data-marquee]')).transform !== 'none'"), 'marquee starts in view');
  await evaluate('scrollTo(0, 0)');
  await wait(400);
  const still = "getComputedStyle(document.querySelector('[data-marquee]')).transform";
  const transform = await evaluate(still);
  await wait(250);
  assert.equal(await evaluate(still), transform, 'Marquee should pause offscreen');
  await csp();
  await visit('/', 1440);
  assert(await evaluate("matchMedia('(pointer: fine)').matches"), 'Desktop browser profile must expose a fine pointer');
  await until(() => evaluate('Boolean(window.lenis)'), 'desktop smooth scrolling');
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 400, y: 380, deltaX: 0, deltaY: 480 });
  await until(() => evaluate("scrollY > 300 && !window.lenis.isScrolling"), 'desktop wheel settles');
  await csp();
  assert.deepEqual(failures, [], 'Unexpected JavaScript errors');
  console.log('Deferred motion, offscreen pause, CSP and JavaScript runtime checks passed.');
} finally {
  socket?.close();
  browser.kill();
  await wait(250);
  const tempRoot = path.resolve(os.tmpdir());
  if (path.dirname(path.resolve(profile)) === tempRoot) {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch { /* Chromium can still be releasing files. */ }
  }
}
