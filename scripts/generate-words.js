// Script to generate word data from free dictionary API
// Uses only public domain / openly licensed data

const https = require('https');
const fs = require('fs');
const path = require('path');

// Common English words - curated list of ~2500 useful words
// Sourced from frequency lists and educational vocabulary lists
const WORD_LIST = [
  // A1 - Beginner (most common)
  'about','above','after','again','agree','ahead','allow','along','already','also',
  'always','among','animal','answer','appear','area','army','around','arrive','article',
  'attack','aunt','autumn','baby','back','bad','bag','ball','bank','base','basket',
  'bath','beach','bean','bear','bed','bedroom','bell','best','better','between',
  'bicycle','bird','birth','bite','black','blame','blank','bleed','blind','block',
  'blood','blow','blue','board','boat','body','bone','book','born','boss','both',
  'bottle','bottom','bowl','box','boy','brain','brave','bread','break','breakfast',
  'bridge','bright','bring','brother','brown','build','burn','bus','business','busy',
  'but','butter','buy','cake','call','calm','came','camera','camp','capital','captain',
  'car','card','care','careful','carry','case','catch','cause','cell','center','century',
  'certain','chair','chance','change','charge','check','cheese','chicken','child','choose',
  'church','circle','city','class','clean','clear','climb','clock','close','cloth',
  'cloud','club','coach','coast','coat','coffee','cold','collect','college','colour',
  'come','common','company','complete','computer','contain','content','context','cook',
  'cool','copy','corner','correct','cost','cotton','could','count','country','couple',
  'course','court','cover','create','cross','cup','current','custom','cut','dark',
  'daughter','day','dead','deal','dear','death','decide','deep','defence','degree',
  'demand','department','describe','design','desk','detail','determine','develop','die',
  'different','difficult','dinner','direct','direction','discover','discuss','doctor',
  'dog','dollar','domestic','door','double','doubt','down','draw','dream','dress',
  'drink','drive','drop','dry','due','during','each','ear','early','earth','east',
  'easy','eat','editor','effect','effort','egg','eight','either','else','employee',
  'end','enemy','enjoy','enough','enter','entire','escape','especially','establish',
  'even','evening','event','ever','every','exact','examine','example','excellent',
  'except','exchange','exercise','exist','expect','experience','expert','explain',
  'explore','express','extend','extra','extreme','eye','face','fact','fail','fair',
  'fall','family','famous','far','farm','fast','fat','father','fault','fear','feature',
  'feed','feel','fellow','few','field','fight','fill','final','finally','find','fine',
  'finger','finish','fire','firm','first','fish','fit','fix','flat','flight','floor',
  'flow','fly','follow','food','foot','football','force','forest','forget','form',
  'fortune','forward','found','frame','free','freedom','fresh','friend','front','fruit',
  'full','fun','function','future','gain','game','garden','gas','gate','gather','general',
  'gentle','gift','girl','give','glad','glass','go','god','gold','golden','good',
  'government','grab','grade','grain','grand','grass','great','green','grey','ground',
  'group','grow','growth','guess','guide','gun','guy','habit','hair','half','hall',
  'hand','handle','hang','happen','happy','hard','hat','hate','have','he','head',
  'health','hear','heart','heat','heavy','help','her','here','hero','herself','hide',
  'high','hill','him','himself','his','history','hit','hold','hole','holiday','home',
  'hope','horse','hospital','host','hot','hotel','hour','house','how','however','huge',
  'human','hundred','hunt','hurry','hurt','husband','idea','identify','if','ignore',
  'ill','illegal','imagine','immediate','impact','import','important','impose','improve',
  'in','incident','include','income','increase','indeed','independent','indicate',
  'individual','industry','inform','information','initial','injure','injury','inside',
  'insist','install','instance','instead','institution','interest','internal','into',
  'introduce','involve','iron','is','island','it','item','its','itself','jacket',
  'jail','job','join','joke','journey','joy','judge','jump','junior','just','keen',
  'keep','key','kid','kill','kind','king','kiss','kitchen','knee','knife','knock',
  'know','knowledge','lab','label','lack','lady','lake','land','language','large',
  'last','late','later','laugh','launch','law','lawyer','lay','layer','lazy','lead',
  'leader','leaf','lean','learn','least','leave','left','leg','legal','less','lesson',
  'let','letter','level','lie','life','lift','light','like','likely','limit','line',
  'link','lip','list','listen','little','live','location','lock','long','look','lord',
  'lose','loss','lot','loud','love','lovely','low','luck','lunch','machine','mad',
  'magazine','mail','main','maintain','major','make','male','mall','man','manage',
  'manner','manufacture','many','map','mark','market','marriage','mass','master','match',
  'material','mathematics','matter','may','maybe','mayor','meal','mean','measure',
  'meat','mechanism','media','medical','meet','meeting','member','memory','mention',
  'mercy','message','metal','method','middle','might','mild','mile','military','milk',
  'million','mind','mine','minute','mirror','miss','mission','mistake','mix','model',
  'modern','moment','money','month','mood','moon','moral','more','morning','most',
  'mother','motion','mountain','mouse','mouth','move','movie','Mrs','much','murder',
  'muscle','museum','music','must','mutual','my','myself','nail','name','narrow',
  'nation','national','natural','nature','near','nearby','nearly','neat','neck',
  'need','negative','negotiate','neither','nerve','net','network','never','new','news',
  'newspaper','next','nice','night','noble','noise','none','nor','normal','north',
  'nose','not','note','nothing','notice','novel','now','nuclear','number','nurse',
  'obey','object','observe','obtain','obvious','occur','ocean','odd','of','off',
  'offer','office','officer','official','often','oh','oil','old','on','once','one',
  'only','open','operate','opinion','oppose','option','or','orange','order','ordinary',
  'organ','organize','other','ought','our','ourselves','out','outcome','outside','over',
  'own','owner','pace','pack','package','page','pain','paint','pair','palace','pale',
  'panel','paper','parent','park','part','particular','partner','party','pass','passage',
  'past','path','patient','pattern','pause','pay','peace','peak','pen','pension','per',
  'percent','perfect','perform','perhaps','period','permit','person','personal','persuade',
  'pet','phone','photo','phrase','physical','piano','pick','picture','piece','pilot',
  'pink','pipe','place','plan','plane','plant','plate','platform','play','player',
  'please','pleasure','plenty','pocket','poem','poet','point','police','policy','polite',
  'political','poor','pop','popular','population','port','portion','pose','position',
  'positive','possess','possible','post','pot','pound','pour','poverty','power','practice',
  'praise','predict','prefer','prepare','present','preserve','press','pressure','pretty',
  'prevent','previous','price','pride','priest','prince','princess','principle','print',
  'prison','private','prize','probable','problem','proceed','process','produce','product',
  'production','professional','professor','profit','program','project','promise','promote',
  'proof','proper','property','proposal','propose','protect','protest','proud','prove',
  'provide','public','pull','punish','pupil','purchase','pure','purpose','pursue','push',
  'put','qualify','quality','quarter','queen','question','quick','quiet','quite','quote',
  'race','radio','rain','raise','range','rank','rapid','rare','rate','rather','raw',
  'reach','react','read','reader','ready','real','reality','realize','reason','receive',
  'recent','recognize','recommend','record','recover','recruit','red','reduce','refer',
  'reflect','reform','refuse','region','regret','regular','reject','relate','relation',
  'relative','relax','release','relevant','religion','rely','remain','remark','remedy',
  'remote','remove','rent','repair','repeat','replace','report','represent','republic',
  'request','require','reserve','resolve','respect','respond','response','responsible',
  'rest','restore','restrict','result','retain','retire','return','reveal','review',
  'revolution','reward','rice','rich','ride','right','ring','rise','risk','river',
  'road','rock','role','roll','roof','room','root','rope','rose','rough','round',
  'route','row','royal','rule','run','rush','sacred','sad','safe','sail','sake',
  'salary','sale','salt','same','sample','sand','satellite','satisfy','save','scene',
  'schedule','scheme','school','science','scope','score','screen','script','sculpture',
  'sea','search','season','seat','second','secret','section','sector','security','seek',
  'seem','segment','select','sell','senior','sense','sentence','series','serious',
  'serve','service','session','set','settle','settlement','seven','severe','sex',
  'sexual','shake','shall','shame','shape','share','sharp','she','sheet','shelf',
  'shell','shift','shine','ship','shirt','shock','shoot','shop','shore','short',
  'shot','shoulder','shout','show','shut','sick','side','sight','sign','signal',
  'significance','silly','silver','similar','simple','simply','since','sing','singer',
  'single','sir','sister','sit','site','situation','six','size','skill','skin',
  'sky','slave','sleep','slice','slide','slight','slip','slow','small','smart',
  'smell','smile','smoke','smooth','snap','snow','so','soap','soccer','social',
  'sock','soft','software','soil','solar','soldier','solid','solution','solve',
  'some','somebody','someday','somehow','someone','something','sometime','sometimes',
  'somewhat','son','song','soon','sophisticated','sorry','sort','soul','sound',
  'source','south','space','spare','speak','speaker','special','specific','speech',
  'speed','spell','spend','spill','spin','spirit','split','sponsor','sport',
  'spot','spread','spring','spy','square','stable','staff','stage','stake','stand',
  'standard','star','stare','start','state','statement','station','stay','steady',
  'steal','steam','steel','steep','stem','step','stick','still','stomach','stone',
  'stop','store','storm','story','straight','strange','strategy','stream','street',
  'strength','stress','stretch','strict','strike','string','stroke','strong','structure',
  'struggle','student','study','stuff','stupid','style','subject','succeed','success',
  'successful','such','sudden','suffer','sugar','suggest','suit','summer','sun',
  'supply','support','suppose','sure','surface','surgery','surprise','surround','survive',
  'suspect','sweet','swim','swing','switch','symbol','system','table','tactic','tail',
  'take','tale','talk','tall','tank','tape','target','task','taste','tax','tea',
  'teach','teacher','team','tear','technology','telephone','television','tell','temperature',
  'ten','tend','term','test','text','than','that','the','theater','their','them',
  'theme','themselves','then','theory','these','they','thick','thin','thing','think',
  'third','this','those','though','thought','thousand','threat','throat','through',
  'throw','thus','ticket','tidy','tie','tight','till','time','tiny','tip','tire',
  'tired','title','to','today','toe','together','tomorrow','tone','tongue','tonight',
  'too','tool','tooth','top','topic','total','touch','tough','tour','tourist',
  'toward','tower','town','track','trade','tradition','traditional','traffic','trail',
  'train','training','transfer','transform','translate','transport','trap','travel',
  'treat','treatment','treaty','tree','tremendous','trend','trial','tribe','trick',
  'trip','troop','trouble','truck','true','truly','trust','truth','try','tube',
  'tunnel','turn','twelve','twenty','twice','twin','two','type','typical','ugly',
  'ultimate','uncle','under','undergo','understand','unemployment','unfortunately',
  'unhappy','uniform','union','unique','unit','unite','universe','university','unknown',
  'unless','unlike','unlikely','until','unusual','up','update','upon','upper','upset',
  'urban','urge','us','use','used','useful','user','usual','usually','vacation',
  'valley','valuable','value','variable','variety','various','vast','vehicle','version',
  'very','vessel','victim','victory','video','view','village','violence','virtual',
  'visible','vision','visit','visitor','vital','voice','volume','vote','wage','wait',
  'wake','walk','wall','want','war','warm','warn','wash','waste','watch','water',
  'wave','way','we','weak','wealth','weapon','wear','weather','web','wedding',
  'week','weekend','weigh','weight','welcome','welfare','well','west','western',
  'wet','what','whatever','wheel','when','whenever','where','wherever','whether',
  'which','while','whisper','white','who','whole','whom','whose','why','wide',
  'widely','wife','wild','will','willing','win','wind','window','wing','winner',
  'winter','wire','wisdom','wise','wish','with','within','without','witness','woman',
  'wonder','wood','wooden','word','work','worker','working','works','workshop','world',
  'worry','worse','worst','worth','worthy','would','wound','wrap','write','writer',
  'writing','wrong','yard','yeah','year','yes','yesterday','yet','you','young',
  'your','youth','zero',
  // B2 - Upper Intermediate additions
  'abstract','academic','accelerate','acceptance','accompany','accountability',
  'accurate','achievement','acknowledge','acquire','adequate','advocate',
  'affirm','aggressive','allocate','alter','ambition','analogy','announce',
  'apparent','appetite','appliance','arbitrary','architect','assert',
  'asset','assume','attribute','authority','automatic','awareness',
  'bachelor','benchmark','bias','bond','boundary','budget','bulk',
  'burden','bureau','cabinet','campaign','capacity','category','challenge',
  'champion','channel','chapter','circumstance','civilian','classify',
  'client','coalition','collapse','combine','comfort','command','comment',
  'commit','commodity','communist','community','companion','compensate',
  'compile','complement','complex','component','compose','comprehensive',
  'compromise','compute','conceive','concentrate','concept','conclude',
  'concrete','condemn','conduct','confess','confidence','confine','confirm',
  'conflict','confront','congress','conscience','consensus','consent',
  'consequently','conservative','considerable','consist','constant',
  'constitute','construct','consult','consume','contemporary','contest',
  'context','contract','contradict','contribute','controversial','convention',
  'convert','convince','cooperate','corporate','correspond','council',
  'counsel','courage','coverage','craft','criterion','critic','crucial',
  'currency','curriculum','debate','decade','decent','deficit','delegate',
  'demonstrate','deny','depression','derive','deserve','designate','desire',
  'detect','devote','dimension','diplomatic','discipline','discriminate',
  'disorder','dispute','distinct','distribute','diverse','divine','domestic',
  'dominate','donate','dramatic','duration','dynamic','economy','edition',
  'editorial','educate','effectiveness','efficient','elaborate','eliminate',
  'embrace','emerge','emission','empire','empirical','enable','encounter',
  'encourage','enhance','enormous','enterprise','enthusiasm','entitle',
  'entity','entrepreneur','equivalent','era','erode','essential','estate',
  'ethnic','evolve','exceed','exceptional','exclusive','execute','exempt',
  'exhibit','expand','expedition','expense','experimental','explicit',
  'exploit','exploitation','expose','extensive','extent','extract','extreme',
  'fabric','facilitate','faculty','fate','federal','fee','fellowship',
  'fierce','fiscal','flag','flexible','float','flourish','folk','forecast',
  'forgive','formal','formation','formula','forth','fortune','fossil',
  'fraction','fragment','framework','frequency','friction','frontier',
  'fulfill','function','fund','fundamental','funeral','generous','genetic',
  'genius','genuine','gesture','global','govern','gradual','grant',
  'graphic','gravity','guarantee','guideline','guy','harmony','harsh',
  'hatred','heal','heritage','hierarchy','highlight','horizon','hostile',
  'humanity','hypothesis','identical','ideology','illusion','implement',
  'implicit','imply','impose','incentive','incorporate','indicate',
  'indigenous','individual','inevitable','infrastructure','initial',
  'innocent','innovation','input','insert','insight','inspect','inspire',
  'install','integrate','intellectual','intense','interact','interfere',
  'intermediate','internal','interpret','interval','intimate','invasion',
  'investigate','investor','invisible','involve','isolate','journal',
  'journalist','judicial','keen','label','laughter','launch','lawyer',
  'layout','leadership','legislation','legitimate','leisure','liberal',
  'liberty','literal','locate','logical','loyalty','lung','luxury',
  'machinery','magazine','maintain','majority','manifest','manipulate',
  'manner','manuscript','margin','marine','massive','mature','mechanism',
  'mediate','medium','membership','memorial','merchant','merit','metaphor',
  'military','mineral','minimal','ministry','minor','moderate','momentum',
  'monopoly','moral','mortgage','motivate','mount','multiple','mutual',
  'naked','narrative','neglect','negotiate','neutral','nonetheless',
  'norm','notion','nuclear','nursing','nutrition','objective','oblige',
  'observe','obtain','occupation','offend','ongoing','opponent','oppose',
  'opt','optimistic','option','organ','orient','outcome','outlook',
  'output','overall','overlook','ownership','oxygen','parallel','particle',
  'partnership','passage','passion','passive','patent','patience','patient',
  'patriotic','penalty','perceive','persist','persona','phenomenon','philosophy',
  'pioneer','policy','politician','portion','pose','positive','possess',
  'postpone','potential','poverty','practical','precede','precise','predict',
  'predominant','prejudice','preliminary','premium','prescribe','preservation',
  'preside','prestige','presume','prevail','primary','primitive','principal',
  'prior','privilege','proceed','processor','proclaim','productive','profession',
  'profile','profound','prohibit','project','prolong','prominent','prompt',
  'propaganda','proportion','prospect','prosperity','protocol','pursue',
  'radical','random','range','ratio','rational','react','recovery','reform',
  'regime','region','regulate','reinforce','reject','relevant','reluctant',
  'rely','remedy','remote','renew','repeated','reputation','request',
  'requirement','resemble','reside','resign','resist','resolution','resolve',
  'resort','resource','respond','restore','restrain','restrict','retain',
  'retire','retrieve','reveal','revenue','reverse','revise','revolution',
  'rhetoric','rigid','ritual','role','rotate','rough','routine','rural',
  'sacrifice','satellite','scheme','scope','scratch','sector','segment',
  'senior','sentiment','sequence','session','setback','settle','severity',
  'shadow','shelter','shift','shortage','shutdown','significant','simulate',
  'simultaneous','sink','skeptic','slavery','slender','slip','sole',
  'solidarity','somehow','somewhat','sophisticated','sovereign','span',
  'specialist','species','speculate','sphere','spiritual','spokesman',
  'sponsor','spot','stake','stance','stationary','statistic','steep',
  'stem','stimulus','straightforward','strain','strand','strategic',
  'strength','stress','strict','stride','strike','string','strip','stroke',
  'structural','subordinate','subsequent','substance','substantial','substitute',
  'subtle','succeed','successor','sue','suffer','sufficient','summarize',
  'summit','superior','supplement','survey','survival','suspect','suspend',
  'sustain','symbol','sympathy','symptom','synthesis','tactic','target',
  'technique','temporary','tension','terminal','terminate','terrific',
  'testimony','theme','theoretical','therapy','thereby','thesis','thorough',
  'threaten','threshold','throne','tighten','timber','tissue','tolerance',
  'toll','tone','topic','tornado','tough','toxic','trace','trademark',
  'tragedy','trait','transaction','transform','transmission','transplant',
  'treasure','treaty','tremendous','trend','trial','tribute','trigger',
  'triumph','troop','troubled','tumor','twist','ultimate','undergo',
  'underlie','undertake','unemployment','unprecedented','upgrade',
  'utility','vague','valid','variable','variation','vehicle','venture',
  'verbal','verify','version','veteran','via','victim','vigorous',
  'violate','violence','virtual','virtue','vision','visual','volume',
  'voluntary','volunteer','vulnerable','wage','wander','warn','wealth',
  'weapon','weave','welfare','whereby','whisper','widespread','wisdom',
  'withdraw','witness','workforce','workshop','worship','yield',
  // C1 - Advanced additions
  'aberration','abhor','abjure','abnegate','abrogate','abscond','abstain',
  'accolade','acquiesce','acrimony','admonish','adroit','adulation','advent',
  'aesthetic','affable','affluent','agrarian','alacrity','alleviate',
  'altruism','amalgamate','ambivalent','ameliorate','amiable','amicable',
  'anachronism','analogous','anecdote','anomaly','antecedent','anthropology',
  'antipathy','apathy','appease','apprehensive','aptitude','archaic',
  'arduous','articulate','ascetic','assiduous','astute','audacious',
  'auspicious','austere','avarice','avid','banal','bane','barren',
  'bellicose','belligerent','benign','beseech','bolster','bombastic',
  'bourgeois','brazen','brevity','bucolic','burgeon','cacophony',
  'cajole','calamity','callous','camaraderie','candor','capitulate',
  'capricious','catalyst','caustic','cavalier','cerebral','charlatan',
  'chicanery','circumscribe','circumvent','clandestine','clemency',
  'coalesce','cogent','cognizant','colloquial','commensurate','compendium',
  'complacent','compliant','compunction','concede','conceited','concoct',
  'concur','condescend','condone','confiscate','confluence','congenial',
  'connotation','conscientious','consecrate','consolidate','conspicuous',
  'construe','consummate','contiguous','contingent','contrite','conundrum',
  'converge','convoluted','copious','corroborate','cosmopolitan','credulous',
  'culminate','cursory','cynical','dearth','debase','debilitate',
  'decorum','deference','defunct','deleterious','deliberate','demagogue',
  'demure','denigrate','denounce','deplete','deprecate','deride',
  'derivative','despondent','despot','destitute','deter','detrimental',
  'deviate','dexterous','diaphanous','didactic','diffident','digress',
  'diligent','diminutive','disaffected','disavow','discreet','discrepancy',
  'disdain','disenfranchise','disparage','disparate','disseminate','dissident',
  'dissolution','divergent','dogmatic','dormant','dubious','duplicity',
  'ebullient','eclectic','effervescent','efficacious','effrontery','egalitarian',
  'egregious','elicit','eloquent','elucidate','elusive','emanate',
  'embellish','eminent','empathy','empirical','empiricism','emulate',
  'endemic','enigma','enigmatic','ennui','enormity','enrapture',
  'ensemble','enthral','epitome','equanimity','equivocal','eradicate',
  'erratic','esoteric','espouse','eulogize','euphemism','euphoria',
  'exasperate','exemplary','exemplify','exhort','exonerate','expedient',
  'exploit','exponential','expunge','exquisite','extol','extraneous',
  'facetious','facile','fallacious','fanatical','fastidious','fatuous',
  'fecund','felicitous','ferment','fervent','fickle','flagrant',
  'flippant','florid','foment','forbearance','fortuitous','fractious',
  'frivolous','frugal','furtive','futile','gainsay','garrulous',
  'germane','glut','grandiloquent','gregarious','grueling','hackneyed',
  'hapless','harangue','harbinger','hedonism','heresy','heretical',
  'hermetic','heterogeneous','histrionic','homogeneous','hubris','iconoclast',
  'idiosyncratic','ignominy','immutable','impasse','impeccable','imperious',
  'impervious','impertinent','impervious','implacable','implicit','importune',
  'impregnable','impromptu','impudent','impugn','inadvertent','inane',
  'incandescent','incendiary','incipient','incisive','inclement','inclined',
  'incongruous','incorporate','incorrigible','indelible','indigent','indolent',
  'indomitable','indulgent','ineffable','ineluctable','inept','inexorable',
  'infallible','ingenious','ingenuous','inherent','innate','innocuous',
  'inscrutable','insidious','insipid','insolent','insurgent','intangible',
  'intermittent','intrepid','intuitive','inundate','inveterate','irascible',
  'irreverent','itinerant','jubilant','judicious','jurisprudence','laconic',
  'languid','largesse','laudable','lethargic','levity','loquacious',
  'lucid','ludicrous','luminary','magnanimous','magnate','malcontent',
  'malediction','malevolent','malleable','maverick','meander','mellifluous',
  'mercenary','mercurial','meticulous','milieu','mitigate','modicum',
  'moribund','morose','mundane','munificent','myopic','nadir','nascent',
  'nebulous','negligent','nemesis','neophyte','nihilism','nobility',
  'nonchalant','nostalgia','notoriety','obdurate','obfuscate','oblique',
  'oblivious','obscure','obsequious','obstinate','obtuse','obviate',
  'onerous','onomatopoeia','opaque','opportune','opprobrium','ostensible',
  'ostentatious','palatable','palpable','panacea','panache','paradigm',
  'paragon','parochial','parsimonious','partisan','patronize','paucity',
  'pedantic','penchant','penitent','pensive','perceptive','perdition',
  'peremptory','perennial','perfidious','perfunctory','peripheral',
  'permeate','pernicious','perpetuate','perplex','persevere','pertinent',
  'peruse','pervasive','petulant','philanthropy','phlegmatic','placate',
  'platitude','plausible','plethora','polemical','pompous','ponderous',
  'portentous','pragmatic','prattle','precarious','precedent','precipitate',
  'precocious','predilection','preeminent','prepossessing','preposterous',
  'prerogative','presage','prescient','presumptuous','prevalent','primordial',
  'probity','prodigious','profane','profuse','prohibitive','prolific',
  'promulgate','propensity','propitious','propriety','prosaic','proscribe',
  'provenance','providence','provocative','prudent','pseudonym','puerile',
  'pugnacious','punctilious','punitive','quagmire','querulous','quiescent',
  'quintessential','quirky','ramification','rancor','rapacious','rapprochement',
  'rationale','rebuke','recalcitrant','recant','reciprocal','recluse',
  'reconcile','rectify','redolent','redundant','refute','reiterate',
  'remiss','remuneration','replete','reprehensible','reprimand','reproach',
  'repudiate','requisite','rescind','resolute','resonate','reticent',
  'revere','revile','revulsion','rhetoric','ribald','robust',
  'rudimentary','ruminate','rustic','sagacious','salient','salubrious',
  'sanction','sanguine','sardonic','satiate','savvy','scrupulous',
  'scrutinize','sequester','serendipity','servile','shrewd','simmer',
  'sinecure','skeptical','solicitous','soporific','specious','sporadic',
  'spurious','staid','stamina','steadfast','stoic','strident',
  'stringent','sublime','substantiate','succinct','superfluous','supplant',
  'supplicate','surreptitious','sycophant','sylvan','tacit','taciturn',
  'tangential','tantamount','taut','temerity','temperate','tenacious',
  'tenet','tepid','terse','tirade','torpid','tractable',
  'transient','trepidation','truculent','turgid','turpitude','ubiquitous',
  'umbrage','unassuming','unctuous','undulate','unequivocal','unfathomable',
  'unimpeachable','untenable','urbane','usurp','utilitarian','utopian',
  'vacillate','vapid','vehement','venerate','verbose','veritable',
  'vernacular','versatile','vicarious','vilify','virulent','visceral',
  'vitriolic','vociferous','voluble','voracious','wanton','winsome',
  'zealous'
];

