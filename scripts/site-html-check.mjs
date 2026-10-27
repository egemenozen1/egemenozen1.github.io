/** Shared, dependency-free checks for generated static HTML. */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'preview');
if (!fs.existsSync(root)) {
  console.error(`Missing directory: ${root}`);
  process.exit(1);
}
const list = (d) => fs.readdirSync(d,{withFileTypes:true}).flatMap((x) => {
  const f=path.join(d,x.name);
  return x.isDirectory()?list(f):(f.endsWith('.html')?[f]:[]);
});
const pages=list(root);
let failures=0;
const fail=(msg)=>{console.error(`FAIL ${msg}`); failures++;};
const attr=(tag,key)=>{
  const m=tag.match(new RegExp(`\\b${key}\\s*=\\s*["']([^"']*)["']`,'i'));
  return m?.[1]??null;
};
function resolvedFile(from,href){
  const pure=href.split('#')[0].split('?')[0];
  if(!pure) return from;
  const dest=pure.startsWith('/')?path.join(root,pure):path.resolve(path.dirname(from),pure);
  if(!path.resolve(dest).startsWith(root+path.sep) && path.resolve(dest)!==root) return null;
  if(fs.existsSync(dest) && fs.statSync(dest).isFile())return dest;
  const pretty=path.join(dest,'index.html');
  if(fs.existsSync(pretty))return pretty;
  if(!path.extname(dest) && fs.existsSync(`${dest}.html`))return `${dest}.html`;
  return dest;
}
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file);
  if(!/<html\s+lang="en"/i.test(html))fail(`${rel}: missing HTML language`);
  if(!/<meta\s+name="viewport"/i.test(html))fail(`${rel}: missing responsive viewport`);
  const nH1=(html.match(/<h1(?:\s|>)/gi)||[]).length;
  if(nH1!==1)fail(`${rel}: expected exactly one H1, found ${nH1}`);
  const ids=new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(x=>x[1]));
  if(ids.size!==[...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].length)fail(`${rel}: duplicate IDs`);
  if(!ids.has('main'))fail(`${rel}: main landmark missing id`);
  if(/example\.com|10\+ projects|lorem ipsum|width:\s*9[05]%/i.test(html))fail(`${rel}: placeholder or unsupported claim`);
  for(const match of html.matchAll(/<a\b[^>]*>/gi)){
    const tag=match[0],href=attr(tag,'href');
    if(!href) {fail(`${rel}: anchor without href`);continue;}
    if(/^mailto:/.test(href))continue;
    if(/^https?:\/\//.test(href)){
      if(attr(tag,'target')==='_blank' && !/\bnoopener\b/.test(attr(tag,'rel')||''))fail(`${rel}: missing noopener on external link ${href}`);
      continue;
    }
    if(/^(tel:|javascript:|data:)/.test(href)){fail(`${rel}: disallowed href scheme ${href}`);continue;}
    const resolved=resolvedFile(file,href);
    if(!resolved || !fs.existsSync(resolved)) {fail(`${rel}: broken local href ${href}`);continue;}
    const hash=href.includes('#')?decodeURIComponent(href.split('#')[1]):'';
    if(hash){
      const content=resolved===file?html:fs.readFileSync(resolved,'utf8');
      const idsThere=[...content.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(x=>x[1]);
      if(!idsThere.includes(hash))fail(`${rel}: missing #${hash} anchor in ${href}`);
    }
  }
}
console.log(`HTML audit: ${pages.length} pages, ${failures} failure(s).`);
if(failures)process.exit(1);
