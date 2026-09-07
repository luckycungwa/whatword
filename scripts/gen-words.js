const fs = require('fs');
const path = require('path');

// ===== UTILITY FUNCTIONS =====

function countSyllables(word) {
  const w = word.toLowerCase();
  if (w.length <= 3) return 1;
  let count = 0;
  const vowels = 'aeiouy';
  let prevVowel = false;
  for (const ch of w) {
    const isV = vowels.includes(ch);
    if (isV && !prevVowel) count++;
    prevVowel = isV;
  }
  if (w.endsWith('e') && count > 1) count--;
  return Math.max(1, count);
}

function makeSyllableArray(word) {
  const w = word.toLowerCase();
  const n = countSyllables(w);
  if (n === 1) return [w];
  const vowels = 'aeiouy';
  const sylls = [];
  let current = '';
  let syllCount = 0;
  const target = Math.ceil(w.length / n);
  for (let i = 0; i < w.length; i++) {
    current += w[i];
    const isV = vowels.includes(w[i]);
    if (isV && current.length >= 2 && syllCount < n - 1) {
      sylls.push(current);
      current = '';
      syllCount++;
    }
  }
  if (current) sylls.push(current);
  return sylls.length > 0 ? sylls : [w];
}

function makeSlug(word) {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function makeWordForms(word, pos) {
  const forms = {};
  const w = word.toLowerCase();
  if (pos === 'verb') {
    if (w.endsWith('e')) {
      forms.pastTense = w + 'd';
      forms.pastParticiple = w + 'd';
    } else if (w.endsWith('y') && w.length > 2 && !'aeiou'.includes(w[w.length - 2])) {
      forms.pastTense = w.slice(0, -1) + 'ied';
      forms.pastParticiple = w.slice(0, -1) + 'ied';
    } else {
      forms.pastTense = w + 'ed';
      forms.pastParticiple = w + 'ed';
    }
    forms.noun = w + 'er';
  }
  if (pos === 'noun') {
    if (w.endsWith('s') || w.endsWith('x') || w.endsWith('z') || w.endsWith('ch') || w.endsWith('sh')) {
      forms.plural = w + 'es';
    } else if (w.endsWith('y') && w.length > 2 && !'aeiou'.includes(w[w.length - 2])) {
      forms.plural = w.slice(0, -1) + 'ies';
    } else {
      forms.plural = w + 's';
    }
  }
  if (pos === 'adjective') {
    forms.adverb = w.endsWith('e') ? w + 'ly' : w + 'ly';
    if (w.endsWith('y') && w.length > 2 && !'aeiou'.includes(w[w.length - 2])) {
      forms.comparative = w.slice(0, -1) + 'ier';
      forms.superlative = w.slice(0, -1) + 'iest';
    } else if (w.length <= 6) {
      forms.comparative = w + 'er';
      forms.superlative = w + 'est';
    } else {
      forms.comparative = 'more ' + w;
      forms.superlative = 'most ' + w;
    }
  }
  return forms;
}

function getDifficulty(level) {
  if (level === 'A1' || level === 'A2') return 'beginner';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

function getLevel(tier, indexInTier, tierSize) {
  if (tier === 1) return 'A1';
  if (tier === 2) {
    const pct = indexInTier / tierSize;
    if (pct < 0.3) return 'A2';
    if (pct < 0.5) return 'B1';
    if (pct < 0.65) return 'B2';
    if (pct < 0.82) return 'C1';
    return 'C2';
  }
  if (tier === 3) return 'B1';
  if (tier === 4) {
    const pct = indexInTier / tierSize;
    if (pct < 0.5) return 'B2';
    if (pct < 0.75) return 'C1';
    return 'C2';
  }
  return 'C1';
}

function getFrequency(index, total) {
  const pct = index / total;
  if (pct < 0.15) return 'very-common';
  if (pct < 0.4) return 'very-common';
  if (pct < 0.65) return 'common';
  if (pct < 0.85) return 'uncommon';
  return 'rare';
}

function escapeTS(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ===== WORD LISTS BY TIER =====

// Each entry: [word, pos(n/v/j/b/p/c/o), synonyms, antonyms, definition, example]
const tier1 = [
  ["the","n","","","Definite article",""],
  ["be","v","","","To exist",""],
  ["to","p","","","Towards",""],
  ["of","p","","","Belonging to",""],
  ["and","c","","","Also",""],
  ["a","n","","","Indefinite article",""],
  ["in","p","","","Inside",""],
  ["that","c","","","Used to introduce a clause",""],
  ["have","v","own,possess","","To possess",""],
  ["it","o","","","Third person pronoun",""],
  ["for","p","","","Intended to be given to",""],
  ["not","b","","","Negation",""],
  ["on","p","","","Supported by",""],
  ["with","p","","","Accompanied by",""],
  ["he","o","","","Male pronoun",""],
  ["as","c","","","In the same way",""],
  ["you","o","","","Second person pronoun",""],
  ["do","v","perform","","To carry out",""],
  ["at","p","","","Expressing location",""],
  ["this","o","","","Demonstrative pronoun",""],
  ["but","c","","","However",""],
  ["his","o","","","Belonging to him",""],
  ["by","p","","","Near or through",""],
  ["from","p","","","Origin",""],
  ["they","o","","","Third person plural",""],
  ["we","o","","","First person plural",""],
  ["her","o","","","Belonging to her",""],
  ["she","o","","","Female pronoun",""],
  ["or","c","","","Otherwise",""],
  ["an","n","","","Indefinite article",""],
  ["will","v","","","Future tense marker",""],
  ["my","o","","","Belonging to me",""],
  ["one","n","","","The number one",""],
  ["all","b","","","The whole quantity",""],
  ["would","v","","","Past tense of will",""],
  ["there","b","","","In that place",""],
  ["their","o","","","Belonging to them",""],
  ["what","o","","","Interrogative pronoun",""],
  ["so","c","","","To that extent",""],
  ["up","b","","","Toward higher position",""],
  ["out","b","","","Away from inside",""],
  ["if","c","","","On condition that",""],
  ["about","p","","","On the subject of",""],
  ["who","o","","","Interrogative pronoun",""],
  ["get","v","obtain","","To receive",""],
  ["which","o","","","Used to specify",""],
  ["go","v","move","","To travel",""],
  ["me","o","","","Object form of I",""],
  ["when","c","","","At what time",""],
  ["make","v","create","","To produce",""],
  ["can","v","able","","Expressing ability",""],
  ["like","v","enjoy","","To find agreeable",""],
  ["time","n","","","The progress of events",""],
  ["no","b","","","Not any",""],
  ["just","b","","","Exactly",""],
  ["him","o","","","Object form of he",""],
  ["know","v","understand","","To be aware of",""],
  ["take","v","grab","","To reach for",""],
  ["people","n","persons","","Human beings",""],
  ["come","v","arrive","","To move toward",""],
  ["could","v","might","","Past tense of can",""],
  ["than","c","","","In comparison to",""],
  ["look","v","see","","To direct eyes",""],
  ["only","b","merely","","Nothing more than",""],
  ["new","j","fresh","","Not existing before",""],
  ["some","o","","","An unspecified amount",""],
  ["very","b","extremely","","To a high degree",""],
  ["way","n","method","","A manner",""],
  ["how","o","","","In what way",""],
  ["find","v","discover","","To locate",""],
  ["here","b","","","In this place",""],
  ["day","n","","","A 24-hour period",""],
  ["work","n","","","Activity involving effort",""],
  ["may","v","might","","Expressing possibility",""],
  ["year","n","","","365 days",""],
  ["back","b","","","Toward the rear",""],
  ["its","o","","","Belonging to it",""],
  ["let","v","allow","","To permit",""],
  ["put","v","place","","To move to place",""],
  ["different","j","distinct","","Not the same",""],
  ["old","j","ancient","","Having lived long",""],
  ["great","j","excellent","","Very good",""],
  ["big","j","large","","Of considerable size",""],
  ["high","j","tall","","Extending upward",""],
  ["long","j","extended","","Great distance end to end",""],
  ["small","j","little","","Of limited size",""],
  ["need","v","require","","To want greatly",""],
  ["tell","v","inform","","To communicate",""],
  ["hand","n","","","Body part at arm end",""],
  ["play","v","engage","","To engage in activity",""],
  ["run","v","jog","","To move faster than walking",""],
  ["move","v","relocate","","To change position",""],
  ["live","v","reside","","To have ones home",""],
  ["believe","v","trust","","To accept as true",""],
  ["bring","v","carry","","To take to a place",""],
  ["happen","v","occur","","To take place",""],
  ["next","j","following","","Coming after",""],
  ["much","b","","","A large amount",""],
  ["home","n","house","","Where one lives",""],
  ["must","v","have to","","Expressing obligation",""],
  ["school","n","academy","","Place of learning",""],
  ["start","v","begin","","To commence",""],
  ["country","n","nation","","A land with government",""],
  ["change","v","alter","","To make different",""],
  ["keep","v","retain","","To continue to have",""],
  ["help","v","assist","","To make easier",""],
  ["turn","v","rotate","","To change direction",""],
  ["every","j","each","","Each one",""],
  ["begin","v","start","","To start",""],
  ["show","v","display","","To cause to be seen",""],
  ["still","b","yet","","Up to now",""],
  ["try","v","attempt","","To make effort",""],
  ["point","n","tip","","A position",""],
  ["hear","v","listen","","To perceive sound",""],
  ["door","n","gate","","An entrance barrier",""],
  ["sure","j","certain","","Confident",""],
  ["walk","v","stroll","","To move on foot",""],
  ["far","b","distant","","At great distance",""],
  ["eye","n","","","Organ of sight",""],
  ["own","j","personal","","Belonging to self",""],
  ["draw","v","sketch","","To make a picture",""],
  ["answer","n","reply","","A response",""],
  ["soon","b","","","In a short time",""],
  ["room","n","chamber","","An enclosed area",""],
  ["leave","v","depart","","To go away",""],
  ["head","n","","","Top of body",""],
  ["stand","v","be upright","","To be on feet",""],
  ["call","v","phone","","To contact by phone",""],
  ["order","n","sequence","","An arrangement",""],
  ["close","v","shut","","To cover opening",""],
  ["seem","v","appear","","To give impression",""],
  ["late","j","tardy","","After expected time",""],
  ["stop","v","halt","","To cease moving",""],
  ["read","v","peruse","","To understand words",""],
  ["never","b","","","At no time",""],
  ["second","n","","","Ordinal number",""],
  ["enough","b","","","As much as needed",""],
  ["city","n","town","","A large town",""],
  ["tree","n","","","A woody plant",""],
  ["cross","v","traverse","","To go across",""],
  ["hard","j","difficult","","Requiring effort",""],
  ["farm","n","","","Land for crops",""],
  ["cut","v","slice","","To divide with blade",""],
  ["light","n","brightness","","Natural agent for vision",""],
  ["sit","v","be seated","","To be supported on bottom",""],
  ["think","v","consider","","To use the mind",""],
  ["story","n","tale","","A narrative",""],
  ["place","n","location","","A particular area",""],
  ["why","o","","","For what reason",""],
  ["ask","v","inquire","","To request info",""],
  ["men","n","males","","Plural of man",""],
  ["group","n","team","","A number together",""],
  ["often","b","frequently","","Many times",""],
  ["thought","n","idea","","An idea from thinking",""],
  ["want","v","desire","","To wish for",""],
  ["grow","v","increase","","To increase in size",""],
  ["white","j","pale","","Color of snow",""],
  ["example","n","instance","","A representative case",""],
  ["learn","v","study","","To gain knowledge",""],
  ["name","n","","","What something is called",""],
  ["word","n","","","Unit of language",""],
  ["food","n","","","Substance for eating",""],
  ["real","j","genuine","","Actually existing",""],
  ["best","j","finest","","Highest quality",""],
  ["body","n","","","Physical structure",""],
  ["girl","n","young woman","","Female child",""],
  ["world","n","earth","","The planet we live on",""],
  ["ready","j","prepared","","In suitable state",""],
  ["simple","j","easy","","Not complex",""],
  ["feel","v","sense","","To experience sensation",""],
  ["also","b","too","","In addition",""],
  ["sky","n","","","Atmosphere above",""],
  ["son","n","boy","","Male child of parents",""],
  ["six","n","","","The number six",""],
  ["while","c","","","During the time that",""],
  ["press","v","push","","To exert force",""],
  ["cover","v","conceal","","To place over",""],
  ["seven","n","","","The number seven",""],
  ["strong","j","powerful","","Having great power",""],
  ["eight","n","","","The number eight",""],
  ["nothing","o","","","Not anything",""],
  ["nine","n","","","The number nine",""],
  ["true","j","correct","","In accordance with fact",""],
  ["rock","n","stone","","A large stone",""],
  ["ten","n","","","The number ten",""],
  ["hurry","v","rush","","To move quickly",""],
  ["dream","n","vision","","Images during sleep",""],
  ["laugh","v","giggle","","To express amusement",""],
  ["sing","v","chant","","To make music with voice",""],
  ["cry","v","weep","","To shed tears",""],
  ["dance","v","move rhythmically","","To move to music",""],
  ["eat","v","consume","","To take food into mouth",""],
  ["swim","v","float","","To move through water",""],
  ["fly","v","soar","","To move through air",""],
  ["jump","v","leap","","To push off ground",""],
  ["drink","v","sip","","To take liquid into mouth",""],
  ["fight","v","battle","","To engage in combat",""],
  ["pay","v","compensate","","To give money for",""],
  ["sleep","v","rest","","To be at rest with eyes closed",""],
  ["wake","v","awaken","","To stop sleeping",""],
  ["drive","v","steer","","To operate a vehicle",""],
  ["ride","v","sit on","","To sit on and control",""],
  ["teach","v","instruct","","To give lessons to",""],
  ["study","v","learn","","To devote time to learning",""],
  ["write","v","compose","","To form letters on surface",""],
  ["build","v","construct","","To make from parts",""],
  ["buy","v","purchase","","To obtain for money",""],
  ["sell","v","trade","","To exchange for money",""],
  ["hold","v","grip","","To grasp in hands",""],
  ["throw","v","toss","","To propel through air",""],
  ["carry","v","transport","","To support and move",""],
  ["spend","v","expend","","To pay out money",""],
  ["wear","v","have on","","To have on body",""],
  ["break","v","shatter","","To separate into pieces",""],
  ["fix","v","repair","","To mend what is broken",""],
  ["send","v","dispatch","","To cause to go to a place",""],
  ["meet","v","encounter","","To come into presence of",""],
  ["love","v","adore","","To have deep affection for",""],
  ["hate","v","detest","","To intensely dislike",""],
  ["hope","v","wish","","To want to happen",""],
  ["wish","v","desire","","To long for",""],
  ["guess","v","estimate","","To suppose without proof",""],
  ["agree","v","concur","","To share same opinion",""],
  ["choose","v","select","","To pick from alternatives",""],
  ["decide","v","determine","","To reach a conclusion",""],
  ["forget","v","disregard","","To fail to remember",""],
  ["remember","v","recollect","","To recall to mind",""],
  ["surprise","v","astonish","","To cause astonishment",""],
  ["join","v","connect","","To become part of",""],
  ["follow","v","pursue","","To come after",""],
  ["lead","v","guide","","To show the way",""],
  ["push","v","shove","","To exert force away",""],
  ["pull","v","tug","","To exert force toward",""],
  ["open","v","unclose","","To move to allow access",""],
  ["shut","v","close","","To move to closed position",""],
  ["rise","v","ascend","","To move upward",""],
  ["fall","v","drop","","To move downward",""],
  ["catch","v","capture","","To intercept something",""],
  ["reach","v","arrive at","","To get to a place",""],
  ["wait","v","stay","","To remain in place",""],
  ["understand","v","comprehend","","To perceive meaning",""],
  ["trust","v","believe in","","To have confidence in",""],
  ["doub","v","question","","To feel uncertain",""],
  ["imagine","v","envision","","To form mental image",""],
  ["plan","v","scheme","","To decide course of action",""],
  ["expect","v","anticipate","","To regard as likely",""],
  ["care","v","mind","","To feel concern",""],
  ["talk","v","speak","","To exchange words",""],
  ["speak","v","talk","","To say words aloud",""],
  ["say","v","state","","To utter words",""],
  ["listen","v","attend","","To pay attention to sound",""],
  ["sound","n","noise","","Vibrations heard as audio",""],
  ["see","v","observe","","To perceive with eyes",""],
  ["watch","v","observe","","To look at attentively",""],
  ["notice","v","observe","","To become aware of",""],
  ["observe","v","watch","","To watch carefully",""],
  ["examine","v","inspect","","To look at closely",""],
  ["inspect","v","examine","","To assess condition",""],
  ["comprehend","v","understand","","To grasp mentally",""],
  ["perceive","v","notice","","To become aware through senses",""],
  ["detect","v","discover","","To identify presence of",""],
  ["recognize","v","identify","","To know from experience",""],
  ["identify","v","recognize","","To establish identity of",""],
  ["recall","v","remember","","To bring to mind",""],
  ["remind","v","prompt","","To cause to remember",""],
  ["predict","v","forecast","","To say what will happen",""],
  ["prepare","v","get ready","","To make ready",""],
  ["organize","v","arrange","","To arrange in order",""],
  ["arrange","v","organize","","To put in neat order",""],
  ["sort","v","classify","","To arrange by category",""],
  ["wash","v","clean","","To clean with water",""],
  ["cook","v","prepare food","","To prepare food by heating",""],
  ["mix","v","blend","","To combine together",""],
  ["stir","v","agitate","","To move circularly",""],
  ["serve","v","provide","","To present food for consumption",""],
  ["taste","v","sample","","To perceive flavor of",""],
  ["chew","v","masticate","","To work food in mouth",""],
  ["swallow","v","gulp down","","To cause food to pass down throat",""],
  ["digest","v","process","","To break down food in body",""],
  ["feed","v","give food","","To give food to",""],
  ["starve","v","famish","","To suffer from hunger",""],
  ["rest","v","relax","","To cease work to relax",""],
  ["relax","v","unwind","","To become less tense",""],
  ["exercise","n","workout","","Physical activity for health",""],
  ["journey","n","trip","","Travel from one place to another",""],
  ["trip","n","journey","","A short journey",""],
  ["tour","n","visit","","A journey for pleasure",""],
  ["visit","v","call on","","To go to see someone",""],
  ["arrive","v","reach","","To reach a destination",""],
  ["depart","v","leave","","To leave a place",""],
  ["return","v","go back","","To come back",""],
  ["stay","v","remain","","To remain in place",""],
  ["rush","v","hurry","","To move with haste",""],
  ["speed","n","pace","","Rate of movement",""],
  ["slow","j","not fast","","Moving at low speed",""],
  ["fast","j","quick","","Moving at high speed",""],
  ["quick","j","fast","","Done in short time",""],
  ["rapid","j","swift","","Happening quickly",""],
  ["sudden","j","abrupt","","Happening unexpectedly",""],
  ["gradual","j","slow","","Happening slowly over time",""],
  ["steady","j","stable","","Firmly placed",""],
  ["constant","j","continuous","","Occurring continuously",""],
  ["frequent","j","common","","Occurring often",""],
  ["rare","j","uncommon","","Not occurring often",""],
  ["regular","j","normal","","Following a pattern",""],
  ["normal","j","usual","","Conforming to standard",""],
  ["usual","j","customary","","Happening most of the time",""],
  ["common","j","frequent","","Found often",""],
  ["special","j","particular","","Different from ordinary",""],
  ["specific","j","particular","","Clearly defined",""],
  ["general","j","broad","","Affecting all or most",""],
  ["ordinary","j","normal","","With no special features",""],
  ["extraordinary","j","remarkable","","Very unusual",""],
  ["complex","j","complicated","","Having many connected parts",""],
  ["easy","j","simple","","Requiring no great effort",""],
  ["difficult","j","hard","","Needing much effort",""],
  ["soft","j","smooth","","Easy to press or bend",""],
  ["rough","j","coarse","","Having uneven surface",""],
  ["smooth","j","even","","Having regular surface",""],
  ["sharp","j","pointed","","Having an edge that can cut",""],
  ["dull","j","blunt","","Lacking interest or sharpness",""],
  ["thick","j","wide","","Having great distance between sides",""],
  ["thin","j","slim","","Having small distance between sides",""],
  ["wide","j","broad","","Extending far side to side",""],
  ["narrow","j","thin","","Of small width",""],
  ["deep","j","profound","","Extending far down",""],
  ["shallow","j","superficial","","Of little depth",""],
  ["tall","j","high","","Of great height",""],
  ["short","j","brief","","Of small distance end to end",""],
  ["whole","j","entire","","All of",""],
  ["complete","j","full","","Having all necessary parts",""],
  ["total","j","whole","","The whole amount",""],
  ["partial","j","incomplete","","Of or affecting only a part",""],
  ["give","v","provide","","To freely transfer",""],
  ["take","v","receive","","To come into possession",""],
  ["make","v","create","","To cause to exist",""],
  ["go","v","move","","To travel or move",""],
  ["come","v","arrive","","To move toward speaker",""],
  ["know","v","understand","","To be aware of",""],
  ["think","v","consider","","To use the mind",""],
  ["see","v","observe","","To perceive with eyes",""],
  ["want","v","desire","","To wish for",""],
  ["use","v","utilize","","To employ for a purpose",""],
  ["find","v","discover","","To locate or detect",""],
  ["tell","v","inform","","To communicate information",""],
  ["ask","v","inquire","","To request information",""],
  ["seem","v","appear","","To give the impression of",""],
  ["feel","v","sense","","To experience sensation",""],
  ["try","v","attempt","","To make an effort",""],
  ["leave","v","depart","","To go away from",""],
  ["call","v","phone","","To contact someone",""],
  ["keep","v","retain","","To continue to have",""],
  ["let","v","permit","","To allow or give permission",""],
  ["begin","v","start","","To commence or initiate",""],
  ["show","v","display","","To cause to be seen",""],
  ["hear","v","listen","","To perceive with ears",""],
  ["play","v","engage","","To engage in activity",""],
  ["run","v","jog","","To move at speed on foot",""],
  ["move","v","relocate","","To change position",""],
  ["live","v","reside","","To have permanent residence",""],
  ["believe","v","trust","","To accept as true",""],
  ["bring","v","carry","","To take to a place",""],
  ["happen","v","occur","","To take place",""],
  ["provide","v","supply","","To make available",""],
  ["sit","v","be seated","","To be in seated position",""],
  ["stand","v","be upright","","To be on feet upright",""],
  ["lose","v","misplace","","To be unable to find",""],
  ["pay","v","compensate","","To give money for something",""],
  ["meet","v","encounter","","To come together with",""],
  ["include","v","contain","","To have as part of",""],
  ["continue","v","persist","","To keep doing something",""],
  ["set","v","place","","To put in position",""],
  ["learn","v","study","","To gain knowledge or skill",""],
  ["change","v","alter","","To make or become different",""],
  ["lead","v","guide","","To be in charge of",""],
  ["understand","v","comprehend","","To grasp the meaning of",""],
  ["watch","v","observe","","To look at carefully",""],
  ["follow","v","pursue","","To come after someone",""],
  ["stop","v","halt","","To cease moving or doing",""],
  ["create","v","produce","","To bring into being",""],
  ["speak","v","talk","","To say words aloud",""],
  ["read","v","peruse","","To look at and understand text",""],
  ["allow","v","permit","","To give permission",""],
  ["add","v","include","","To join something to another",""],
  ["spend","v","expend","","To use money for payment",""],
  ["grow","v","increase","","To increase in size",""],
  ["open","v","unlock","","To move to allow access",""],
  ["win","v","triumph","","To be victorious in",""],
  ["offer","v","provide","","To present for acceptance",""],
  ["consider","v","ponder","","To think carefully about",""],
  ["appear","v","seem","","To come into sight",""],
  ["buy","v","purchase","","To obtain by paying money",""],
  ["serve","v","assist","","To help or provide for",""],
  ["die","v","perish","","To cease living",""],
  ["expect","v","anticipate","","To look forward to something",""],
  ["build","v","construct","","To make by putting parts together",""],
  ["fall","v","drop","","To move downward quickly",""],
  ["cut","v","slice","","To divide with a sharp instrument",""],
  ["reach","v","arrive","","To get to a point or place",""],
  ["raise","v","lift","","To move to higher position",""],
  ["pass","v","go by","","To move past something",""],
  ["sell","v","trade","","To exchange for money",""],
  ["decide","v","determine","","To make a choice",""],
  ["return","v","go back","","To come or go back",""],
  ["explain","v","clarify","","To make something clear",""],
  ["develop","v","grow","","To grow or cause to grow",""],
  ["carry","v","transport","","To support and move along",""],
  ["break","v","shatter","","To separate into pieces",""],
  ["receive","v","get","","To come into possession of",""],
  ["agree","v","concur","","To be of the same mind",""],
  ["support","v","help","","To bear the weight of",""],
  ["hit","v","strike","","To bring hand into contact with",""],
  ["produce","v","create","","To make or manufacture",""],
  ["cause","v","create","","To make something happen",""],
  ["pull","v","drag","","To exert force toward self",""],
  ["turn","v","rotate","","To change direction",""],
  ["face","v","confront","","To deal with directly",""],
  ["answer","v","reply","","To respond to a question",""],
];

// TIER 2-5 WORDS: just word strings (auto-POS-detected)
const tier2Words = ["accomplish","acknowledge","adapt","adequate","admire","admit","adopt","advance","advantage","adventure","advertise","advice","afford","aggressive","aim","alarm","alert","allocate","alter","alternative","amaze","ambitious","analyse","announce","annual","apparent","appetite","apply","appreciate","approach","appropriate","approve","arrange","article","assess","assign","assist","assume","attach","attempt","attend","attitude","attract","authority","automatic","available","average","avoid","award","aware","awkward","background","balance","ban","base","basic","behave","behavior","beneath","benefit","blame","blend","bold","border","bore","bottom","bother","brand","brave","brief","broadcast","budget","burden","calculate","capable","capacity","career","casual","category","celebrate","challenge","channel","chapter","character","charity","circumstance","civil","claim","clarify","classic","climate","colleague","colony","column","combat","comment","commission","commit","commitment","communicate","companion","compare","compete","component","concentrate","concept","conclude","concrete","confident","confirm","conflict","confront","confuse","connect","conscious","consequence","considerable","consistent","construct","consult","consume","contact","contain","contemporary","content","context","contract","contrast","contribute","control","convince","cooperate","cope","core","corporate","correct","council","courage","crisis","critical","crowd","crucial","curious","current","curriculum","custom","cycle","debate","decade","decline","dedicate","defeat","defend","define","deliberate","delicate","deliver","demand","democracy","deny","depend","deposit","depression","derive","describe","desire","despite","destination","destroy","detect","determine","devote","dimension","diminish","discipline","distinct","distribute","disturb","diverse","document","domestic","dominant","donate","donation","dramatic","duration","dynamic","eager","economic","efficient","elaborate","element","eliminate","emerge","emission","emphasis","emphasize","encounter","encourage","endeavor","endorse","enhance","enormous","ensure","enterprise","enthusiasm","entire","entitle","episode","equivalent","error","escape","essential","establish","estimate","ethical","evaluate","eventually","evidence","evolution","exaggerate","exceed","excellent","exchange","exclusive","execute","exercise","exhibit","expand","expense","experiment","expert","explicit","exploit","exploration","expose","extension","extent","external","extra","extract","extreme","fabricate","facilitate","factor","faith","fashion","feature","flexible","flourish","focus","forbid","forecast","former","foundation","fraction","fragment","framework","frequent","frustrate","fulfill","function","fundamental","generate","genuine","global","grant","guarantee","guideline","halt","harsh","hazard","highlight","horizon","hostile","identify","ignore","illustrate","image","impact","implement","imply","impose","impression","incredible","independent","indicate","individual","induce","inevitable","influence","initial","initiative","innovation","insight","inspect","instance","integrate","intellectual","intense","interact","interpret","intervene","investigate","involve","isolate","issue","justify","keen","label","landscape","launch","layer","lean","legislation","legitimate","leisure","lend","liable","liberal","limit","link","locate","logic","luxury","maintain","major","manifest","manipulate","mature","maximum","mechanism","mental","merely","method","mild","minimum","minor","mission","moderate","modify","monitor","moral","motivate","mutual","negotiate","nevertheless","notable","notion","objective","obligation","occasion","occupy","occurrence","offend","ongoing","option","orient","outcome","output","overall","overcome","oversight","participate","passion","passive","percentage","perception","persist","perspective","phenomenon","pioneer","policy","portion","possess","potential","poverty","practical","precede","precise","predict","presume","previous","primary","prime","principal","proceed","process","produce","profession","prohibit","promote","proportion","propose","prospect","prosperity","protect","protest","prove","provision","pursue","qualify","quantity","quote","radical","rapid","rational","reaction","reasonable","recovery","reform","refuse","regime","region","register","regulate","reinforce","reject","relevant","reliable","reluctant","rely","remedy","remote","remove","replace","represent","reproduce","reputation","require","research","reserve","resolve","respective","respond","restore","restrict","retain","reveal","revenue","reverse","revolution","rigid","role","rough","routine","sacrifice","sample","satellite","scan","scatter","scenario","scheme","scope","sector","secure","seek","select","sequence","shift","significant","similar","simplify","somewhat","source","specific","speculate","stable","statistic","status","stimulus","strategy","strengthen","strive","subsequent","substantial","substitute","successive","sufficient","summarize","supplement","survey","survive","suspect","suspend","sustain","symbol","target","temporary","tendency","terminate","territory","theme","theory","thereby","thorough","tradition","transfer","transform","transmit","trend","trigger","ultimate","undergo","underlie","undertake","uniform","unique","universal","update","upgrade","uphold","valid","variable","vast","vehicle","version","violate","virtual","visible","volume","voluntary","vulnerable","wage","welfare","whereby","widespread","witness","abandon","absorb","abstract","accelerate","accommodate","accomplish","acquire","adapt","address","adjust","admire","adopt","advance","advocate","affect","afford","agency","agreement","agriculture","aim","announce","annoy","anxiety","anyway","apologize","appreciation","approval","architect","argument","army","arrangement","article","aspect","assembly","assessment","assumption","asset","associate","assume","assure","atmosphere","attach","attempt","attitude","audience","authority","automatic","availability","awareness","awkward","balance","barrier","battery","behalf","behaviour","beneficial","besides","binding","biography","blank","bleed","bless","blind","blood","bold","bomb","boost","bound","breed","brick","broadcast","brush","budget","bullet","burn","cabin","cable","calendar","campaign","capable","capacity","capital","capture","careful","cargo","carpet","carve","catalog","ceiling","cement","census","ceremony","certificate","chamber","channel","chapter","chart","charter","cheek","cheese","chemical","chest","childhood","chip","chorus","cinema","circuit","circulate","citizen","civilian","clay","clever","cliff","clone","cloth","clue","coach","coal","coast","coin","collapse","colonial","colony","combat","comedy","commander","commentary","commercial","commissioner","community","companion","comparison","compassion","compatible","compensate","competence","complaint","complexity","comply","component","comprise","compute","conceal","concentrate","conceptual","conclude","concrete","condemn","confess","confidence","configuration","confine","confirm","confuse","congress","conscience","consent","consequence","conservation","conserve","consolidate","constant","constitute","construct","consultant","consumer","consumption","contemplate","contemporary","contempt","contest","context","controversy","convention","conversion","convert","convict","convince","cooperate","coordinate","cope","copyright","corporate","corporation","correspond","corridor","counsel","count","countless","courage","course","coverage","crack","craft","crash","creature","credit","crew","crime","criminal","crisis","crop","crowd","crucial","cruel","crush","curve","cycle","database","daughter","deadline","deal","debate","debt","debut","decay","decent","declare","decline","dedicate","deed","deem","default","defence","deficit","definite","delegate","delight","delivery","democrat","dense","departure","dependence","deposit","deprive","deputy","derive","desert","designer","despair","destination","destiny","detective","determination","devote","diagram","dialogue","diamond","diary","dictate","dinosaur","diplomacy","disability","disappoint","disaster","discipline","disclosure","discount","discover","discrete","disorder","dispatch","dispense","displace","display","disposal","dispose","dispute","dissolve","distinction","distinguish","distribute","disturb","diverse","dividend","doctrine","document","domestic","dominant","donate","donor","dose","draft","dramatic","drift","drive","drown","duration","dynamic","earn","ease","edition","editorial","effect","efficiency","efficient","elaborate","elderly","elect","election","electric","element","eliminate","elite","embrace","emerge","emergency","emission","emotion","emphasis","employ","empower","encounter","encourage","engage","engine","enormous","enterprise","enthusiasm","entrance","entrepreneur","envelope","equality","equation","equip","equivalent","era","error","escape","escort","essay","essential","establish","estate","ethical","evolution","exceed","exception","excess","exchange","excite","exclude","exclusive","execute","executive","exempt","exercise","exhibit","expand","expedition","expense","expertise","explicit","exploit","explosion","export","expose","express","extend","extensive","extent","external","extreme","fabric","facility","factor","faculty","fame","fantasy","fascinate","fate","favour","federal","feedback","fellow","fence","fierce","figure","filter","finance","firm","fix","flag","flame","flash","flesh","float","flood","flourish","fluid","flush","fold","forbid","forecast","foreign","forever","formula","forth","fortune","fossil","foundation","fraction","fragment","framework","frequent","friction","frontier","frustrate","fuel","function","fund","funeral","furthermore","gallery","gang","gap","gather","gender","gene","generous","genocide","gesture","global","glory","goddess","govern","grab","grace","grade","graduate","grain","grand","grant","graphic","gravity","great","greet","grief","grill","gross","guarantee","guardian","guess","guest","guideline","guilt","habitat","halt","handle","handsome","harbour","harmony","harsh","harvest","hatred","heal","heap","heritage","heroic","hesitate","highlight","hint","historian","holiday","holy","homeless","honesty","horror","hostage","household","humble","humour","hunger","hunt","hurdle","hypothesis","icon","identity","ideology","ignorant","illusion","illustration","imagery","immigrant","immigration","implement","implication","imply","import","impose","imprison","impulse","inadequate","incident","incline","incorporate","incredible","independent","index","indicate","individual","inevitable","infant","inflation","influence","inform","infrastructure","inherent","inherit","initial","initiate","inject","injury","innocent","innovation","input","insert","insight","inspect","inspiration","install","instance","instant","instinct","institution","instrument","insult","insurance","intellectual","intelligence","intense","interact","interest","interior","intermediate","interpret","interval","intimate","invest","investigate","investor","invisible","involve","iron","irony","isolated","journal","journalist","journey","judgment","junction","junior","jury","justice","justify","keen","label","labour","landscape","language","launch","lawsuit","lay","layer","leadership","league","legacy","lend","length","lens","lesson","liberal","liberty","license","lift","limitation","link","liquid","literacy","literature","loan","lobby","location","logic","loose","loss","loyalty","lung","luxury","machine","magazine","magic","magnet","maintain","major","makeup","manage","manipulate","mansion","manufacturer","margin","marine","marker","market","marry","mask","massive","master","mate","mature","mayor","mechanism","media","medieval","medium","memorial","merchant","mercy","mere","merger","merit","mess","method","middle","mighty","militia","militia","mind","mineral","minimum","minister","minor","miracle","mirror","misery","missile","mission","mob","mode","moderate","modify","molecule","momentum","monarchy","monitor","monthly","monument","moral","moreover","mortgage","motion","motivate","mount","mourn","multiple","murder","muscle","mutual","mystery","myth","naked","narrative","nasty","native","neat","needle","neglect","negotiate","nerve","network","neutral","noble","nod","nominate","norm","notable","novel","nucleus","nurse","nutrition","obey","object","objection","objective","obligation","observe","obsession","obstacle","obtain","occasion","occupation","offence","offensive","officer","online","operate","operator","opponent","oppose","opposite","option","orange","orbit","organ","organize","orient","origin","outcome","outdoor","output","outrage","outsider","overcome","overlook","overseas","overtime","overview","owe","ownership","oxygen","pace","pack","package","pad","palace","palm","panel","panic","paragraph","parallel","parliament","partial","participant","participate","particular","patent","patience","patient","patrol","patron","pause","peak","penalty","pension","percent","perform","period","permanent","permission","permit","persist","personality","perspective","petrol","phase","phenomenon","philosophy","phrase","pilot","pit","pitch","plain","planet","planner","plastic","plate","platform","pleasant","pleasure","pledge","plenty","plot","plug","plunge","poem","poet","poetry","poison","policy","political","poll","pollution","pond","pop","popular","population","portion","portrait","pose","position","positive","possess","post","pot","potato","potential","potion","poverty","powder","praise","prayer","predict","prefer","pregnant","prejudice","premiere","premium","prepare","present","presidency","president","press","pressure","pretend","previous","priest","prince","princess","principle","print","priority","prison","prisoner","privacy","private","privilege","prize","probe","procedure","proceed","produce","product","profile","program","progress","prohibit","project","promise","promote","prompt","proof","proper","property","proposal","propose","prosecute","prospect","prosperity","protect","protest","proud","prove","provide","province","provision","psychology","publicity","publish","punishment","purchase","pure","purple","pursuit","qualify","quality","quarter","queen","query","quest","queue","quiet","quite","quote","race","racial","racism","radar","radiation","rage","raid","rail","rainbow","raise","rally","random","range","rank","ratio","raw","react","reality","realm","rear","rebel","receipt","receive","recover","recruit","reform","refugee","regime","region","register","regulate","reinforce","reject","relate","relation","relative","relax","relay","relief","rely","remain","remedy","remote","remove","rent","repair","repeat","replace","replicate","report","represent","republic","reputation","request","require","resemble","reserve","resident","resign","resist","resolution","resolve","resource","respond","restore","restrict","retain","retire","retrieve","reveal","revenue","reverse","review","revolution","reward","rhythm","ride","rifle","rigid","riot","risk","rival","river","robot","rocket","romance","root","rope","rose","rough","routine","royal","rub","ruin","rural","sacrifice","sail","sake","satellite","satisfaction","satisfy","sauce","scale","scandal","scare","scatter","scenario","scene","schedule","scheme","scholar","scope","score","screen","script","sculpture","search","season","secret","sector","security","segment","seize","select","senate","senator","sensitive","sentence","separate","sequence","series","settle","severe","shadow","shame","shape","share","sharp","shelter","shift","shine","ship","shock","shoot","shore","shortage","shoulder","shout","shrink","sight","signal","silence","silk","silly","silver","similar","simple","sin","sink","sir","sister","site","sketch","skill","skin","sky","slave","slavery","slide","slight","slip","slope","smart","smell","smile","smoke","smooth","snap","snow","soak","soar","soccer","social","society","soft","software","soldier","solid","solution","solve","somewhat","sophisticated","soul","source","speech","spirit","split","sponsor","sport","spot","spread","spring","spy","square","squeeze","stable","staff","stage","stake","stall","stamp","stand","standard","star","stare","start","state","statement","station","statistics","status","steady","steal","steam","steel","steep","stem","step","stereotype","stick","stiff","stimulate","stir","stock","stomach","stone","store","storm","story","straight","strain","stranger","strategy","strength","stress","stretch","strike","string","strip","stroke","structure","struggle","student","studio","stuff","stupid","style","subject","submit","substance","succeed","success","suffer","suggest","suit","sum","summary","summit","super","supply","support","supreme","sure","surface","surgery","surplus","surprise","surround","survey","survival","survive","suspect","sustain","swallow","swear","sweet","swing","switch","symbol","sympathy","syndrome","system","tackle","tail","talent","tank","tape","target","task","taste","tax","tear","technique","technology","teen","temple","temporary","tend","tennis","tension","tent","term","testimony","text","theme","therapy","thereby","thick","thief","thing","think","thorough","threat","throat","through","throw","thunder","ticket","tide","tie","tight","til","till","timber","tissue","title","tobacco","tone","tongue","topic","total","tough","tour","tourist","tournament","toy","trace","track","trade","tradition","traditional","traffic","trail","trainer","transaction","transform","transition","translate","transport","trap","travel","treasure","treat","treaty","trend","trial","tribe","trick","troop","trouble","truck","trust","tube","tunnel","twin","twist","type","typical","ugly","ultimate","uncertainty","undergo","underlie","unemployment","unfair","unfortunately","uniform","unique","unite","universe","unlike","unlikely","update","uphold","upset","urban","urge","urgent","usage","useless","usual","utility","vague","valid","valley","valuable","variable","variety","various","vast","vehicle","venture","version","veteran","via","victim","victory","violence","virtual","virtue","visible","vision","visual","vital","vocabulary","voice","volume","voluntary","volunteer","vote","wage","wake","wander","warn","waste","wave","weak","wealth","weapon","weird","welcome","welfare","western","wheel","whilst","whisper","widespread","wild","wine","wing","wire","wisdom","wise","wish","witness","wonder","wood","wool","word","workshop","worry","worst","worth","wound","wrap","yard","yell","youth","zone"];

const tier3Words = ["aberration","abolish","abstain","acquiesce","adversary","advocate","aesthetic","affinity","aggregate","allegiance","alleviate","ambiguous","amend","analogous","anomaly","apparatus","apprehension","articulate","assertion","astute","attribute","augment","aversion","benchmark","benevolent","bolster","bureaucratic","calibrate","candid","catalyst","categorize","chronological","circumvent","coherent","collateral","commensurate","commodity","compelling","compliant","comprehensive","compromise","concede","conceive","concurrent","condescend","connotation","conspicuous","contempt","contradiction","controversy","conventional","conversely","conviction","correlate","correspond","credible","criterion","cumulative","curtail","deem","deficiency","demographic","deplete","deprive","designate","despair","destine","deteriorate","deviation","devise","differentiate","dilemma","diminish","disclose","discourse","discrepancy","discretion","displace","dispose","dispute","disregard","disrupt","distinct","distinguish","distort","divert","doctrine","domain","dominant","dubious","duration","dwell","dynamic","elicit","eligible","eloquent","embrace","emerge","emission","empirical","enable","encounter","endeavor","enforce","enhance","enormous","enquiry","entail","entity","envision","equitable","erode","essence","evaluate","evoke","excerpt","excess","exclude","exempt","explicit","exploit","expose","extract","fabricate","facilitate","feasible","fiscal","fluctuate","formulate","forthcoming","foster","fraction","fragment","friction","generic","genuine","glimpse","govern","gradient","grasp","grievance","gross","grounds","hamper","harmonize","hazard","heritage","hierarchy","hinder","hypothesis","ideology","imperative","implication","implicit","impose","impoverish","incentive","incidence","incline","incorporate","indicate","indigenous","induce","inevitable","infrastructure","inherent","initiate","innovate","integrity","intense","interim","intricate","intrinsic","invoke","irony","irrelevant","isolation","juxtapose","legitimate","liability","lucid","magnitude","mandatory","manifest","medieval","merit","metaphor","mitigate","morality","mutual","negate","negligible","nominal","norm","notorious","notwithstanding","nurture","obligatory","obscure","offset","opt","optimistic","orient","outcome","outright","overlap","paradigm","paradox","paramount","partial","participation","perceive","persist","perspective","phenomenon","pivotal","plausible","plight","polarize","postpone","pragmatic","precedent","preliminary","premise","prevalent","prior","profound","prohibit","prolific","prominent","prone","propagate","provision","provoke","proximity","quota","rationale","reconcile","reinforce","relinquish","reluctant","repercussion","replicate","resemble","residual","resilient","respective","restore","restrain","retain","retrieve","revise","rhetoric","rigorous","robust","ruthless","saturate","scrutiny","segment","simultaneous","skeptical","solicit","sophisticated","specify","spontaneous","stagnant","stipulate","subordinate","subsequent","substantiate","succinct","superficial","supplement","suppress","surge","surplus","surveillance","susceptible","symmetry","synthesis","tangible","tentative","theorem","thesis","threshold","transcend","transparent","tremendous","trigger","turbulent","undergo","underlying","unify","utilize","valid","vary","ventilate","versatile","viable","vindicate","volatile","vulnerable","warrant","wholesale","withstand","aberration","abjure","ablate","abolish","abridge","abrupt","absolve","abstain","abundance","abuse","accolade","acclaim","accommodate","accumulate","accusation","acquaint","acquiesce","acquisition","activate","addendum","adept","adhere","adjacent","adjourn","admonish","advent","adversary","adverse","aesthetic","affable","affirm","afflict","affront","aggrandize","ailment","alacrity","albeit","alchemy","algorithm","alias","alibi","alienate","alignment","allay","allegiance","allegory","allot","allude","allusion","altruism","amalgamate","ambivalent","ameliorate","amnesty","amorphous","amplify","analogy","anarchy","anecdote","annex","annotate","annul","anomaly","antagonize","antecedent","anthology","antithesis","apathy","appease","appliance","applicable","apprehend","apprentice","aptitude","arbitrary","archaic","archive","ardent","arduous","aria","aristocracy","arrogant","ascend","ascertain","ascribe","assail","assassin","assent","assertion","assimilate","assort","assuage","astray","attain","attest","attire","attribute","audacious","audible","augment","austere","autocrat","avarice","avid","axiom"];

const tier4Words = ["acumen","adulterate","affectation","aggrandize","alacrity","allegory","amalgamate","ameliorate","anachronism","anathema","antediluvian","antithesis","apathetic","appease","approbation","arbitrary","arcane","arduous","ascetic","assiduous","astute","audacious","austere","avarice","axiomatic","belie","bellicose","benign","berate","berate","bifurcate","blandish","blithe","bombastic","bourgeois","brevity","bucolic","bulwark","bumptious","byzantine","cabal","calumny","canard","capricious","castigate","catalyst","caustic","censure","cerebral","charlatan","chicanery","circumscribe","circumlocution","clandestine","clemency","coalesce","codify","cogent","cohort","collateral","colloquial","commensurate","compendium","complacent","compliant","compunction","concede","conceited","conciliatory","concomitant","conflagration","connive","consecrate","consonant","contrite","conundrum","copious","corroborate","cosmopolitan","credulous","culminate","cupidity","curtail","cynical","decimate","defenestrate","deleterious","demagogue","denigrate","deprecate","deride","desiccate","desultory","diatribe","didactic","diffident","digress","dilatory","dilettante","disabuse","disaffected","disburse","discerning","dissonance","dissent","dissolution","divergent","dogmatic","duplicity","ebullient","eclectic","effervescent","efficacious","egregious","eleemosynary","ellipsis","emaciate","embellish","eminent","emollient","empathy","empirical","empiricism","emulate","endemic","engender","enigma","ennui","ephemeral","epigram","epitome","equanimity","equitable","eradicate","erudite","esoteric","espouse","estrange","eulogize","euphemism","euphoria","exasperate","excoriate","exculpate","execrable","exemplary","exhort","exonerate","expedient","exploitative","exquisite","extemporaneous","extirpate","extraneous","extravagant","facetious","fallacious","fastidious","fatuous","fecund","feckless","felicitous","furtive","furtively","gainsay","galvanize","gauche","grandiloquent","grandiose","gregarious","guile","hackneyed","harangue","heresy","hermetic","hubris","iconoclast","idiosyncratic","ignominious","imbroglio","immutable","impeccable","impede","impertinent","impervious","implacable","importune","impregnable","impromptu","impudent","impugn","inadvertent","incandescent","incendiary","inclement","incognito","indifferent","indigent","indomitable","indulgent","ineffable","ineluctable","inept","inexorable","infallible","ingenuous","inherent","innocuous","inscrutable","insipid","insolent","insouciant","intransigent","inundate","invective","inveterate","irascible","iridescent","irreverent","jejune","juxtapose","laconic","languid","lapsarian","lassitude","latter","laudable","legerdemain","loquacious","magnanimous","magniloquent","maelstrom","maudlin","mauve","maverick","mellifluous","mercurial","militate","minatory","misanthrope","miserly","mitigate","mollify","moribund","multifarious","munificent","myopic","nefarious","neophyte","nihilism","nonchalant","obdurate","obeisance","obfuscate","oblique","oblivious","obstreperous","obtuse","officious","opprobrium","oration","ostentatious","palatial","palaver","palimpsest","palpable","panacea","panache","panegyric","paragon","pariah","parochial","parsimonious","patrician","paucity","pedagogical","pedantic","penurious","perdition","peremptory","perfidious","perfunctory","peripatetic","pernicious","perpetuate","perquisite","pertinacious","perusal","pervasive","petulant","philippic","phlegmatic","pious","pithy","platitude","plenary","plethora","polemic","pontificate","portentous","pragmatism","precarious","precipitate","precocious","predilection","preeminent","prelate","preposterous","presage","presumption","prevaricate","probity","proclivity","prodigal","prodigious","profane","proffer","profligate","prohibitive","proletarian","proliferate","propitious","propriety","proscribe","prosaic","protean","provenance","provocative","puerile","pugnacious","punctilious","pugnacious","punitive","pusillanimous","quagmire","quaint","quandary","querulous","quiescent","quintessential","quotidian","raconteur","rapprochement","rarefied","recalcitrant","recant","recidivism","recluse","recrimination","rectitude","recuperate","redoubtable","refractory","refute","relegate","remorse","reparation","reprobate","repudiate","requisite","rescind","resolute","restitution","reticent","retribution","ribald","risible","rogue","rubric","ruminant","ruthless","sagacious","salacious","salient","sanctimonious","sangfroid","sanguine","sardonic","satiate","scrupulous","sedulous","semaphore","sententious","serendipity","servile","sinecure","sobriety","soliloquy","soporific","specious","spendthrift","spurious","stolid","strident","stricture","sublimate","sublime","substantiate","succor","suffice","suffocate","sumptuous","supercilious","supplant","supple","suppress","surreptitious","sycophant","tautology","taxonomy","temerity","temperate","tenacious","tendentious","tenure","tergiversate","terse","tirade","torpid","travesty","trenchant","trepidation","truculent","truism","turgid","turpitude","tyrannical","ubiquitous","umbrage","unctuous","undermine","unequivocal","ungainly","untenable","urbane","usurp","utilitarian","vacillate","vacuous","valediction","vapid","vehement","venerate","veracity","verbiage","veritable","vernacular","vestige","vicarious","vicissitude","vilify","vindictive","virulent","visceral","vitriolic","vociferous","volition","voracious","vulnerable","wanton","wayward","whimsical","winnow","wistful","zealot","zenith","zeitgeist","abnegate","abscond","abstemious","acarpous","adjudicate","adumbrate","aegis","affectation","agglomerate","agnostic","agrarian","alacritous","antediluvian","antinomy","aphorism","apotheosis","appellation","approbation","arabesque","asperity","assiduity","atavism","auctorial","autarky","beatific","bedizen","beleaguer","behemoth","besmirch","bilious","blandishment","blather","bloviate","bowdlerize","brachiate","brobdingnagian","brouhaha","bumfuzzle","bumptious","cacophony","calumniate","canard","captious","casuistry","catharsis","causality","cerulean","chagrin","chimera","circumlocution","clamor","clapperclaw","cloying","codicil","collateral","commensurate","compendious","concatenate","conflagration","conjure","consanguinity","consonance","contravene","contumacious","contumely","conundrum","convergence","convivial","cornucopia","corollary","corpulent","coruscate","craven","cupidity","curmudgeon","dearth","debacle","decanter","decimate","declivity","defenestrate","delectation","deliquescent","demagogue","demarcation","denouement","deontic","depredation","deracinate","derelict","desiccate","desideratum","despoliation","desultory","diaphanous","diatribe","dichotomy","didactic","diffidence","digression","dilatory","dilettante","dirigible","disabuse","disapprobation","discomfit","discordant","discreet","discrepancy","disdain","disembogue","disenfranchise","disheveled","disparage","disparate","disputation","dissident","dissolution","divergence","divertissement","docile","doggerel","dogmatic","dolorous","donnybrook","draconian","ebullience","ecumenical","edification","efflorescence","effulgent","egomania","ejaculate","eleemosynary","elucidate","emaciated","emblazon","emolument","empiricist","encomium","endemic","enervate","engender","enmity","ennui","ephemeron","epigram","epiphany","epistemology","equable","equanimous","equivocate","eremite","erudition","eschatology","esoteric","esprit","estimable","ethereal","etiology","evanescent","exasperate","excoriation","exculpation","execrable","exegesis","exiguous","exordium","expatiate","expediency","expunge","extirpation","extemporaneous","extrapolate","extropian","facetious","fallacious","farinaceous","fastidious","fatuous","febrile","feckless","felicitous","feracious","filigree","firmament","fissure","flail","flagitious","flippant","foppish","forestall","formidable","fortuitous","fracas","frangible","fugacious","fulminate","furtive","gainsay","galvanic","gambit","garner","genuflect","gesticulate","glabrous","grandiloquence","gratuitous","grodious","hackneyed","hagiography","halcyon","harbinger","hegemony","heuristic","hirsute","hubris","iconoclasm","ignominy","illicit","imbroglio","immolate","impecunious","impervious","implacable","importunate","imprecation","improvident","impunity","inchoate","incogitant","inculcate","indelible","indigence","ineffable","ineluctable","inexorable","ingratiate","innocuous","inscrutable","insipid","insolent","insouciance","internecine","intransigent","inure","invective","inveterate","invidious","irascible","iridescent","irksome","itinerant","jejune","judicature","jurisprudence","juxtaposition","labyrinthine","lachrymose","laconic","lambaste","languid","lassitude","lattice","laudatory","legerdemain","lethargic","limpid","litany","litigious","logorrhea","loquacious","lugubrious","maelstrom","magnanimity","malapropism","maudlin","mawkish","mellifluous","mercantile","meretricious","meritocracy","misanthropy","mordant","moribund","multifarious","munificent","nascent","nefarious","nemesis","neophyte","nihilism","non sequitur","nonpareil","numinous","obdurate","obfuscation","oblation","oblique","obloquy","obsequious","obstreperous","obtuse","officious","omniscient","opaque","opprobrious","oration","oscillate","ossify","ostracism","overwrought","palimpsest","palpable","panacea","panache","panjandrum","panoply","paradigmatic","paragon","pariah","parlance","parochial","parsimonious","partisan","paucity","pecuniary","pedagogical","pedantic","penchant","penitent","penumbra","perdition","peremptory","perfidious","peripatetic","pernicious","perquisite","pertinacious","perusal","pervasive","petulant","philippic","phlegmatic","pithy","plangent","platitude","plethora","polemic","pontificate","portentous","praxis","precipitous","predilection","preeminent","prevaricate","probity","proclivity","prodigal","prodigious","profligate","proletarian","prolix","propinquity","prosaic","protean","provenance","puerile","pugilism","pugnacious","punctilious","purview","pusillanimous","quagmire","quaint","quandary","querulous","quiescent","quintessential","quotidian","raconteur","rapprochement","rarefied","recalcitrant","recidivism","recluse","recrimination","rectitude","redoubtable","refractory","relegate","remonstrate","reparation","reprobate","repudiate","rescind","resolute","reticent","retribution","ribald","risible","rococo","rubric","sacrosanct","sagacious","salacious","salubrious","sanctimonious","sang-froid","sanguine","sardonic","saturate","sawyer","scintillate","scrupulous","sedulous","semaphore","sententious","serendipity","servile","shibboleth","sinecure","sobriety","soliloquy","soporific","specious","spendthrift","spurious","stolid","strident","stricture","sublimate","sublime","succor","suffice","sumptuous","superannuated","supercilious","supplant","supple","surreptitious","sycophant","tautology","taxonomy","temerity","temporize","tendentious","tenure","tergiversate","tirade","torpid","travesty","trenchant","trepidation","truculent","turgid","turpitude","ubiquitous","umbrage","unctuous","undersigned","unequivocal","untenable","urbane","usurp","utilitarian","vacillate","vacuous","valediction","vapid","vehement","venerate","veracious","verbiage","veritable","vernacular","vestige","vicarious","vicissitude","vindictive","virulent","visceral","vitriolic","vociferous","volition","voracious","wanton","wayward","whimsical","winnow","wistful","zealot","zenith","zeitgeist"];

// ===== GENERATION =====

const allCompact = [];
const tiers = [tier1, tier2Words, tier3Words, tier4Words];

// Process tier 1 (already formatted)
tier1.forEach((entry, i) => {
  allCompact.push({
    word: entry[0],
    pos: entry[1] === 'n' ? 'noun' : entry[1] === 'v' ? 'verb' : entry[1] === 'j' ? 'adjective' : entry[1] === 'b' ? 'adverb' : entry[1] === 'p' ? 'preposition' : entry[1] === 'c' ? 'conjunction' : 'pronoun',
    syn: entry[2] ? entry[2].split(',') : [],
    ant: entry[3] ? entry[3].split(',') : [],
    def: entry[4],
    ex: entry[5],
    tier: 1,
    tierIndex: i,
  });
});

// Process tiers 2-4 (word strings only) with deduplication
const seenWords = new Set(tier1.map(e => e[0].toLowerCase()));
const tierCounts = [0, 0, 0];
[tier2Words, tier3Words, tier4Words].forEach((words, tierIdx) => {
  let tierIndex = 0;
  words.forEach((w) => {
    const key = w.toLowerCase();
    if (seenWords.has(key)) return;
    seenWords.add(key);
    allCompact.push({
      word: w,
      pos: detectPOS(w),
      syn: [],
      ant: [],
      def: 'A common English word meaning related to ' + w + '.',
      ex: 'The word ' + w + ' is used in everyday English.',
      tier: tierIdx + 2,
      tierIndex: tierIndex++,
    });
    tierCounts[tierIdx]++;
  });
});

function detectPOS(word) {
  const w = word.toLowerCase();
  if (w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ment') || w.endsWith('ness') || w.endsWith('ity') || w.endsWith('ance') || w.endsWith('ence') || w.endsWith('ism') || w.endsWith('ist') || w.endsWith('dom') || w.endsWith('ship') || w.endsWith('hood') || w.endsWith('age') || w.endsWith('ure') || w.endsWith('ling')) return 'noun';
  if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ify') || w.endsWith('ate') || w.endsWith('en') || w.endsWith('fy')) return 'verb';
  if (w.endsWith('ful') || w.endsWith('less') || w.endsWith('ous') || w.endsWith('ive') || w.endsWith('able') || w.endsWith('ible') || w.endsWith('al') || w.endsWith('ic') || w.endsWith('ant') || w.endsWith('ent') || w.endsWith('ary') || w.endsWith('ory')) return 'adjective';
  if (w.endsWith('ly') && w.length > 3) return 'adverb';
  return 'noun';
}

const wordsDatabase = [];
const total = allCompact.length;
const tierSizes = [tier1.length, tierCounts[0], tierCounts[1], tierCounts[2]];

allCompact.forEach((c, i) => {
  const syllables = makeSyllableArray(c.word);
  const vocabularyLevel = getLevel(c.tier, c.tierIndex || 0, tierSizes[c.tier - 1] || 1);
  const difficulty = getDifficulty(vocabularyLevel);
  const frequency = getFrequency(i, total);
  const wordForms = makeWordForms(c.word, c.pos);

  wordsDatabase.push({
    slug: makeSlug(c.word),
    word: c.word.charAt(0).toUpperCase() + c.word.slice(1),
    phonetic: '',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/' + makeSlug(c.word) + '-us.mp3',
    partOfSpeech: c.pos,
    definitions: { simple: c.def, full: c.def },
    examples: c.ex ? [c.ex] : [],
    synonyms: c.syn,
    antonyms: c.ant,
    relatedWords: [],
    wordForms: wordForms,
    syllables: syllables,
    difficulty: difficulty,
    vocabularyLevel: vocabularyLevel,
    category: 'General',
    subcategories: ['general'],
    frequency: frequency,
    quizEligible: true,
    gameEligible: true,
    etymology: '',
    funFact: '',
  });
});

console.log('Total word entries:', wordsDatabase.length);

// ===== WRITE TYPESCRIPT =====

const tsContent = `// Auto-generated by scripts/gen-words.js - Do not edit manually
export interface WordEntry {
  slug: string;
  word: string;
  phonetic: string;
  audioUrl: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun';
  definitions: { simple: string; full: string };
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
  wordForms: {
    plural?: string;
    pastTense?: string;
    pastParticiple?: string;
    comparative?: string;
    superlative?: string;
    adverb?: string;
    adjective?: string;
    noun?: string;
    verb?: string;
  };
  syllables: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  vocabularyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  subcategories: string[];
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare';
  quizEligible: boolean;
  gameEligible: boolean;
  etymology: string;
  funFact: string;
}

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const categories = [
  'Everyday', 'Academic', 'Business', 'Literary', 'Science',
  'Technology', 'Art', 'Nature', 'Emotions', 'Character',
  'Communication', 'Formal', 'Informal', 'Legal', 'Medical',
] as const;

// @ts-expect-error TS2590 - large array literal
const wordsDatabase: WordEntry[] = [
`;

const entries = wordsDatabase.map(w => {
  const syns = w.synonyms.length > 0 ? `[${w.synonyms.map(s => "'" + escapeTS(s) + "'").join(',')}]` : '[]';
  const ants = w.antonyms.length > 0 ? `[${w.antonyms.map(a => "'" + escapeTS(a) + "'").join(',')}]` : '[]';
  const exs = w.examples.length > 0 ? `[${w.examples.map(e => "'" + escapeTS(e) + "'").join(',')}]` : '[]';
  const rws = w.relatedWords.length > 0 ? `[${w.relatedWords.map(r => "'" + escapeTS(r) + "'").join(',')}]` : '[]';
  
  let wf = '{';
  const wfParts = [];
  if (w.wordForms.plural) wfParts.push(`plural: '${escapeTS(w.wordForms.plural)}'`);
  if (w.wordForms.pastTense) wfParts.push(`pastTense: '${escapeTS(w.wordForms.pastTense)}'`);
  if (w.wordForms.pastParticiple) wfParts.push(`pastParticiple: '${escapeTS(w.wordForms.pastParticiple)}'`);
  if (w.wordForms.comparative) wfParts.push(`comparative: '${escapeTS(w.wordForms.comparative)}'`);
  if (w.wordForms.superlative) wfParts.push(`superlative: '${escapeTS(w.wordForms.superlative)}'`);
  if (w.wordForms.adverb) wfParts.push(`adverb: '${escapeTS(w.wordForms.adverb)}'`);
  if (w.wordForms.adjective) wfParts.push(`adjective: '${escapeTS(w.wordForms.adjective)}'`);
  if (w.wordForms.noun) wfParts.push(`noun: '${escapeTS(w.wordForms.noun)}'`);
  if (w.wordForms.verb) wfParts.push(`verb: '${escapeTS(w.wordForms.verb)}'`);
  wf += wfParts.join(', ') + '}';
  
  const sylls = `[${w.syllables.map(s => "'" + escapeTS(s) + "'").join(',')}]`;
  const subcats = `[${w.subcategories.map(s => "'" + escapeTS(s) + "'").join(',')}]`;

  return `  {
    slug: '${escapeTS(w.slug)}',
    word: '${escapeTS(w.word)}',
    phonetic: '${escapeTS(w.phonetic)}',
    audioUrl: '${escapeTS(w.audioUrl)}',
    partOfSpeech: '${w.partOfSpeech}',
    definitions: { simple: '${escapeTS(w.definitions.simple)}', full: '${escapeTS(w.definitions.full)}' },
    examples: ${exs},
    synonyms: ${syns},
    antonyms: ${ants},
    relatedWords: ${rws},
    wordForms: ${wf},
    syllables: ${sylls},
    difficulty: '${w.difficulty}',
    vocabularyLevel: '${w.vocabularyLevel}',
    category: '${escapeTS(w.category)}',
    subcategories: ${subcats},
    frequency: '${w.frequency}',
    quizEligible: ${w.quizEligible},
    gameEligible: ${w.gameEligible},
    etymology: '${escapeTS(w.etymology)}',
    funFact: '${escapeTS(w.funFact)}',
  },`;
}).join('\n');

const tail = `];

export function getAllWords(): WordEntry[] {
  return wordsDatabase;
}

export function getWordBySlug(slug: string): WordEntry | undefined {
  return wordsDatabase.find((w) => w.slug === slug);
}

export function getAllSlugs(): string[] {
  return wordsDatabase.map((w) => w.slug);
}

export function searchWords(query: string): WordEntry[] {
  const lower = query.toLowerCase();
  return wordsDatabase.filter(
    (w) =>
      w.word.toLowerCase().includes(lower) ||
      w.definitions.simple.toLowerCase().includes(lower) ||
      w.definitions.full.toLowerCase().includes(lower) ||
      w.category.toLowerCase().includes(lower) ||
      w.etymology.toLowerCase().includes(lower) ||
      w.synonyms.some((s) => s.toLowerCase().includes(lower)) ||
      w.antonyms.some((a) => a.toLowerCase().includes(lower))
  );
}

export function getWordsByCategory(category: string): WordEntry[] {
  return wordsDatabase.filter(
    (w) => w.category.toLowerCase() === category.toLowerCase()
  );
}

export function getWordsByDifficulty(difficulty: string): WordEntry[] {
  return wordsDatabase.filter((w) => w.difficulty === difficulty);
}

export function getWordsByLevel(level: string): WordEntry[] {
  return wordsDatabase.filter((w) => w.vocabularyLevel === level);
}

export function getWordsByFrequency(frequency: string): WordEntry[] {
  return wordsDatabase.filter((w) => w.frequency === frequency);
}

export function getDailyChallenge(): WordEntry {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % wordsDatabase.length;
  return wordsDatabase[index];
}

export function getRelatedWords(slug: string): WordEntry[] {
  const word = getWordBySlug(slug);
  if (!word) return [];
  return wordsDatabase.filter(
    (w) =>
      w.slug !== slug &&
      (w.category === word.category ||
        w.vocabularyLevel === word.vocabularyLevel ||
        word.relatedWords.some((rw) => rw.toLowerCase() === w.word.toLowerCase()) ||
        word.synonyms.some((s) => w.synonyms.includes(s)))
  );
}

export function getWordsByLetter(letter: string): WordEntry[] {
  const lower = letter.toLowerCase();
  return wordsDatabase.filter((w) => w.word.toLowerCase().startsWith(lower));
}

export function getWordsByLength(length: number): WordEntry[] {
  return wordsDatabase.filter((w) => w.word.length === length);
}

export function getQuizWords(): WordEntry[] {
  return wordsDatabase.filter((w) => w.quizEligible);
}

export function getGameWords(): WordEntry[] {
  return wordsDatabase.filter((w) => w.gameEligible);
}

export function getSynonymsForWord(slug: string): { word: string; synonyms: string[] } | undefined {
  const word = getWordBySlug(slug);
  if (!word) return undefined;
  return { word: word.word, synonyms: word.synonyms };
}

export function getAntonymsForWord(slug: string): { word: string; antonyms: string[] } | undefined {
  const word = getWordBySlug(slug);
  if (!word) return undefined;
  return { word: word.word, antonyms: word.antonyms };
}
`;

const fullContent = tsContent + entries + '\n' + tail;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'words-expanded.ts'), fullContent);
console.log('Written words-expanded.ts');
console.log('Total entries:', wordsDatabase.length);

// Verify
const lines = fullContent.split('\n');
console.log('Total lines:', lines.length);
const slugCount = fullContent.split("slug: '").length - 1;
console.log('Slug count in output:', slugCount);
