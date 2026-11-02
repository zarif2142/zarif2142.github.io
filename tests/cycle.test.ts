import test from 'node:test';
import assert from 'node:assert/strict';

function getNextIndex(currentIdx: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIdx + 1) % total;
}

function getNextItem<T>(items: T[], currentIdx: number): T {
  const nextIdx = getNextIndex(currentIdx, items.length);
  return items[nextIdx];
}

test('cycle logic advances index sequentially and wraps around', () => {
  const phrases = [
    "make my parents' lives easier",
    "help me work",
    "help me study",
    "help me find jobs",
    "help me invest",
    "help me organize",
    "help me train",
  ];

  assert.equal(phrases.length, 7);
  let idx = 0;

  assert.equal(getNextItem(phrases, 0), "help me work");
  idx = getNextIndex(idx, phrases.length); // 1
  assert.equal(idx, 1);

  idx = getNextIndex(idx, phrases.length); // 2
  assert.equal(phrases[idx], "help me study");

  idx = getNextIndex(idx, phrases.length); // 3
  assert.equal(phrases[idx], "help me find jobs");

  idx = getNextIndex(idx, phrases.length); // 4
  assert.equal(phrases[idx], "help me invest");

  idx = getNextIndex(idx, phrases.length); // 5
  assert.equal(phrases[idx], "help me organize");

  idx = getNextIndex(idx, phrases.length); // 6
  assert.equal(phrases[idx], "help me train");

  // Wrap around back to index 0
  idx = getNextIndex(idx, phrases.length); // 0
  assert.equal(idx, 0);
  assert.equal(phrases[idx], "make my parents' lives easier");
});

test('pronoun cycle advances through you, we, I correctly', () => {
  const pronouns = ['you', 'we', 'I'];
  assert.equal(getNextItem(pronouns, 0), 'we');
  assert.equal(getNextItem(pronouns, 1), 'I');
  assert.equal(getNextItem(pronouns, 2), 'you');
});

test('role cycle advances through Software, Data, Security correctly', () => {
  const roles = ['Software', 'Data', 'Security'];
  assert.equal(getNextItem(roles, 0), 'Data');
  assert.equal(getNextItem(roles, 1), 'Security');
  assert.equal(getNextItem(roles, 2), 'Software');
});

