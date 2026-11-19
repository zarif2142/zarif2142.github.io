import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const HTML_FILES = [
  'index.html',
  'projects/openring.html',
  'projects/pdf-tools.html',
  'projects/job-hunt.html',
  'work/pg-data-engineering.html',
  'work/pg-software-engineering.html',
  'notes/index.html',
  'notes/talking-to-a-20-dollar-ring.html',
  'notes/pdf-tools-that-never-see-your-files.html',
  '404.html',
];

test('all required static site files exist', () => {
  const files = [
    ...HTML_FILES,
    'css/style.css',
    'js/site.js',
    'favicon.svg',
    'robots.txt',
    'sitemap.xml',
    'README.md',
    'notes/feed.xml',
    'assets/Zarif_Ahmed_Resume.pdf',
    'assets/img/openring-cover.jpg',
    'assets/img/pdf-tools-cover.jpg',
    'assets/img/job-hunt-cover.jpg',
    'assets/img/openring-sleep-week.jpg',
    'assets/img/openring-ring-sensors.jpg',
    'assets/img/pdf-tools-compress.jpg',
    'assets/img/pdf-tools-phone-grid.jpg',
    'assets/img/job-hunt-triage.jpg',
    'assets/img/job-hunt-funnel.jpg',
  ];

  for (const f of files) {
    const fullPath = path.join(ROOT, f);
    assert.equal(fs.existsSync(fullPath), true, `Expected file to exist: ${f}`);
  }

  for (const stem of ['openring-cover', 'pdf-tools-cover', 'job-hunt-cover']) {
    for (const w of [480, 960, 1600]) {
      assert.equal(fs.existsSync(path.join(ROOT, `assets/img/${stem}-${w}.jpg`)), true, `${stem}-${w}.jpg must exist`);
      assert.equal(fs.existsSync(path.join(ROOT, `assets/img/${stem}-${w}.webp`)), true, `${stem}-${w}.webp must exist`);
    }
  }
});

test('js/site.js is under 60 lines', () => {
  const content = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf-8');
  const lines = content.split('\n').filter(Boolean);
  assert.ok(lines.length < 60, `js/site.js should be under 60 lines, got ${lines.length}`);
});

test('README.md is 15 lines max', () => {
  const content = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf-8');
  const lines = content.trim().split('\n');
  assert.ok(lines.length <= 15, `README.md should be at most 15 lines, got ${lines.length}`);
});

test('css/style.css grew by less than 3 KB over the 22,784 byte baseline', () => {
  const size = fs.statSync(path.join(ROOT, 'css/style.css')).size;
  assert.ok(size < 22784 + 3072, `css/style.css should stay under 25,856 bytes, got ${size}`);
});

test('no prohibited AI cliches or buzzwords in HTML', () => {
  const bannedKeywords = [
    'passionate',
    'innovative',
    'cutting-edge',
    'seamless',
    'robust',
    'leverage',
    'delve',
    'journey',
    'crafting digital experiences',
    'turning ideas into reality',
    "let's build something amazing together",
  ];

  for (const f of HTML_FILES) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8').toLowerCase();
    for (const word of bannedKeywords) {
      assert.equal(
        text.includes(word),
        false,
        `File ${f} contains banned buzzword: "${word}"`
      );
    }
  }
});

test('no em dashes (—) anywhere in HTML or CSS', () => {
  const filesToCheck = [...HTML_FILES, 'css/style.css'];

  for (const f of filesToCheck) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    assert.equal(
      text.includes('\u2014') || text.includes('&mdash;'),
      false,
      `File ${f} contains prohibited em dash`
    );
  }
});

test('no emojis anywhere in HTML or CSS', () => {
  const filesToCheck = [...HTML_FILES, 'css/style.css'];

  // Regex covering standard emoji unicode ranges
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  for (const f of filesToCheck) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    assert.equal(
      emojiRegex.test(text),
      false,
      `File ${f} contains prohibited emoji`
    );
  }
});

