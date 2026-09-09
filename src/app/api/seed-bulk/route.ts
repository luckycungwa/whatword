import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// WhatWord common-word candidate list (spelling facts only — single words are not
// copyrightable; frequency ordering here is an internal heuristic, NOT COCA data).
// Lexical methodology aligns to ESDB size-60 (see WORD-SOURCES.md). Definitions are
// NEVER sourced from this list — only via dictionary enrichment with provenance.
// NOTE (2026-09-09): removed an incorrect "Source: COCA" comment that previously
// appeared here. Do not re-add source claims without verification.
const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'was', 'are', 'been', 'being', 'has', 'had', 'having', 'does', 'did', 'doing', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'will',
  'am', 'were', 'own', 'say', 'says', 'said', 'tells', 'told', 'asks', 'asked', 'find', 'finds', 'found', 'call', 'calls', 'called', 'try', 'tries', 'tried', 'ask',
  'go', 'goes', 'going', 'went', 'want', 'wants', 'wanted', 'need', 'needs', 'needed', 'feel', 'feels', 'felt', 'become', 'becomes', 'became', 'leave', 'leaves', 'left', 'put', 'puts',
  'put', 'mean', 'means', 'meant', 'keep', 'keeps', 'kept', 'let', 'lets', 'let', 'begin', 'begins', 'began', 'seem', 'seems', 'seemed', 'help', 'helps', 'helped', 'talk', 'talks', 'talked',
  'turn', 'turns', 'turned', 'start', 'starts', 'started', 'show', 'shows', 'showed', 'hear', 'hears', 'heard', 'let', 'lets', 'play', 'plays', 'played', 'run', 'runs', 'ran',
  'move', 'moves', 'moved', 'like', 'likes', 'liked', 'live', 'lives', 'lived', 'believe', 'believes', 'believed', 'hold', 'holds', 'held', 'bring', 'brings', 'brought', 'happen', 'happens', 'happened',
  'write', 'writes', 'wrote', 'provide', 'provides', 'provided', 'sit', 'sits', 'sat', 'stand', 'stands', 'stood', 'lose', 'loses', 'lost', 'pay', 'pays', 'paid', 'meet', 'meets', 'met',
  'include', 'includes', 'included', 'continue', 'continues', 'continued', 'set', 'sets', 'read', 'reads', 'allow', 'allows', 'allowed', 'add', 'adds', 'added', 'spend', 'spends', 'spent', 'grow', 'grows', 'grew',
  'open', 'opens', 'opened', 'walk', 'walks', 'walked', 'win', 'wins', 'won', 'offer', 'offers', 'offered', 'remember', 'remembers', 'remembered', 'love', 'loves', 'loved', 'consider', 'considers', 'considered',
  'appear', 'appears', 'appeared', 'buy', 'buys', 'bought', 'wait', 'waits', 'waited', 'serve', 'serves', 'served', 'die', 'dies', 'died', 'send', 'sends', 'sent', 'expect', 'expects', 'expected',
  'build', 'builds', 'built', 'stay', 'stays', 'stayed', 'fall', 'falls', 'fell', 'cut', 'cuts', 'reach', 'reaches', 'reached', 'kill', 'kills', 'killed', 'remain', 'remains', 'remained',
  'suggest', 'suggests', 'suggested', 'raise', 'raises', 'raised', 'pass', 'passes', 'passed', 'sell', 'sells', 'sold', 'require', 'requires', 'required', 'report', 'reports', 'reported', 'decide', 'decides', 'decided',
  'pull', 'pulls', 'pulled', 'explain', 'explains', 'explained', 'develop', 'develops', 'developed', 'carry', 'carries', 'carried', 'break', 'breaks', 'broke', 'spend', 'spends', 'lead', 'leads', 'led', 'understand', 'understands', 'understood',
  'watch', 'watches', 'watched', 'follow', 'follows', 'followed', 'stop', 'stops', 'stopped', 'create', 'creates', 'created', 'speak', 'speaks', 'spoke', 'read', 'reads', 'read', 'allow', 'allows', 'allowed', 'add', 'adds', 'added',
  'spend', 'spends', 'spent', 'grow', 'grows', 'grew', 'open', 'opens', 'opened', 'walk', 'walks', 'walked', 'win', 'wins', 'won', 'offer', 'offers', 'offered', 'remember', 'remembers', 'remembered', 'love', 'loves', 'loved',
  'consider', 'considers', 'considered', 'appear', 'appears', 'appeared', 'buy', 'buys', 'bought', 'wait', 'waits', 'waited', 'serve', 'serves', 'served', 'die', 'dies', 'died', 'send', 'sends', 'sent',
  'expect', 'expects', 'expected', 'build', 'builds', 'built', 'stay', 'stays', 'stayed', 'fall', 'falls', 'fell', 'cut', 'cuts', 'reach', 'reaches', 'reached', 'kill', 'kills', 'killed', 'remain', 'remains', 'remained',
  'suggest', 'suggests', 'suggested', 'raise', 'raises', 'raised', 'pass', 'passes', 'passed', 'sell', 'sells', 'sold', 'require', 'requires', 'required', 'report', 'reports', 'reported', 'decide', 'decides', 'decided',
  'pull', 'pulls', 'pulled', 'explain', 'explains', 'explained', 'develop', 'develops', 'developed', 'carry', 'carries', 'carried', 'break', 'breaks', 'broke', 'spend', 'spends', 'lead', 'leads', 'led', 'understand', 'understands', 'understood',
  // Add adjectives, nouns for better variety
  'good', 'bad', 'big', 'small', 'new', 'old', 'first', 'last', 'long', 'short', 'high', 'low', 'right', 'wrong', 'true', 'false', 'best', 'worst', 'great', 'poor',
  'early', 'late', 'fast', 'slow', 'hard', 'easy', 'free', 'busy', 'happy', 'sad', 'beautiful', 'ugly', 'strong', 'weak', 'hot', 'cold', 'wet', 'dry', 'clean', 'dirty',
  'safe', 'dangerous', 'possible', 'impossible', 'certain', 'uncertain', 'clear', 'unclear', 'simple', 'complex', 'special', 'general', 'public', 'private', 'whole', 'half', 'thick', 'thin', 'wide', 'narrow',
  'deep', 'shallow', 'bright', 'dark', 'light', 'heavy', 'full', 'empty', 'alive', 'dead', 'sweet', 'bitter', 'loud', 'quiet', 'smooth', 'rough', 'soft', 'hard', 'warm', 'cool',
  'young', 'adult', 'child', 'man', 'woman', 'person', 'people', 'family', 'friend', 'enemy', 'teacher', 'student', 'doctor', 'patient', 'worker', 'boss', 'parent', 'brother', 'sister', 'son', 'daughter',
  'mother', 'father', 'grandfather', 'grandmother', 'husband', 'wife', 'king', 'queen', 'prince', 'princess', 'soldier', 'officer', 'president', 'government', 'country', 'city', 'town', 'village', 'street', 'road',
  'house', 'building', 'school', 'church', 'hospital', 'office', 'factory', 'shop', 'market', 'restaurant', 'hotel', 'park', 'garden', 'forest', 'mountain', 'river', 'lake', 'ocean', 'beach', 'desert',
  'animal', 'dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'sheep', 'pig', 'chicken', 'duck', 'goose', 'eagle', 'snake', 'tiger', 'lion', 'bear', 'wolf', 'fox', 'rabbit',
  'tree', 'flower', 'plant', 'grass', 'leaf', 'fruit', 'vegetable', 'apple', 'orange', 'banana', 'grape', 'lemon', 'lime', 'strawberry', 'peach', 'pear', 'plum', 'melon', 'watermelon', 'carrot',
  'potato', 'onion', 'garlic', 'tomato', 'lettuce', 'bean', 'pea', 'corn', 'wheat', 'rice', 'bread', 'milk', 'cheese', 'butter', 'egg', 'meat', 'fish', 'chicken', 'beef', 'pork',
  'sugar', 'salt', 'pepper', 'water', 'wine', 'beer', 'coffee', 'tea', 'juice', 'oil', 'honey', 'flour', 'cake', 'pie', 'cookie', 'candy', 'chocolate', 'ice', 'snow', 'rain',
  'sun', 'moon', 'star', 'cloud', 'wind', 'thunder', 'lightning', 'fire', 'smoke', 'ash', 'dust', 'sand', 'stone', 'rock', 'metal', 'gold', 'silver', 'copper', 'iron', 'steel',
  'color', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'shape', 'circle', 'square', 'triangle', 'line', 'angle', 'size', 'weight',
  'height', 'width', 'length', 'distance', 'speed', 'time', 'hour', 'minute', 'second', 'day', 'week', 'month', 'year', 'century', 'morning', 'afternoon', 'evening', 'night', 'noon', 'midnight',
  'number', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand', 'million', 'billion', 'zero', 'plus', 'minus', 'times', 'divide',
  'money', 'dollar', 'cent', 'coin', 'bill', 'bank', 'business', 'market', 'price', 'cost', 'value', 'rich', 'poor', 'buy', 'sell', 'trade', 'profit', 'loss', 'economy', 'industry', 'agriculture',
  'technology', 'computer', 'phone', 'internet', 'email', 'website', 'software', 'hardware', 'machine', 'engine', 'car', 'truck', 'bus', 'train', 'plane', 'ship', 'boat', 'bicycle', 'motorcycle', 'wheel',
  'road', 'bridge', 'tunnel', 'airport', 'station', 'port', 'path', 'trail', 'door', 'window', 'wall', 'floor', 'ceiling', 'roof', 'bed', 'chair', 'table', 'desk', 'sofa', 'lamp',
  'book', 'newspaper', 'magazine', 'letter', 'word', 'sentence', 'paragraph', 'page', 'chapter', 'story', 'poem', 'song', 'music', 'dance', 'art', 'painting', 'drawing', 'sculpture', 'photograph', 'film',
  'movie', 'game', 'sport', 'ball', 'team', 'player', 'coach', 'referee', 'victory', 'defeat', 'prize', 'medal', 'trophy', 'race', 'competition', 'match', 'battle', 'war', 'peace', 'law',
  'crime', 'punishment', 'justice', 'court', 'judge', 'lawyer', 'police', 'thief', 'criminal', 'prison', 'freedom', 'liberty', 'right', 'duty', 'responsibility', 'rule', 'law', 'religion', 'god', 'church',
  'prayer', 'spirit', 'soul', 'heaven', 'hell', 'angel', 'devil', 'miracle', 'magic', 'science', 'nature', 'physics', 'chemistry', 'biology', 'mathematics', 'history', 'geography', 'culture', 'tradition', 'custom',
  'language', 'speech', 'voice', 'sound', 'noise', 'silence', 'music', 'instrument', 'song', 'dance', 'actor', 'author', 'artist', 'scientist', 'philosopher', 'poet', 'painter', 'musician', 'dancer', 'actor',
  'health', 'medicine', 'disease', 'illness', 'pain', 'cure', 'doctor', 'nurse', 'hospital', 'pharmacy', 'poison', 'drug', 'alcohol', 'cigarette', 'exercise', 'sport', 'gym', 'diet', 'food', 'nutrition',
  'education', 'school', 'university', 'college', 'student', 'teacher', 'professor', 'lesson', 'class', 'subject', 'exam', 'test', 'grade', 'degree', 'diploma', 'knowledge', 'wisdom', 'learning', 'study', 'research',
  'adventure', 'journey', 'travel', 'expedition', 'discover', 'explore', 'mystery', 'secret', 'treasure', 'map', 'compass', 'direction', 'destination', 'route', 'path', 'trail', 'way', 'exit', 'entrance', 'passage',
  'bridge', 'gap', 'obstacle', 'challenge', 'difficulty', 'problem', 'solution', 'answer', 'question', 'idea', 'thought', 'mind', 'brain', 'heart', 'soul', 'emotion', 'feeling', 'love', 'hate', 'fear',
  'courage', 'hope', 'despair', 'joy', 'sorrow', 'anger', 'calm', 'peace', 'war', 'conflict', 'agreement', 'contract', 'promise', 'lie', 'truth', 'honesty', 'deception', 'trust', 'doubt', 'belief',
  'faith', 'hope', 'charity', 'virtue', 'vice', 'sin', 'forgiveness', 'mercy', 'judgment', 'decision', 'choice', 'option', 'alternative', 'possibility', 'probability', 'chance', 'luck', 'fortune', 'fate', 'destiny',
  'beginning', 'end', 'start', 'finish', 'birth', 'death', 'creation', 'destruction', 'growth', 'decline', 'progress', 'improvement', 'innovation', 'invention', 'discovery', 'achievement', 'success', 'failure', 'attempt', 'effort',
  'work', 'job', 'career', 'profession', 'skill', 'ability', 'talent', 'gift', 'quality', 'characteristic', 'trait', 'feature', 'aspect', 'perspective', 'point', 'view', 'opinion', 'suggestion', 'recommendation', 'advice',
  'warning', 'danger', 'caution', 'alert', 'emergency', 'accident', 'incident', 'event', 'occurrence', 'happening', 'circumstance', 'situation', 'condition', 'state', 'position', 'status', 'rank', 'level', 'grade', 'class',
  'category', 'type', 'kind', 'sort', 'variety', 'species', 'genus', 'family', 'group', 'team', 'organization', 'company', 'corporation', 'institution', 'association', 'union', 'club', 'society', 'community', 'population',
  'crowd', 'audience', 'public', 'private', 'secret', 'obvious', 'hidden', 'visible', 'invisible', 'apparent', 'actual', 'real', 'imaginary', 'virtual', 'abstract', 'concrete', 'practical', 'theoretical', 'academic', 'professional',
  'amateur', 'expert', 'novice', 'beginner', 'intermediate', 'advanced', 'master', 'apprentice', 'trainee', 'intern', 'volunteer', 'employee', 'employer', 'staff', 'crew', 'squad', 'unit', 'division', 'department', 'section',
  'branch', 'headquarters', 'subsidiary', 'affiliate', 'partner', 'competitor', 'enemy', 'ally', 'friend', 'neighbor', 'stranger', 'acquaintance', 'colleague', 'associate', 'assistant', 'aide', 'helper', 'supporter', 'fan', 'admirer',
  'critic', 'judge', 'observer', 'witness', 'victim', 'survivor', 'hero', 'villain', 'protagonist', 'antagonist', 'character', 'personality', 'identity', 'reputation', 'fame', 'celebrity', 'legend', 'myth', 'folklore', 'tale',
  'story', 'novel', 'drama', 'comedy', 'tragedy', 'romance', 'thriller', 'horror', 'fantasy', 'science', 'fiction', 'adventure', 'mystery', 'detective', 'crime', 'justice', 'revenge', 'redemption', 'salvation', 'damnation',
  'temptation', 'weakness', 'strength', 'power', 'authority', 'leadership', 'influence', 'control', 'dominance', 'submission', 'rebellion', 'revolution', 'reform', 'change', 'modification', 'alteration', 'adjustment', 'adaptation', 'evolution', 'development',
  'progress', 'regression', 'advancement', 'promotion', 'demotion', 'elevation', 'degradation', 'improvement', 'deterioration', 'expansion', 'contraction', 'growth', 'decline', 'increase', 'decrease', 'multiplication', 'division', 'addition', 'subtraction', 'calculation',
  'computation', 'measurement', 'analysis', 'synthesis', 'comparison', 'contrast', 'similarity', 'difference', 'equality', 'inequality', 'balance', 'imbalance', 'symmetry', 'asymmetry', 'harmony', 'discord', 'rhythm', 'pattern', 'sequence', 'order',
  'chaos', 'organization', 'structure', 'framework', 'foundation', 'basis', 'ground', 'root', 'source', 'origin', 'cause', 'effect', 'reason', 'explanation', 'interpretation', 'meaning', 'significance', 'importance', 'relevance', 'irrelevance',
  'connection', 'relation', 'association', 'correlation', 'causation', 'coincidence', 'synchronicity', 'parallelism', 'opposition', 'contradiction', 'conflict', 'tension', 'stress', 'pressure', 'force', 'energy', 'power', 'weakness', 'fragility', 'robustness',
  'durability', 'stability', 'instability', 'volatility', 'reliability', 'unreliability', 'consistency', 'inconsistency', 'coherence', 'incoherence', 'logic', 'illogic', 'reason', 'irrationality', 'sense', 'nonsense', 'meaning', 'meaninglessness', 'purpose', 'purposelessness',
  // More common words to reach 2000+
  'absolutely', 'absence', 'accept', 'accident', 'account', 'accuse', 'accustom', 'ache', 'achieve', 'acid', 'acquaint', 'acquire', 'acre', 'across', 'act', 'action', 'activity', 'actual', 'actually', 'acute',
  'adapt', 'addition', 'address', 'adequate', 'adjacent', 'adjective', 'administer', 'admiration', 'admire', 'admission', 'admit', 'adolescent', 'adopt', 'adore', 'adult', 'advance', 'advantage', 'adventure', 'adverb', 'adverse',
  'advertise', 'advice', 'advisable', 'advise', 'advocate', 'affair', 'affect', 'affection', 'affectionate', 'affidavit', 'affirm', 'afflict', 'afford', 'afraid', 'africa', 'after', 'afternoon', 'afterward', 'afterwards', 'again',
  'against', 'age', 'agency', 'agent', 'aggravate', 'aggregate', 'aggression', 'aggressive', 'agitate', 'ago', 'agony', 'agree', 'agreeable', 'agreement', 'agriculture', 'ahead', 'aid', 'aim', 'air', 'aisle',
  'alarm', 'alas', 'album', 'alcohol', 'alert', 'alias', 'alien', 'alike', 'alive', 'all', 'allay', 'allege', 'allegiance', 'alley', 'alliance', 'allied', 'allocate', 'allot', 'allow', 'allowance',
  'alloy', 'allude', 'allure', 'allusion', 'ally', 'almanac', 'almighty', 'almost', 'alms', 'aloe', 'aloft', 'alone', 'along', 'alongside', 'aloof', 'aloud', 'alphabet', 'already', 'also', 'altar',
  'alter', 'alteration', 'alternate', 'alternative', 'altitude', 'altogether', 'aluminium', 'always', 'amalgamate', 'amateur', 'amaze', 'amazement', 'amazon', 'ambassador', 'amber', 'ambiance', 'ambiguity', 'ambiguous', 'ambition', 'ambitious',
].slice(0, 2000); // Limit to 2000 most common words for practical seeding

