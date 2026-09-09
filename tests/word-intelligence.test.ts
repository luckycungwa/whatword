// WhatWord Word Intelligence — engine tests (run: npm run test:intelligence).
// Pure modules only: no network, no Supabase, deterministic.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeWord, slugifyWord, canonicalKey, validateWord } from '../src/lib/word-intelligence/normalize';
import { SOURCE_REGISTRY, shareAlikeSources } from '../src/lib/word-intelligence/sources';
import {
  letterProps,
  scrabbleScore,
  gameInfo,
  canBuildFrom,
  matchPattern,
  isOneLetterNeighbour,
} from '../src/lib/word-intelligence/letter-props';
import {
  buildSignatureIndex,
  getAnagrams,
  getOneLetterNeighbours,
  getLetterRemovals,
  getWordsWithin,
} from '../src/lib/word-intelligence/relationships';
import { scoreWordPage, indexDecision, listPageDecision } from '../src/lib/word-intelligence/seo-score';
import { parseSmartQuery, intentRoute } from '../src/lib/word-intelligence/query-parser';
import { getLocalCorpus } from '../src/lib/word-intelligence/corpus';
import { getRegionalEntry } from '../src/lib/word-intelligence/regional';

const corpus = [
  { word: 'listen' }, { word: 'silent' }, { word: 'enlist' }, { word: 'inlets' }, { word: 'tinsel' },
  { word: 'apple' }, { word: 'cat' }, { word: 'bat' }, { word: 'can' }, { word: 'cap' },
  { word: 'plan' }, { word: 'lane' }, { word: 'late' }, { word: 'planet' },
];

describe('normalisation', () => {
  it('APPLE → apple', () => assert.equal(normalizeWord('APPLE'), 'apple'));
  it('slugifies phrases', () => assert.equal(slugifyWord('Hello World'), 'hello-world'));
  it('canonical key strips noise', () => assert.equal(canonicalKey('  Apple! '), 'apple'));
  it('rejects empty/malformed', () => {
    assert.equal(validateWord('').ok, false);
    assert.equal(validateWord('$$$').ok, false);
    assert.equal(validateWord('a--b').ok, false);
    // digits are stripped by design: abc123 → abc (valid canonical)
    assert.equal(validateWord('abc123').canonical, 'abc');
  });
  it('dedupes same canonical word', () => {
    assert.equal(validateWord('Apple').canonical, validateWord('APPLE').canonical);
  });
});

describe('letter intelligence', () => {
  it('apple → length 5', () => assert.equal(letterProps('apple').length, 5));
  it('apple starts with a / ends with e', () => {
    const p = letterProps('apple');
    assert.equal(p.firstLetter, 'a');
    assert.equal(p.lastLetter, 'e');
  });
  it('apple signature is aelpp', () => assert.equal(letterProps('apple').alphabeticalSignature, 'aelpp'));
  it('pattern _a__e shape', () => {
    assert.equal(matchPattern('apple', '_a__e'), false); // apple is a-p-p-l-e
    assert.equal(matchPattern('dance', '_a__e'), true);
  });
  it('contains p / excludes z', () => {
    assert.equal('apple'.includes('p'), true);
    assert.equal('apple'.includes('z'), false);
  });
});

describe('relationships', () => {
  const index = buildSignatureIndex(corpus);
  const set = new Set(corpus.map((c) => c.word));
  it('listen → silent', () => assert.ok(getAnagrams('listen', index).includes('silent')));
  it('listen finds enlist/inlets/tinsel', () => {
    const a = getAnagrams('listen', index);
    assert.ok(a.includes('enlist') && a.includes('inlets') && a.includes('tinsel'));
  });
  it('cat → bat one-letter neighbour', () => {
    const n = getOneLetterNeighbours('cat', corpus);
    assert.ok(n.includes('bat') && n.includes('can') && n.includes('cap'));
  });
  it('isOneLetterNeighbour guards', () => {
    assert.equal(isOneLetterNeighbour('cat', 'bat'), true);
    assert.equal(isOneLetterNeighbour('cat', 'dog'), false);
    assert.equal(isOneLetterNeighbour('cat', 'cats'), false);
  });
  it('planet removals/within include plan', () => {
    assert.ok(getWordsWithin('planet', set).includes('plan'));
    assert.ok(getLetterRemovals('cat', new Set([...set, 'at'])) .includes('at'));
  });
  it('canBuildFrom powers unscrambler', () => {
    assert.equal(canBuildFrom('apple', 'aeplp'), true);
    assert.equal(canBuildFrom('apple', 'apl'), false);
  });
});

describe('game scoring', () => {
  it('apple scrabble = 9', () => assert.equal(scrabbleScore('apple'), 9));
  it('quiz/wordle candidate flags', () => {
    assert.equal(gameInfo('apple', true).wordleCandidate, true);
    assert.equal(gameInfo('a', true).gameCandidate, false);
  });
});

