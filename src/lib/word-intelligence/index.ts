// WhatWord Word Intelligence — public barrel. UI/API consume from here.

export * from './normalize';
export * from './sources';
export * from './letter-props';
export * from './relationships';
export * from './seo-score';
export * from './query-parser';
export * from './regional';
export { getLocalCorpus, corpusStats } from './corpus';
export {
  getWordIntelligence,
  finderQuery,
  solverAnagrams,
  wordsFromLetters,
  getSearchUniverse,
  type WordIntelligenceResult,
  type FinderQuery,
  type FinderHit,
} from './service';