interface FetchResult {
  word: string;
  success: boolean;
  cached?: boolean;
  error?: string;
}

// Exponential backoff retry logic
async function fetchWithRetry(word: string, attempt = 0): Promise<FetchResult> {
  const maxAttempts = 3;
  const baseDelay = 1000; // 1 second
  
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      next: { revalidate: 86400 },
    });

    if (res.status === 429 || res.status === 522) {
      // Rate limited or bad gateway - retry with exponential backoff
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay));
        return fetchWithRetry(word, attempt + 1);
      }
      return { word, success: false, error: `API error: ${res.status}` };
    }

    if (!res.ok) {
      return { word, success: false, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    if (!Array.isArray(data) || !data.length) {
      return { word, success: false, error: 'No data' };
    }

    return { word, success: true };
  } catch (err) {
    if (attempt < maxAttempts) {
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay));
      return fetchWithRetry(word, attempt + 1);
    }
    return { word, success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function GET(req: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return Response.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const batchSize = parseInt(searchParams.get('batch') || '50');
  const startIdx = parseInt(searchParams.get('start') || '0');
  const dryRun = searchParams.get('dry') === 'true';

  const batch = COMMON_WORDS.slice(startIdx, startIdx + batchSize);
  const results: FetchResult[] = [];
  let cached = 0;
  let fetched = 0;
  let failed = 0;

  console.log(`[Seed] Starting batch: ${startIdx}-${startIdx + batch.length} (${batchSize} words requested)`);

  for (const word of batch) {
    // Check if word already cached
    const { data: existing } = await supabase
      .from('words')
      .select('id')
      .eq('slug', word.toLowerCase())
      .single();

    if (existing) {
      results.push({ word, success: true, cached: true });
      cached++;
      continue;
    }

    // Fetch from API
    const result = await fetchWithRetry(word);
    
    if (result.success && !dryRun) {
      // Fetch full data and insert
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length) {
          const entry = data[0];
          const meanings = entry.meanings?.[0] || {};
          const defs = meanings.definitions?.[0] || {};
          
          await supabase.from('words').insert({
            slug: word.toLowerCase(),
            word: entry.word || word,
            phonetic: entry.phonetic || '',
            audio_url: entry.phonetics?.[0]?.audio || '',
            part_of_speech: meanings.partOfSpeech || 'noun',
            definition_simple: defs.definition || '',
            definition_full: defs.definition || '',
            examples: defs.example ? [defs.example] : [],
            synonyms: meanings.synonyms || [],
            antonyms: meanings.antonyms || [],
            etymology: '',
            fun_fact: '',
            difficulty: 'beginner',
            vocabulary_level: 'A1',
            category: 'Everyday',
            subcategories: [],
            frequency: 'common',
            syllables: [],
            word_forms: {},
          });
          
          fetched++;
        }
      } catch (err) {
        console.error(`[Seed] Insert failed for "${word}":`, err);
        failed++;
      }
    } else if (result.success) {
      fetched++;
    } else {
      failed++;
    }

    results.push(result);
    
    // Respect rate limiting - add delay between requests
    await new Promise(r => setTimeout(r, 100));
  }

  const nextStart = startIdx + batchSize;
  const isComplete = nextStart >= COMMON_WORDS.length;

  return Response.json({
    success: true,
    batch: { start: startIdx, size: batch.length, total: COMMON_WORDS.length },
    stats: { cached, fetched, failed, total: cached + fetched + failed },
    nextStart: isComplete ? null : nextStart,
    complete: isComplete,
    message: isComplete ? 'Seeding complete!' : `Continue with ?start=${nextStart}`,
  });
}
