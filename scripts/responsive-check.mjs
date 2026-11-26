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
], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
let launchError;
browser.on('error', (error) => { launchError = error; });
let browserLog = '';
browser.stderr.setEncoding('utf8').on('data', (chunk) => {
  browserLog = (browserLog + chunk).slice(-4096);
});
let socket;

async function until(probe, label, attempts = 60) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (await probe()) return;
    await wait(80);
  }
  throw new Error('Timed out: ' + label);
}
try {
  const portFile = path.join(profile, 'DevToolsActivePort');
  let endpoint;
  try {
    await until(() => {
      if (launchError) throw launchError;
      assert.equal(browser.exitCode, null, 'Chromium exited before debugging was ready');
      if (fs.existsSync(portFile)) {
        const [port, browserId] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
        if (port && browserId) endpoint = 'ws://127.0.0.1:' + port + browserId;
      }
      endpoint ??= browserLog.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[\w-]+)/)?.[1];
      return endpoint !== undefined;
    }, 'Chromium debugging endpoint', 250);
  } catch (error) {
    if (browserLog.trim()) console.error(browserLog.trim());
    throw error;
  }
  socket = new WebSocket(endpoint);
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
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      failures.push(message.params.entry.text);
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      failures.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '));
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
  await send('Log.enable');
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

  const routes = ['/', '/projects/futureme-ai/', '/projects/pytorch-forecasting-tft/', '/projects/ego-ai-studio/', '/projects/ictavo/', '/projects/recommendation-systems/', '/projects/antidepressant-binding-mechanisms/'];
  const widths = [320, 360, 390, 768, 1280, 1440];
  let viewportChecks = 0;
  for (const route of routes) {
    for (const width of widths) {
      await visit(route, width);
      const layout = await evaluate("({ width: innerWidth, scroll: document.documentElement.scrollWidth, heading: !!document.querySelector('h1') })");
      assert(layout.width === width && layout.scroll <= width + 1 && layout.heading, route + ' ' + width + 'px ' + JSON.stringify(layout));
      if (route === '/projects/recommendation-systems/' && width === 320) {
        assert(await evaluate(`(() => {
          const heading = document.querySelector('h1');
          const text = document.createRange();
          text.selectNodeContents(heading);
          const fits = text.getBoundingClientRect().right <= heading.getBoundingClientRect().right + 1;
          const node = heading.firstChild;
          const word = 'recommendation';
          const start = node.textContent.indexOf(word);
          text.setStart(node, start);
          text.setEnd(node, start + word.length);
          return fits && text.getClientRects().length === 1;
        })()`), 'The full recommendation title fits at 320px without splitting the longest word');
      }
      await csp();
      viewportChecks++;
    }
  }
  console.log('Responsive layout: ' + viewportChecks + ' viewport checks passed.');

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
  await visit('/', 390);
  assert(await evaluate(`(() => {
    const button = document.querySelector('[data-copy]');
    const mail = document.querySelector('[data-mail]');
    return getComputedStyle(button).display === 'none' && mail.href === 'mailto:' + mail.textContent.trim()
      && document.querySelector('#contact noscript').textContent.includes('Select and copy');
  })()`), 'Copy email has a usable static fallback');
  await visit('/projects/pytorch-forecasting-tft/', 390);
  assert(await evaluate(`(() => {
    const control = document.querySelector('.horizon-control');
    const fallback = document.querySelector('[data-horizon-static]');
    const chart = document.querySelector('.horizon svg');
    return getComputedStyle(control).display === 'none' && getComputedStyle(fallback).display !== 'none'
      && fallback.textContent.includes('12 hours ahead') && fallback.textContent.includes('all 24 horizons')
      && chart.querySelector('[data-o="line"]').getAttribute('x1') === chart.querySelector('[data-o="dtft"]').getAttribute('cx')
      && document.querySelector('[data-o="h"]').textContent === '12h ahead';
  })()`), 'Static forecast labels the fixed readout separately from the full series');
  await send('Emulation.setScriptExecutionDisabled', { value: false });
  console.log('Mobile navigation, contact and forecast fallbacks without JavaScript passed.');

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const width of [320, 360, 390]) {
    await visit('/projects/ego-ai-studio/', width);
    assert(await evaluate(`(() => {
      const mission = document.querySelector('.mission');
      const log = mission.querySelector('.mission-log');
      const lines = [...log.querySelectorAll('[data-step]:not([hidden]) span')];
      const right = log.getBoundingClientRect().right;
      return mission.querySelector('[data-replay]').hidden && mission.scrollWidth <= mission.clientWidth + 1
        && lines.length === 18 && lines.every((line) => {
          const text = document.createRange();
          text.selectNodeContents(line);
          return text.getBoundingClientRect().right <= right + 1;
        });
    })()`), `All nine mission steps fit at ${width}px`);
  }
  const contrast = await evaluate(`(() => {
    const log = document.querySelector('.mission-log');
    const channels = (color) => color.match(/[\\d.]+/g).map(Number);
    const luminance = ([r, g, b]) => [r, g, b].map((value) => value / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
      .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const background = channels(getComputedStyle(log).backgroundColor);
    return Math.min(...[...log.querySelectorAll('li span:first-child')].map((step) => {
      const color = channels(getComputedStyle(step).color);
      const alpha = color[3] ?? 1;
      const foreground = background.map((value, index) => color[index] * alpha + value * (1 - alpha));
      const levels = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (levels[0] + 0.05) / (levels[1] + 0.05);
    }));
  })()`);
  assert(contrast >= 4.5, 'Mission step contrast: ' + contrast.toFixed(2) + ':1');
  await csp();
  await visit('/projects/pytorch-forecasting-tft/', 320);
  assert(await evaluate("!document.querySelector('.horizon-control').hidden && document.querySelector('[data-horizon-static]').hidden"));
  await evaluate("const slider=document.querySelector('#hz-range'); slider.value='22'; slider.focus()");
  await key('ArrowRight');
  assert(await evaluate("document.querySelector('[data-o=verdict]').textContent.startsWith('Persistence ') && document.querySelector('#hz-range').getAttribute('aria-valuetext') === '23 hours ahead' && document.querySelector('.ledger').textContent.includes('Persistence wins at 1–3 h and 22–24 h')"));
  await csp();
  const staticToolkit = `(() => {
    const track = document.querySelector('[data-marquee]');
    const bounds = track.getBoundingClientRect();
    const items = [...track.querySelectorAll('span:not([data-marquee-clone])')];
    return document.querySelector('[data-marquee-toggle]').hidden && items.length === 15 && items.every((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.left >= bounds.left && rect.right <= bounds.right + 1;
    }) && [...track.querySelectorAll('[data-marquee-clone]')].every((clone) => getComputedStyle(clone).display === 'none');
  })()`;
  for (const width of [320, 390, 1440]) {
    await visit('/', width);
    assert(await evaluate(staticToolkit), `All toolkit entries must fit in reduced motion at ${width}px`);
  }
  await send('Emulation.setEmulatedMedia', { features: [] });
  console.log(`Reduced-motion toolkit, mission transcript (${contrast.toFixed(2)}:1) and keyboard-operated forecast chart passed.`);

  const resources = "performance.getEntriesByType('resource').some(r=>r.name.includes('/home-motion.'))";
  await visit('/', 390);
  assert.equal(await evaluate(resources), false, 'Animation chunk loaded on the initial viewport');
  await evaluate("document.querySelector('[data-marquee]').scrollIntoView({block:'center'})");
  await until(() => evaluate(resources), 'deferred motion chunk');
  await until(() => evaluate("getComputedStyle(document.querySelector('[data-marquee]')).transform !== 'none'"), 'marquee starts in view');
  await evaluate("document.querySelector('[data-marquee-toggle]').focus({preventScroll:true})");
  await key('Tab', 8);
  await key('Tab');
  await key('Enter');
  assert(await evaluate("document.activeElement.matches('[data-marquee-toggle]:focus-visible') && document.activeElement.textContent === 'Resume toolkit'"));
  const still = "getComputedStyle(document.querySelector('[data-marquee]')).transform";
  const pausedAt = await evaluate(still);
  await evaluate('scrollTo(0, 0)');
  await wait(300);
  await evaluate("document.querySelector('[data-marquee]').scrollIntoView({block:'center'})");
  await wait(350);
  assert.equal(await evaluate(still), pausedAt, 'User pause persists after scrolling away and back');
  await key('Enter');
  assert(await evaluate("document.activeElement.textContent === 'Pause toolkit'"));
  await until(async () => await evaluate(still) !== pausedAt, 'marquee resumes from pause');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await until(() => evaluate(staticToolkit), 'live switch to static toolkit');
  await send('Emulation.setEmulatedMedia', { features: [] });
  await evaluate("document.querySelector('[data-marquee]').scrollIntoView({block:'center'})");
  await until(() => evaluate("!document.querySelector('[data-marquee-toggle]').hidden"), 'live switch back to animated toolkit');
  await evaluate('scrollTo(0, 0)');
  await wait(400);
  const transform = await evaluate(still);
  await wait(250);
  assert.equal(await evaluate(still), transform, 'Marquee should pause offscreen');
  await csp();
  await visit('/', 1440);
  assert(await evaluate("matchMedia('(pointer: fine)').matches"), 'Desktop browser profile must expose a fine pointer');
  await until(() => evaluate('Boolean(window.lenis)'), 'desktop smooth scrolling');
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 400, y: 380, deltaX: 0, deltaY: 480 });
  await until(() => evaluate("scrollY > 300 && !window.lenis.isScrolling"), 'desktop wheel settles');
  await evaluate("document.querySelector('[data-copy]').focus()");
  await key('Enter');
  await until(() => evaluate(`(() => {
    const state = document.querySelector('[data-copy-state]');
    return state.textContent.startsWith('Email copied') || (state.textContent.startsWith('Address selected')
      && getSelection().toString() === document.querySelector('[data-mail]').textContent);
  })()`), 'keyboard copy email or native text selection');
  await csp();
  assert.deepEqual(failures, [], 'Unexpected JavaScript errors');
  console.log('Keyboard toolkit pause and resume, offscreen pause, copy email, CSP and browser console checks passed.');
} finally {
  socket?.close();
  browser.kill();
  await wait(250);
  const tempRoot = path.resolve(os.tmpdir());
  if (path.dirname(path.resolve(profile)) === tempRoot) {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch { /* Chromium can still be releasing files. */ }
  }
}
