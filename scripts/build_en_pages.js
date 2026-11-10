#!/usr/bin/env node
/*
 * 英語版のスポットページを作る（v3.16）
 *   node scripts/build_en_pages.js --pool   … 英語版で扱うスポットの Wikidata 番号を data/en-pool.json に書く
 *   node scripts/build_en_pages.js          … en/spots/*.html・en/spots/index.html・data/en-labels.js・sitemap.xml を作る
 * 英語名は en/i18n-en.js の EN.names（手入力）→ data/en-wiki.json（Wikidata、scripts/fetch_en_wiki.py で取得）の順に使う。
 * 英語名がないスポットはページを作らない。
 * 書く内容は、全国データ・確認済み情報・Wikipedia の要約（出典つき）にあるものだけ。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://motonory-a.github.io/japan-power-spots/';
const r = (p) => path.join(ROOT, p);

// ---------- データを読む（ブラウザと同じファイルを vm で実行） ----------
const ctx = { console };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
['assets/js/config.js', 'assets/js/jst-date.js', 'data/solar-terms.js', 'assets/js/kyusei.js', 'data/spots-demo.js', 'data/spots-osm.js',
  'data/curated-info.js', 'data/known-benefits.js', 'assets/js/data.js', 'assets/js/diagnosis.js', 'data/model-courses.js', 'en/i18n-en.js', 'en/pool-en.js']
  .forEach((f) => vm.runInContext(fs.readFileSync(r(f), 'utf8').replace(/^var (\w+)/mg, 'this.$1'), ctx, { filename: f }));
const { ALL_SPOTS, EN, EnPool, Diagnosis: D, MODEL_COURSES, APP_CONFIG } = ctx;
const POOL = EnPool.build(ALL_SPOTS);

if (process.argv.includes('--pool')) {
  const qs = POOL.map((s) => s.wikidata).sort();
  fs.writeFileSync(r('data/en-pool.json'), JSON.stringify(qs) + '\n');
  console.log('data/en-pool.json：' + qs.length + '件');
  process.exit(0);
}

const WIKI = fs.existsSync(r('data/en-wiki.json')) ? JSON.parse(fs.readFileSync(r('data/en-wiki.json'), 'utf8')) : {};

// ---------- 小さな道具 ----------
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const JP = /[぀-ヿ㐀-鿿]/;
function enName(s) {
  const q = s.wikidata;
  if (EN.names[q]) return EN.names[q];
  const w = WIKI[q];
  return w && w.n && !JP.test(w.n) ? w.n : '';
}
function slugify(t) {
  return t.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'spot';
}
const REGION_OF = {};
[['Hokkaido & Tohoku', '01-07'], ['Tokyo & Kanto', '08-14'], ['Central Japan', '15-23'], ['Kansai', '24-30'], ['Chugoku & Shikoku', '31-39'], ['Kyushu & Okinawa', '40-47']]
  .forEach(([name, range]) => { const [a, b] = range.split('-').map(Number); for (let i = a; i <= b; i++) REGION_OF[String(i).padStart(2, '0')] = name; });
const HERITAGE = [[/世界遺産/, 'Part of a UNESCO World Heritage Site'], [/国宝/, 'Has a National Treasure of Japan'], [/重要文化財/, 'Has an Important Cultural Property of Japan'],
  [/特別史跡|特別名勝/, 'Special Historic Site / Special Place of Scenic Beauty'], [/史跡|名勝/, 'Historic Site / Place of Scenic Beauty'], [/天然記念物/, 'Natural Monument of Japan']];
function heritageEn(h) { for (const [re, t] of HERITAGE) if (re.test(h || '')) return t; return ''; }
const cat = (s) => EN.categories[s.category] || s.category;
const pref = (s) => EN.prefectures[s.prefecture_code] || '';
function article(word) { return /^[aeiou]/i.test(word) ? 'an' : 'a'; }
function fmtMin(m) {
  if (m < 60) return 'about ' + Math.max(5, Math.round(m / 5) * 5) + ' min';
  const rr = Math.round(m / 10) * 10, h = Math.floor(rr / 60), mm = rr % 60;
  return 'about ' + h + ' h' + (mm ? ' ' + mm + ' min' : '');
}

// ---------- ページにするスポットと URL ----------
const pages = [];
const used = {};
POOL.slice().sort((a, b) => (b.fame - a.fame) || (a.wikidata < b.wikidata ? -1 : 1)).forEach((s) => {
  const name = enName(s);
  if (!name) return;
  let slug = slugify(name);
  if (used[slug]) slug = slugify(name + ' ' + pref(s));
  let n = 2; const base = slug;
  while (used[slug]) slug = base + '-' + (n++);
  used[slug] = true;
  pages.push({ s, name, slug });
});
const bySlugQ = {};
pages.forEach((p) => { bySlugQ[p.s.wikidata] = p; });

// コースに含まれるスポット
const coursesOf = {};
(MODEL_COURSES || []).forEach((c) => c.stops.forEach((st) => { (coursesOf[st.q] = coursesOf[st.q] || []).push(c); }));

// いちばん近い「訪日客が泊まる都市」と、公共交通での目安時間
const transit = APP_CONFIG.travelModes.transit;
function nearestCities(s) {
  return EN.cities.map((c) => ({ c, km: D.distanceKm(c.lat, c.lon, s.lat, s.lon) }))
    .sort((a, b) => a.km - b.km).filter((x, i, a) => a.findIndex((y) => y.c.label.split(' (')[0] === x.c.label.split(' (')[0]) === i).slice(0, 2)
    .map((x) => ({ label: x.c.label, km: x.km, min: D.estimateMinutes(x.km, transit) }));
}

function nearby(s) {
  return pages.filter((p) => p.s !== s).map((p) => ({ p, km: D.distanceKm(s.lat, s.lon, p.s.lat, p.s.lon) }))
    .filter((x) => x.km <= 15).sort((a, b) => (b.p.s.fame - a.p.s.fame) || (a.km - b.km)).slice(0, 6);
}

// ---------- 共通の部品 ----------
function head({ title, desc, url, img, extra }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#4B2D7E">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Japan Power Spot Journey">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img || SITE + 'en/img/hero-spring-1200.jpg'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../../apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap">
<link rel="stylesheet" href="../../assets/css/style.css">
<link rel="stylesheet" href="../en.css">
${extra || ''}</head>
<body class="en en-page">
<header class="en-bar">
  <a class="en-brand" href="../">Japan Power Spot Journey</a>
  <nav class="en-bar-links"><a href="../#planner">Plan my trip</a><a href="./">All spots</a><a href="../#mylist">My list <span class="en-count" data-mylist-count></span></a></nav>
</header>
`;
}
const FOOT = `<footer class="en-foot">
  <p>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · Place data: OpenStreetMap, Wikidata · Descriptions: Wikipedia (CC BY-SA 4.0) · Photos: Wikimedia Commons</p>
  <p>Japan Power Spot Journey / <a href="../../" lang="ja">開運パワースポット巡り</a> · Run by Akki, the Higher-Dimensional Negotiator, Tokyo · <a href="https://www.instagram.com/japan_psj/" target="_blank" rel="noopener">Instagram @japan_psj</a></p>
</footer>
`;

// ---------- スポットのページ ----------
function spotPage(p) {
  const { s, name, slug } = p;
  const url = SITE + 'en/spots/' + slug + '.html';
  const w = WIKI[s.wikidata] || {};
  const bless = (s.wishesInferred || []).map((k) => EN.wishes[k]).filter(Boolean);
  const feats = (s.wishes || []).filter((k) => (s.wishesInferred || []).indexOf(k) === -1 && EN.wishes[k] && ['神社', '寺院'].indexOf(k) === -1).map((k) => EN.wishes[k]);
  const her = heritageEn(s.heritage);
  const cities = nearestCities(s);
  const c = cat(s);
  const where = (s.prefecture_code === '13' ? 'Tokyo' : pref(s) + ' Prefecture');
  const cl = /^(Buddhist|Shinto)/.test(c) ? c : c.toLowerCase();
  let intro = `${name} is ${article(cl)} ${cl} in ${where}, Japan.`;
  if (bless.length) intro += ` It is traditionally visited for ${bless.slice(0, 3).join(', ').toLowerCase()}.`;
  const desc = (w.x ? w.x.split(/(?<=\.)\s/)[0] + ' ' : intro + ' ') + `Find your lucky days to visit with Nine Star Ki.`;
  const title = `${name} (${s.name}) – ${pref(s)} | Japan Power Spot Journey`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'TouristAttraction', name, alternateName: s.name, url,
    description: (w.x || intro).slice(0, 300),
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lon },
    address: { '@type': 'PostalAddress', addressRegion: pref(s), addressCountry: 'JP' },
    sameAs: ['https://www.wikidata.org/wiki/' + s.wikidata].concat(w.u ? [w.u] : []).concat(s.verified && s.verified.official ? [s.verified.official] : [])
  };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Japan Power Spot Journey', item: SITE + 'en/' },
    { '@type': 'ListItem', position: 2, name: 'All spots', item: SITE + 'en/spots/' },
    { '@type': 'ListItem', position: 3, name, item: url }] };
  const near = nearby(s);
  const courses = coursesOf[s.wikidata] || [];
  const data = { q: s.wikidata, n: name, j: s.name, lat: s.lat, lon: s.lon, s: slug, c: s.category, p: s.prefecture_code };
  const gmaps = 'https://www.google.com/maps/search/?api=1&query=' + s.lat + ',' + s.lon;

  return head({ title, desc, url, extra: `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<script type="application/ld+json">${JSON.stringify(crumbs).replace(/</g, "\\u003c")}</script>
` }) + `<main class="en-spot">
  <p class="en-crumbs"><a href="../">Home</a> › <a href="./#${slugify(REGION_OF[s.prefecture_code] || '')}">${esc(REGION_OF[s.prefecture_code] || '')}</a> › ${esc(pref(s))}</p>
  <article class="panel">
    <div class="en-spot-head">
      <div>
        <h1 class="en-spot-title">${esc(name)}</h1>
        <p class="en-jp" lang="ja">${esc(s.name)}</p>
        <p class="en-meta">${esc(c)} · ${esc(pref(s))}${s.verified ? ' · <span class="en-ok">✓ Checked on the official website</span>' : ''}</p>
      </div>
      <div id="save-slot"></div>
    </div>
    <div id="photo-slot" class="en-spot-photo"></div>
    <section class="en-spot-sec">
      <h2>About</h2>
      ${w.x ? `<p>${esc(w.x)}</p><p class="small">From <a href="${esc(w.u)}" target="_blank" rel="noopener">Wikipedia</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>` : `<p>${esc(intro)}</p>`}
      ${bless.length ? `<p><b>Traditionally visited for:</b></p><div class="en-tags">${bless.map((b) => `<span class="en-tag">${esc(b)}</span>`).join('')}</div>` : ''}
      ${feats.length ? `<p><b>What you'll find:</b> ${esc(feats.join(', '))}</p>` : ''}
      ${her ? `<p><b>Heritage:</b> ${esc(her)}</p>` : ''}
      <p class="small">Blessings are the traditional ones associated with this place's deities, name or local custom.</p>
    </section>
    <section class="en-spot-sec">
      <h2>Getting there</h2>
      <ul>${cities.map((x) => `<li>From ${esc(x.label)}: ${fmtMin(x.min)} by train &amp; bus (${Math.round(x.km)} km, rough estimate)</li>`).join('')}</ul>
      ${s.verified && s.verified.official ? `<p><a href="${esc(s.verified.official)}" target="_blank" rel="noopener">Official website</a> (Japanese) — please check opening hours before you go.</p>` : ''}
      <p><a class="btn-sub en-btn" href="${gmaps}" target="_blank" rel="noopener">Open in Google Maps</a></p>
      <div id="spot-map" class="en-spot-map" aria-label="Map of ${esc(name)}"></div>
    </section>
    <section class="en-spot-sec en-lucky" id="lucky">
      <h2>Your lucky days to visit</h2>
      <p>In Japanese Nine Star Ki, the direction you travel from where you stay matters. Enter your birthday and where you will stay to see good days in the next three months.</p>
      <div class="en-lucky-form">
        <label>Birthday <input type="date" id="lk-bday" min="1900-01-01"></label>
        <label>Staying in <select id="lk-city"></select></label>
        <button type="button" class="btn-main en-btn" id="lk-go">Show my lucky days</button>
      </div>
      <div id="lk-out" role="status" aria-live="polite"></div>
    </section>
    ${courses.length ? `<section class="en-spot-sec"><h2>Model routes with this place</h2><ul>${courses.map((c2) => `<li><a href="../#courses">${esc((EN.courses[c2.id] || [c2.title])[0])}</a></li>`).join('')}</ul></section>` : ''}
    ${near.length ? `<section class="en-spot-sec"><h2>Power spots nearby</h2><ul class="en-near">${near.map((x) => `<li><a href="${x.p.slug}.html">${esc(x.p.name)}</a> <span class="small">${esc(cat(x.p.s))} · ${x.km.toFixed(1)} km</span></li>`).join('')}</ul></section>` : ''}
    <p class="en-cta"><a class="btn-main en-btn" href="../#finder">Find more power spots for you</a></p>
  </article>
</main>
${FOOT}<script>var SPOT = ${JSON.stringify(data).replace(/</g, "\\u003c")};</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script src="../../assets/js/config.js"></script>
<script src="../../assets/js/jst-date.js"></script>
<script src="../../data/solar-terms.js"></script>
<script src="../../assets/js/kyusei.js"></script>
<script src="../../assets/js/diagnosis.js"></script>
<script src="../../assets/js/photos.js"></script>
<script src="../i18n-en.js"></script>
<script src="../mylist.js"></script>
<script src="../spot.js"></script>
</body>
</html>
`;
}

// ---------- 一覧ページ ----------
function indexPage() {
  const url = SITE + 'en/spots/';
  const regions = {};
  pages.forEach((p) => {
    const rg = REGION_OF[p.s.prefecture_code] || 'Other';
    ((regions[rg] = regions[rg] || {})[p.s.prefecture_code] = regions[rg][p.s.prefecture_code] || []).push(p);
  });
  const order = ['Tokyo & Kanto', 'Kansai', 'Central Japan', 'Hokkaido & Tohoku', 'Chugoku & Shikoku', 'Kyushu & Okinawa'];
  const body = order.filter((rg) => regions[rg]).map((rg) => `<section class="panel" id="${slugify(rg)}"><h2>${esc(rg)}</h2>` +
    Object.keys(regions[rg]).sort().map((pc) => `<h3>${esc(EN.prefectures[pc])}</h3><ul class="en-index-list">` +
      regions[rg][pc].map((p) => `<li><a href="${p.slug}.html">${esc(p.name)}</a> <span class="small">${esc(cat(p.s))}</span></li>`).join('') + '</ul>').join('') + '</section>').join('\n');
  return head({ title: 'All power spots in Japan – shrines, temples & sacred nature | Japan Power Spot Journey',
    desc: `${pages.length} famous shrines, temples, sacred trees, waterfalls and mountains across Japan, with traditional blessings, access and your lucky days to visit.`, url }) +
    `<main>
  <section class="panel"><h1 class="en-spot-title">All power spots</h1>
  <p>${pages.length} well-known shrines, temples and sacred places across Japan. Each page shows what the place is traditionally visited for, how to get there, and your lucky days to visit.</p>
  <p class="en-jump">${order.filter((rg) => regions[rg]).map((rg) => `<a href="#${slugify(rg)}">${esc(rg)}</a>`).join(' · ')}</p></section>
${body}
</main>
${FOOT}<script src="../mylist.js"></script>
<script>(function(){var n=MyList.read().length;document.querySelectorAll('[data-mylist-count]').forEach(function(e){e.textContent=n?'('+n+')':'';});})();</script>
</body>
</html>
`;
}

// ---------- 書き出し ----------
const dir = r('en/spots');
fs.mkdirSync(dir, { recursive: true });
const keep = new Set(['index.html']);
pages.forEach((p) => { fs.writeFileSync(path.join(dir, p.slug + '.html'), spotPage(p)); keep.add(p.slug + '.html'); });
fs.writeFileSync(path.join(dir, 'index.html'), indexPage());
fs.readdirSync(dir).forEach((f) => { if (f.endsWith('.html') && !keep.has(f)) fs.unlinkSync(path.join(dir, f)); });

// 英語名とページの対応（診断画面で使う）
const labels = {};
pages.forEach((p) => { const w = WIKI[p.s.wikidata] || {}; labels[p.s.wikidata] = [p.name, p.slug, w.w || '']; });
fs.writeFileSync(r('data/en-labels.js'), '/* 英語版：英語名・スポットページ・英語版Wikipediaの記事名（自動生成：scripts/build_en_pages.js） */\nvar EN_LABELS = ' + JSON.stringify(labels) + ';\nif (typeof module !== \'undefined\') module.exports = EN_LABELS;\n');

// sitemap
const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const urls = [[SITE, 'daily'], [SITE + 'en/', 'weekly'], [SITE + 'zh/', 'weekly'], [SITE + 'ko/', 'weekly'], [SITE + 'fr/', 'weekly'], [SITE + 'es/', 'weekly'], [SITE + 'en/spots/', 'weekly']].concat(pages.map((p) => [SITE + 'en/spots/' + p.slug + '.html', 'monthly']));
fs.writeFileSync(r('sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(([u, f]) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${f}</changefreq>\n  </url>`).join('\n') + '\n</urlset>\n');

console.log('英語版：対象 ' + POOL.length + '件 / ページ ' + pages.length + '件（Wikipediaの要約つき ' + pages.filter((p) => (WIKI[p.s.wikidata] || {}).x).length + '件）');
