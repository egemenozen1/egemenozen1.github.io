import fs from 'node:fs';
const required = [
  'astro.config.mjs','src/config/site.ts','src/content.config.ts','src/pages/index.astro',
  'src/pages/projects/[id].astro','src/components/Hero.astro','src/layouts/BaseLayout.astro',
  'src/components/ProjectCard.astro','src/components/ProjectInteraction.astro',
  'src/styles/global.css','src/content/projects/futureme-ai.md',
  'src/content/projects/pytorch-forecasting-tft.md',
  'src/content/projects/recommendation-systems.md',
  'src/content/projects/antidepressant-binding-mechanisms.md', 'public/favicon.svg',
  'src/pages/404.astro', 'src/pages/robots.txt.ts', 'src/pages/sitemap.xml.ts',
  'src/pages/impressum.astro', 'src/pages/privacy.astro',
  'src/config/legal.ts',
  'scripts/site-html-check.mjs', 'scripts/preview-check.mjs', 'scripts/dist-check.mjs'
];
let failures = 0;
for(const file of required){if(!fs.existsSync(file)){console.error(`MISSING: ${file}`); failures++;}}
const mdFiles = fs.readdirSync('src/content/projects').filter(f=>f.endsWith('.md'));
const expectedOrder = [
  'futureme-ai.md',
  'pytorch-forecasting-tft.md',
  'recommendation-systems.md',
  'antidepressant-binding-mechanisms.md',
];
if(JSON.stringify(mdFiles.sort((a,b)=>{
  const getOrder=(file)=>Number(fs.readFileSync(`src/content/projects/${file}`,'utf8').match(/^order:\s*(\d+)/m)?.[1] ?? 0);
  return getOrder(a)-getOrder(b);
}))!==JSON.stringify(expectedOrder)){
  console.error('Project collection does not match the approved four-project order');
  failures++;
}
if(fs.existsSync('src/content/projects/walmart-forecasting.md')){
  console.error('Walmart project content must be removed');
  failures++;
}
for(const file of mdFiles){
  const content = fs.readFileSync(`src/content/projects/${file}`,'utf8');
  for(const key of ['title','category','summary','problem','approach','verifiedOutput','order','featured','technologies','scope']){
    if(!new RegExp(`^${key}:`, 'm').test(content)){console.error(`${file} missing field ${key}`);failures++;}
  }
}
const source = fs.readFileSync('src/pages/index.astro','utf8');
const impressum = fs.readFileSync('src/pages/impressum.astro','utf8');
const legalAddress = fs.readFileSync('src/config/legal.ts','utf8');
const footer = fs.readFileSync('src/components/Footer.astro','utf8');
if(!impressum.includes('providerAddress') || !/straße\s+\d+/i.test(legalAddress) || !/\d{5}\s+Berlin/i.test(legalAddress) || /(?:Apt\.?|Apartment|Suite|Room|Door)\s*\d/i.test(legalAddress) || /straße|\d{5}\s+Berlin/i.test(source)){
  console.error('The owner-provided postal address must appear only on the Impressum page');
  failures++;
}
if(!footer.includes('/impressum/') || !footer.includes('/privacy/')){
  console.error('Footer must expose the Impressum and privacy pages');
  failures++;
}
if(/10\+ projects|90% skills|example\.com/i.test(source)){console.error('Unverified claim or placeholder detected');failures++;}
if(/walmart/i.test(source)){console.error('Removed project is still referenced by the homepage');failures++;}
if(!source.includes('MSc Data Analytics — BSBI Berlin') || !source.includes('BSc Genetics & Bioengineering — Istanbul Bilgi University') || /<span>Studies<\/span>/.test(source)){
  console.error('Education entries must appear under one Education heading with the approved degree names');
  failures++;
}
const card=fs.readFileSync('src/components/ProjectCard.astro','utf8');
const styles=fs.readFileSync('src/styles/global.css','utf8');
const layout=fs.readFileSync('src/layouts/BaseLayout.astro','utf8');
if(!layout.includes('<main id="main" tabindex="-1">')){
  console.error('The skip link target must accept programmatic keyboard focus');
  failures++;
}
if(!card.includes('project-title-link') || !card.includes('project-open-label') || !styles.includes('.project:focus-within')){
  console.error('Project cards must expose a keyboard-focusable case-study link and focus state');
  failures++;
}
if(!styles.includes('@media (prefers-reduced-motion:reduce)') || !styles.includes('.project:hover,.btn:hover { transform:none; }')){
  console.error('Interactive movement must respect reduced-motion preferences');
  failures++;
}
const interactions=fs.readFileSync('src/components/ProjectInteraction.astro','utf8');
for(const slug of ['futureme-ai','pytorch-forecasting-tft','recommendation-systems']){
  if(!interactions.includes(`id === '${slug}'`)){console.error(`Missing project interaction for ${slug}`);failures++;}
}
const visibleCopy=[card,interactions,fs.readFileSync('src/components/Header.astro','utf8'),fs.readFileSync('src/pages/404.astro','utf8'),...mdFiles.map(file=>fs.readFileSync(`src/content/projects/${file}`,'utf8'))].join('\n');
if(/Case study’y|Case study’y|Projeler|Eğitim|İletişim|Türkçe/.test(visibleCopy)){
  console.error('Turkish UI copy remains; the public interface must be English');
  failures++;
}
console.log(`Source audit: ${required.length} required paths and ${mdFiles.length} content entries checked. Failures: ${failures}`);
if(failures) process.exit(1);
