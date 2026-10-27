#!/usr/bin/env python3
"""Local visual prototype, deliberately NOT an Astro build."""
from pathlib import Path
from html import escape
import shutil
import yaml
import mistune

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'preview'
OUT.mkdir(exist_ok=True)
(OUT/'projects').mkdir(exist_ok=True)
shutil.copy2(ROOT/'src/styles/global.css',OUT/'style.css')
shutil.copy2(ROOT/'public/favicon.svg',OUT/'favicon.svg')
projects=[]
for p in sorted((ROOT/'src/content/projects').glob('*.md')):
    txt=p.read_text(encoding='utf-8')
    _,metadata,body=txt.split('---',2)
    data=yaml.safe_load(metadata)
    data.update(slug=p.stem,body=body)
    projects.append(data)
projects.sort(key=lambda p:p['order'])
expected_pages={f'{p["slug"]}.html' for p in projects}
for stale_page in (OUT/'projects').glob('*.html'):
    if stale_page.name not in expected_pages:
        stale_page.unlink()

def doc(title,body,case=False,error=False):
    navprefix='../index.html#' if case else ('index.html#' if error else '#')
    home='../index.html' if case else 'index.html'
    suffix='' if case else ''
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0a0e16"><meta name="description" content="Professional portfolio of Egemen Özen: data analytics, applied AI and product development"><title>{escape(title)}</title><link rel="icon" href="{'../' if case else ''}favicon.svg"><link rel="stylesheet" href="{'../' if case else ''}style.css"></head><body>
<a class="skip" href="#main">Skip to content</a><header class="site-header"><nav class="nav container" aria-label="Primary navigation"><a href="{home}" class="brand">Egemen Özen<span>.</span></a><div class="nav-links"><a href="{navprefix}work">Work</a><a href="{navprefix}expertise">Expertise</a><a href="{navprefix}about">About</a><a href="{navprefix}contact">Contact</a><a class="nav-resume" href="https://github.com/egemenozen1" rel="noopener noreferrer" target="_blank">GitHub <span aria-hidden="true">↗</span></a></div></nav></header><main id="main">{body}</main><footer class="site-footer"><div class="container footer-row"><span>© 2026 Egemen Özen. All rights reserved.</span><span>Built with intention · Berlin, Germany</span></div></footer></body></html>'''

def project_card(p,i):
    links=[]
    if p.get('sourceUrl'):links.append(f'<a class="text-link" href="{escape(p["sourceUrl"])}" target="_blank" rel="noopener noreferrer">Source <span aria-hidden="true">↗</span></a>')
    if p.get('liveUrl'):links.append(f'<a class="text-link" href="{escape(p["liveUrl"])}" target="_blank" rel="noopener noreferrer">Live app <span aria-hidden="true">↗</span></a>')
    return f'''<article class="project"><div><span class="project-index">{i:02d} / SELECTED WORK</span><h3><a class="project-title-link" href="projects/{p['slug']}.html" aria-label="{escape(p['title'])} — View case study">{escape(p['title'])}</a></h3><p>{escape(p['summary'])}</p><div class="tagline">{escape(p['category'])}</div><span class="project-open-label" aria-hidden="true">View case study <span>↗</span></span></div><div class="project-meta"><span class="project-meta-title">Focus & tools</span><div class="tech-list">{''.join(f'<span class="tech">{escape(t)}</span>' for t in p['technologies'])}</div><div class="link-row">{''.join(links)}</div></div></article>'''

orbit='<div class="hero-orbit" aria-hidden="true"><span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span><span class="ring r4"></span><span class="orbit-line"></span><span class="orbit-point"></span></div>'
hero=f'''<section class="hero" aria-labelledby="hero-title">{orbit}<div class="container hero-inner"><div class="hero-main"><span class="eyebrow">Data + AI + Product Builder</span><h1 id="hero-title"><span class="hero-title-line">Building intelligent</span> <em>digital products.</em></h1><p class="hero-description">I'm Egemen Özen, a Berlin-based data analytics professional working across Python, applied AI, and product development.</p><div class="actions"><a class="btn btn-primary" href="#work">Explore My Work <span class="arrow" aria-hidden="true">↗</span></a><a class="btn btn-outline" href="https://github.com/egemenozen1" target="_blank" rel="noopener noreferrer">View GitHub <span class="arrow" aria-hidden="true">↗</span></a></div></div><div class="hero-foot"><span>Berlin, Germany</span><a href="#work">Scroll to explore <span aria-hidden="true">↓</span></a></div></div></section>'''
work=f'''<section class="section" id="work" aria-labelledby="work-title"><div class="container"><div class="section-label">01 / Selected work</div><h2 class="section-heading" id="work-title">A selection of work, built around real problems.</h2><p class="section-desc">Software, applied machine learning and research. Each project is presented with its context, approach and evidence.</p><div class="projects">{''.join(project_card(p,i) for i,p in enumerate(projects,1))}</div></div></section>'''
expertise='''<section class="section" id="expertise" aria-labelledby="expertise-title"><div class="container"><div class="section-label">02 / Expertise</div><h2 class="section-heading" id="expertise-title">Where analysis meets execution.</h2><div class="expertise-grid"><div class="expertise"><div class="expertise-no">01 / ANALYTICS</div><h3>Data & Analytics</h3><p>Python, SQL, data exploration, statistical reasoning and visualization. From noisy inputs to useful insights.</p></div><div class="expertise"><div class="expertise-no">02 / INTELLIGENCE</div><h3>Applied AI</h3><p>Machine learning fundamentals, experimentation, model comparison and evaluation grounded in evidence.</p></div><div class="expertise"><div class="expertise-no">03 / EXECUTION</div><h3>Product Building</h3><p>Prototyping, API-driven applications, testing and iterative product improvement with attention to usability.</p></div></div></div></section>'''
about='''<section class="section" id="about" aria-labelledby="about-title"><div class="container about-grid"><div><div class="section-label">03 / Background</div><h2 class="section-heading" id="about-title">Scientific roots. Product-minded execution.</h2><p class="section-desc">I studied Genetics & Bioengineering at Istanbul Bilgi University before completing an MSc in Data Analytics at BSBI Berlin. That blend of scientific and computational thinking shapes how I approach problems: question assumptions, work with evidence and make ideas tangible.</p><p class="section-desc">I am focused on opportunities at the intersection of data analytics, applied AI and technical product development.</p></div><div class="facts"><div class="fact"><span>Based in</span><strong>Berlin, Germany</strong></div><div class="fact"><span>Education</span><strong>MSc Data Analytics — BSBI Berlin<br />BSc Genetics & Bioengineering — Istanbul Bilgi University</strong></div><div class="fact"><span>Areas</span><strong>Data / AI / Software products</strong></div></div></div></section>'''
contact='''<section class="section" id="contact" aria-labelledby="contact-title"><div class="container contact-area"><div><div class="section-label">04 / Contact</div><h2 class="contact-heading" id="contact-title">Let's make something useful.</h2><p class="section-desc">Open to meaningful conversations about data analytics, AI and product development.</p></div><div class="contact-links"><a href="mailto:egemen.oezen@gmail.com">Email <span aria-hidden="true">↗</span></a><a href="https://github.com/egemenozen1" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div></div></section>'''
(OUT/'index.html').write_text(doc('Egemen Özen — Data Analytics, Applied AI & Product Development',hero+work+expertise+about+contact),encoding='utf-8')
def interaction(p):
    flows={
      'futureme-ai': [('Choose a fictional example','Select a short career course, reduced working hours or a side project.'),('Compare modeled possibilities','The demo displays an assumption-based range over five years, not a personalized prediction.'),('Consider a small experiment','A suggested experiment gives the scenario a practical next step to think through.')],
      'pytorch-forecasting-tft': [('Prepare the series','The analysis script parses date and time, creates a sequential time index and uses UCI Air Quality’s CO_GT_ field.'),('Preserve chronology','The code separates the final 20% as a test segment without shuffling time order.'),('Configure one-step TFT','PyTorch Forecasting and PyTorch Lightning configure a one-step Temporal Fusion Transformer.'),('Review evaluation code','The script calculates R². Evaluation needs further review, so no numerical result is presented.')],
      'recommendation-systems': [('Review recommendation approaches','The thesis surveys and compares algorithms described in its literature review.'),('Consider SQL data management','It discusses how data organization relates to recommendation approaches and smaller organizations.'),('Compare application contexts','Case studies connect the discussion to streaming services and smaller businesses; no running ranking pipeline is claimed.'),('Include responsible-use questions','The research also addresses bias, transparency and privacy.')],
      'antidepressant-binding-mechanisms': [('Prepare structures and compounds','The 2022 report describes protein structures 5I6X and 7VOE and ten selected compounds.'),('Run computational docking','The report documents AutoDock Vina docking and grid boxes around previously bound ligands.'),('Inspect poses','PyMOL is used to visualize docking poses; these are computational outputs, not clinical effects.')]
    }
    nodes=''.join(f'<li><details><summary><span class="flow-number">{i:02d}</span><span>{escape(title)}</span></summary><p>{escape(body)}</p></details></li>' for i,(title,body) in enumerate(flows[p['slug']],1))
    heading='Product walkthrough' if p['slug']=='futureme-ai' else ('Research walkthrough' if p['slug']=='recommendation-systems' else 'Method walkthrough')
    title='A small decision-support flow' if p['slug']=='futureme-ai' else ('How the thesis frames recommendation' if p['slug']=='recommendation-systems' else ('From time series to an evaluation step' if p['slug']=='pytorch-forecasting-tft' else 'From structures to docking poses'))
    note='This is the documented research flow, not a deployed or interactive recommendation engine.' if p['slug']=='recommendation-systems' else ('Interactive source-code flow. No synthetic forecast curve or unverified score is shown.' if p['slug']=='pytorch-forecasting-tft' else '')
    disclaimer='<p class="interaction-note">The public version is limited to three fictional examples.</p>' if p['slug']=='futureme-ai' else ''
    live=f'<a class="btn btn-primary interaction-demo" href="{escape(p["liveUrl"])}" target="_blank" rel="noopener noreferrer">Open the live demo <span class="arrow" aria-hidden="true">↗</span></a>' if p.get('liveUrl') else ''
    return f'<section class="project-interaction"><div class="interaction-heading"><span class="section-label">{heading}</span><h2>{title}</h2><p>{note or "Open a step to inspect the documented workflow."}</p></div>{live}{disclaimer}<ol class="flow-list">{nodes}</ol></section>'