test('homepage keeps the scroll intro and rotating words', () => {
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  const jsText = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf-8');

  assert.equal(indexText.includes("classList.add('is-intro')"), true, 'index.html should start the scroll intro');
  assert.equal(indexText.includes('id="scroll-prompt"'), true, 'scroll prompt should be present');
  assert.equal(indexText.includes('id="morph-pronoun"'), true, 'rotating pronoun should be present');
  assert.equal(indexText.includes('id="morph-phrase"'), true, 'rotating phrase should be present');
  assert.equal(indexText.includes('id="morph-role"'), true, 'rotating role should be present');
  assert.equal(jsText.includes('setInterval'), true, 'site.js should rotate hero words');
  assert.equal(jsText.includes('is-intro'), true, 'site.js should handle the intro');
  assert.equal(indexText.includes("Hey, I'm Zarif. I can build whatever"), true, 'Original headline should be present');
  assert.equal(indexText.includes('time back'), false, 'Replacement headline should be gone');
  assert.equal(indexText.includes('starts with a problem I find, or a thing that I want'), true, 'Should include updated intro phrasing');
  assert.equal(indexText.includes("make my parents' lives easier"), true, 'Should include initial tools phrase');
  assert.equal(indexText.includes('<p>I like ending up with something I actually use every day.</p>'), true, 'Ending sentence should be on its own line/paragraph');
  assert.equal(indexText.includes("I've spent the last year and a half at P&G building tools to automate data pipelines and eliminate thousands of hours of work"), true, 'Should include updated P&G sentence');
  assert.equal(indexText.includes("and I'm looking for a new opportunity to build towards something!"), true, 'Should include build towards something opportunity clause');
  assert.equal(indexText.includes('Python · SQL · Swift · JavaScript · Azure · Databricks'), true, 'Skills line should be present');
  assert.equal(indexText.includes('CS @ Western University'), true, 'Header should include CS @ Western University');
  assert.equal(indexText.includes('$20 smart ring'), true, 'OpenRing hook should use $20');
  assert.equal(indexText.includes('used by over 50 people'), true, 'Tunify should say over 50 people');
  assert.equal(indexText.includes('50+ people'), false, '50+ people should be replaced');
  assert.equal(indexText.includes('teaches kids how to program'), true, 'ProBot should say teaches kids how to program');
  assert.equal(indexText.includes('<li>Still building!</li>'), true, 'Currently section should include Still building!');
  assert.equal(indexText.includes('<li>Finishing my 4th year at Western.</li>'), true, 'Now section should include Finishing my 4th year');
  assert.equal(indexText.includes("The best way to reach me is email. I read everything and I'm happy to talk! Let's talk life, plans, opportunities, projects, or a good album!"), true, 'Contact paragraph should match requested copy');
});

test('P&G work entries start collapsed and link to detail pages', () => {
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  assert.equal(indexText.includes('href="work/pg-data-engineering.html"'), true, 'P&G Data entry should link to its detail page');
  assert.equal(indexText.includes('href="work/pg-software-engineering.html"'), true, 'P&G Software entry should link to its detail page');
  const openCount = (indexText.match(/<details class="work-disclosure" open>/g) || []).length;
  assert.equal(openCount, 0, 'P&G entries should start collapsed');
});

test('Notes nav and homepage notes list', () => {
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  assert.equal(indexText.includes('href="#notes"'), true, 'Notes should be in the nav');
  assert.equal(indexText.includes('id="notes"'), true, 'Notes section should exist');
  assert.equal(indexText.includes('notes/talking-to-a-20-dollar-ring.html'), true, 'Homepage should list the OpenRing post');
  assert.equal(indexText.includes('notes/pdf-tools-that-never-see-your-files.html'), true, 'Homepage should list the PDF Tools post');
  const feed = fs.readFileSync(path.join(ROOT, 'notes/feed.xml'), 'utf-8');
  assert.equal(feed.includes('talking-to-a-20-dollar-ring.html'), true, 'RSS feed should include the OpenRing post');
  assert.equal(feed.includes('pdf-tools-that-never-see-your-files.html'), true, 'RSS feed should include the PDF Tools post');
});

test('covers use srcset and honest alt text', () => {
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  for (const stem of ['openring-cover', 'pdf-tools-cover', 'job-hunt-cover']) {
    assert.equal(indexText.includes(`${stem}-480.webp`), true, `Homepage should srcset ${stem} 480w`);
    assert.equal(indexText.includes(`${stem}-1600.webp`), true, `Homepage should srcset ${stem} 1600w`);
  }
  assert.equal(indexText.includes('A black smart ring beside an iPhone showing sleep, heart rate and step charts'), true, 'OpenRing alt should describe the new image');
  assert.equal(indexText.includes('OpenRing application running on iPhone'), false, 'Old wrong OpenRing alt should be gone');
  assert.equal(indexText.includes('OpenRing dashboard syncing metrics directly over CoreBluetooth'), false, 'Old wrong OpenRing caption should be gone');
});

