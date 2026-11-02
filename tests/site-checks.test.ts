import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

test('all required static site files exist', () => {
  const files = [
    'index.html',
    'projects/openring.html',
    'projects/pdf-tools.html',
    'projects/job-hunt.html',
    '404.html',
    'css/style.css',
    'js/site.js',
    'favicon.svg',
    'robots.txt',
    'sitemap.xml',
    'README.md',
    'assets/Zarif_Ahmed_Resume.pdf',
  ];

  for (const f of files) {
    const fullPath = path.join(ROOT, f);
    assert.equal(fs.existsSync(fullPath), true, `Expected file to exist: ${f}`);
  }
});

test('js/site.js is under 40 lines', () => {
  const content = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf-8');
  const lines = content.split('\n').filter(Boolean);
  assert.ok(lines.length < 40, `js/site.js should be under 40 lines, got ${lines.length}`);
});

test('README.md is 15 lines max', () => {
  const content = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf-8');
  const lines = content.trim().split('\n');
  assert.ok(lines.length <= 15, `README.md should be at most 15 lines, got ${lines.length}`);
});

test('no prohibited AI cliches or buzzwords in HTML', () => {
  const htmlFiles = [
    'index.html',
    'projects/openring.html',
    'projects/pdf-tools.html',
    'projects/job-hunt.html',
    '404.html',
  ];

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

  for (const f of htmlFiles) {
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
  const filesToCheck = [
    'index.html',
    'projects/openring.html',
    'projects/pdf-tools.html',
    'projects/job-hunt.html',
    '404.html',
    'css/style.css',
  ];

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
  const filesToCheck = [
    'index.html',
    'projects/openring.html',
    'projects/pdf-tools.html',
    'projects/job-hunt.html',
    '404.html',
    'css/style.css',
  ];

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

test('user requested modifications are applied', () => {
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

  // "built by hand" removed
  assert.equal(indexText.toLowerCase().includes('built by hand'), false, 'Built by hand should be removed');

  // "updated november 2026" removed
  assert.equal(indexText.toLowerCase().includes('updated november 2026'), false, 'Updated November 2026 should be removed');

  // User's new intro text present
  assert.equal(indexText.includes('starts with a problem I find, or a thing that I want'), true, 'Should include updated intro phrasing');
  assert.equal(indexText.includes('I build tools to <span id="morph-phrase"'), true, 'Should include animated morph-phrase');
  assert.equal(indexText.includes("make my parent's lives easier"), true, 'Should include initial tools phrase');

  // Morph phrase cycling phrases in js/site.js
  const jsText = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf-8');
  const expectedPhrases = [
    "make my parent's lives easier",
    "help me work",
    "help me study",
    "help me find jobs",
    "help me invest",
    "help me organize",
    "help me train"
  ];
  for (const phrase of expectedPhrases) {
    assert.equal(jsText.includes(phrase), true, `js/site.js should include phrase: "${phrase}"`);
  }

  // Cover jpgs exist
  assert.equal(fs.existsSync(path.join(ROOT, 'assets/img/openring-cover.jpg')), true, 'openring-cover.jpg must exist');
  assert.equal(fs.existsSync(path.join(ROOT, 'assets/img/pdf-tools-cover.jpg')), true, 'pdf-tools-cover.jpg must exist');
  assert.equal(fs.existsSync(path.join(ROOT, 'assets/img/job-hunt-cover.jpg')), true, 'job-hunt-cover.jpg must exist');

  // "Western Developers' Society" and "Western AI" removed
  assert.equal(indexText.includes("Western Developers' Society"), false, "Western Developers' Society should be removed");
  assert.equal(indexText.includes('Western AI'), false, 'Western AI should be removed');

  // "Older and smaller" changed to "Older"
  assert.equal(indexText.includes('Older and smaller'), false, 'Older and smaller should be changed to Older');
  assert.equal(indexText.includes('<h3 class="older-title">Older</h3>'), true, 'Should include Older title');

  // Intro replacement: "Hey, I'm Zarif. I can build whatever [pronoun] want."
  assert.equal(indexText.includes("Hey, I'm Zarif. I can build whatever <span id=\"morph-pronoun\""), true, "Should have static 'I can build whatever' with morphing second pronoun");
  assert.equal(indexText.includes('morph-pronoun-2'), false, 'Should not have morph-pronoun-2 since first I is static');
  assert.equal(indexText.includes("I'm in my last year of computer science at Western University and I graduate in April 2027"), false, 'Old intro paragraph should be removed');

  // "Most of all" removed, ending sentence on its own line/paragraph
  assert.equal(indexText.toLowerCase().includes('most of all'), false, 'Most of all should be removed');
  assert.equal(indexText.toLowerCase().includes('most ofall'), false, 'Most ofall should be removed');
  assert.equal(indexText.includes('<p>I like ending up with something I actually use every day.</p>'), true, 'Ending sentence should be on its own line/paragraph');

  // Updated P&G intro sentence
  assert.equal(indexText.includes("I've spent the last 2 years at P&G building tools to automate data pipelines and eliminate thousands of hours of work"), true, 'Should include updated P&G sentence');
  assert.equal(indexText.includes("and I'm looking for a new opportunity to build towards something!"), true, 'Should include build towards something opportunity clause');

  // All three animated elements must be synchronized on the same timer
  assert.equal(jsText.includes('morph-pronoun') && jsText.includes('morph-phrase') && jsText.includes('morph-role'), true, 'All three morph targets must exist in site.js');
  assert.equal(jsText.includes("'Software'") && jsText.includes("'Data'") && jsText.includes("'Security'"), true, 'All three role names must exist in site.js');
  // Confirm single setInterval governs all morph elements
  const setIntervalMatches = jsText.match(/setInterval\s*\(/g) || [];
  assert.equal(setIntervalMatches.length, 1, 'All animated parts must be on a single shared timer');

  // Focus elements updates
  assert.equal(indexText.includes('20$ smart ring'), true, 'OpenRing hook should use 20$');
  assert.equal(indexText.includes('used by over 50 people'), true, 'Tunify should say over 50 people');
  assert.equal(indexText.includes('50+ people'), false, '50+ people should be replaced');
  assert.equal(indexText.includes('teaches kids how to program'), true, 'ProBot should say teaches kids how to program');
  assert.equal(indexText.includes('<li>Building...</li>'), true, 'Now section should include Building...');
  assert.equal(indexText.includes('<li>Finishing my 4th year at Western.</li>'), true, 'Now section should include Finishing my 4th year');
  assert.equal(indexText.includes("The best way to reach me is email. I read everything and I'm happy to talk! Let's talk life, plans, opportunities, projects, or a good album!"), true, 'Contact paragraph should match requested copy');
  assert.equal(indexText.includes('CS @ Western University'), true, 'Header should include CS @ Western University');
  assert.equal(indexText.includes('id="morph-role"'), true, 'Header should include morph-role');
  assert.equal(indexText.includes('Engineer'), true, 'Header should include Engineer');
});

test('opening hero state and scroll prompt are configured', () => {
  const indexText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  const cssText = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf-8');
  const jsText = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf-8');

  // scroll prompt exists
  assert.equal(indexText.includes('id="scroll-prompt"'), true, 'Scroll prompt should exist in index.html');
  assert.equal(indexText.includes('scroll down'), true, 'Scroll prompt text should say scroll down');

  // header-brand wrapper exists for selected elements
  assert.equal(indexText.includes('class="header-brand"'), true, 'Header brand wrapper should exist in index.html');

  // CSS transitions for intro state
  assert.equal(cssText.includes('html.is-intro .header-brand'), true, 'CSS should contain intro styles for header-brand');
  assert.equal(cssText.includes('.scroll-prompt'), true, 'CSS should style scroll-prompt');
  assert.equal(cssText.includes('html.is-intro body'), true, 'CSS should lock overflow during intro');

  // JS has unlock triggers
  assert.equal(jsText.includes("classList.remove('is-intro')"), true, 'JS should remove is-intro to unlock scrolling');
  assert.equal(jsText.includes('wheel'), true, 'JS should listen for scroll/wheel trigger');
});



