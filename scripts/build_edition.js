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
function head({ title, desc, canon, depth, extra }) {
  const R = up(depth);
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
<meta property="og:image" content="${SITE}en/img/hero-spring-1200.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${R}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${R}apple-touch-icon.png">
<link rel="manifest" href="${R}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap">
<link rel="stylesheet" href="${R}assets/css/style.css">
<link rel="stylesheet" href="${R}en/en.css">
<link rel="stylesheet" href="${R}${OUT}/edition.css">
${extra || ''}</head>
<body class="en en-page ed">
${PREVIEW ? '<p class="ed-preview">Preview of the new English edition (not public yet) · <a href="' + R + 'en/">Current site</a></p>' : ''}
<header class="en-bar">
  <a class="en-brand" href="${R}${OUT}/">${esc(ED.siteName)}</a>
  <nav class="en-bar-links"><a href="${R}${OUT}/cities/">Cities</a><a href="${R}en/spots/">All spots</a><a href="${R}${OUT}/guide/">Shrine guide</a><a href="${R}${OUT}/my-list/">My list <span class="en-count" data-mylist-count></span></a></nav>
</header>
`;
}
function foot(depth, scripts) {
  const R = up(depth);
  return `<footer class="en-foot">
  <p>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · Place data: OpenStreetMap, Wikidata · Photos: Wikimedia Commons</p>
  <p>${esc(ED.siteName)} / <a href="${R}" lang="ja">開運パワースポット巡り</a> · Run by Akki, the Higher-Dimensional Negotiator, Tokyo · <a href="https://www.instagram.com/japan_psj/" target="_blank" rel="noopener">Instagram @japan_psj</a></p>
</footer>
${scripts || `<script src="${R}en/mylist.js"></script>`}
<script src="${R}assets/js/pwa.js" defer></script>
</body>
</html>
`;
}
function spotItem(s, depth, note) {
  const b = blessings(s);
  return `<li class="ed-spot"><a href="${up(depth)}en/spots/${s.slug}.html"><span class="ed-spot-name">${esc(s.en)}</span><span class="ed-spot-ja" lang="ja">${esc(s.name)}</span></a>
    <span class="ed-spot-meta">${esc(cat(s))} · ${esc(pref(s))}${note ? ' · ' + esc(note) : ''}</span>${b.length ? `<span class="ed-spot-bless">${esc(b.join(' · '))}</span>` : ''}</li>`;
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
<main class="en-main ed-main">
  <nav class="ed-crumbs"><a href="../../">Home</a> › <a href="../">Cities</a> › ${esc(c.name)}</nav>
  <section class="panel ed-city-head">
    <p class="ed-kicker">${esc(c.region)}</p>
    <h1>Power spots in ${esc(c.name)}</h1>
    <p class="ed-lead">${esc(c.tagline)}</p>
    <p class="ed-note">${d.total} well-known sacred places within about ${Math.round(d.dayMax / 60 * 10) / 10} hours by train and bus. Times are rough estimates from straight-line distance.</p>
    <p><a class="btn-main" href="../../finder/">Find the ones that match you</a></p>
  </section>
  <section class="panel">
    <h2>In and around ${esc(c.name)}</h2>
    <p class="ed-sub">Up to about an hour away</p>
    <ul class="ed-spots">${d.near.map((x) => spotItem(x.s, depth, fmtMin(x.min))).join('\n')}</ul>
  </section>
  ${d.trips.length ? `<section class="panel">
    <h2>Day trips from ${esc(c.name)}</h2>
    <p class="ed-sub">About 1 to ${Math.round(d.dayMax / 60 * 10) / 10} hours away</p>
    <ul class="ed-spots">${d.trips.map((x) => spotItem(x.s, depth, fmtMin(x.min))).join('\n')}</ul>
  </section>` : ''}
  ${d.courses.length ? `<section class="panel">
    <h2>Routes you can walk in a day</h2>
    <p class="ed-sub">Every stop has been checked on its official website.</p>
    ${d.courses.map(({ co, en }) => `<div class="ed-route"><h3>${esc(en[0])}</h3><p>${esc(en[1])}</p>
      <ol>${co.stops.map((st) => { const s = SPOTS.find((x) => x.wikidata === st.q); return '<li>' + (s ? `<a href="${up(depth)}en/spots/${s.slug}.html">${esc(s.en)}</a>` : `<span lang="ja">${esc(st.name)}</span>`) + '</li>'; }).join('')}</ol>
      <p><a href="${gm(co)}" target="_blank" rel="noopener">Open the route in Google Maps</a></p></div>`).join('\n')}
  </section>` : ''}
  <section class="panel ed-next">
    <h2>Before you go</h2>
    <p><a href="../../guide/">How to visit a shrine or temple →</a></p>
    <p><a href="${up(depth)}en/gourmet.html">Local food to try nearby →</a></p>
  </section>
</main>
` + foot(depth);
}

// ---------- 都市の一覧 ----------
function citiesIndex() {
  const depth = 2;
  return head({ title: `Power spots by city | ${ED.siteName}`, desc: 'Shrines, temples and sacred nature you can visit from Tokyo, Kyoto, Osaka and other cities in Japan.', canon: OUT + '/cities/', depth }) + `
<main class="en-main ed-main">
  <nav class="ed-crumbs"><a href="../">Home</a> › Cities</nav>
  <section class="panel"><h1>Where are you staying?</h1><p class="ed-lead">Pick your base. We show the sacred places you can reach from there, with travel times and routes.</p></section>
  <section class="panel"><ul class="ed-cities">${cityCfg.map((c) => cityCard(c, '')).join('\n')}</ul></section>
</main>
` + foot(depth);
}
function cityCard(c, base) {
  const built = ED.buildCities.indexOf(c.key) !== -1;
  return built
    ? `<li class="ed-city"><a href="${base}${c.slug}/"><b>${esc(c.name)}</b><span>${esc(c.tagline)}</span></a></li>`
    : `<li class="ed-city ed-soon"><b>${esc(c.name)}</b><span>${esc(c.tagline)}</span><em>Coming soon</em></li>`;
}

