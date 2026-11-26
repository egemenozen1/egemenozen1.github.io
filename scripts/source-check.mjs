// Source-level guardrails for content and accessibility decisions. Dependency-free.
import fs from 'node:fs';

const read = (f) => fs.readFileSync(f, 'utf8');
let failures = 0;
const fail = (msg) => { console.error(`FAIL ${msg}`); failures++; };

const required = [
  'astro.config.mjs', 'src/config/site.ts', 'src/config/legal.ts', 'src/content.config.ts',
  'src/layouts/BaseLayout.astro', 'src/components/Header.astro', 'src/components/Footer.astro',
  'src/components/StoryCanvas.astro', 'src/components/EvidenceLedger.astro', 'src/components/MissionReplay.astro',
  'src/components/HorizonExplorer.astro',
  'src/pages/index.astro', 'src/pages/projects/[id].astro', 'src/pages/404.astro', 'src/pages/impressum.astro',
  'src/pages/privacy.astro', 'src/pages/robots.txt.ts', 'src/pages/sitemap.xml.ts', 'src/styles/global.css',
  'src/data/metrics_by_horizon.csv', 'src/data/baseline.json', 'src/data/provenance.json',
  'public/favicon.svg', 'public/og.png', 'scripts/site-html-check.mjs', 'scripts/dist-check.mjs',
];
for (const file of required) if (!fs.existsSync(file)) fail(`missing ${file}`);

// Approved project set and order: three flagships, then the lab.
const expected = ['ego-ai-studio', 'ictavo', 'futureme-ai', 'pytorch-forecasting-tft', 'recommendation-systems', 'antidepressant-binding-mechanisms'];
const md = fs.readdirSync('src/content/projects').filter((f) => f.endsWith('.md'));
const order = (f) => Number(read(`src/content/projects/${f}`).match(/^order:\s*(\d+)/m)?.[1] ?? 0);
const actual = md.sort((a, b) => order(a) - order(b)).map((f) => f.replace(/\.md$/, ''));
if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`project order ${actual.join(', ')} does not match the approved set`);
for (const f of md) {
  const c = read(`src/content/projects/${f}`);
  for (const key of ['title', 'category', 'thesis', 'summary', 'year', 'role', 'status', 'order', 'flagship', 'disciplines', 'technologies', 'evidence']) {
    if (!new RegExp(`^${key}:`, 'm').test(c)) fail(`${f} missing field ${key}`);
  }
  if (!/state:\s*limit|state:\s*private/.test(c)) fail(`${f} must state at least one limit or privacy boundary in its evidence ledger`);
}

const index = read('src/pages/index.astro');
const visible = [index, ...md.map((f) => read(`src/content/projects/${f}`)), ...fs.readdirSync('src/components').map((f) => read(`src/components/${f}`))].join('\n');

// Owner decisions carried over from the previous release.
if (/walmart/i.test(visible)) fail('the removed Walmart project is referenced');
if (/contract[- ]scanner/i.test(visible)) fail('Contract Scanner is not publicly reachable and must not be linked');
if (!index.includes('MSc Data Analytics — BSBI Berlin') || !index.includes('BSc Genetics & Bioengineering — Istanbul Bilgi University')) fail('approved degree names are missing');
const legal = read('src/config/legal.ts');
if (!read('src/pages/impressum.astro').includes('providerAddress') || /straße|\d{5}\s+Berlin/i.test(visible) || !/\d{5}\s+Berlin/.test(legal)) fail('the postal address must appear only on the Impressum page');
const footer = read('src/components/Footer.astro');
if (!footer.includes('/impressum/') || !footer.includes('/privacy/')) fail('footer must link the Impressum and privacy pages');
if (/10\+ projects|lorem ipsum|example\.com|salary|€\s?\d{2}K|Madrid/i.test(visible)) fail('placeholder, unverified or private claim detected');
if (/Projeler|Eğitim|İletişim|Türkçe|Hakkında/.test(visible)) fail('Turkish UI copy remains; the public interface is English');

// Accessibility and motion.
const layout = read('src/layouts/BaseLayout.astro');
if (!layout.includes('<main id="main" tabindex="-1">')) fail('skip-link target must accept programmatic focus');
const css = read('src/styles/global.css');
if (!css.includes('@media (prefers-reduced-motion: reduce)')) fail('styles must respect reduced motion');
for (const c of ['StoryCanvas', 'MissionReplay']) if (!read(`src/components/${c}.astro`).includes('prefers-reduced-motion')) fail(`${c} must respect reduced motion in script`);
if (!read('src/pages/index.astro').includes('aria-label="From DNA to agents')) fail('story section needs a text label');
if (/fonts\.googleapis|fonts\.gstatic|googletagmanager|plausible|analytics\.js/i.test(layout + visible)) fail('no third-party fonts or analytics: privacy page promises none');

console.log(`Source audit: ${required.length} required paths, ${md.length} projects. Failures: ${failures}`);
if (failures) process.exit(1);
