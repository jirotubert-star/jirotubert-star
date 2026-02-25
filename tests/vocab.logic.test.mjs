import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  levenshteinDistance,
  isWriteAnswerAccepted,
  buildMcqOptions,
  updateVocabProgress,
  computeVocabStreak,
} = require('../js/vocab-logic.js');

test('levenshteinDistance computes expected differences', () => {
  assert.equal(levenshteinDistance('bonjour', 'bonjou'), 1);
  assert.equal(levenshteinDistance('ecole', 'école'), 0);
  assert.equal(levenshteinDistance('chat', 'chien'), 3);
});

test('isWriteAnswerAccepted allows small typos within tolerance', () => {
  assert.equal(isWriteAnswerAccepted('bonjor', 'bonjour', 1), true);
  assert.equal(isWriteAnswerAccepted('bnjor', 'bonjour', 1), false);
  assert.equal(isWriteAnswerAccepted('ecole', 'école', 0), true);
});

test('buildMcqOptions returns four options and includes correct answer', () => {
  const pool = [
    { id: 'a', fr: 'bonjour', de: 'hallo' },
    { id: 'b', fr: 'chat', de: 'katze' },
    { id: 'c', fr: 'chien', de: 'hund' },
    { id: 'd', fr: 'maison', de: 'haus' },
    { id: 'e', fr: 'livre', de: 'buch' },
  ];
  const options = buildMcqOptions(pool[0], pool, 'fr-de', 4);
  assert.equal(options.length, 4);
  assert.equal(options.includes('hallo'), true);
});

test('updateVocabProgress increments correct and learned ids', () => {
  const result = updateVocabProgress(
    { byTheme: {}, daily: {} },
    { themeId: 'familie', dateISO: '2026-02-25', itemId: 'familie-001', correct: true }
  );
  assert.equal(result.daily['2026-02-25'].correct, 1);
  assert.equal(result.byTheme.familie.correctCount, 1);
  assert.equal(result.byTheme.familie.learnedIds.includes('familie-001'), true);
});

test('computeVocabStreak counts only consecutive days with reached goal', () => {
  const progress = {
    daily: {
      '2026-02-23': { correct: 10, wrong: 0, sessions: 1 },
      '2026-02-24': { correct: 12, wrong: 2, sessions: 1 },
      '2026-02-25': { correct: 10, wrong: 1, sessions: 1 },
      '2026-02-22': { correct: 4, wrong: 0, sessions: 1 },
    },
  };
  assert.equal(computeVocabStreak(progress, '2026-02-25', 10), 3);
  assert.equal(computeVocabStreak(progress, '2026-02-25', 11), 0);
});
