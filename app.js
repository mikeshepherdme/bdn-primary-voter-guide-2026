// BDN Maine 2026 Primary Voter Guide — app.js

// ── Constants ─────────────────────────────────────────────────────────────────

const RACES = [
  {
    id: 'senate-dem',
    title: 'U.S. Senate',
    subtitle: 'Democratic Primary',
    office: 'Senate',
    party: 'Democrat',
    opponent: {
      name: 'Susan Collins',
      party: 'Republican',
      label: 'Five-term Republican incumbent',
    },
  },
  {
    id: 'governor-dem',
    title: 'Governor',
    subtitle: 'Democratic Primary',
    office: 'Governor',
    party: 'Democrat',
    opponent: null,
  },
  {
    id: 'governor-rep',
    title: 'Governor',
    subtitle: 'Republican Primary',
    office: 'Governor',
    party: 'Republican',
    opponent: null,
  },
  {
    id: 'cd1-rep',
    title: 'CD-1',
    fullTitle: '1st Congressional District',
    subtitle: 'Republican Primary',
    office: '1st District',
    party: 'Republican',
    opponent: {
      name: 'Chellie Pingree',
      party: 'Democrat',
      label: 'Nine-term Democratic incumbent',
    },
  },
  {
    id: 'cd2-dem',
    title: 'CD-2',
    fullTitle: '2nd Congressional District',
    subtitle: 'Democratic Primary',
    office: '2nd District',
    party: 'Democrat',
    opponent: {
      name: 'Paul LePage',
      party: 'Republican',
      label: 'Republican nominee',
      sublabel: 'Former two-term governor',
    },
  },
];

const TOPICS = {
  costs_affordability:  'Costs & Affordability',
  housing:              'Housing',
  healthcare:           'Healthcare',
  education:            'Education',
  economy_jobs:         'Economy & Jobs',
  immigration:          'Immigration',
  crime_public_safety:  'Crime & Public Safety',
  threats_to_democracy: 'Threats to Democracy',
  civil_liberties:      'Civil Liberties',
  foreign_policy:       'Foreign Policy',
  environment_climate:  'Environment & Climate',
  reproductive_rights:  'Reproductive Rights',
  trump_opposition:     'Opposition to Trump',
};

const TOPIC_SHORT = {
  costs_affordability:  'Affordability',
  economy_jobs:         'Economy & Jobs',
  housing:              'Housing',
  healthcare:           'Healthcare',
  education:            'Education',
  environment_climate:  'Environment',
  civil_liberties:      'Civil liberties',
  immigration:          'Immigration',
  crime_public_safety:  'Public Safety',
  threats_to_democracy: 'Democracy',
  foreign_policy:       'Foreign Policy',
  reproductive_rights:  'Reproductive Rights',
  trump_opposition:     'Trump opposition',
};

const TOPIC_EMOJI = {
  trump_opposition:     '✊',
  costs_affordability:  '🧾',
  economy_jobs:         '📈',
  healthcare:           '🩺',
  civil_liberties:      '🗽',
  foreign_policy:       '🗺️',
  threats_to_democracy: '⚖️',
  housing:              '🏠',
  education:            '🍎',
  immigration:          '🛂',
  crime_public_safety:  '🚨',
  environment_climate:  '🌿',
  reproductive_rights:  '🏥',
};

// Top 6 topics shown in the inline card expand, ordered by race context.
// All topics remain visible on Compare pages.
const PRIORITY_TOPICS = {
  'Democrat-federal':   ['trump_opposition','costs_affordability','healthcare','civil_liberties','foreign_policy','threats_to_democracy'],
  'Democrat-state':     ['trump_opposition','costs_affordability','economy_jobs','housing','healthcare','education'],
  'Republican-federal': ['costs_affordability','immigration','healthcare','crime_public_safety','foreign_policy'],
  'Republican-state':   ['costs_affordability','economy_jobs','housing','healthcare','education','crime_public_safety'],
};

function emojiForTopic(label) {
  if (!label) return '';
  const norm = s => s.toLowerCase().replace(/[&\/]/g, '').replace(/\s+/g, ' ').trim();
  const normLabel = norm(label);
  const labelWords = new Set(normLabel.split(' '));
  let entry = Object.entries(TOPICS).find(([, name]) => normLabel.startsWith(norm(name)));
  if (!entry) {
    entry = Object.entries(TOPICS).find(([, name]) => {
      const firstSignificant = norm(name).split(' ').find(w => w.length > 3);
      return firstSignificant && labelWords.has(firstSignificant);
    });
  }
  return entry ? (TOPIC_EMOJI[entry[0]] || '') : '';
}

function getPriorityTopics(race) {
  if (!race) return Object.keys(TOPICS);
  const level = race.office === 'Governor' ? 'state' : 'federal';
  return PRIORITY_TOPICS[`${race.party}-${level}`] || Object.keys(TOPICS);
}

const MAX_COMPARE = 2;

// ── Source label display names ────────────────────────────────────────────────
const SOURCE_LABELS = {
  // Colby College town halls (slug form)
  'colby_th_angus_king_2026-02-26':         'Colby College Town Hall, Feb. 26, 2026',
  'colby_th_graham_platner_2026-02-19':     'Colby College Town Hall, Feb. 19, 2026',
  'colby_th_hannah_pingree_2026-03-12':     'Colby College Town Hall, March 12, 2026',
  'colby_th_janet_mills_2026-03-19':        'Colby College Town Hall, March 19, 2026',
  'colby_th_shenna_bellows_2026-04-02':     'Colby College Town Hall, April 2, 2026',
  'colby_th_troy_jackson_2026-02-12':       'Colby College Town Hall, Feb. 12, 2026',
  // Colby College town halls (human-readable form)
  'Colby College Democrats interview, 2026-02-12': 'Colby College Town Hall, Feb. 12, 2026',
  'Colby College Democrats interview, 2026-02-19': 'Colby College Town Hall, Feb. 19, 2026',
  'Colby College Democrats interview, 2026-02-26': 'Colby College Town Hall, Feb. 26, 2026',
  'Colby College Democrats interview, 2026-03-12': 'Colby College Town Hall, March 12, 2026',
  'Colby College Democrats interview, 2026-03-19': 'Colby College Town Hall, March 19, 2026',
  'Colby College Democrats interview, 2026-04-02': 'Colby College Town Hall, April 2, 2026',
  // Common Sense debates
  'common_sense_debate_2026-03-10':         'Common Sense, March 10, 2026',
  'common_sense_gov_rep_debate_2025-09-16': 'Common Sense, Sept. 16, 2025',
  // Maine Policy Institute (slug form)
  'mpi_ben_midgley_2025-10-18':             'Maine Policy Institute, Oct. 18, 2025',
  'mpi_david_jones_2025-06-27':             'Maine Policy Institute, June 27, 2025',
  'mpi_garrett_mason_2026-02-17':           'Maine Policy Institute, Feb. 17, 2026',
  'mpi_jonathan_bush_2026-01-14':           'Maine Policy Institute, Jan. 14, 2026',
  'mpi_owen_mccarthy_2025-07-11':           'Maine Policy Institute, July 11, 2025',
  'mpi_robert_wessels_2026-03-05':          'Maine Policy Institute, March 5, 2026',
  // Maine Policy Institute (human-readable form)
  'Maine Policy Institute interview, 2025-04-19': 'Maine Policy Institute, April 19, 2025',
  'Maine Policy Institute interview, 2025-06-27': 'Maine Policy Institute, June 27, 2025',
  'Maine Policy Institute interview, 2025-07-11': 'Maine Policy Institute, July 11, 2025',
  'Maine Policy Institute interview, 2025-10-18': 'Maine Policy Institute, Oct. 18, 2025',
  'Maine Policy Institute interview, 2026-01-14': 'Maine Policy Institute, Jan. 14, 2026',
  'Maine Policy Institute interview, 2026-02-17': 'Maine Policy Institute, Feb. 17, 2026',
  'Maine Policy Institute interview, 2026-03-13': 'Maine Policy Institute, March 13, 2026',
  // CBS13/BDN debates
  'cbs13_bdn_gov_dem_debate_2026-05-08':    'CBS13/BDN Debate, May 8, 2026',
  'cbs13_bdn_gov_rep_debate_2026-05-08':    'CBS13/BDN Debate, May 8, 2026',
  // WMTW debates
  'wmtw_cd2_dem_debate_2026-04-28':         'WMTW, April 28, 2026',
  'wmtw_gov_dem_debate_2026-04-30':         'WMTW, April 30, 2026',
  // Misc
  'interview, 2025-07-23':                  'BDN Interview, July 23, 2025',
};

