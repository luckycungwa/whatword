/**
 * Seed script: Fetches real definitions from Free Dictionary API
 * and inserts into Supabase.
 *
 * Usage: node scripts/seed-supabase.js
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Curated word list: ~1,500 real English words across CEFR levels
const WORD_LIST = [
  // A1 - Beginner
  'able','about','above','accept','across','act','add','afraid','after','again','age','ago','agree','air','all','allow','almost','alone','along','already','also','always','among','animal','answer','any','anyone','anything','appear','apple','area','arm','army','around','art','ask','atom','baby','back','bad','bag','ball','bank','base','basket','bath','be','bear','beat','beautiful','bed','behind','bell','below','beside','best','better','between','big','bird','birth','birthday','bit','bite','black','blame','blank','bleed','blind','block','blood','blow','blue','board','boat','body','bone','book','born','borrow','both','bottle','bottom','bowl','box','boy','brain','brave','bread','break','breakfast','breath','breathe','bridge','bright','broken','brother','brown','brush','build','burn','bus','business','busy','but','butter','buy','by','cake','call','calm','came','camera','camp','card','care','careful','carry','case','catch','cause','cell','center','certain','chair','chance','change','charge','cheap','check','cheese','child','choice','choose','church','circle','city','claim','class','clean','clear','climb','clock','close','clothes','cloud','club','coach','coal','coast','coat','code','coffee','cold','collect','college','colour','come','common','company','compare','complete','computer','concern','condition','connect','consider','contain','continue','control','cook','cool','copy','corner','correct','cost','cotton','could','count','country','couple','course','cousin','create','cross','cry','cup','cut','dance','danger','dangerous','dark','daughter','day','dead','dear','death','decide','deep','deer','design','desk','destroy','develop','die','dig','dinner','direct','discover','dish','do','doctor','dog','dollar','door','down','draw','dream','dress','drink','drive','drop','dry','duck','dull','dust','duty','each','ear','early','earn','earth','east','easy','eat','education','egg','eight','either','else','empty','end','enemy','enjoy','enough','enter','equal','escape','even','evening','ever','every','everyone','everything','example','except','excite','exercise','exist','expect','explain','explore','express','extra','eye','face','fact','fair','fall','false','family','famous','far','farm','fast','fat','father','fear','feel','few','field','fight','fill','film','final','find','fine','finger','finish','fire','first','fish','fit','five','fix','flat','floor','flower','fly','fold','follow','food','foot','for','force','forest','forget','form','four','free','fresh','friend','from','front','fruit','full','fun','funny','furniture','future','game','garden','gas','gate','gather','general','gentle','gift','girl','give','glad','glass','go','god','gold','golden','good','grandfather','grandmother','grass','grave','great','green','grey','ground','group','grow','guard','guess','guide','gun','hair','half','hall','hand','hang','happen','happy','hard','hat','hate','have','he','head','health','hear','heart','heat','heavy','help','her','here','hide','high','hill','him','hip','hire','history','hit','hold','hole','holiday','home','hope','horse','hospital','host','hot','hotel','hour','house','how','however','huge','human','hundred','hungry','hurry','hurt','husband','ice','idea','identify','if','ill','important','improve','in','include','increase','independent','Indian','industry','insect','inside','instead','interest','introduce','invent','invite','island','it','item','join','joy','jump','justice','keep','key','kid','kill','kind','king','kiss','kitchen','knee','knife','knock','know','knowledge','lab','labour','lack','lady','lake','land','language','large','last','late','later','laugh','launch','law','lay','lazy','lead','leader','leaf','lean','learn','least','leave','left','leg','lend','lens','less','lesson','let','letter','level','lie','life','lift','light','like','limit','line','lip','list','listen','little','live','lock','long','look','lord','lose','loss','loud','love','lovely','low','luck','lunch','machine','mad','mail','main','major','make','male','man','manage','manner','many','mark','market','marry','mass','master','match','material','matter','may','maybe','meal','mean','measure','meat','medical','meet','member','memory','mental','mention','mercy','metal','middle','might','mile','milk','million','mind','mine','minute','miss','mistake','mix','model','modern','moment','money','monkey','month','moon','more','morning','most','mother','motion','mountain','mouse','mouth','move','much','murder','music','must','my','mystery','name','narrow','nation','nature','near','nearly','neat','neck','need','negative','neighbour','neither','nerve','net','never','new','news','newspaper','next','nice','night','nine','no','nobody','nod','noise','none','nor','north','nose','not','note','nothing','notice','now','number','nurse','obey','object','observe','obtain','occur','odd','off','offer','office','officer','often','oil','old','on','once','one','only','open','operate','opinion','oppose','option','or','orange','order','ordinary','organ','other','otherwise','our','out','outside','over','own','pack','page','pain','paint','pair','palace','pale','pan','paper','parent','park','part','particular','partner','party','pass','passenger','past','path','pattern','pay','peace','pen','pencil','people','per','percent','perfect','perhaps','period','permit','person','petrol','phone','photo','phrase','pick','picture','piece','pig','pile','pilot','pin','pink','pipe','place','plain','plan','plant','plate','play','player','please','pleasure','plenty','pocket','poem','poet','point','poison','police','polite','pool','poor','popular','population','position','possess','possible','post','pound','pour','poverty','power','practice','praise','pray','prefer','prepare','present','president','press','price','pride','prime','prison','private','prize','probable','problem','produce','product','production','professor','programme','progress','promise','proper','protect','proud','prove','public','pull','punish','pupil','pure','purpose','push','put','quality','quarter','queen','question','quick','quiet','quite','race','radio','rain','raise','range','rank','rapid','rare','rate','rather','raw','reach','read','ready','real','reason','receive','recent','reckon','recognise','record','red','reduce','refer','reform','refuse','region','relation','religion','remain','remember','remind','remote','remove','rent','repair','repeat','replace','reply','report','republic','request','respect','respond','rest','restaurant','result','return','reveal','review','reward','rich','ride','ring','rise','risk','river','road','robot','rock','role','roll','roof','room','root','rope','rose','round','route','row','rub','rude','rule','run','rush','sad','safe','sail','salt','same','sand','satisfy','save','scene','scheme','school','science','score','screen','search','season','seat','secret','section','security','see','seed','seem','self','sell','send','senior','sense','sentence','separate','sequence','serious','servant','serve','service','set','settle','seven','several','shade','shadow','shake','shall','shame','shape','share','sharp','she','sheet','shelf','shell','shine','ship','shirt','shock','shoe','shoot','shop','short','shot','shoulder','shout','show','shut','shy','sick','side','sight','sign','silence','silly','silver','similar','simple','since','sing','single','sir','sister','sit','site','situation','six','size','skill','skin','sky','slave','sleep','slide','slight','slip','slow','small','smell','smile','smoke','smooth','snow','so','soap','social','society','soft','soldier','solid','solution','solve','some','someone','something','sometimes','somewhere','son','song','soon','sorry','sort','soul','sound','south','space','speak','special','speech','speed','spell','spend','spirit','split','sport','spread','spring','square','stable','staff','stage','stand','standard','star','stare','start','state','station','stay','steal','steam','steel','steep','step','stick','still','stomach','stone','stop','store','storm','story','strange','stream','street','strength','strike','strong','structure','student','study','stupid','subject','succeed','success','successful','such','sudden','suffer','sugar','suit','summer','sun','support','sure','surprise','surround','sweet','swim','swing','switch','symbol','system','table','tail','take','tale','talk','tall','tank','tape','task','tax','tea','teach','team','tear','technology','telephone','television','tell','ten','tend','tent','term','test','text','than','that','the','theatre','their','them','theme','themselves','then','there','these','they','thick','thin','thing','think','third','thirsty','this','those','though','thought','thousand','threat','throat','through','throw','thus','ticket','tie','tight','till','time','tiny','tired','title','to','tobacco','today','toe','together','tomorrow','tone','tongue','tonight','too','tool','tooth','top','total','touch','tour','town','trade','tradition','traffic','train','transport','trap','travel','treat','tree','trend','trial','trip','trouble','truck','true','trust','try','tube','turn','twelve','twenty','twice','two','type','uncle','under','union','unit','unite','university','unless','unlike','until','up','upon','upper','upset','urban','us','use','used','useful','valley','valuable','variety','various','vast','version','very','vessel','victim','view','village','violence','visit','visitor','voice','vote','wage','wait','wake','walk','wall','want','war','warm','warn','wash','waste','watch','water','wave','way','we','weak','wealth','weapon','wear','weather','week','weigh','welcome','welfare','well','west','western','wet','what','wheel','when','where','whether','which','while','whisper','white','who','whole','whom','whose','why','wide','wife','wild','will','willing','win','wind','window','wine','wing','winner','winter','wire','wish','with','within','without','witness','woman','wonder','wood','word','work','worker','world','worry','worse','worst','worth','would','wound','write','writer','wrong','yard','yeah','year','yellow','yes','yesterday','yet','you','young','your','youth','zero','zone',
];

// CEFR level assignment based on frequency/commonality
function getCEFRLevel(word, index) {
  if (index < 200) return 'A1';
  if (index < 500) return 'A2';
  if (index < 800) return 'B1';
  if (index < 1100) return 'B2';
  if (index < 1350) return 'C1';
  return 'C2';
}

function getDifficulty(word, index) {
  if (index < 300) return 'beginner';
  if (index < 900) return 'intermediate';
  return 'advanced';
}

function getFrequency(index) {
  if (index < 200) return 'very-common';
  if (index < 600) return 'common';
  if (index < 1100) return 'uncommon';
  return 'rare';
}

function getCategory(pos) {
  const map = {
    noun: 'Everyday',
    verb: 'Everyday',
    adjective: 'Character',
    adverb: 'Communication',
    preposition: 'Formal',
    conjunction: 'Formal',
    pronoun: 'Everyday',
  };
  return map[pos] || 'Everyday';
}

function slugify(word) {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchWord(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0];
  } catch (e) {
    return null;
  }
}

function extractEntry(apiData, word, index) {
  const phonetics = apiData.phonetics || [];
  const audio = phonetics.find(p => p.audio && p.audio.includes('-us'))?.audio ||
                phonetics.find(p => p.audio)?.audio || '';
  const phoneticText = phonetics.find(p => p.text)?.text || '';

  const meanings = apiData.meanings || [];
  const firstMeaning = meanings[0] || {};
  const pos = firstMeaning.partOfSpeech || 'noun';

  const definitions = firstMeaning.definitions || [];
  const firstDef = definitions[0] || {};

  const allSynonyms = [...new Set(meanings.flatMap(m => m.definitions?.flatMap(d => d.synonyms || []) || []))];
  const allAntonyms = [...new Set(meanings.flatMap(m => m.definitions?.flatMap(d => d.antonyms || []) || []))];
  const allExamples = definitions.filter(d => d.example).map(d => d.example).slice(0, 3);

  return {
    slug: slugify(word),
    word: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    phonetic: phoneticText,
    audio_url: audio,
    part_of_speech: pos,
    definition_simple: firstDef.definition || '',
    definition_full: definitions.map(d => d.definition).join(' | '),
    examples: allExamples,
    synonyms: allSynonyms.slice(0, 8),
    antonyms: allAntonyms.slice(0, 5),
    etymology: '',
    fun_fact: '',
    difficulty: getDifficulty(word, index),
    vocabulary_level: getCEFRLevel(word, index),
    category: getCategory(pos),
    subcategories: [],
    frequency: getFrequency(index),
    syllables: [],
    word_forms: {},
  };
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('WhatWord Database Seeder');
  console.log('========================');
  console.log(`Total words to seed: ${WORD_LIST.length}`);
  console.log('');

  // Check existing words
  const { data: existing } = await supabase.from('words').select('slug');
  const existingSlugs = new Set((existing || []).map(w => w.slug));
  console.log(`Already in database: ${existingSlugs.size}`);

  const toFetch = WORD_LIST.filter(w => !existingSlugs.has(slugify(w)));
  console.log(`To fetch: ${toFetch.length}`);
  console.log('');

  let success = 0;
  let failed = 0;
  let batch = [];

  for (let i = 0; i < toFetch.length; i++) {
    const word = toFetch[i];
    process.stdout.write(`[${i + 1}/${toFetch.length}] ${word}...`);

    const apiData = await fetchWord(word);
    if (!apiData) {
      console.log(' SKIP (no data)');
      failed++;
      continue;
    }

    const entry = extractEntry(apiData, word, WORD_LIST.indexOf(word));
    batch.push(entry);
    success++;
    console.log(` OK (${entry.part_of_speech})`);

    // Insert in batches of 50
    if (batch.length >= 50 || i === toFetch.length - 1) {
      const { error } = await supabase.from('words').upsert(batch, { onConflict: 'slug' });
      if (error) {
        console.error('Batch insert error:', error.message);
      } else {
        console.log(`  -> Inserted ${batch.length} words`);
      }
      batch = [];
    }

    // Rate limit: 100ms between requests
    await sleep(100);
  }

  console.log('');
  console.log('========================');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total in database: ${existingSlugs.size + success}`);
}

main().catch(console.error);