test('project pages: depth, images, navigation and contact', () => {
  const expectations: Record<string, string[]> = {
    'projects/openring.html': [
      '146 RingKit tests',
      '74 self-check tests',
      '28 app tests',
      'openring-sleep-week.jpg',
      'openring-ring-sensors.jpg',
      'href="job-hunt.html"',
      'href="pdf-tools.html"',
      'Swift, SwiftUI, CoreBluetooth, SwiftData, Swift Charts, XCTest',
    ],
    'projects/pdf-tools.html': [
      'Thirteen PDF tools',
      'pdf-tools-compress.jpg',
      'pdf-tools-phone-grid.jpg',
      'href="openring.html"',
      'href="job-hunt.html"',
      'JavaScript, WebAssembly (qpdf), Web Workers, pdf.js, PDFium, Cloudflare Workers, Claude API, GitHub Actions',
      'separate piece',
    ],
    'projects/job-hunt.html': [
      'What was hard',
      'job-hunt-triage.jpg',
      'job-hunt-funnel.jpg',
      'href="pdf-tools.html"',
      'href="openring.html"',
      'Python, FastAPI, SQLite, React, pytest',
      '543 roles that actually fit',
    ],
  };

  for (const [f, phrases] of Object.entries(expectations)) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    for (const phrase of phrases) {
      assert.equal(text.includes(phrase), true, `${f} should include: "${phrase}"`);
    }
    assert.equal(text.includes('zariftahmed@gmail.com'), true, `${f} should end with a contact block`);
    assert.equal(text.includes('108 XCTest cases at 93%'), false, `${f} should not keep the stale test figure`);
    assert.equal(text.includes('Twelve PDF tools'), false, `${f} should not say Twelve PDF tools`);
  }

  // Word counts in the reading column: 450 to 650 per project page
  for (const f of ['projects/openring.html', 'projects/pdf-tools.html', 'projects/job-hunt.html']) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    const match = text.match(/<div class="reading-column">([\s\S]*?)<\/div>\s*<\/article>/);
    assert.ok(match, `${f} should have a reading column`);
    const words = match[1].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 450 && words <= 650, `${f} reading column should be 450 to 650 words, got ${words}`);
  }
});

test('notes posts are 600 to 800 words with structured data', () => {
  for (const f of ['notes/talking-to-a-20-dollar-ring.html', 'notes/pdf-tools-that-never-see-your-files.html']) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    const paras = [...text.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, ' '));
    const words = paras.join(' ').split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 600 && words <= 800, `${f} post body should be 600 to 800 words, got ${words}`);
    assert.equal(text.includes('"@type": "Article"'), true, `${f} should carry Article JSON-LD`);
    assert.equal(text.includes('2026-11-18'), true, `${f} should be dated 18 Nov 2026`);
  }
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  assert.equal(indexText.includes('"@type": "Person"'), true, 'Homepage should carry Person JSON-LD');
  assert.equal(indexText.includes('"@type": "WebSite"'), true, 'Homepage should carry WebSite JSON-LD');
});

test('sitemap is current and lists every page', () => {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf-8');
  for (const page of [
    'https://zarif2142.github.io/',
    'https://zarif2142.github.io/projects/openring.html',
    'https://zarif2142.github.io/projects/pdf-tools.html',
    'https://zarif2142.github.io/projects/job-hunt.html',
    'https://zarif2142.github.io/work/pg-data-engineering.html',
    'https://zarif2142.github.io/work/pg-software-engineering.html',
    'https://zarif2142.github.io/notes/index.html',
    'https://zarif2142.github.io/notes/talking-to-a-20-dollar-ring.html',
    'https://zarif2142.github.io/notes/pdf-tools-that-never-see-your-files.html',
  ]) {
    assert.equal(sitemap.includes(page), true, `Sitemap should list ${page}`);
  }
  assert.equal(sitemap.includes('<lastmod>2026-11-18</lastmod>'), true, 'Sitemap lastmod should be 2026-11-18');
  assert.equal(sitemap.includes('2026-11-03'), false, 'Sitemap should not keep the stale 2026-11-03 date');
});

test('every local link, image, script and stylesheet points to a real file', () => {
  const siteUrl = 'https://zarif2142.github.io/';

  for (const f of HTML_FILES) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf-8');
    for (const [, attr, ref] of text.matchAll(/(href|src|content)="([^"#?]+)[^"]*"/g)) {
      if (attr === 'content' && !ref.startsWith(siteUrl)) continue;
      // Only check files: other repos share the domain (e.g. /pdf-tools/), and bare paths can't be resolved here
      if (!/\.[a-z0-9]+$/i.test(ref)) continue;
      let target: string;
      if (ref.startsWith(siteUrl)) target = ref.slice(siteUrl.length);
      else if (/^(https?:|mailto:|data:)/.test(ref)) continue;
      else target = path.join(path.dirname(f), ref);
      assert.equal(fs.existsSync(path.join(ROOT, target)), true, `${f} references missing file: ${ref}`);
    }
  }
});