// Deduplicate
const uniqueWords = [...new Set(WORD_LIST.map(w => w.toLowerCase()))];

console.log(`Unique words to process: ${uniqueWords.length}`);

// Batch fetch from free dictionary API
async function fetchWord(word) {
  return new Promise((resolve, reject) => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              resolve(parsed[0]);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function extractData(raw, word) {
  if (!raw) return null;
  
  const phonetics = raw.phonetics?.find(p => p.audio && p.text)?.text || 
                    raw.phonetics?.[0]?.text || '';
  const audio = raw.phonetics?.find(p => p.audio)?.audio || '';
  
  const meanings = raw.meanings || [];
  const allDefinitions = [];
  const synonyms = new Set();
  const antonyms = new Set();
  let partOfSpeech = 'noun';
  
  for (const meaning of meanings) {
    if (meaning.partOfSpeech) partOfSpeech = meaning.partOfSpeech;
    
    for (const def of (meaning.definitions || []).slice(0, 2)) {
      if (def.definition) allDefinitions.push(def.definition);
      if (def.synonyms) def.synonyms.forEach(s => synonyms.add(s));
      if (def.antonyms) def.antonyms.forEach(a => antonyms.add(a));
    }
    
    if (meaning.synonyms) meaning.synonyms.forEach(s => synonyms.add(s));
    if (meaning.antonyms) meaning.antonyms.forEach(a => antonyms.add(a));
  }
  
  if (allDefinitions.length === 0) return null;
  
  return {
    word: raw.word,
    phonetic: phonetics,
    audioUrl: audio,
    partOfSpeech,
    definitions: allDefinitions,
    synonyms: [...synonyms].slice(0, 8),
    antonyms: [...antonyms].slice(0, 5),
  };
}

// Classify difficulty based on word frequency/commonness
function classifyDifficulty(word, index) {
  const len = word.length;
  if (len <= 4) return 'beginner';
  if (len <= 6 && index < 500) return 'beginner';
  if (len <= 7 && index < 1200) return 'intermediate';
  if (index < 1800) return 'intermediate';
  return 'advanced';
}

function classifyCEFR(difficulty) {
  switch(difficulty) {
    case 'beginner': return 'A1';
    case 'intermediate': return 'B1';
    case 'advanced': return 'C1';
    default: return 'B1';
  }
}

function getFrequency(index) {
  if (index < 200) return 'very-common';
  if (index < 600) return 'common';
  if (index < 1400) return 'uncommon';
  return 'rare';
}

function getWordForms(word, pos) {
  const forms = {};
  if (pos === 'verb') {
    if (word.endsWith('e')) {
      forms.pastTense = word + 'd';
      forms.pastParticiple = word + 'd';
    } else if (word.endsWith('y')) {
      forms.pastTense = word.slice(0, -1) + 'ied';
    } else if (!['spread','put','cut','set','let','hit','run','shut'].includes(word)) {
      forms.pastTense = word + 'ed';
    }
  }
  if (pos === 'adjective') {
    if (word.endsWith('e')) {
      forms.comparative = word + 'r';
      forms.superlative = word + 'st';
    } else if (word.length <= 6) {
      forms.adverb = word + 'ly';
    }
  }
  if (pos === 'noun' && !word.endsWith('s')) {
    forms.plural = word + 's';
  }
  return forms;
}

function getSyllables(word) {
  // Simple syllable estimation
  const vowels = 'aeiouy';
  const syllables = [];
  let current = '';
  let prevWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    current += word[i];
    if (!isVowel && prevWasVowel && i < word.length - 1) {
      syllables.push(current);
      current = '';
    }
    prevWasVowel = isVowel;
  }
  if (current) syllables.push(current);
  
  return syllables.length > 0 ? syllables : [word];
}

async function main() {
  const results = [];
  const batchSize = 10;
  
  for (let i = 0; i < uniqueWords.length; i += batchSize) {
    const batch = uniqueWords.slice(i, i + batchSize);
    const promises = batch.map(w => fetchWord(w).then(raw => ({ word: w, raw })));
    const batchResults = await Promise.all(promises);
    
    for (const { word, raw } of batchResults) {
      const data = extractData(raw, word);
      if (data) {
        const difficulty = classifyDifficulty(word, i);
        results.push({
          slug: word,
          word: data.word.charAt(0).toUpperCase() + data.word.slice(1),
          phonetic: data.phonetic,
          audioUrl: data.audioUrl,
          partOfSpeech: data.partOfSpeech,
          definitions: {
            simple: data.definitions[0] || '',
            full: data.definitions.join(' ') || data.definitions[0] || '',
          },
          examples: [],
          synonyms: data.synonyms,
          antonyms: data.antonyms,
          relatedWords: [],
          wordForms: getWordForms(word, data.partOfSpeech),
          syllables: getSyllables(word),
          difficulty,
          vocabularyLevel: classifyCEFR(difficulty),
          category: 'General',
          frequency: getFrequency(i),
          quizEligible: true,
          gameEligible: true,
        });
      }
    }
    
    if ((i / batchSize) % 10 === 0) {
      console.log(`Processed ${Math.min(i + batchSize, uniqueWords.length)}/${uniqueWords.length}...`);
    }
    
    // Small delay to be polite to the API
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`Total words with data: ${results.length}`);
  
  // Write output
  const output = `// Auto-generated word database
// Generated from free dictionary API (https://dictionaryapi.dev/)
// License: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
// ${results.length} words

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
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare';
  quizEligible: boolean;
  gameEligible: boolean;
}

export const WORDS: WordEntry[] = ${JSON.stringify(results, null, 2)};

export function getAllWords(): WordEntry[] {
  return WORDS;
}

export function getWordBySlug(slug: string): WordEntry | undefined {
  return WORDS.find(w => w.slug === slug);
}

export function getAllSlugs(): string[] {
  return WORDS.map(w => w.slug);
}

export function getWordsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): WordEntry[] {
  return WORDS.filter(w => w.difficulty === difficulty);
}

export function getWordsByLevel(level: string): WordEntry[] {
  return WORDS.filter(w => w.vocabularyLevel === level);
}

export function getWordsByCategory(category: string): WordEntry[] {
  return WORDS.filter(w => w.category === category);
}

export function getGameWords(): WordEntry[] {
  return WORDS.filter(w => w.gameEligible);
}

export function getDailyChallenge(): WordEntry {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return WORDS[dayOfYear % WORDS.length];
}

export const categories = [...new Set(WORDS.map(w => w.category))].sort();
`;

  fs.writeFileSync(path.join(__dirname, 'src/lib/words-auto.ts'), output);
  console.log('Written to src/lib/words-auto.ts');
}

main().catch(console.error);