describe('provenance', () => {
  it('registry verifies ESDB + FreeDictionaryAPI terms', () => {
    assert.equal(SOURCE_REGISTRY.esdb.termsVerified, true);
    assert.equal(SOURCE_REGISTRY.freedictionaryapi.termsVerified, true);
    assert.equal(SOURCE_REGISTRY.freedictionaryapi.shareAlike, true);
    assert.equal(SOURCE_REGISTRY.esdb.shareAlike, false);
  });
  it('corpus entries carry field sources', () => {
    const { byWord } = getLocalCorpus();
    const apple = byWord.get('apple');
    assert.ok(apple);
    assert.equal(apple.fieldSources.spelling, 'whatword-seed-v1');
    assert.equal(apple.fieldSources.letterProps, 'whatword-derived-v1');
  });
  it('shareAlike detection flags dictionary sources', () => {
    assert.deepEqual(
      shareAlikeSources({ definition: 'freedictionaryapi', letterProps: 'whatword-derived-v1' }),
      ['freedictionaryapi'],
    );
  });
  it('local corpus has breadth', () => {
    const { words } = getLocalCorpus();
    assert.ok(words.length >= 1500, `expected 1500+, got ${words.length}`);
  });
});

describe('SEO scoring + indexing', () => {
  const rich = {
    hasVerifiedDefinition: true, definitionLength: 400, exampleCount: 3,
    synonymCount: 6, antonymCount: 3, relatedCount: 5, anagramCount: 4,
    hasPronunciation: true, hasWordForms: true, facetCoverage: 12, contentBlocks: 10,
  };
  const thin = {
    hasVerifiedDefinition: false, definitionLength: 0, exampleCount: 0,
    synonymCount: 0, antonymCount: 0, relatedCount: 0, anagramCount: 0,
    hasPronunciation: false, hasWordForms: false, facetCoverage: 0, contentBlocks: 1,
  };
  it('high-quality page → INDEX', () => {
    const s = scoreWordPage(rich);
    assert.ok(s.total >= 80, `expected >= 80, got ${s.total}`);
    assert.ok(['index', 'index-priority'].includes(indexDecision(s.total)));
  });
  it('low-quality page → NOINDEX', () => {
    const s = scoreWordPage(thin);
    assert.equal(indexDecision(s.total), 'noindex');
  });
  it('tiny result sets stay out of the index', () => {
    assert.equal(listPageDecision(1), 'noindex');
    assert.equal(listPageDecision(147), 'index');
  });
});

describe('smart search parser', () => {
  it('parses length + startsWith', () => {
    const i = parseSmartQuery('5 letter words starting with S');
    assert.equal(i.kind, 'finder');
    if (i.kind === 'finder') {
      assert.equal(i.length, 5);
      assert.equal(i.startsWith, 's');
    }
  });
  it('parses anagram of listen', () => {
    const i = parseSmartQuery('anagram of listen');
    assert.equal(i.kind, 'anagram');
    if (i.kind === 'anagram') assert.equal(i.letters, 'listen');
  });
  it('parses containing q without u', () => {
    const i = parseSmartQuery('words containing q without u');
    assert.equal(i.kind, 'finder');
    if (i.kind === 'finder') {
      assert.equal(i.contains, 'q');
      assert.ok(i.notContains?.includes('u'));
    }
  });
  it('parses word meaning queries', () => {
    const i = parseSmartQuery('word meaning very happy');
    assert.equal(i.kind, 'meaning');
  });
  it('routes intents to engines', () => {
    assert.equal(intentRoute({ kind: 'word-lookup', word: 'apple' }), '/words/apple');
    assert.equal(intentRoute({ kind: 'anagram', letters: 'listen' }), '/anagram-solver?letters=listen');
  });
});

describe('regional architecture', () => {
  it('lekker resolves as en-ZA with citation', () => {
    const e = getRegionalEntry('lekker');
    assert.ok(e);
    assert.equal(e.locale, 'en-ZA');
    assert.ok(e.sourceCitation.length > 0);
  });
  it('generic words have no regional tag', () => {
    assert.equal(getRegionalEntry('apple'), undefined);
  });
});

describe('dictionary universe (graph floor + enrichment overlay)', () => {
  it('always serves the local graph, even without Supabase configured', async () => {
    const { getDictionaryEntries, corpusToEntry } = await import('../src/lib/words');
    const entries = await getDictionaryEntries();
    assert.ok(entries.length >= 1500, `expected 1500+, got ${entries.length}`);
    const apple = entries.find((e) => e.slug === 'apple');
    assert.ok(apple);
    assert.equal(typeof apple.word, 'string');
  });
  it('corpus entries are definition-pending with mapped metadata', async () => {
    const { corpusToEntry } = await import('../src/lib/words');
    const { getLocalCorpus } = await import('../src/lib/word-intelligence/corpus');
    const apple = getLocalCorpus().byWord.get('apple');
    assert.ok(apple);
    const entry = corpusToEntry(apple);
    assert.equal(entry.definitions.simple, '');
    assert.equal(entry.slug, 'apple');
    assert.ok(['beginner', 'intermediate', 'advanced'].includes(entry.difficulty));
  });
});
