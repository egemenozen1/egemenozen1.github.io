import fs from 'node:fs';
const requiredLegal = ['src/pages/impressum.astro','src/pages/privacy.astro'];
const missing = requiredLegal.filter(x=>!fs.existsSync(x));
if(missing.length){ console.error('BLOCKED: legal review not complete. Missing:',missing.join(', ')); process.exit(1); }
if(!fs.existsSync('release-approval.json')){console.error('BLOCKED: explicit release-approval.json is missing.');process.exit(1);}
let ok=false;
try { const a=JSON.parse(fs.readFileSync('release-approval.json','utf8'));ok=a.contentReviewed===true&&a.legalReviewed===true&&a.liveLinksVerified===true; } catch {}
if(!ok){console.error('BLOCKED: content, legal and URL checks need explicit approval.');process.exit(1);}
console.log('Release approval checks passed.');