// Source ID → canonical URL (for non-video quotes that have no url field)
const SOURCE_URLS = {
  'colby_th_angus_king_2026-02-26':         'https://www.youtube.com/watch?v=mopCKOu8xBs',
  'colby_th_graham_platner_2026-02-19':     'https://www.youtube.com/watch?v=Xfm-TVCtE5Q',
  'colby_th_hannah_pingree_2026-03-12':     'https://www.youtube.com/watch?v=orwjWNv2gJo',
  'colby_th_janet_mills_2026-03-19':        'https://www.youtube.com/watch?v=coe0sHxzZYM',
  'colby_th_shenna_bellows_2026-04-02':     'https://www.youtube.com/watch?v=whoAVLCeTXQ',
  'colby_th_troy_jackson_2026-02-12':       'https://www.youtube.com/watch?v=5H3Pu6rClrE',
  'Colby College Democrats interview, 2026-02-12': 'https://www.youtube.com/watch?v=5H3Pu6rClrE',
  'Colby College Democrats interview, 2026-02-19': 'https://www.youtube.com/watch?v=Xfm-TVCtE5Q',
  'Colby College Democrats interview, 2026-02-26': 'https://www.youtube.com/watch?v=mopCKOu8xBs',
  'Colby College Democrats interview, 2026-03-12': 'https://www.youtube.com/watch?v=orwjWNv2gJo',
  'Colby College Democrats interview, 2026-03-19': 'https://www.youtube.com/watch?v=coe0sHxzZYM',
  'Colby College Democrats interview, 2026-04-02': 'https://www.youtube.com/watch?v=whoAVLCeTXQ',
  'common_sense_debate_2026-03-10':         'https://www.youtube.com/watch?v=6p0n7zof9JM',
  'common_sense_gov_rep_debate_2025-09-16': 'https://www.youtube.com/watch?v=7Xuga65-dBk',
  'mpi_ben_midgley_2025-10-18':             'https://www.youtube.com/watch?v=GUCIyqpnNzk',
  'mpi_david_jones_2025-06-27':             'https://www.youtube.com/watch?v=Y0qrGTQNwms',
  'mpi_garrett_mason_2026-02-17':           'https://www.youtube.com/watch?v=wZEKvy27kU4',
  'mpi_jonathan_bush_2026-01-14':           'https://www.youtube.com/watch?v=djsIlB50zKI',
  'mpi_owen_mccarthy_2025-07-11':           'https://www.youtube.com/watch?v=ttvRxtbVKno',
  'mpi_robert_wessels_2026-03-05':          'https://www.youtube.com/watch?v=Ejb_JQ2Zcuc',
  'Maine Policy Institute interview, 2025-04-19': 'https://www.youtube.com/watch?v=djsIlB50zKI',
  'Maine Policy Institute interview, 2025-06-27': 'https://www.youtube.com/watch?v=Y0qrGTQNwms',
  'Maine Policy Institute interview, 2025-07-11': 'https://www.youtube.com/watch?v=ttvRxtbVKno',
  'Maine Policy Institute interview, 2025-10-18': 'https://www.youtube.com/watch?v=GUCIyqpnNzk',
  'Maine Policy Institute interview, 2026-01-14': 'https://www.youtube.com/watch?v=djsIlB50zKI',
  'Maine Policy Institute interview, 2026-02-17': 'https://www.youtube.com/watch?v=wZEKvy27kU4',
  'Maine Policy Institute interview, 2026-03-13': 'https://www.youtube.com/watch?v=Ejb_JQ2Zcuc',
  'wmtw_cd2_dem_debate_2026-04-28':         'https://www.youtube.com/watch?v=b5EkoUQxiNg',
  'wmtw_gov_dem_debate_2026-04-30':         'https://www.youtube.com/watch?v=__T6ZQTepcw',
  'cbs13_bdn_gov_dem_debate_2026-05-08':    'https://www.youtube.com/watch?v=I6cn_vYt4gU',
  'cbs13_bdn_gov_rep_debate_2026-05-08':    'https://www.youtube.com/watch?v=0F7q2tBdVAU',
};

