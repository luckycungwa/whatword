// WhatWord Word Intelligence — SEO opportunity scoring + index/noindex decisions (pure).
// Implements the phase spec: pageScore over intent/completeness/uniqueness/utility/
// relationships/depth/confidence, with configurable thresholds.

export interface SeoScoreInput {
  hasVerifiedDefinition: boolean;
  definitionLength: number;
  exampleCount: number;
  synonymCount: number;
  antonymCount: number;
  relatedCount: number;
  anagramCount: number;
  hasPronunciation: boolean;
  hasWordForms: boolean;
  /** How many corpus words share its primary discovery facets (result-set depth). */
  facetCoverage: number;
  /** Estimated distinct content blocks on the rendered page. */
  contentBlocks: number;
}

export interface SeoScore {
  total: number;
  parts: {
    intent: number; // /20
    completeness: number; // /20
    uniqueness: number; // /15
    utility: number; // /20
    relationships: number; // /10
    depth: number; // /10
    confidence: number; // /5
  };
}

export function scoreWordPage(input: SeoScoreInput): SeoScore {
  const intent = input.hasVerifiedDefinition ? 18 : 6;
  const completeness = Math.min(
    20,
    (input.hasVerifiedDefinition ? 8 : 0) +
      Math.min(4, Math.floor(input.definitionLength / 60)) +
      Math.min(3, input.exampleCount) +
      (input.hasPronunciation ? 2 : 0) +
      (input.hasWordForms ? 2 : 0) +
      (input.synonymCount > 0 ? 1 : 0),
  );
  const uniqueness = Math.min(15, 5 + Math.min(10, input.contentBlocks));
  const utility = Math.min(
    20,
    Math.min(8, input.synonymCount) +
      Math.min(4, input.antonymCount) +
      Math.min(4, input.relatedCount) +
      Math.min(4, input.anagramCount + input.exampleCount),
  );
  const relationships = Math.min(
    10,
    Math.min(4, input.relatedCount) +
      Math.min(3, input.anagramCount) +
      (input.synonymCount > 0 ? 2 : 0) +
      (input.facetCoverage > 5 ? 1 : 0),
  );
  const depth = Math.min(10, Math.min(6, input.contentBlocks) + (input.facetCoverage >= 10 ? 4 : input.facetCoverage >= 3 ? 2 : 0));
  const confidence = input.hasVerifiedDefinition ? 5 : 1;

  const parts = { intent, completeness, uniqueness, utility, relationships, depth, confidence };
  const total = intent + completeness + uniqueness + utility + relationships + depth + confidence;
  return { total, parts };
}

export type IndexDecision = 'index-priority' | 'index' | 'review' | 'noindex';

export interface SeoThresholds {
  priority: number;
  index: number;
  review: number;
}

/** Configurable thresholds — never hard-code these at call sites. */
export const DEFAULT_THRESHOLDS: SeoThresholds = { priority: 90, index: 80, review: 70 };

export function indexDecision(score: number, thresholds: SeoThresholds = DEFAULT_THRESHOLDS): IndexDecision {
  if (score >= thresholds.priority) return 'index-priority';
  if (score >= thresholds.index) return 'index';
  if (score >= thresholds.review) return 'review';
  return 'noindex';
}

/** Word-list pages need a useful result set: tiny/empty sets stay out of the index. */
export function listPageDecision(resultCount: number, minResults = 5): IndexDecision {
  if (resultCount >= Math.max(minResults, 10)) return 'index';
  if (resultCount >= minResults) return 'review';
  return 'noindex';
}