// ---------- 参拝ガイド(今の英語版トップの文章を使う) ----------
function guidePage() {
  const depth = 2;
  const src = fs.readFileSync(r('en/index.html'), 'utf8');
  const m = src.match(/<section class="panel" id="manners"[\s\S]*?<\/section>/);
  if (!m) throw new Error('en/index.html に参拝の作法の欄が見つからない');
  const body = m[0].replace(/<section[^>]*>/, '').replace(/<\/section>$/, '').replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '');
  return head({ title: `How to visit a shrine or temple in Japan | ${ED.siteName}`, desc: 'Simple etiquette for Shinto shrines and Buddhist temples in Japan: the torii gate, purifying, how to pray, goshuin and omamori.', canon: OUT + '/guide/', depth }) + `
<main class="en-main ed-main">
  <nav class="ed-crumbs"><a href="../">Home</a> › Shrine guide</nav>
  <section class="panel" id="manners"><h1>How to visit a shrine or temple</h1>${body}</section>
</main>
` + foot(depth);
}


// ---------- 聖地さがし・旅程・マイリスト(今の英語版トップの欄を、そのままの形で別ページにする) ----------
const EN_TOP = fs.readFileSync(r('en/index.html'), 'utf8');
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
<main class="en-main ed-main">
  <nav class="ed-crumbs"><a href="../">Home</a> › ${esc(crumb)}</nav>
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
  return head({ title: `${ED.siteName} | Shrines, temples & sacred nature in Japan`, desc: "Plan your visits to Japan's shrines, temples, sacred trees and waterfalls: by the city you stay in, by your wish, or by region. Etiquette, routes and lucky days.", canon: OUT + '/', depth }) + `
<header class="ed-hero">
  <picture><source type="image/webp" srcset="../en/img/hero-autumn-800.webp 800w, ../en/img/hero-autumn-1200.webp 1200w" sizes="100vw"><img src="../en/img/hero-autumn-1200.jpg" alt="A red torii gate with Mt. Fuji and a five-story pagoda among autumn leaves" width="1200" height="675"></picture>
  <div class="ed-hero-text">
    <p class="ed-kicker" lang="ja">開運パワースポット巡り</p>
    <h1>Japan's sacred places,<br> made easy to visit</h1>
    <p>Shrines, temples, ancient trees and waterfalls, with how to get there and how to pray.</p>
  </div>
</header>
<main class="en-main ed-main">
  <section class="ed-doors" aria-label="Start here">
    <a class="ed-door" href="cities/"><b>Where are you staying?</b><span>Places you can reach from Tokyo, Kyoto, Osaka and more</span></a>
    <a class="ed-door" href="finder/"><b>What do you wish for?</b><span>Love, luck, health… find places that match you</span></a>
    <a class="ed-door" href="../en/spots/"><b>Browse by region</b><span>About 1,400 well-known places across Japan</span></a>
  </section>
  <section class="panel">
    <h2>First time in Japan? Start with these</h2>
    <p class="ed-sub">Well-known sacred places, one per prefecture, checked on their official websites.</p>
    <ul class="ed-spots">${featured.map((s) => spotItem(s, depth)).join('\n')}</ul>
  </section>
  <section class="panel">
    <h2>Plan by city</h2>
    <ul class="ed-cities">${cityCfg.slice(0, 6).map((c) => cityCard(c, 'cities/')).join('\n')}</ul>
    <p><a href="cities/">All cities →</a></p>
  </section>
  <section class="panel ed-two">
    <a class="ed-card" href="guide/"><b>How to visit a shrine or temple</b><span>Bowing, purifying, praying, goshuin and omamori</span></a>
    <a class="ed-card" href="plan/"><b>Plan your trip, day by day</b><span>Lucky directions from where you stay each night</span></a>
    <a class="ed-card" href="../en/gourmet.html"><b>Local Food Guide</b><span>300+ dishes from all 47 prefectures</span></a>
  </section>
  <section class="panel en-guide" aria-labelledby="h-guide">
    <img class="en-guide-pic" src="../en/img/akki-240.jpg" srcset="../en/img/akki-240.jpg 1x, ../en/img/akki-480.jpg 2x" width="72" height="72" alt="Akki, the guide of this site" loading="lazy" decoding="async">
    <div class="en-guide-body">
      <p class="en-guide-kicker">Your guide</p>
      <h2 id="h-guide">Hello, I'm Akki.</h2>
      <p>In Japan I'm known as <b>the Higher-Dimensional Negotiator</b> (<span lang="ja">高次元ネゴシエイター</span>). I was born in Yokosuka and live in Tokyo, and Japan's shrines and sacred places are a big part of my life and work.</p>
      <p class="en-guide-link"><a href="https://www.instagram.com/japan_psj/" target="_blank" rel="noopener">Say hello on Instagram @japan_psj</a> · <a href="https://www.youtube.com/@nigihayahi03" target="_blank" rel="noopener">Watch my videos on YouTube</a></p>
    </div>
  </section>
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