const MONTHS = ['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];

function dateFromUrl(url) {
  if (!url) return null;
  const m = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (!m) return null;
  return `${MONTHS[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}, ${m[1]}`;
}

function prettyLabel(label, url) {
  if (!label) return label;
  label = label.trim();
  if (SOURCE_LABELS[label]) return SOURCE_LABELS[label];
  // For news article labels like 'Outlet: "Headline"', strip the headline and append date from URL
  const m = label.match(/^([^:"]+):\s*["""].+$/);
  if (m) {
    const outlet = m[1].trim();
    const date   = dateFromUrl(url);
    return date ? `${outlet}, ${date}` : outlet;
  }
  return label;
}

// ── State ─────────────────────────────────────────────────────────────────────
let candidates = [];
let compareNames = [];   // ordered list of names in compare set
let policyDiffs        = [];   // loaded from policy_differences.json
let candidateRelations = [];   // loaded from candidate_relationships.json

// ── Utilities ─────────────────────────────────────────────────────────────────
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Per-candidate object-position overrides — bypasses FaceDetector when set.
const PHOTO_POSITION_OVERRIDE = {
  'Chellie Pingree': { position: 'center center', fit: 'contain' },
  'Paul LePage': 'center 50%',
  'Susan Collins': 'center 47%',
};

// Smart face crop — centers object-position on the detected face.
// Falls back to center 20% (good default for headshots) if FaceDetector
// is unavailable or finds no face.
async function smartCrop(img) {
  const override = PHOTO_POSITION_OVERRIDE[img.alt];
  if (override) {
    if (typeof override === 'object') {
      img.style.objectPosition = override.position;
      if (override.fit) img.style.objectFit = override.fit;
    } else {
      img.style.objectPosition = override;
    }
    return;
  }
  img.style.objectPosition = 'center 20%';
  if (!('FaceDetector' in window)) return;
  try {
    const faces = await new FaceDetector({ fastMode: true }).detect(img);
    if (!faces.length) return;
    const box = faces[0].boundingBox;
    const cx  = ((box.x + box.width  / 2) / img.naturalWidth  * 100).toFixed(1);
    const cy  = ((box.y + box.height / 2) / img.naturalHeight * 100).toFixed(1);
    img.style.objectPosition = `${cx}% ${cy}%`;
  } catch (_) {}
}

const CANDIDATE_PHOTOS = {
  'Angus King III':    'candidate-photos/King.JPG',
  'Ben Midgley':       'candidate-photos/Midgley.jpg',
  'Bobby Charles':     'candidate-photos/Charles.JPG',
  'Chellie Pingree':   'candidate-photos/chellie-pingree.jpg',
  'David Costello':    'candidate-photos/Costello.PNG',
  'David Jones':       'candidate-photos/Jones.JPEG',
  'Garrett Mason':     'candidate-photos/Mason.jpg',
  'Graham Platner':    'candidate-photos/Platner.JPG',
  'Janet Mills':       'candidate-photos/Mills.jpg',
  'Hannah Pingree':    'candidate-photos/Hannah_Pingree.JPG',
  'Joe Baldacci':      'candidate-photos/Baldacci.jpg',
  'Jonathan Bush':     'candidate-photos/Bush.JPG',
  'Jordan Wood':       'candidate-photos/Wood.JPG',
  'Joshua Pietrowicz': 'candidate-photos/pietrowicz.jpeg',
  'Matt Dunlap':       'candidate-photos/Dunlap.JPG',
  'Nirav Shah':        'candidate-photos/Shah.JPG',
  'Owen McCarthy':     'candidate-photos/McCarthy.jpg',
  'Paige Loud':        'candidate-photos/Loud.PNG',
  'Paul LePage':       'candidate-photos/LePage.jpg',
  'Robert Wessels':    'candidate-photos/Wessels.jpg',
  'Ronald Russell':    'candidate-photos/Russell.png',
  'Shenna Bellows':    'candidate-photos/Bellows.JPG',
  'Susan Collins':     'candidate-photos/Collins2.jpg',
  'Troy Jackson':      'candidate-photos/Jackson.JPG',
};

function initials(name) {
  return name.split(/\s+/).filter(w => /^[A-Z]/i.test(w)).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

function getRace(id) {
  return RACES.find(r => r.id === id) || null;
}

function getRaceCandidates(raceId) {
  const race = getRace(raceId);
  if (!race) return [];
  return candidates.filter(c =>
    c.office === race.office &&
    c.party  === race.party  &&
    (c.topics_covered || 0) > 0 &&
    !c.dropped_out
  ).sort((a, b) => (a.suspended ? 1 : 0) - (b.suspended ? 1 : 0));
}

function getCandidateBySlug(slug) {
  return candidates.find(c => slugify(c.name) === slug) || null;
}

function formatTs(secs) {
  if (secs == null) return '';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

// Classify a single quote for badge display
function classifyQuote(q) {
  if (q == null) return 'statement';
  if (typeof q === 'object' && q.embed_url) return 'video';
  const text   = typeof q === 'string' ? q : (q.text || '');
  const source = typeof q === 'object' ? (q.source || '') : '';

  // Heuristic: if the source label contains an outlet marker (colon not followed by
  // "interview"/"debate"/"podcast"/"town hall") it came from a news article.
  const isArticle = source.includes(':') &&
    !/(interview|debate|podcast|town\s?hall)/i.test(source);

  if (isArticle) {
    return (text.startsWith('"') || text.startsWith('“')) ? 'direct' : 'attributed';
  }
  return (text.startsWith('"') || text.startsWith('“')) ? 'direct' : 'statement';
}

function getBestQuote(quotes) {
  if (!quotes || quotes.length === 0) return null;
  for (const type of ['video', 'direct', 'attributed', 'statement']) {
    const q = quotes.find(q => classifyQuote(q) === type);
    if (q) return q;
  }
  return quotes[0];
}

// Citation priority: 0=timestamped video, 1=BDN, 2=campaign/Maine Public,
// 3=other media, 4=Maine Morning Star (last resort)
function citationScore(urlOrSrc) {
  const s = (urlOrSrc || '').toLowerCase();
  if (!s) return 3;
  if (s.includes('bangordailynews')) return 1;
  if (s.includes('mainemorningstar')) return 4;
  if (s.includes('mainepublic') || s.includes('maine.gov') ||
      s.includes('campaign') || /\.(com|org|net)\/[a-z-]+\/?(#|$)/.test(s)) return 2;
  return 3;
}

function quoteScore(q) {
  if (!q || typeof q !== 'object') return 3;
  if (q.embed_url) return 0;
  return citationScore(q.url) || citationScore(q.source);
}

function bulletScore(b) {
  if (!b || typeof b !== 'object') return 3;
  if (b.timestamp_seconds != null) return 0;
  const s = citationScore(b.source_url);
  return s !== 3 ? s : citationScore(b.source_label);
}

// ── URL / Routing ─────────────────────────────────────────────────────────────
function parseHash() {
  const hash  = location.hash.replace(/^#\/?/, '');
  const [pathPart, qsPart] = hash.split('?');
  const parts  = pathPart ? pathPart.split('/').filter(Boolean) : [];
  const params = new URLSearchParams(qsPart || '');
  return { parts, params };
}

function go(path, params) {
  const qs = params && params.toString() ? '?' + params.toString() : '';
  location.hash = '/' + path + qs;
}

function replaceHash(path, params) {
  const qs = params && params.toString() ? '?' + params.toString() : '';
  history.replaceState(null, '', location.pathname + '#/' + path + qs);
}

function compareParams() {
  const p = new URLSearchParams();
  if (compareNames.length > 0) p.set('c', compareNames.join(','));
  return p;
}

// ── Render dispatcher ─────────────────────────────────────────────────────────
function render() {
  const { parts, params } = parseHash();
  const main = document.getElementById('main');
  const bc   = document.getElementById('breadcrumb');

  // Restore compare names from URL query string on deep-link
  if (params.get('c') && compareNames.length === 0) {
    compareNames = params.get('c').split(',').filter(Boolean);
  }

  if (parts.length === 0) {
    bc.innerHTML = '';
    renderHome(main);
  } else {
    const race = getRace(parts[0]);
    if (!race) return renderHome(main);
    bc.innerHTML = crumbs([{ label: 'Home', href: '#/' }, { label: race.fullTitle || race.title }]);
    renderRace(main, race);
    if (compareNames.length > 0) refreshCompareSection(race.id);
  }

  updateCompareTray(parts[0] || '');
  sanitizeMain();
}

function sanitizeMain() {
  const main = document.getElementById('main');
  if (!main || !main.innerHTML.includes('Deeke-DeLocks')) return;
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes('Deeke-DeLocks')) {
      node.textContent = node.textContent
        .replace(/the Deeke-DeLocks bill/gi, 'the bill')
        .replace(/Deeke-DeLocks\s+bill/gi, 'the bill')
        .replace(/Deeke-DeLocks/gi, '');
    }
  }
}

function crumbs(items) {
  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    const label  = isLast ? `<span class="crumb-current">${item.label}</span>` : `<a href="${item.href}">${item.label}</a>`;
    return i > 0 ? `<span class="sep">›</span>${label}` : label;
  }).join('');
}

// ── Home ──────────────────────────────────────────────────────────────────────
function renderHome(main) {
  const cards = RACES.map(race => {
    const cands      = getRaceCandidates(race.id);
    const pClass     = race.party === 'Democrat' ? 'dem' : 'rep';
    const stripeClass= race.party === 'Democrat' ? 'stripe-dem' : 'stripe-rep';

    const candPhotos = cands.map(c => {
      const photo     = CANDIDATE_PHOTOS[c.name];
      const nameParts = c.name.split(' ').filter(w => !/^(I{1,3}|IV|V?I{0,3}|Jr\.?|Sr\.?)$/i.test(w));
      const firstName = nameParts[nameParts.length - 1];
      const photoEl   = photo
        ? `<img src="${photo}" alt="${c.name}" onload="smartCrop(this)">`
        : `<span class="home-cand-initials">${initials(c.name)}</span>`;
      return `<div class="home-cand-chip">
        <div class="home-cand-photo">${photoEl}</div>
        <span class="home-cand-name">${firstName}</span>
      </div>`;
    }).join('');

    return `
      <div class="race-card" onclick="go('${race.id}')">
        <div class="race-card-stripe ${stripeClass}"></div>
        <div class="race-card-header">
          <div class="race-card-title">${race.fullTitle || race.title}</div>
          <div class="race-card-sub">${race.subtitle}</div>
        </div>
        <div class="race-card-body">
          <div class="home-cand-strip">${candPhotos}</div>
        </div>
      </div>`;
  }).join('');

  main.innerHTML = `
    <div class="home-intro">
      <h1>Maine 2026<br>Primary Voter Guide</h1>
      <p>Where do the candidates stand? Explore positions on 13 issues drawn from debates, interviews and news coverage. Select a race to begin.</p>
    </div>
    <div class="race-grid">${cards}</div>`;
}

// ── Race view ─────────────────────────────────────────────────────────────────
function renderRace(main, race) {
  const cands = getRaceCandidates(race.id);
  const opp   = race.opponent;

  const oppPanel = opp ? (() => {
    const pClass  = opp.party === 'Democrat' ? 'dem' : 'rep';
    const photo   = CANDIDATE_PHOTOS[opp.name];
    const photoEl = photo
      ? `<img src="${photo}" alt="${opp.name}" onload="smartCrop(this)">`
      : `<div class="opp-photo-initials">${initials(opp.name)}</div>`;
    return `
      <aside class="opp-panel">
        <div class="opp-eyebrow">General election opponent</div>
        <div class="opp-card opp-card-${pClass}">
          <div class="opp-info">
            <div class="opp-name">${opp.name}</div>
            <div class="opp-label">${opp.label}</div>
            ${opp.sublabel ? `<div class="opp-sublabel">${opp.sublabel}</div>` : ''}
          </div>
          <div class="opp-photo">${photoEl}</div>
        </div>
      </aside>`;
  })() : '';

  const suspendedNotice = cands.some(c => c.suspended) ? `
    <div class="suspension-notice">
      <strong>Note:</strong> Janet Mills suspended her campaign on April 30, 2026, but has not filed paperwork to formally withdraw from the race and will still appear on the June ballot.
    </div>` : '';

  main.innerHTML = `
    <div class="race-page-wrap${opp ? ' has-opponent' : ''}">
      <div class="race-main">
        <h1 class="race-title">${race.fullTitle || race.title}</h1>
        <div class="race-subtitle">${race.subtitle} &nbsp;·&nbsp; ${cands.length} candidates</div>
        <div class="candidate-grid" id="cand-grid">${cands.map(c => candidateCardHtml(c, race.id)).join('')}</div>
        <div id="compare-inline" class="compare-inline hidden"></div>
        ${suspendedNotice}
      </div>
      ${oppPanel}
    </div>`;

  initDrag(race.id);
}

// ── Candidates tab ────────────────────────────────────────────────────────────
function renderCandidatesTab(el, cands, raceId) {
  el.innerHTML = `<div class="candidate-grid" id="cand-grid">${cands.map(c => candidateCardHtml(c, raceId)).join('')}</div>`;
  initDrag(raceId);
}

function candidateCardHtml(c, raceId) {
  const slug    = slugify(c.name);
  const inCmp   = compareNames.includes(c.name);
  const photo   = CANDIDATE_PHOTOS[c.name];
  const photoEl = photo
    ? `<img src="${photo}" alt="${c.name}" onload="smartCrop(this)">`
    : `<div class="card-photo-initials">${initials(c.name)}</div>`;

  return `
    <div class="candidate-card draggable${c.suspended ? ' suspended-card' : ''}"
         draggable="true"
         data-cand="${esc(c.name)}">
      <div class="card-header-row">
        <div class="card-photo-b">
          ${photoEl}
          <span class="avatar-drag-hint" title="Drag to compare">⠿</span>
        </div>
        <div class="candidate-card-body">
          <div class="cand-name">${c.name}${c.suspended ? ' <span class="badge-suspended">Campaign suspended</span>' : ''}</div>
          ${(c.signature_topics && c.signature_topics.length) ? `<div class="sig-topics"><span class="sig-topics-label">Focuses:</span>${c.signature_topics.map(k => `<span class="sig-topic">${TOPIC_EMOJI[k] || ''} ${TOPIC_SHORT[k] || k}</span>`).join('')}</div>` : ''}
          <div class="candidate-card-footer">
            <button class="btn-outline" style="font-size:0.74rem;padding:5px 10px"
                    onclick="expandCandCard('${esc(c.name)}','${raceId}',this)">View ▾</button>
            <button class="btn-compare ${inCmp ? 'active' : ''}"
                    data-cand="${esc(c.name)}"
                    onclick="event.stopPropagation();toggleCompare('${esc(c.name)}','${raceId}')">
              ${inCmp ? '✓ In compare' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>
      <div class="card-expand-body" id="cand-expand-${slug}"></div>
    </div>`;
}

function expandCandCard(candName, raceId, btn) {
  const card = btn.closest('.candidate-card');
  const body = card.querySelector('.card-expand-body');
  const isOpen = body.classList.contains('open');
  if (isOpen) {
    body.classList.remove('open');
    btn.textContent = 'View ▾';
  } else {
    if (!body.innerHTML) {
      const c = candidates.find(c => c.name === candName);
      if (c) body.innerHTML = candidateInlineHtml(c, raceId);
    }
    body.classList.add('open');
    btn.textContent = 'Close ▴';
  }
}

function candidateInlineHtml(c, raceId) {
  const race    = getRace(raceId);
  const topicKeys = getPriorityTopics(race);
  const topicsHtml = topicKeys.map(key => {
    const label     = TOPICS[key];
    if (!label) return '';
    const td        = c.topics && c.topics[key];
    const conf      = td ? (td.confidence || 'none') : 'none';
    const bodyHtml  = conf === 'none'
      ? '<div class="no-data">No data collected on this topic.</div>'
      : topicBodyHtml(td);
    const emoji     = TOPIC_EMOJI[key] || '';
    return `
      <div class="topic-accordion">
        <div class="topic-accordion-hd" onclick="toggleSection(this)">
          <span class="topic-hd-emoji">${emoji}</span>
          <span class="topic-hd-name">${label}</span>
          <span class="topic-chevron">▾</span>
        </div>
        <div class="topic-accordion-bd">${bodyHtml}</div>
      </div>`;
  }).join('');
  return `<div class="topics-section">${topicsHtml}</div>`;
}

// ── Topics tab ────────────────────────────────────────────────────────────────
function renderTopicsTab(el, cands, raceId) {
  const items = Object.entries(TOPICS).map(([key, label]) => {
    const covered = cands.filter(c => {
      const t = c.topics && c.topics[key];
      return t && t.confidence && t.confidence !== 'none';
    });

    const cards = covered.length > 0
      ? covered.map(c => `
        <div class="topic-cand-card">
          <div class="topic-cand-name" onclick="go('${raceId}/candidate/${slugify(c.name)}')">${c.name}</div>
          ${topicSnippetHtml(c, key)}
        </div>`).join('')
      : '<div class="no-data">No candidate data on this topic yet.</div>';

    return `
      <div class="topic-list-item">
        <div class="topic-list-hd" onclick="toggleSection(this)">
          <span class="topic-list-name">${TOPIC_EMOJI[key] ? TOPIC_EMOJI[key] + ' ' : ''}${label}</span>
          <span class="topic-list-meta">${covered.length} of ${cands.length} candidates <span class="topic-chevron">▾</span></span>
        </div>
        <div class="topic-list-bd">
          <div class="topic-cand-grid">${cards}</div>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `<div class="topic-list">${items}</div>`;
}

function topicSnippetHtml(cand, topicKey) {
  const td = cand.topics && cand.topics[topicKey];
  if (!td || td.confidence === 'none') return '<div class="no-data">No data</div>';
  // Snippet: just overview + first bullet (no full video players in grid cards)
  if (td.synthesis) {
    const s   = td.synthesis;
    const b   = (s.bullets || []).find(b => b.source_label || b.source_url);
    const bHtml = b ? `<ul class="synthesis-bullets">${bulletHtml(b)}</ul>` : '';
    return `<div class="synthesis-overview">${s.overview}</div>${bHtml}`;
  }
  const best = getBestQuote(td.quotes || []);
  let html = '';
  if (td.position) html += `<div class="topic-position-text">${td.position}</div>`;
  if (best && !best.embed_url) html += quoteItemHtml(best);
  return html;
}

// ── Topic body (full accordion content) ──────────────────────────────────────
function topicBodyHtml(td) {
  if (td.synthesis) {
    const s = td.synthesis;
    // Sort bullets: video → BDN → campaign → other → Morning Star
    const citedBullets = (s.bullets || [])
      .filter(b => b.source_label || b.source_url)
      .slice()
      .sort((a, b) => bulletScore(a) - bulletScore(b));
    const bulletsHtml = citedBullets.map(b => bulletHtml(b)).join('');

    // Best video: prefer non-Morning Star if available, else fall back to any
    const videos = (td.quotes || []).filter(q => typeof q === 'object' && q.embed_url);
    const bestVideo = videos.sort((a, b) => quoteScore(a) - quoteScore(b))[0] || null;
    const videoHtml = bestVideo
      ? `<div class="quotes-list">${quoteItemHtml(bestVideo)}</div>`
      : '';

    return `
      <div class="synthesis-overview">${s.overview}</div>
      ${bulletsHtml ? `<ul class="synthesis-bullets">${bulletsHtml}</ul>` : ''}
      ${videoHtml}`;
  }

  // Fallback for topics not yet synthesized: one video clip + all non-video quotes
  const quotes = td.quotes || [];
  const sortedAll = quotes.filter(q => typeof q === 'object').slice().sort((a, b) => quoteScore(a) - quoteScore(b));
  const bestVideo   = sortedAll.find(q => q.embed_url) || null;
  const otherQuotes = sortedAll.filter(q => !q.embed_url);
  const displayQuotes = bestVideo ? [bestVideo, ...otherQuotes] : otherQuotes;
  return `
    ${td.position ? `<div class="topic-position-text">${td.position}</div>` : ''}
    ${displayQuotes.length > 0 ? `<div class="quotes-list">${displayQuotes.map(q => quoteItemHtml(q)).join('')}</div>` : ''}`;
}

// ── Unified citation renderer ─────────────────────────────────────────────────
function isYouTube(url) {
  return url && /youtube\.com|youtu\.be/.test(url);
}

function buildEmbedUrl(watchUrl, ts) {
  const m = (watchUrl || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (!m) return null;
  const start = ts != null ? ts : ((watchUrl.match(/[?&]t=(\d+)/) || [])[1] ?? null);
  return `https://www.youtube.com/embed/${m[1]}${start != null ? '?start=' + start : ''}`;
}

// Returns HTML for a source citation.
function citationHtml(label, url, ts) {
  const hasUrl = url && url !== 'null';
  label = prettyLabel(label, url);
  const tsStr  = ts != null ? ` at ${formatTs(ts)}` : '';

  if (hasUrl && isYouTube(url)) {
    const embedUrl = buildEmbedUrl(url, ts);
    if (embedUrl) {
      return `<span class="cite-video">
        <span class="cite-label">${label || 'Video'}${tsStr}</span>
        <button class="cite-play-btn" data-embed="${embedUrl}" onclick="toggleCitePlayer(this)">&#9654; Watch</button>
        <span class="cite-player-slot"></span>
      </span>`;
    }
    return `<span class="cite-video"><a class="cite-watch-link" href="${url}" target="_blank" rel="noopener">${label || 'Video'}${tsStr} &#9654;</a></span>`;
  }

  if (hasUrl) {
    const safeUrl = url.replace(/"/g, '%22');
    return `<span class="cite-article"><a class="cite-article-link" href="${safeUrl}" target="_blank" rel="noopener">${label || url} &#8599;</a></span>`;
  }

  return label ? `<span class="cite-plain">${label}</span>` : '';
}

function bulletHtml(b) {
  if (!b.source_label && !b.source_url) return '';
  const cite = citationHtml(prettyLabel(b.source_label, b.source_url), b.source_url, b.timestamp_seconds);
  return `<li>${b.text}${cite ? `<span class="bullet-citation">${cite}</span>` : ''}</li>`;
}

// ── Candidate profile ─────────────────────────────────────────────────────────
function renderCandidateProfile(main, c, raceId) {
  const pClass  = c.party === 'Democrat' ? 'dem' : 'rep';
  const inCmp   = compareNames.includes(c.name);

  const topicsHtml = Object.entries(TOPICS).map(([key, label]) => {
    const td    = c.topics && c.topics[key];
    const conf  = td ? (td.confidence || 'none') : 'none';
    const quotes= td ? (td.quotes || []) : [];
    const dotCls= `dot-${conf}`;
    const confLabel = conf === 'none' ? 'No data' : conf.charAt(0).toUpperCase() + conf.slice(1);

    const bodyHtml = conf === 'none'
      ? '<div class="no-data">No data collected on this topic.</div>'
      : topicBodyHtml(td);

    return `
      <div class="topic-accordion">
        <div class="topic-accordion-hd" onclick="toggleSection(this)">
          <span class="conf-dot ${dotCls}"></span>
          <span class="topic-hd-name">${label}</span>
          <span class="topic-hd-conf">${confLabel}</span>
          <span class="topic-chevron">▾</span>
        </div>
        <div class="topic-accordion-bd">
          ${bodyHtml}
        </div>
      </div>`;
  }).join('');

  const profileSuspendedBanner = c.suspended ? `
    <div class="suspension-notice suspension-notice-profile">
      <strong>Campaign suspended.</strong> Mills suspended her campaign on April 30, 2026, but has not filed paperwork to formally withdraw from the race and will still appear on the June ballot.
    </div>` : '';

  main.innerHTML = `
    ${profileSuspendedBanner}
    <div class="profile-header">
      <div class="profile-avatar">
      ${CANDIDATE_PHOTOS[c.name]
        ? `<img src="${CANDIDATE_PHOTOS[c.name]}" alt="${c.name}" onload="smartCrop(this)">`
        : initials(c.name)}
    </div>
      <div class="profile-meta">
        <div class="profile-name">${c.name}</div>
        <div class="profile-race">${c.office} &nbsp;<span class="badge badge-${pClass}">${c.party}</span></div>
        <div class="profile-actions">
          <button class="btn-compare ${inCmp ? 'active' : ''}"
                  id="profile-cmp-btn"
                  style="font-size:0.82rem;padding:6px 12px"
                  onclick="toggleCompare('${esc(c.name)}','${raceId}');refreshProfileCmpBtn(this,'${esc(c.name)}')">
            ${inCmp ? '✓ In compare' : '+ Compare'}
          </button>
          <button class="btn-outline"
                  style="font-size:0.82rem"
                  onclick="go('${raceId}/compare?c=${encodeURIComponent(c.name)}')">Go to compare →</button>
        </div>
      </div>
    </div>
    <div class="topics-section">${topicsHtml}</div>`;
}

function refreshProfileCmpBtn(btn, name) {
  const inCmp = compareNames.includes(name);
  btn.classList.toggle('active', inCmp);
  btn.textContent = inCmp ? '✓ In compare' : '+ Compare';
}

// ── Compare view ──────────────────────────────────────────────────────────────
function getPairDiffs(nameA, nameB) {
  return policyDiffs.find(d =>
    (d.candidate_a === nameA && d.candidate_b === nameB) ||
    (d.candidate_a === nameB && d.candidate_b === nameA)
  ) || null;
}

function getRelationship(nameA, nameB) {
  return candidateRelations.find(r =>
    (r.candidate_a === nameA && r.candidate_b === nameB) ||
    (r.candidate_a === nameB && r.candidate_b === nameA)
  ) || null;
}

function diffSourceHtml(label, url, ts) {
  const c = citationHtml(label, url, ts);
  return c ? `<span class="diff-source">${c}</span>` : '';
}

function renderCompareView(el, race) {
  if (compareNames.length === 0) {
    el.innerHTML = `
      <div class="compare-header">
        <h2 class="compare-title">Compare Candidates</h2>
      </div>
      <div class="compare-empty-hint">
        Use the <strong>+ Compare</strong> button on a candidate card (or drag a card to the tray) to begin.
      </div>`;
    return;
  }

  const compareCands = compareNames
    .map(name => candidates.find(c => c.name === name))
    .filter(Boolean);

  // ── Key differences panel (2-candidate view only) ──────────────────────────
  let keyDiffsHtml = '';
  if (compareCands.length === 2) {
    const pair = getPairDiffs(compareCands[0].name, compareCands[1].name);
    if (pair && pair.differences.length > 0) {
      // Normalise so a=compareCands[0], b=compareCands[1]
      const flipped = pair.candidate_a !== compareCands[0].name;
      const items = pair.differences.map(d => {
        const aPos    = flipped ? d.b_position      : d.a_position;
        const aSrc    = flipped ? d.b_source_label  : d.a_source_label;
        const aUrl    = flipped ? d.b_source_url    : d.a_source_url;
        const aTs     = flipped ? d.b_timestamp_seconds : d.a_timestamp_seconds;
        const bPos    = flipped ? d.a_position      : d.b_position;
        const bSrc    = flipped ? d.a_source_label  : d.b_source_label;
        const bUrl    = flipped ? d.a_source_url    : d.b_source_url;
        const bTs     = flipped ? d.a_timestamp_seconds : d.b_timestamp_seconds;
        return `
          <div class="key-diff-item">
            <div class="key-diff-topic">${emojiForTopic(d.topic_label)} ${d.topic_label}</div>
            <div class="key-diff-positions">
              <div class="key-diff-pos">
                <span class="key-diff-name">${compareCands[0].name}</span>
                <span class="key-diff-text">${aPos}</span>
                ${diffSourceHtml(aSrc, aUrl, aTs)}
              </div>
              <div class="key-diff-pos">
                <span class="key-diff-name">${compareCands[1].name}</span>
                <span class="key-diff-text">${bPos}</span>
                ${diffSourceHtml(bSrc, bUrl, bTs)}
              </div>
            </div>
          </div>`;
      }).join('');
      keyDiffsHtml = `
        <div class="key-diffs-section">
          <h3 class="key-diffs-title">Key Policy Differences</h3>
          <div class="key-diffs-list">${items}</div>
        </div>`;
    }
  }

  const removeButtons = compareCands.map(c => `
    <button class="compare-remove-chip" onclick="removeFromCompare('${esc(c.name)}','${race.id}')">
      ${c.name} ✕
    </button>`).join('');

  const pickHint = compareCands.length < 2
    ? `<div class="compare-pick-hint">Use the <strong>+ Compare</strong> button on a second candidate card above.</div>`
    : '';

  // ── Relationship panel (governor races, 2-candidate view only) ───────────────
  let relationshipHtml = '';
  if (compareCands.length === 2 && race.id.startsWith('governor')) {
    const rel = getRelationship(compareCands[0].name, compareCands[1].name);
    const typeLabels  = { rival: '⚔️ Rivals', allied: '🤝 Allied', cordial: '👋 Cordial', tension: '😬 Tension' };
    const qualityLabels = { strong: 'Well documented', moderate: 'Developing' };
    if (rel) {
      const typeLabel    = typeLabels[rel.type]    || rel.type;
      const qualityLabel = qualityLabels[rel.quality] || rel.quality;
      const sourceLink   = rel.source_url
        ? `<a class="rel-source" href="${rel.source_url}" target="_blank">${rel.source_label}</a>`
        : '';
      relationshipHtml = `
        <div class="relationship-section">
          <h3 class="relationship-title">Relationship</h3>
          <div class="relationship-card rel-type-${rel.type}">
            <div class="rel-card-header">
              <span class="rel-type-badge">${typeLabel}</span>
              <span class="rel-quality-badge">${qualityLabel}</span>
            </div>
            <p class="rel-summary">${rel.summary}</p>
            ${sourceLink}
          </div>
        </div>`;
    } else {
      relationshipHtml = `
        <div class="relationship-section">
          <h3 class="relationship-title">Relationship</h3>
          <div class="relationship-card rel-type-unknown">
            <div class="rel-card-header">
              <span class="rel-type-badge">❓ Undocumented</span>
              <span class="rel-quality-badge rel-quality-sparse">Needs development</span>
            </div>
            <p class="rel-summary rel-summary-sparse">${compareCands[0].name} and ${compareCands[1].name} have not had many notable interactions on the campaign trail.</p>
          </div>
        </div>`;
    }
  }

  el.innerHTML = `
    <div class="compare-header">
      <h2 class="compare-title">Compare</h2>
      <div class="compare-hint">${race.fullTitle || race.title} — ${race.subtitle}</div>
      <div class="compare-active-cands">${removeButtons}</div>
    </div>
    ${pickHint}
    ${relationshipHtml}
    ${keyDiffsHtml}`;
}

function refreshCompareSection(raceId) {
  const el   = document.getElementById('compare-inline');
  const race = getRace(raceId);
  if (!el || !race) return;
  if (compareNames.length === 0) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  renderCompareView(el, race);
}

function removeFromCompare(name, raceId) {
  compareNames = compareNames.filter(n => n !== name);
  updateCompareTray(raceId);
  refreshCompareSection(raceId);
}

// ── Quote rendering ───────────────────────────────────────────────────────────
function quoteItemHtml(q) {
  if (!q) return '';
  const type     = classifyQuote(q);
  const text     = typeof q === 'string' ? q : (q.text || '');
  const rawSrc   = typeof q === 'object' ? (q.source || '') : '';
  const url      = typeof q === 'object' ? (q.url || SOURCE_URLS[rawSrc.trim()] || null) : null;
  const source   = prettyLabel(rawSrc, url);
  const embedUrl = typeof q === 'object' ? (q.embed_url || null) : null;
  const videoUrl = typeof q === 'object' ? (q.video_url || null) : null;
  const ts       = typeof q === 'object' ? q.timestamp_seconds : null;

  const badges = {
    video:      ['badge-video',      'Video clip'],
    direct:     ['badge-direct',     'Direct quote'],
    attributed: ['badge-attributed', 'Attributed'],
    statement:  ['badge-statement',  'Statement'],
  };
  const [badgeClass, badgeLabel] = badges[type] || badges.statement;
  const isItalic = type === 'video' || type === 'direct';
  const tsStr = ts != null ? ` at ${formatTs(ts)}` : '';

  let sourceHtml = '';
  if (source || url || videoUrl) {
    const tsStr2 = ts != null ? ` at ${formatTs(ts)}` : '';
    if (videoUrl) {
      sourceHtml = `<div class="quote-source-line"><a href="${videoUrl}" target="_blank" rel="noopener">${source}${tsStr2}</a></div>`;
    } else if (url) {
      const safeU = url.replace(/"/g, '%22');
      sourceHtml = `<div class="quote-source-line"><a href="${safeU}" target="_blank" rel="noopener">${source || url}</a></div>`;
    } else if (source) {
      sourceHtml = `<div class="quote-source-line">${source}</div>`;
    }
  }

  if (embedUrl) {
    const playerHtml = `
      <div class="video-embed-wrapper" data-embed="${embedUrl}" onclick="loadEmbed(this)">
        <div class="video-embed-placeholder">
          <div class="play-btn">&#9654;</div>
          ${ts != null ? `<div class="video-ts-label">at ${formatTs(ts)}</div>` : ''}
        </div>
      </div>`;
    return `
      <div class="quote-item q-video quote-video-layout">
        <div class="quote-left">
          <div class="quote-type-row"><span class="badge ${badgeClass}">${badgeLabel}</span></div>
          <div class="quote-text italic">${text}</div>
          ${sourceHtml}
        </div>
        ${playerHtml}
      </div>`;
  }

  return `
    <div class="quote-item q-${type}">
      <div class="quote-type-row"><span class="badge ${badgeClass}">${badgeLabel}</span></div>
      <div class="quote-text${isItalic ? ' italic' : ''}">${text}</div>
      ${sourceHtml}
    </div>`;
}

// ── Drag & Drop ───────────────────────────────────────────────────────────────
function initDrag(raceId) {
  document.querySelectorAll('.candidate-card[draggable]').forEach(card => {
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', card.dataset.cand);
      e.dataTransfer.effectAllowed = 'copy';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });

  const tray = document.getElementById('compare-tray');
  tray.addEventListener('dragover', e => { e.preventDefault(); tray.classList.add('drag-over'); });
  tray.addEventListener('dragleave', () => tray.classList.remove('drag-over'));
  tray.addEventListener('drop', e => {
    e.preventDefault();
    tray.classList.remove('drag-over');
    const name = e.dataTransfer.getData('text/plain');
    if (name) toggleCompare(name, raceId);
  });
}

// ── Compare tray ──────────────────────────────────────────────────────────────
function updateCompareTray(raceId) {
  const tray   = document.getElementById('compare-tray');
  const chips  = document.getElementById('compare-tray-chips');
  const goBtn  = document.getElementById('btn-compare-go');
  const clrBtn = document.getElementById('btn-compare-clear');

  if (compareNames.length === 0) {
    tray.classList.add('hidden');
    return;
  }
  tray.classList.remove('hidden');

  chips.innerHTML = compareNames.map(name => `
    <span class="compare-chip">
      ${name}
      <button class="chip-remove" onclick="toggleCompare('${esc(name)}','${raceId}')">✕</button>
    </span>`).join('');

  goBtn.onclick = () => {
    refreshCompareSection(raceId);
    const el = document.getElementById('compare-inline');
    if (el && !el.classList.contains('hidden')) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  clrBtn.onclick = () => {
    compareNames = [];
    updateCompareTray(raceId);
    refreshAllCmpButtons();
  };
}

function toggleCompare(name, raceId) {
  const idx = compareNames.indexOf(name);
  if (idx > -1) {
    compareNames.splice(idx, 1);
  } else if (compareNames.length < MAX_COMPARE) {
    compareNames.push(name);
  } else {
    showToast('You can only compare two candidates at a time');
    return;
  }
  updateCompareTray(raceId);
  refreshAllCmpButtons();
  refreshCompareSection(raceId);
}

function refreshAllCmpButtons() {
  document.querySelectorAll('[data-cand]').forEach(btn => {
    if (!btn.classList.contains('btn-compare')) return;
    const name  = btn.dataset.cand;
    const inCmp = compareNames.includes(name);
    btn.classList.toggle('active', inCmp);
    btn.textContent = inCmp ? '✓ In compare' : '+ Compare';
  });
}

// ── Accordion / section toggle ────────────────────────────────────────────────
function toggleSection(header) {
  const body = header.nextElementSibling;
  if (!body) return;
  const open = body.classList.contains('open');
  body.classList.toggle('open', !open);
  header.classList.toggle('open', !open);
}

// ── Copy link ─────────────────────────────────────────────────────────────────
function copyLink() {
  const url = location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  showToast('Link copied!');
}

// ── Fullscreen ────────────────────────────────────────────────────────────────
function toggleFullscreen() {
  const el  = document.documentElement;
  const btn = document.getElementById('btn-fullscreen');
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
}

function onFullscreenChange() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    btn.textContent = '✕ Exit full screen';
  } else {
    btn.innerHTML = 'Open full page &#x2197;';
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
  return str.replace(/'/g, "\\'");
}

// ── Inline video player ───────────────────────────────────────────────────────
function loadEmbed(wrapper) {
  const base = wrapper.dataset.embed;
  const src  = base + (base.includes('?') ? '&' : '?') + 'autoplay=1';
  wrapper.innerHTML = `
    <div class="video-embed-iframe">
      <iframe src="${src}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowfullscreen></iframe>
    </div>`;
}

function toggleCitePlayer(btn) {
  const slot = btn.nextElementSibling;
  if (!slot || !slot.classList.contains('cite-player-slot')) return;
  if (slot.dataset.open === '1') {
    slot.dataset.open = '0';
    slot.innerHTML = '';
    btn.textContent = '▶ Watch';
    return;
  }
  const src = btn.dataset.embed + (btn.dataset.embed.includes('?') ? '&' : '?') + 'autoplay=1';
  slot.dataset.open = '1';
  slot.innerHTML = `<div class="cite-player-embed"><iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
  btn.textContent = '✕ Close';
}

// ── Side panel ────────────────────────────────────────────────────────────────
function openSidePanel(type, label, url, ts) {
  const panel   = document.getElementById('side-panel');
  const body    = document.getElementById('sp-body');
  const title   = document.getElementById('sp-title');
  const overlay = document.getElementById('sp-overlay');
  title.textContent = label || (type === 'video' ? 'Video clip' : 'Source');

  if (type === 'video') {
    let src = url || '';
    if (src && !src.includes('/embed/')) {
      src = buildEmbedUrl(src, ts) || '';
    } else if (src && ts != null) {
      src = src + (src.includes('?') ? '&' : '?') + 'start=' + ts;
    }
    if (src) src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
    body.innerHTML = src
      ? `<div class="sp-video"><iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
      : `<div class="sp-article"><p class="sp-article-note">Could not load video.</p></div>`;
  } else {
    const safeUrl = (url || '').replace(/"/g, '&quot;');
    body.innerHTML = `<div class="sp-article">
      <div class="sp-article-source">${label || ''}</div>
      <a class="sp-open-btn" href="${safeUrl}" target="_blank" rel="noopener">Open article &#8599;</a>
      <p class="sp-article-note">News articles cannot be embedded due to publisher restrictions.</p>
    </div>`;
  }

  panel.classList.add('open');
  overlay.classList.add('open');
}

function closeSidePanel() {
  document.getElementById('side-panel').classList.remove('open');
  document.getElementById('sp-overlay').classList.remove('open');
  document.getElementById('sp-body').innerHTML = '';
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  try {
    const resp = await fetch('data.json?v=26');
    if (!resp.ok) throw new Error(resp.status);
    candidates = await resp.json();
  } catch (e) {
    document.getElementById('main').innerHTML = `
      <div style="padding:40px;text-align:center;color:#777;font-family:Arial,sans-serif">
        <p>Could not load <code>data.json</code>. Make sure it is in the same folder as this page.</p>
        <p style="margin-top:8px;font-size:0.85rem">Error: ${e.message}</p>
      </div>`;
    return;
  }

  try {
    const resp = await fetch('policy_differences.json?v=8');
    if (resp.ok) policyDiffs = await resp.json();
  } catch (e) { /* optional file — silent fail */ }

  try {
    const resp = await fetch('candidate_relationships.json');
    if (resp.ok) candidateRelations = await resp.json();
  } catch (e) { /* optional file — silent fail */ }

  document.getElementById('btn-copy').addEventListener('click', copyLink);
  document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);

  // Exit fullscreen before opening any external link so the transition is clean
  document.getElementById('app').addEventListener('click', e => {
    const a = e.target.closest('a[target="_blank"]');
    if (!a) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  });

  window.addEventListener('hashchange', render);
  render();
}

// ── Voter Match Quiz ──────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = {
  Republican: [
    {
      id: 'r1', topic: 'costs_affordability',
      text: 'Maine should work toward eliminating the state income tax entirely.',
      stances: {
        'Owen McCarthy': 2, 'David Jones': 1, 'Garrett Mason': 1, 'Ben Midgley': 1,
        'Jonathan Bush': 1, 'Robert Wessels': 1, 'Bobby Charles': 1,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 2, 'Susan Collins': 0,
      },
    },
    {
      id: 'r2', topic: 'costs_affordability',
      text: "Maine's state budget needs to be cut by $2 billion or more in the next governor's first year.",
      stances: {
        'Robert Wessels': 2, 'Bobby Charles': 2, 'David Jones': 1, 'Ben Midgley': 0,
        'Owen McCarthy': 0, 'Jonathan Bush': 0, 'Garrett Mason': -1,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 1, 'Susan Collins': 0,
      },
    },
    {
      id: 'r3', topic: 'education',
      text: 'Maine should eliminate the cap on charter schools and expand school-choice options for families.',
      stances: {
        'Jonathan Bush': 2, 'David Jones': 2, 'Garrett Mason': 2, 'Owen McCarthy': 1,
        'Ben Midgley': 1, 'Robert Wessels': 1, 'Bobby Charles': 1,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 2, 'Susan Collins': 1,
      },
    },
    {
      id: 'r4', topic: 'education',
      text: 'DEI programs, gender ideology, and social-emotional learning should be removed from Maine public schools.',
      stances: {
        'David Jones': 2, 'Jonathan Bush': 2, 'Garrett Mason': 2, 'Owen McCarthy': 1,
        'Ben Midgley': 1, 'Robert Wessels': 1, 'Bobby Charles': 1,
        'Joshua Pietrowicz': 2, 'Ronald Russell': 2, 'Paul LePage': 2, 'Susan Collins': 0,
      },
    },
    {
      id: 'r5', topic: 'reproductive_rights',
      text: "Maine's abortion laws should be significantly tightened beyond current limits.",
      stances: {
        'Garrett Mason': 2, 'Robert Wessels': 2, 'Bobby Charles': 1, 'David Jones': 1,
        'Jonathan Bush': 1, 'Ben Midgley': 0, 'Owen McCarthy': 0,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 2, 'Susan Collins': -1,
      },
    },
    {
      id: 'r6', topic: 'healthcare',
      text: "MaineCare's Medicaid eligibility should be significantly scaled back to control state spending.",
      stances: {
        'Jonathan Bush': 2, 'David Jones': 2, 'Ben Midgley': 2, 'Garrett Mason': 1,
        'Owen McCarthy': 1, 'Robert Wessels': 1, 'Bobby Charles': 1,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 2, 'Susan Collins': 0,
      },
    },
    {
      id: 'r7', topic: 'costs_affordability',
      text: "Eliminating or dramatically reducing Maine's property tax should be the state's top tax priority.",
      stances: {
        'David Jones': 2, 'Owen McCarthy': 1, 'Robert Wessels': 1,
        'Jonathan Bush': 0, 'Garrett Mason': 0, 'Ben Midgley': 0, 'Bobby Charles': 0,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 1, 'Susan Collins': 0,
      },
    },
    {
      id: 'r8', topic: 'education',
      text: 'Schools should face funding consequences when students fail to reach grade-level reading by 4th grade.',
      stances: {
        'Jonathan Bush': 2, 'Owen McCarthy': 2, 'David Jones': 1, 'Garrett Mason': 1,
        'Ben Midgley': 1, 'Robert Wessels': 1, 'Bobby Charles': 1,
        'Joshua Pietrowicz': 1, 'Ronald Russell': 1, 'Paul LePage': 1, 'Susan Collins': 0,
      },
    },
    {
      id: 'r9', topic: 'economy_jobs',
      text: 'Reducing business regulations and lowering taxes is the primary path to growing the Maine economy.',
      stances: {
        'Owen McCarthy': 2, 'Garrett Mason': 2, 'Robert Wessels': 1, 'Jonathan Bush': 1,
        'Bobby Charles': 1, 'Ben Midgley': 1, 'David Jones': 1,
        'Joshua Pietrowicz': 2, 'Ronald Russell': 2, 'Paul LePage': 2, 'Susan Collins': 1,
      },
    },
    {
      id: 'r10', topic: 'immigration',
      text: 'Maine should cooperate fully with federal immigration enforcement agencies.',
      stances: {
        'Robert Wessels': 2, 'Bobby Charles': 2, 'David Jones': 2, 'Garrett Mason': 1,
        'Jonathan Bush': 1, 'Owen McCarthy': 1, 'Ben Midgley': 1,
        'Joshua Pietrowicz': 2, 'Ronald Russell': 2, 'Paul LePage': 2, 'Susan Collins': 1,
      },
    },
    {
      id: 'r11', topic: 'costs_affordability',
      text: 'Taxes on the wealthiest Americans and large corporations should be raised to fund relief for working families.',
      stances: {
        'Joshua Pietrowicz': 2,
        'Ronald Russell': -2,
      },
    },
    {
      id: 'r12', topic: 'civil_liberties',
      text: 'LGBTQ+ individuals should be fully protected from discrimination in schools, healthcare, and the workplace.',
      stances: {
        'Ronald Russell': 2,
        'Joshua Pietrowicz': -1,
      },
    },
  ],

  Democrat: [
    {
      id: 'd1', topic: 'costs_affordability',
      text: "Maine's millionaire's tax should be doubled to fund direct relief for working families.",
      stances: {
        'Troy Jackson': 2, 'Shenna Bellows': 2, 'Graham Platner': 2, 'Paige Loud': 2,
        'Jordan Wood': 1, 'Nirav Shah': 1, 'Hannah Pingree': 1,
        'Joe Baldacci': 1, 'Matt Dunlap': 1, 'Angus King III': 0,
        'David Costello': 0, 'Chellie Pingree': 1,
      },
    },
    {
      id: 'd2', topic: 'healthcare',
      text: 'The U.S. should move to a Medicare for All single-payer healthcare system.',
      stances: {
        'Graham Platner': 2, 'Paige Loud': 2, 'Jordan Wood': 2, 'Chellie Pingree': 2,
        'Troy Jackson': 1, 'Joe Baldacci': 1, 'Matt Dunlap': 1, 'Shenna Bellows': 1,
        'Hannah Pingree': 0, 'Nirav Shah': -1, 'Angus King III': -1, 'David Costello': -1,
      },
    },
    {
      id: 'd3', topic: 'costs_affordability',
      text: 'Billionaires should face a special wealth tax on assets above $1 billion.',
      stances: {
        'Graham Platner': 2, 'Paige Loud': 2, 'Jordan Wood': 2, 'Joe Baldacci': 2,
        'Troy Jackson': 1, 'Shenna Bellows': 1, 'Matt Dunlap': 1,
        'Hannah Pingree': 1, 'Chellie Pingree': 1,
        'Nirav Shah': 0, 'Angus King III': 0, 'David Costello': 0,
      },
    },
    {
      id: 'd4', topic: 'civil_liberties',
      text: 'Democratic candidates should refuse all corporate PAC donations.',
      stances: {
        'Graham Platner': 2, 'Paige Loud': 2, 'Jordan Wood': 2, 'Joe Baldacci': 2,
        'Troy Jackson': 1, 'Shenna Bellows': 1, 'Matt Dunlap': 1,
        'Hannah Pingree': 1, 'Chellie Pingree': 1,
        'Nirav Shah': 0, 'Angus King III': 0, 'David Costello': 0,
      },
    },
    {
      id: 'd5', topic: 'housing',
      text: 'Maine should invest $100 million or more annually in building and preserving affordable housing.',
      stances: {
        'Hannah Pingree': 2, 'Paige Loud': 2, 'Shenna Bellows': 1,
        'Troy Jackson': 1, 'Jordan Wood': 1, 'Joe Baldacci': 1,
        'Matt Dunlap': 1, 'Nirav Shah': 1, 'Graham Platner': 1, 'Chellie Pingree': 1,
        'Angus King III': 0, 'David Costello': 0,
      },
    },
    {
      id: 'd6', topic: 'housing',
      text: 'Maine should impose a surcharge on non-resident second-home owners to fund housing programs.',
      stances: {
        'Hannah Pingree': 2, 'Troy Jackson': 1, 'Shenna Bellows': 1,
        'Graham Platner': 1, 'Paige Loud': 1, 'Jordan Wood': 1,
        'Joe Baldacci': 1, 'Chellie Pingree': 1,
        'Matt Dunlap': 0, 'Nirav Shah': 0, 'David Costello': 0, 'Angus King III': -1,
      },
    },
    {
      id: 'd7', topic: 'education',
      text: 'All outstanding federal student loan debt should be cancelled.',
      stances: {
        'Graham Platner': 2, 'Paige Loud': 2,
        'Troy Jackson': 1, 'Shenna Bellows': 1, 'Matt Dunlap': 1, 'Chellie Pingree': 1,
        'Hannah Pingree': 0, 'Joe Baldacci': 0, 'Jordan Wood': 0,
        'Nirav Shah': -1, 'Angus King III': -1, 'David Costello': -1,
        'Janet Mills': -1,
      },
    },
    {
      id: 'd8', topic: 'environment_climate',
      text: 'Maine should strengthen utility regulation to prevent energy price increases for households.',
      stances: {
        'Troy Jackson': 2, 'Paige Loud': 2, 'Jordan Wood': 1, 'Shenna Bellows': 1,
        'Nirav Shah': 1, 'Hannah Pingree': 1, 'Joe Baldacci': 1,
        'Matt Dunlap': 1, 'Graham Platner': 1, 'Chellie Pingree': 1,
        'Angus King III': 0, 'David Costello': 0,
      },
    },
    {
      id: 'd9', topic: 'costs_affordability',
      text: "Protecting Maine's budget reserves and exercising fiscal caution should guide new spending decisions.",
      stances: {
        'Angus King III': 2, 'Nirav Shah': 1, 'David Costello': 1, 'Matt Dunlap': 1,
        'Hannah Pingree': 0, 'Joe Baldacci': 0, 'Chellie Pingree': 0,
        'Shenna Bellows': -1, 'Troy Jackson': -1,
        'Graham Platner': -1, 'Paige Loud': -1, 'Jordan Wood': -1,
      },
    },
    {
      id: 'd10', topic: 'foreign_policy',
      text: 'The U.S. should significantly reduce its military and defense spending.',
      stances: {
        'Graham Platner': 2, 'Paige Loud': 2,
        'Troy Jackson': 1, 'Shenna Bellows': 1,
        'Jordan Wood': 0, 'Joe Baldacci': 0, 'Matt Dunlap': 0,
        'Hannah Pingree': 0, 'Chellie Pingree': 0,
        'Nirav Shah': -1, 'Angus King III': -1, 'David Costello': -1,
        'Janet Mills': -1,
      },
    },
  ],
};

let quizState = {
  party:    null,
  offices:  new Set(),
  screen:   'start',
  currentQ: 0,
  answers:  [],
};

function quizRacesForParty(party) {
  if (!party) return [];
  return RACES
    .filter(r => r.party === party)
    .map(r => ({ id: r.id, office: r.office, label: (r.fullTitle || r.title) + ' — ' + r.subtitle }));
}

function quizActiveCandidates() {
  return candidates.filter(c =>
    c.party === quizState.party &&
    quizState.offices.has(c.office)
  );
}

function renderQuizScreen(main) {
  if (quizState.screen === 'start')     renderQuizStart(main);
  else if (quizState.screen === 'questions') renderQuizQuestion(main);
  else if (quizState.screen === 'results')   renderQuizResults(main);
}

function renderQuizStart(main) {
  const party    = quizState.party;
  const races    = party ? quizRacesForParty(party) : [];
  const selected = quizState.offices;

  const partyBtns = ['Democrat', 'Republican'].map(p => {
    const cls = p === 'Democrat' ? 'dem' : 'rep';
    return `<button class="quiz-party-btn ${cls}${party === p ? ' selected' : ''}"
      onclick="quizSelectParty('${p}')">${p}</button>`;
  }).join('');

  const racesHtml = races.length ? `
    <div class="quiz-offices">
      <h3>Which primaries do you vote in?</h3>
      <div class="quiz-office-checks">
        ${races.map(r => `
          <label class="quiz-office-check">
            <input type="checkbox" onchange="quizToggleOffice('${r.office}')"
              ${selected.has(r.office) ? 'checked' : ''}>
            ${r.label}
          </label>`).join('')}
      </div>
    </div>
    <button class="btn-primary quiz-start-btn"
      onclick="quizStartQuestions()" ${selected.size === 0 ? 'disabled' : ''}>
      Start Quiz &rarr;
    </button>` : '';

  main.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-start-hero">
        <h2>Voter Match Quiz</h2>
        <p>Answer 10 questions on the issues to see which candidates align closest with your views.</p>
      </div>
      <div class="quiz-party-btns">${partyBtns}</div>
      ${racesHtml}
    </div>`;
}

function renderQuizQuestion(main) {
  const party  = quizState.party;
  const pClass = party === 'Democrat' ? 'dem' : 'rep';
  const qs     = QUIZ_QUESTIONS[party];
  const idx    = quizState.currentQ;
  const q      = qs[idx];
  const cur    = quizState.answers[idx];
  const pct    = Math.round((idx / qs.length) * 100);
  const topicLabel = TOPICS[q.topic] || q.topic;

  const opts = [
    { value: 1,  label: 'Agree' },
    { value: 0,  label: 'Neutral' },
    { value: -1, label: 'Disagree' },
  ];

  main.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-progress">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill ${pClass}" style="width:${pct}%"></div>
        </div>
        <span class="quiz-progress-label">Question ${idx + 1} of ${qs.length}</span>
      </div>
      <div class="quiz-q-card">
        <div class="quiz-q-topic">${emojiForTopic(topicLabel)} ${topicLabel}</div>
        <div class="quiz-q-text">${q.text}</div>
        <div class="quiz-options">
          ${opts.map(o => `
            <button class="quiz-option${cur === o.value ? ' selected ' + pClass : ''}"
              onclick="quizAnswer(${o.value})">${o.label}</button>`).join('')}
        </div>
      </div>
      <div class="quiz-nav">
        <button class="quiz-nav-btn" onclick="quizBack()">← Back</button>
        <button class="quiz-nav-btn" onclick="quizSkip()">Skip →</button>
      </div>
    </div>`;
}

function renderQuizResults(main) {
  const party  = quizState.party;
  const pClass = party === 'Democrat' ? 'dem' : 'rep';
  const qs     = QUIZ_QUESTIONS[party];

  const scored = quizActiveCandidates().map(c => {
    let diff = 0, possible = 0;
    qs.forEach((q, i) => {
      const stance = q.stances[c.name];
      const ans    = quizState.answers[i];
      if (stance !== undefined && ans !== null && ans !== undefined) {
        diff     += Math.abs(ans - stance);
        possible += 3;
      }
    });
    const pct = possible > 0 ? Math.round((1 - diff / possible) * 100) : 50;
    return { c, pct };
  }).sort((a, b) => b.pct - a.pct);

  const byOffice = {};
  scored.forEach(({ c, pct }) => {
    (byOffice[c.office] = byOffice[c.office] || []).push({ c, pct });
  });

  const officeOrder = ['Governor', 'Senate', '1st District', '2nd District'];
  const racesHtml = officeOrder
    .filter(o => byOffice[o])
    .map(office => {
      const race  = RACES.find(r => r.office === office && r.party === party);
      const title = race ? (race.fullTitle || race.title) + ' — ' + race.subtitle : office;
      const cards = byOffice[office].map(({ c, pct }, rank) => {
        const photo = CANDIDATE_PHOTOS[c.name];
        const imgEl = photo
          ? `<img src="${photo}" alt="${c.name}" onload="smartCrop(this)">`
          : `<span class="quiz-result-initials">${initials(c.name)}</span>`;
        const target = race ? `${race.id}/candidate/${slugify(c.name)}` : '';
        return `
          <div class="quiz-result-card" onclick="go('${target}')">
            <div class="quiz-result-rank${rank < 3 ? ' top' : ''}">${rank + 1}</div>
            <div class="quiz-result-photo">${imgEl}</div>
            <div class="quiz-result-info">
              <div class="quiz-result-name">${c.name}${c.suspended ? ' <span class="quiz-suspended-tag">Campaign suspended</span>' : ''}</div>
              <div class="quiz-result-bar-wrap">
                <div class="quiz-result-bar">
                  <div class="quiz-result-bar-fill ${pClass}" style="width:${pct}%"></div>
                </div>
                <div class="quiz-result-pct">${pct}%</div>
              </div>
            </div>
          </div>`;
      }).join('');
      return `
        <div class="quiz-race-results">
          <div class="quiz-race-title">${title}</div>
          ${cards}
        </div>`;
    }).join('');

  main.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-results-header">
        <h2>Your Results</h2>
        <p>Candidates ranked by alignment with your answers. Click any card to read their positions.</p>
      </div>
      ${racesHtml}
      <div class="quiz-results-footer">
        <button class="quiz-nav-btn" onclick="quizRestart()">← Retake Quiz</button>
        <a class="quiz-nav-btn" href="#/" style="text-decoration:none">View All Candidates</a>
      </div>
    </div>`;
}

function quizSelectParty(party) {
  quizState.party   = party;
  quizState.offices = new Set();
  renderQuizScreen(document.getElementById('main'));
}

function quizToggleOffice(office) {
  if (quizState.offices.has(office)) quizState.offices.delete(office);
  else quizState.offices.add(office);
  renderQuizScreen(document.getElementById('main'));
}

function quizStartQuestions() {
  if (!quizState.party || quizState.offices.size === 0) return;
  quizState.screen   = 'questions';
  quizState.currentQ = 0;
  quizState.answers  = new Array(QUIZ_QUESTIONS[quizState.party].length).fill(null);
  renderQuizScreen(document.getElementById('main'));
}

function quizAnswer(value) {
  quizState.answers[quizState.currentQ] = value;
  const qs = QUIZ_QUESTIONS[quizState.party];
  if (quizState.currentQ < qs.length - 1) {
    quizState.currentQ++;
    renderQuizScreen(document.getElementById('main'));
  } else {
    quizState.screen = 'results';
    renderQuizScreen(document.getElementById('main'));
  }
}

function quizSkip() {
  const qs = QUIZ_QUESTIONS[quizState.party];
  if (quizState.currentQ < qs.length - 1) {
    quizState.currentQ++;
    renderQuizScreen(document.getElementById('main'));
  } else {
    quizState.screen = 'results';
    renderQuizScreen(document.getElementById('main'));
  }
}

function quizBack() {
  if (quizState.screen === 'questions') {
    if (quizState.currentQ > 0) {
      quizState.currentQ--;
    } else {
      quizState.screen = 'start';
    }
    renderQuizScreen(document.getElementById('main'));
  } else if (quizState.screen === 'results') {
    quizState.screen   = 'questions';
    quizState.currentQ = QUIZ_QUESTIONS[quizState.party].length - 1;
    renderQuizScreen(document.getElementById('main'));
  }
}

function quizRestart() {
  quizState = { party: null, offices: new Set(), screen: 'start', currentQ: 0, answers: [] };
  renderQuizScreen(document.getElementById('main'));
}

init();
