#!/usr/bin/env node
/*
 * 海外版(作り直し)のページを作る(2026-11-27〜、設計は docs/EN_REDESIGN.md)
 *   土台は1つ:スポットのデータ・計算は data/ と assets/js/ の共通のもの
 *   見せ方は国ごと:data/editions/<言語>.json(都市・おすすめ)と、このファイルの文章
 *
 *   node scripts/build_edition.js            … 英語版を en-next/ に作る(確認用、検索には出さない)
 *   node scripts/build_edition.js --out en   … 入れ替えのとき(まだ使わない)
 *
 * 作るページ:トップ / 都市の一覧 / 都市のまとめ(buildCities の都市)/ 参拝ガイド
 * スポットのページは今の en/spots/(build_en_pages.js)をそのまま使う。
 * どのページにも Googleアナリティクスのタグと、ホーム画面アプリ(PWA)の設定を入れる(CLAUDE.md)。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://motonory-a.github.io/japan-power-spots/';
const r = (p) => path.join(ROOT, p);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--out', 'en-next');
const PREVIEW = OUT !== 'en';
const ED = JSON.parse(fs.readFileSync(r('data/editions/en.json'), 'utf8'));

// ---------- 共通のデータを読む(ブラウザと同じファイル) ----------
const ctx = { console };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
['assets/js/config.js', 'assets/js/jst-date.js', 'data/solar-terms.js', 'assets/js/kyusei.js', 'data/spots-demo.js', 'data/spots-osm.js',
  'data/curated-info.js', 'data/known-benefits.js', 'assets/js/data.js', 'assets/js/diagnosis.js', 'data/model-courses.js',
  'en/i18n-en.js', 'en/pool-en.js', 'data/en-labels.js']
  .forEach((f) => vm.runInContext(fs.readFileSync(r(f), 'utf8').replace(/^var (\w+)/mg, 'this.$1').replace(/^const (\w+)/mg, 'this.$1'), ctx, { filename: f }));
const { ALL_SPOTS, EN, EnPool, Diagnosis: D, MODEL_COURSES, APP_CONFIG, EN_LABELS } = ctx;
const transit = APP_CONFIG.travelModes.transit;

// 英語版で扱うスポットのうち、英語のページがあるものだけ
const SKIP = (ED.skip && ED.skip.q) || [];
const SPOTS = EnPool.build(ALL_SPOTS).filter((s) => EN_LABELS[s.wikidata] && SKIP.indexOf(s.wikidata) === -1).map((s) => {
  const [name, slug] = EN_LABELS[s.wikidata];
  return Object.assign(s, { en: name, slug });
});
const cityCfg = ED.cities.map((c) => {
  const e = EN.cities.find((x) => x.key === c.key);
  return e ? Object.assign({}, c, { lat: e.lat, lon: e.lon }) : c;
});

// ---------- 小さな道具 ----------
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cat = (s) => EN.categories[s.category] || s.category;
const pref = (s) => EN.prefectures[s.prefecture_code] || '';
function fmtMin(m) {
  if (m < 60) return 'about ' + Math.max(5, Math.round(m / 5) * 5) + ' min';
  const rr = Math.round(m / 10) * 10, h = Math.floor(rr / 60), mm = rr % 60;
  return 'about ' + h + ' h' + (mm ? ' ' + mm + ' min' : '');
}
// ページの深さに合わせた、サイトの一番上への道すじ(例:en-next/cities/kyoto/ → ../../../)
const up = (depth) => '../'.repeat(depth);
const blessings = (s) => (s.wishesInferred || []).map((k) => EN.wishes[k]).filter(Boolean).slice(0, 3);

// ---------- 共通の部品 ----------
const LANGS = [['ja', '', '日本語'], ['en', 'en/', 'English'], ['zh-Hant', 'zh/', '繁體中文'], ['ko', 'ko/', '한국어'], ['fr', 'fr/', 'Français'], ['es', 'es/', 'Español']];
function head({ title, desc, canon, depth, extra, home }) {
  const R = up(depth);
  if (home && !PREVIEW) {
    extra = (extra || '') + LANGS.map(([hl, p]) => `<link rel="alternate" hreflang="${hl}" href="${SITE}${p}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${SITE}en/">\n`
      // 前のトップの中の欄(#finder など)へのリンク・共有されたマイリスト(#list=)を、新しいページへ案内する
      + `<script>(function(h){var m={'#finder':'finder/','#results':'finder/','#panel-wish':'finder/','#planner':'plan/','#mylist':'my-list/','#courses':'cities/','#manners':'guide/'};if(m[h])location.replace(m[h]);else if(/^#list=/.test(h))location.replace('my-list/'+h);})(location.hash);</script>\n`;
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CX2WH9VGQ5"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CX2WH9VGQ5');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${PREVIEW ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${SITE}${canon}">`}
<meta name="theme-color" content="#4B2D7E">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(ED.siteName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}assets/img/edition/hero-autumn-1200.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${R}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${R}apple-touch-icon.png">
<link rel="manifest" href="${R}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap">
<link rel="stylesheet" href="${R}assets/css/style.css">
<link rel="stylesheet" href="${R}en/en.css">
<link rel="stylesheet" href="${R}assets/css/edition.css">
${extra || ''}</head>
<body class="en en-page ed">
${PREVIEW ? '<p class="ed-preview">Preview of the new English edition (not public yet) · <a href="' + R + 'en/">Current site</a></p>' : ''}
<header class="ed-bar">
  <a class="ed-brand" href="${R}${OUT}/"><img src="${R}assets/img/flower-of-life-icon.svg" width="34" height="34" alt=""><span><b>Japan Power <i>Spot</i> Journey</b><small>by Akki, the Higher-Dimensional Negotiator</small></span></a>
  <nav class="ed-nav"><a href="${R}${OUT}/cities/">Cities</a><a href="${R}en/spots/">All spots</a><a href="${R}${OUT}/guide/">Shrine guide</a><a href="${R}${OUT}/my-list/">My list <span class="en-count" data-mylist-count></span></a></nav>
</header>
`;
}
function foot(depth, scripts) {
  const R = up(depth);
  return `<footer class="en-foot">
  <p>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · Place data: OpenStreetMap, Wikidata · Photos: Wikimedia Commons</p>
  <p class="ed-langs">${LANGS.map(([hl, p, n]) => `<a href="${R}${p}" hreflang="${hl}" lang="${hl}"${hl === 'en' ? ' aria-current="page"' : ''}>${n}</a>`).join(' · ')}</p>
  <p>${esc(ED.siteName)} / <a href="${R}" lang="ja">開運パワースポット巡り</a> · Run by Akki, the Higher-Dimensional Negotiator, Tokyo · <a href="https://www.instagram.com/japan_psj/" target="_blank" rel="noopener">Instagram @japan_psj</a></p>
</footer>
${scripts || `<script src="${R}en/mylist.js"></script>
<script src="${R}assets/js/photos.js"></script>`}
<script src="${R}assets/js/edition/ui.js"></script>
<script src="${R}assets/js/pwa.js" defer></script>
</body>
</html>
`;
}
// 小さな絵(SVG)。色は CSS の currentColor
const ICON = {
  torii: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5c4 1 16 1 20 0v2.5c-1 .3-2 .5-3 .6V20h-2V8.3c-1.6.1-3.3.2-5 .2s-3.4-.1-5-.2V20H5V8.1c-1-.1-2-.3-3-.6zM6 11h12v2H6z" fill="currentColor"/></svg>',
  bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h2v7h14a2 2 0 0 1 2 2v4h-2v-2H5v2H3zm4 2.5A1.5 1.5 0 1 1 7 11.5a1.5 1.5 0 0 1 0-3zM10 9h7a2 2 0 0 1 2 2v1h-9z" fill="currentColor"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z" fill="currentColor"/></svg>',
  walk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM9.8 8.9 7 22h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3A7 7 0 0 0 19 12v-2a5 5 0 0 1-4.3-2.4l-1-1.6A2 2 0 0 0 11 5.3L6 7.4V12h2V8.6z" fill="currentColor"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm-1 8v10h12V10zm2 2h3v3H8z" fill="currentColor"/></svg>',
  bowl: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 11h20a10 10 0 0 1-6 8.2V21H8v-1.8A10 10 0 0 1 2 11zm7-8c1 1.2 1 2.6 0 4M13 3c1 1.2 1 2.6 0 4" fill="currentColor" stroke="currentColor" stroke-width="1.4"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3a7 7 0 0 1 5.6 11.2l5.6 5.6-1.4 1.4-5.6-5.6A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" fill="currentColor"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2zm0 2.2 6 2v13.6l-6-2z" fill="currentColor"/></svg>'
};
const typeShort = (s) => (s.category === '神社' ? 'Shrine' : s.category === '寺院' ? 'Temple' : cat(s));
// スポットのカード。写真は開いたときに edition-ui.js が Wikimedia Commons から入れる(撮影者・ライセンスも表示)
function spotItem(s, depth, note, small) {
  const b = blessings(s);
  return `<li class="ed-spot${small ? ' ed-spot-s' : ''}" data-q="${s.wikidata}"><a href="${up(depth)}en/spots/${s.slug}.html">
    <span class="ed-thumb" aria-hidden="true"></span>
    <span class="ed-spot-body"><span class="ed-spot-name">${esc(s.en)}</span><span class="ed-spot-ja" lang="ja">${esc(s.name)}</span>
    <span class="ed-chips"><span class="ed-chip">${ICON.torii}${esc(typeShort(s))}</span>${note ? `<span class="ed-chip">${ICON.walk}${esc(note.replace(/^about /, 'about '))}</span>` : `<span class="ed-chip">${ICON.pin}${esc(pref(s))}</span>`}${!small && b.length ? `<span class="ed-chip ed-chip-b">${esc(b.slice(0, 2).join(' / '))}</span>` : ''}</span></span>
    <span class="ed-chev" aria-hidden="true">›</span></a></li>`;
}

// ---------- 都市のまとめ ----------
function cityData(c) {
  const rows = SPOTS.map((s) => {
    const km = D.distanceKm(c.lat, c.lon, s.lat, s.lon);
    return { s, km, min: D.estimateMinutes(km, transit) };
  });
  const R = ED.cityRules;
  const byFame = (a, b) => (b.s.fame - a.s.fame) || (a.km - b.km);
  const dayMax = c.dayTripMinutes || R.dayTripMinutes;
  const pins = (c.pins || []).map((q) => rows.find((x) => x.s.wikidata === q)).filter(Boolean);
  const notPin = (x) => pins.indexOf(x) === -1;
  const near = pins.concat(rows.filter((x) => notPin(x) && x.min <= R.nearMinutes).sort(byFame)).slice(0, R.perGroup);
  const trips = rows.filter((x) => notPin(x) && x.min > R.nearMinutes && x.min <= dayMax).sort(byFame).slice(0, R.perGroup);
  const courses = (MODEL_COURSES || []).filter((co) => co.stops.length && D.distanceKm(c.lat, c.lon, co.stops[0].lat, co.stops[0].lon) <= (R.routeKm || 25))
    .map((co) => ({ co, en: (EN.courses || {})[co.id] })).filter((x) => x.en);
  const total = rows.filter((x) => x.min <= dayMax).length;
  return { near, trips, courses, total, dayMax };
}
function cityPage(c) {
  const depth = 3;
  const d = cityData(c);
  const title = `Power spots in ${c.name}: shrines, temples & sacred nature | ${ED.siteName}`;
  const desc = `${d.total} well-known shrines, temples and sacred places you can reach from ${c.name}, with routes and travel times. ${c.tagline}`;
  const gm = (co) => 'https://www.google.com/maps/dir/' + co.stops.map((st) => st.lat + ',' + st.lon).join('/');
  return head({ title, desc, canon: OUT + '/cities/' + c.slug + '/', depth }) + `
<header class="ed-cityhero" data-q="${d.near[0] ? d.near[0].s.wikidata : ''}">
  <div class="ed-cityhero-in">
    <nav class="ed-crumbs"><a href="../../">Home</a> › <a href="../">Cities</a> › ${esc(c.name)}</nav>
    <h1>Power spots in ${esc(c.name)}</h1>
    <p class="ed-lead">${esc(c.tagline)}</p>
    <p class="ed-count">${ICON.torii}<span>${d.total} well-known sacred places<br>within about ${Math.round(d.dayMax / 60 * 10) / 10} hours</span></p>
    <a class="ed-gold" href="../../finder/">${ICON.search}Find the ones that match you <span aria-hidden="true">›</span></a>
  </div>
</header>
<main class="ed-main">
  <section class="ed-sec">
    <h2 class="ed-h2">In and around ${esc(c.name)}</h2>
    <p class="ed-sub">Up to about an hour by train and bus. Times are rough estimates.</p>
    <ul class="ed-spots">${d.near.map((x) => spotItem(x.s, depth, fmtMin(x.min))).join('\n')}</ul>
  </section>
  ${d.trips.length ? `<section class="ed-band">
    <h2 class="ed-h2">Day trips from ${esc(c.name)}</h2>
    <ul class="ed-spots ed-grid2">${d.trips.map((x) => spotItem(x.s, depth, fmtMin(x.min), true)).join('\n')}</ul>
  </section>` : ''}
  ${d.courses.length ? `<section class="ed-sec">
    <h2 class="ed-h2">Routes you can walk in a day</h2>
    <p class="ed-sub">Every stop has been checked on its official website.</p>
    ${d.courses.map(({ co, en }) => `<div class="ed-route"><h3>${ICON.map}${esc(en[0])}</h3><p>${esc(en[1])}</p>
      <ol class="ed-steps">${co.stops.map((st) => { const s = SPOTS.find((x) => x.wikidata === st.q); return '<li>' + (s ? `<a href="${up(depth)}en/spots/${s.slug}.html">${esc(s.en)}</a>` : `<span lang="ja">${esc(st.name)}</span>`) + '</li>'; }).join('')}</ol>
      <a class="ed-purple" href="${gm(co)}" target="_blank" rel="noopener">${ICON.pin}Open the route in Google Maps</a></div>`).join('\n')}
  </section>` : ''}
  <section class="ed-sec ed-row3">
    <a class="ed-mini" href="../../guide/">${ICON.torii}<span>How to visit<br>a shrine or temple</span></a>
    <a class="ed-mini" href="../../plan/">${ICON.cal}<span>Plan your trip,<br>day by day</span></a>
    <a class="ed-mini" href="${up(depth)}en/gourmet.html">${ICON.bowl}<span>Local Food<br>Guide</span></a>
  </section>
  <p class="ed-credits" data-credits hidden></p>
</main>
` + foot(depth);
}

// ---------- 都市の一覧 ----------
function citiesIndex() {
  const depth = 2;
  return head({ title: `Power spots by city | ${ED.siteName}`, desc: 'Shrines, temples and sacred nature you can visit from Tokyo, Kyoto, Osaka and other cities in Japan.', canon: OUT + '/cities/', depth }) + `
<main class="ed-main">
  <section class="ed-sec"><nav class="ed-crumbs ed-crumbs-d"><a href="../">Home</a> › Cities</nav><h1 class="ed-h1">Where are you staying?</h1><p class="ed-lead">Pick your base. We show the sacred places you can reach from there, with travel times and routes.</p></section>
  <section class="ed-band"><ul class="ed-cities">${cityCfg.map((c) => cityCard(c, '')).join('\n')}</ul></section>
  <p class="ed-credits" data-credits hidden></p>
</main>
` + foot(depth);
}
// 都市のタイル。背景の写真は、その都市でいちばん有名なスポットの写真(edition-ui.js が入れる)
function cityCard(c, base) {
  const top = cityData(c).near[0];
  return `<li class="ed-city" data-q="${top ? top.s.wikidata : ''}"><a href="${base}${c.slug}/"><span class="ed-city-name">${esc(c.name)}</span><span class="ed-city-tag">${esc(c.tagline)}</span><span class="ed-chev" aria-hidden="true">›</span></a></li>`;
}

// ---------- 参拝ガイド(今の英語版トップの文章を使う) ----------
function guidePage() {
  const depth = 2;
  const src = fs.readFileSync(r('scripts/i18n/base-en-index.html'), 'utf8');
  const m = src.match(/<section class="panel" id="manners"[\s\S]*?<\/section>/);
  if (!m) throw new Error('ひな形に参拝の作法の欄が見つからない');
  const body = m[0].replace(/<section[^>]*>/, '').replace(/<\/section>$/, '').replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '');
  return head({ title: `How to visit a shrine or temple in Japan | ${ED.siteName}`, desc: 'Simple etiquette for Shinto shrines and Buddhist temples in Japan: the torii gate, purifying, how to pray, goshuin and omamori.', canon: OUT + '/guide/', depth }) + `
<main class="en-main ed-main ed-tool">
  <nav class="ed-crumbs ed-crumbs-d"><a href="../">Home</a> › Shrine guide</nav>
  <section class="panel" id="manners"><h1>How to visit a shrine or temple</h1>${body}</section>
</main>
` + foot(depth);
}


// ---------- 聖地さがし・旅程・マイリスト(今の英語版トップの欄を、そのままの形で別ページにする) ----------
// 作り直す前の英語版トップ(固定したひな形)。聖地さがし・旅程・マイリスト・参拝ガイドの欄はここから取る
const EN_TOP = fs.readFileSync(r('scripts/i18n/base-en-index.html'), 'utf8');
function sectionById(id) {
  const start = EN_TOP.search(new RegExp('<section[^>]*(id="' + id + '"|class="[^"]*' + id + '[^"]*")'));
  if (start < 0) throw new Error('en/index.html に欄が見つからない:' + id);
  const re = /<\/?section\b[^>]*>/g; re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(EN_TOP))) { depth += m[0][1] === '/' ? -1 : 1; if (!depth) return EN_TOP.slice(start, re.lastIndex); }
  throw new Error('欄の終わりが見つからない:' + id);
}
function fixLinks(html, depth) {
  const R = up(depth);
  return html.split('href="spots/').join('href="' + R + 'en/spots/')
    .split('href="#planner"').join('href="' + R + OUT + '/plan/"')
    .split('href="#mylist"').join('href="' + R + OUT + '/my-list/"')
    .split('href="#finder"').join('href="' + R + OUT + '/finder/"')
    .split('href="gourmet').join('href="' + R + 'en/gourmet');
}
function appScripts(depth) {
  const R = up(depth);
  const tail = EN_TOP.slice(EN_TOP.indexOf('<script src="https://unpkg.com/leaflet'), EN_TOP.indexOf('<script src="../assets/js/pwa.js"'));
  return tail.split('src="../').join('src="' + R)
    .replace(/src="(i18n-en|pool-en|mylist)\.js/g, 'src="' + R + 'en/$1.js')
    .replace(/src="app-en\.js(\?v=[^"]*)?"/, 'src="' + R + 'assets/js/edition/app.js"');
}
const LEAFLET_CSS = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">';
function toolPage({ rel, title, desc, crumb, ids }) {
  const depth = 2;
  const body = ids.map((id) => fixLinks(sectionById(id), depth)).join('\n');
  return head({ title: title + ' | ' + ED.siteName, desc, canon: OUT + '/' + rel + '/', depth, extra: LEAFLET_CSS }) + `
<main class="en-main ed-main ed-tool">
  <nav class="ed-crumbs ed-crumbs-d"><a href="../">Home</a> › ${esc(crumb)}</nav>
${body}
</main>
` + foot(depth, appScripts(depth));
}

// ---------- トップ ----------
function homePage() {
  const depth = 1;
  const seen = {};
  const featured = SPOTS.filter((s) => s.verified).sort((a, b) => b.fame - a.fame)
    .filter((s) => (seen[s.prefecture_code] = (seen[s.prefecture_code] || 0) + 1) <= 1).slice(0, ED.home.featuredCount);
  return head({ home: true, title: `${ED.siteName} | Shrines, temples & sacred nature in Japan`, desc: "Plan your visits to Japan's shrines, temples, sacred trees and waterfalls: by the city you stay in, by your wish, or by region. Etiquette, routes and lucky days.", canon: OUT + '/', depth }) + `
<header class="ed-hero">
  <picture data-hero><source type="image/webp" srcset="../assets/img/edition/hero-autumn-800.webp 800w, ../assets/img/edition/hero-autumn-1200.webp 1200w, ../assets/img/edition/hero-autumn-1672.webp 1672w" sizes="100vw"><img src="../assets/img/edition/hero-autumn-1200.jpg" alt="A traveler walks toward a red torii gate along a shrine path with stone lanterns" width="1672" height="941"></picture>
  <div class="ed-hero-text">
    <h1>Japan's sacred places,<br> made easy to visit</h1>
    <p>Discover shrines, temples, sacred trees and waterfalls, with how to get there and how to pray.</p>
  </div>
  <nav class="ed-doors" aria-label="Start here">
    <a class="ed-door" href="cities/">${ICON.bed}<span>Where are you<br>staying?</span></a>
    <a class="ed-door" href="finder/">${ICON.torii}<span>What do you<br>wish for?</span></a>
    <a class="ed-door" href="../en/spots/">${ICON.pin}<span>Browse<br>by region</span></a>
  </nav>
</header>
<main class="ed-main">
  <section class="ed-sec">
    <h2 class="ed-h2">First time in Japan? Start with these</h2>
    <p class="ed-sub">Well-known sacred places, one per prefecture, checked on their official websites.</p>
    <ul class="ed-spots">${featured.map((s) => spotItem(s, depth)).join('\n')}</ul>
  </section>
  <section class="ed-band">
    <h2 class="ed-h2">Plan by city</h2>
    <ul class="ed-cities ed-cities-3">${cityCfg.slice(0, 6).map((c) => cityCard(c, 'cities/')).join('\n')}</ul>
    <p class="ed-more"><a href="cities/">All 10 cities ›</a></p>
  </section>
  <section class="ed-sec ed-row3">
    <a class="ed-mini" href="guide/">${ICON.torii}<span>How to visit<br>a shrine or temple</span></a>
    <a class="ed-mini" href="plan/">${ICON.cal}<span>Plan your trip,<br>day by day</span></a>
    <a class="ed-mini" href="../en/gourmet.html">${ICON.bowl}<span>Local Food<br>Guide</span></a>
  </section>
  <section class="ed-akki" aria-labelledby="h-guide">
    <img src="../en/img/akki-240.jpg" srcset="../en/img/akki-240.jpg 1x, ../en/img/akki-480.jpg 2x" width="96" height="96" alt="Akki, the guide of this site" loading="lazy" decoding="async">
    <div>
      <h2 id="h-guide">Hello, I'm Akki.</h2>
      <p>In Japan I'm known as <b>the Higher-Dimensional Negotiator</b>. I was born in Yokosuka and live in Tokyo, and Japan's shrines and sacred places are a big part of my life and work.</p>
      <p><a href="https://www.instagram.com/japan_psj/" target="_blank" rel="noopener">Instagram @japan_psj</a> · <a href="https://www.youtube.com/@nigihayahi03" target="_blank" rel="noopener">YouTube</a></p>
    </div>
  </section>
  <p class="ed-credits" data-credits hidden></p>
</main>
` + foot(depth);
}

// ---------- 書き出し ----------
function write(rel, html) {
  const p = r(path.join(OUT, rel));
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
}
write('index.html', homePage());
write('cities/index.html', citiesIndex());
cityCfg.filter((c) => ED.buildCities.indexOf(c.key) !== -1).forEach((c) => write('cities/' + c.slug + '/index.html', cityPage(c)));
write('guide/index.html', guidePage());
write('finder/index.html', toolPage({ rel: 'finder', crumb: 'Find my power spots', title: 'Find the power spots that match you',
  desc: 'Tell us your wish, where you are staying and (if you like) your birthday. We suggest shrines, temples and sacred nature in Japan that suit you.', ids: ['panel-wish', 'finder', 'results'] }));
write('plan/index.html', toolPage({ rel: 'plan', crumb: 'Plan my trip', title: 'Plan your trip to Japan, day by day',
  desc: 'Enter the cities and dates of your trip. For each day we suggest power spots in a lucky direction from where you stay.', ids: ['planner'] }));
write('my-list/index.html', toolPage({ rel: 'my-list', crumb: 'My list', title: 'My list of power spots',
  desc: 'The shrines and temples you saved, on this device. Open them as a route in Google Maps or share the list.', ids: ['mylist'] }));
console.log(OUT + '/ を作りました(トップ・都市の一覧・都市 ' + ED.buildCities.join(', ') + '・参拝ガイド)');