for pi,p in enumerate(projects):
    tag=''.join(f'<span class="tech">{escape(t)}</span>' for t in p['technologies'])
    btns=''
    if p.get('sourceUrl'):btns+=f'<a class="btn btn-outline" href="{escape(p["sourceUrl"])}" target="_blank" rel="noopener noreferrer">View source ↗</a>'
    if p.get('liveUrl'):btns+=f'<a class="btn btn-primary" href="{escape(p["liveUrl"])}" target="_blank" rel="noopener noreferrer">Visit application ↗</a>'
    previous=f'<a class="case-nav-item" href="{projects[pi-1]["slug"]}.html"><span>Previous project</span><strong>← {escape(projects[pi-1]["title"])}</strong></a>' if pi else '<span></span>'
    nxt=f'<a class="case-nav-item case-nav-next" href="{projects[pi+1]["slug"]}.html"><span>Next project</span><strong>{escape(projects[pi+1]["title"])} →</strong></a>' if pi<len(projects)-1 else '<a class="case-nav-item case-nav-next" href="../index.html#work"><span>End of selected projects</span><strong>Back to all projects →</strong></a>'
    facts=f'<section class="section case-overview"><div class="container case-facts"><div><h2>Problem</h2><p>{escape(p["problem"])}</p></div><div><h2>Approach</h2><p>{escape(p["approach"])}</p></div><div><h2>Tools</h2><div class="case-meta">{tag}</div></div><div><h2>Verified output</h2><p>{escape(p["verifiedOutput"])}</p></div></div></section>'
    page=f'<section class="case-hero"><div class="container"><a class="case-back case-home-link" href="../index.html#work">← Selected work</a><div class="section-label">Case study / {escape(p["category"])}</div><h1>{escape(p["title"])}</h1><p class="case-subtitle">{escape(p["summary"])}</p><p class="case-scope">Scope: {escape(p["scope"])}</p><div class="case-meta">{tag}</div><div class="actions">{btns}</div></div></section>{facts}<section class="section case-detail"><div class="container">{interaction(p)}<article class="case-prose">{mistune.html(p["body"])}<nav class="case-navigation" aria-label="Project navigation">{previous}{nxt}</nav></article></div></section>'
    (OUT/'projects'/f'{p["slug"]}.html').write_text(doc(f'{p["title"]} — Egemen Özen',page,True),encoding='utf-8')
print('Generated preview homepage and',len(projects),'case studies')

# A static design-preview version of the custom error page.
(OUT/'404.html').write_text(doc('Page not found — Egemen Özen','<section class="case-hero not-found"><div class="container"><div class="section-label">404 / Page not found</div><h1>This page doesn\'t exist.</h1><p class="case-subtitle">The link may have changed. Return to the homepage to explore the projects.</p><div class="actions"><a class="btn btn-primary" href="index.html">Back to homepage ↗</a></div></div></section>',error=True),encoding='utf-8')
