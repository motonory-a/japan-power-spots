#!/usr/bin/env node
/*
 * 海外版(作り直し)のページを作る(2026-11-27〜、設計は docs/EN_REDESIGN.md)
 *   土台は1つ:スポットのデータ・計算は data/ と assets/js/ の共通のもの
 *   見せ方は国ごと:data/editions/<言語>.json(都市・おすすめ・画面の文章 t)
 *
 *   node scripts/build_edition.js --lang en              … 英語版を en/ に作る(公開中)
 *   node scripts/build_edition.js --lang ko --out ko-next … 韓国語版を確認用の ko-next/ に作る(検索に出さない)
 *   (--out を省くと <言語>/ に作る。言語のフォルダ以外に作るときは確認用として noindex を付ける)
 *
 * 作るページ:トップ / 都市の一覧 / 都市のまとめ / 参拝ガイド / 聖地さがし / 旅程 / マイリスト
 * 聖地さがし・旅程・マイリスト・参拝ガイドの欄は、作り直す前のトップ(固定したひな形 scripts/i18n/base-<言語>-index.html)から取る。
 * スポットのページは英語の en/spots/(build_en_pages.js)を使う。
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
const LANG = arg('--lang', 'en');
const OUT = arg('--out', LANG);
const PREVIEW = OUT !== LANG;
// トップの最初の画面の案(2026-11-28 グルメを前に出す):--hero a(実写:神社と名物のセット)/ b(旅行者が名物を持つ絵)
const ED = JSON.parse(fs.readFileSync(r('data/editions/' + LANG + '.json'), 'utf8'));
const T = ED.t;
const HERO = arg('--hero', '') || (ED.home && ED.home.hero) || '';
const MONZEN = require('../data/monzen.js');
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

// ---------- 共通のデータを読む(ブラウザと同じファイル) ----------
const ctx = { console };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
['assets/js/config.js', 'assets/js/jst-date.js', 'data/solar-terms.js', 'assets/js/kyusei.js', 'data/spots-demo.js', 'data/spots-osm.js',
  'data/curated-info.js', 'data/known-benefits.js', 'assets/js/data.js', 'assets/js/diagnosis.js', 'data/model-courses.js',
  'en/i18n-en.js', 'en/pool-en.js', 'data/en-labels.js', 'data/ranking.js', 'data/gourmet.js', 'data/food-photos.js']
  .forEach((f) => vm.runInContext(fs.readFileSync(r(f), 'utf8').replace(/^var (\w+)/mg, 'this.$1').replace(/^const (\w+)/mg, 'this.$1'), ctx, { filename: f }));
const { ALL_SPOTS, EN, EnPool, Diagnosis: D, MODEL_COURSES, APP_CONFIG, EN_LABELS, GOURMET_RANK, GOURMET, FOOD_PHOTOS, PREFECTURES } = ctx;
const ALL_PREF = {};   // 都道府県コード → 日本語名(北海道・福岡県…)
(PREFECTURES || []).forEach((p) => { ALL_PREF[p[0]] = p[1]; });
// 料理名の訳(韓国語など)。英語は data/gourmet.js の中にある
const GT = LANG === 'en' ? null : (() => { const c2 = {}; vm.createContext(c2); vm.runInContext(fs.readFileSync(r('data/gourmet-' + LANG + '.js'), 'utf8').replace(/^var (\w+)/mg, 'this.$1'), c2); return c2.GOURMET_T; })();
const transit = APP_CONFIG.travelModes.transit;
// 言語ごとの名前(都道府県・種類・ご利益・コース名)。英語以外は scripts/i18n/<言語>.js の data
const LOC = LANG === 'en' ? EN : Object.assign({}, EN, require('./i18n/' + LANG + '.js').data);

// 扱うスポット:英語のページがあるもの。おすすめに出さないもの(ED.skip・各言語の exclude)は外す
const SKIP = ((ED.skip && ED.skip.q) || []).concat((LOC.exclude && LOC.exclude.q) || []);
const SKIP_RE = LOC.exclude && LOC.exclude.nameRe ? new RegExp(LOC.exclude.nameRe) : null;
const SPOTS = EnPool.build(ALL_SPOTS).filter((s) => EN_LABELS[s.wikidata] && SKIP.indexOf(s.wikidata) === -1 && !(SKIP_RE && SKIP_RE.test(s.name))).map((s) => {
  const [name, slug] = EN_LABELS[s.wikidata];
  return Object.assign(s, { en: name, slug });
});
const cityCfg = ED.cities.map((c) => {
  const e = EN.cities.find((x) => x.key === c.key);
  return e ? Object.assign({}, c, { lat: e.lat, lon: e.lon }) : c;
});

// ---------- 小さな道具 ----------
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cat = (s) => LOC.categories[s.category] || s.category;
const pref = (s) => LOC.prefectures[s.prefecture_code] || '';
function fmtMin(m) {
  if (m < 60) return fill(T.minFmt, { m: Math.max(5, Math.round(m / 5) * 5) });
  const rr = Math.round(m / 10) * 10, h = Math.floor(rr / 60), mm = rr % 60;
  return mm ? fill(T.hourMinFmt, { h, m: mm }) : fill(T.hourFmt, { h });
}
// ページの深さに合わせた、サイトの一番上への道すじ(例:en/cities/kyoto/ → ../../../)
const up = (depth) => '../'.repeat(depth);
const blessings = (s) => (s.wishesInferred || []).map((k) => LOC.wishes[k]).filter(Boolean).slice(0, 3);
const spotHref = (s, depth) => up(depth) + 'en/spots/' + s.slug + '.html';
const hours = (min) => Math.round(min / 60 * 10) / 10;

// ---------- 共通の部品 ----------
const LANGS = [['ja', '', '日本語'], ['en', 'en/', 'English'], ['zh-Hant', 'zh/', '繁體中文'], ['ko', 'ko/', '한국어'], ['fr', 'fr/', 'Français'], ['es', 'es/', 'Español']];
const HTML_LANG = LANG === 'zh' ? 'zh-Hant' : LANG;
// 公開中の言語版と、それぞれにあるページ(都市・一覧・ガイド・診断・旅程・マイリスト)
const EDITION_PAGES = fs.readdirSync(path.join(__dirname, '..', 'data', 'editions')).filter((f) => f.endsWith('.json')).map((f) => {
  const e = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'editions', f), 'utf8'));
  const l = f.replace(/\.json$/, '');
  if (!e.live && l !== LANG) return null;
  return [l, l === 'zh' ? 'zh-Hant' : l, new Set(['cities/', 'guide/', 'finder/', 'plan/', 'my-list/', ...(e.cities || []).map((c) => 'cities/' + c.slug + '/')])];
}).filter(Boolean);
function head({ title, desc, canon, depth, extra, home }) {
  const R = up(depth);
  // 都市・ガイドなどのページ:同じページがある公開中の各言語版を、検索エンジンに知らせる
  if (!home && !PREVIEW && canon.startsWith(OUT + '/')) {
    const sub = canon.slice(OUT.length + 1);
    const alts = EDITION_PAGES.filter(([, , pages]) => pages.has(sub));
    if (alts.length > 1) {
      extra = (extra || '') + alts.map(([l, hl]) => `<link rel="alternate" hreflang="${hl}" href="${SITE}${l}/${sub}">`).join('\n') + '\n'
        + (alts.some(([l]) => l === 'en') ? `<link rel="alternate" hreflang="x-default" href="${SITE}en/${sub}">\n` : '');
    }
  }
  if (home && !PREVIEW) {
    extra = (extra || '') + LANGS.map(([hl, p]) => `<link rel="alternate" hreflang="${hl}" href="${SITE}${p}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${SITE}en/">\n`;
  }
  if (home) {
    // 前のトップの中の欄(#finder など)へのリンク・共有されたマイリスト(#list=)を、新しいページへ案内する
    extra = (extra || '') + `<script>(function(h){var m={'#finder':'finder/','#results':'finder/','#panel-wish':'finder/','#planner':'plan/','#mylist':'my-list/','#courses':'cities/','#manners':'guide/'};if(m[h])location.replace(m[h]);else if(/^#list=/.test(h))location.replace('my-list/'+h);})(location.hash);</script>\n`;
  }
  return `<!DOCTYPE html>
<html lang="${HTML_LANG}">
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
<meta property="og:locale" content="${ED.locale || 'en_US'}">
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
<body class="en en-page ed ed-${LANG}">
${PREVIEW ? `<p class="ed-preview">${esc(T.preview)} · <a href="${R}${LANG}/">${esc(T.current)}</a></p>` : ''}
<header class="ed-bar">
  <a class="ed-brand" href="${R}${OUT}/"><img src="${R}assets/img/flower-of-life-icon.svg" width="34" height="34" alt=""><span><b>${LANG === 'en' ? 'Japan Power <i>Spot</i> Journey' : esc(ED.siteName)}</b><small>${esc(T.byline)}</small></span></a>
  <nav class="ed-nav"><a href="${R}${OUT}/cities/">${esc(T.navCities)}</a><a href="${R}en/spots/">${esc(T.navAll)}</a><a href="${R}${OUT}/guide/">${esc(T.navGuide)}</a><a href="${R}${OUT}/my-list/">${esc(T.navList)} <span class="en-count" data-mylist-count></span></a></nav>
</header>
`;
}
function foot(depth, scripts) {
  const R = up(depth);
  return `<footer class="en-foot">
  <p>${T.footData}</p>
  <p class="ed-langs">${LANGS.map(([hl, p, n]) => `<a href="${R}${p}" hreflang="${hl}" lang="${hl}"${hl === HTML_LANG ? ' aria-current="page"' : ''}>${n}</a>`).join(' · ')}</p>
  <p>${esc(ED.siteName)} / <a href="${R}" lang="ja">開運パワースポット巡り</a> · ${esc(T.footRun)} · <a href="https://www.instagram.com/japan_psj/" target="_blank" rel="noopener">Instagram @japan_psj</a></p>
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
const typeShort = (s) => (s.category === '神社' ? T.shrine : s.category === '寺院' ? T.temple : cat(s));
// スポットのカード。写真(と英語以外の名前)は開いたときに ui.js が Wikimedia Commons・Wikidata から入れる
function spotItem(s, depth, note, small, from) {
  const b = blessings(s);
  // 都市のページでは、その都市から電車・バスでの道順(Google マップ)をすぐ開けるボタンを付ける
  const go = from ? `<a class="ed-go" href="https://www.google.com/maps/dir/?api=1&amp;origin=${from.lat},${from.lon}&amp;destination=${s.lat},${s.lon}&amp;travelmode=transit" target="_blank" rel="noopener">${ICON.pin}${esc(T.go)}</a>` : '';
  return `<li class="ed-spot${small ? ' ed-spot-s' : ''}${go ? ' ed-has-go' : ''}" data-q="${s.wikidata}">${go}<a href="${spotHref(s, depth)}">
    <span class="ed-thumb" aria-hidden="true"></span>
    <span class="ed-spot-body"><span class="ed-spot-name" data-label="${s.wikidata}">${esc(s.en)}</span><span class="ed-spot-ja" lang="ja">${esc(s.name)}</span>
    <span class="ed-chips"><span class="ed-chip">${ICON.torii}${esc(typeShort(s))}</span>${note ? `<span class="ed-chip">${ICON.walk}${esc(note)}</span>` : `<span class="ed-chip">${ICON.pin}${esc(pref(s))}</span>`}${!small && b.length ? `<span class="ed-chip ed-chip-b">${esc(b.slice(0, 2).join(' / '))}</span>` : ''}</span></span>
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
    .map((co) => ({ co, tx: (LOC.courses || {})[co.id] })).filter((x) => x.tx);
  const total = rows.filter((x) => x.min <= dayMax).length;
  return { near, trips, courses, total, dayMax };
}
function cityPage(c) {
  const depth = 3;
  const d = cityData(c);
  const o = { city: c.name, n: d.total, h: hours(d.dayMax), tagline: c.tagline };
  const gm = (co) => 'https://www.google.com/maps/dir/' + co.stops.map((st) => st.lat + ',' + st.lon).join('/');
  return head({ title: fill(T.cityTitle, o) + ' | ' + ED.siteName, desc: fill(T.cityDesc, o), canon: OUT + '/cities/' + c.slug + '/', depth }) + `
<header class="ed-cityhero" data-q="${d.near[0] ? d.near[0].s.wikidata : ''}">
  <div class="ed-cityhero-in">
    <nav class="ed-crumbs"><a href="../../">${esc(T.home)}</a> › <a href="../">${esc(T.cities)}</a> › ${esc(c.name)}</nav>
    <h1>${esc(fill(T.cityH1, o))}</h1>
    <p class="ed-lead">${esc(c.tagline)}</p>
    <p class="ed-count">${ICON.torii}<span>${fill(T.cityCount, o)}</span></p>
    <a class="ed-gold" href="../../finder/">${ICON.search}${esc(T.findBtn)} <span aria-hidden="true">›</span></a>
  </div>
</header>
<main class="ed-main">
  <section class="ed-sec">
    <h2 class="ed-h2">${esc(fill(T.nearH, o))}</h2>
    <p class="ed-sub">${esc(T.nearSub)}</p>
    <ul class="ed-spots">${d.near.map((x) => spotItem(x.s, depth, fmtMin(x.min), false, c)).join('\n')}</ul>
  </section>
  ${d.trips.length ? `<section class="ed-band">
    <h2 class="ed-h2">${esc(fill(T.tripsH, o))}</h2>
    <ul class="ed-spots ed-grid2">${d.trips.map((x) => spotItem(x.s, depth, fmtMin(x.min), true, c)).join('\n')}</ul>
  </section>` : ''}
  ${d.courses.length ? `<section class="ed-sec">
    <h2 class="ed-h2">${esc(T.routesH)}</h2>
    <p class="ed-sub">${esc(T.routesSub)}</p>
    ${d.courses.map(({ co, tx }) => `<div class="ed-route"><h3>${ICON.map}${esc(tx[0])}</h3><p>${esc(tx[1])}</p>
      <ol class="ed-steps">${co.stops.map((st) => { const s = SPOTS.find((x) => x.wikidata === st.q); return '<li>' + (s ? `<a href="${spotHref(s, depth)}" data-label="${s.wikidata}">${esc(s.en)}</a>` : `<span lang="ja">${esc(st.name)}</span>`) + '</li>'; }).join('')}</ol>
      <a class="ed-purple" href="${gm(co)}" target="_blank" rel="noopener">${ICON.pin}${esc(T.routeMap)}</a></div>`).join('\n')}
  </section>` : ''}
  ${foodSection(c, depth)}
  ${miniCards(depth, '../../')}
  <p class="ed-credits" data-credits hidden></p>
</main>
` + foot(depth);
}
// その都市の都道府県の名物料理(data/ranking.js の TOP5)。写真は Wikimedia Commons(撮影者とライセンスを下に出す)
function foodSection(c, depth) {
  const list = (GOURMET_RANK[c.pref] || []).slice(0, 5);
  if (!list.length) return '';
  const all = GOURMET[c.pref] || [];
  const dish = (jp) => {
    const g = all.find((x) => x[0] === jp);
    if (LANG === 'en') return g ? [g[1], g[3]] : [jp, ''];
    const t = GT && GT[jp];
    return t ? [t[0], t[1]] : [g ? g[1] : jp, ''];
  };
  const credits = [];
  const items = list.map((jp) => {
    const [name, desc] = dish(jp);
    const ph = FOOD_PHOTOS[jp];
    if (ph) credits.push(`<a href="${esc(ph[1])}" target="_blank" rel="noopener noreferrer">${esc(ph[2])} (${esc(ph[3])})</a>`);
    return `<li class="ed-food"><span class="ed-food-pic"${ph ? ` style="background-image:url('${esc(ph[0])}')"` : ''} aria-hidden="true"></span><span><b>${esc(name)}</b><span class="ed-spot-ja" lang="ja">${esc(jp)}</span>${desc ? `<small>${esc(desc)}</small>` : ''}</span></li>`;
  }).join('\n');
  const prefName = LOC.prefectures[Object.keys(EN.prefectures).find((k) => (ALL_PREF[k] || '') === c.pref)] || c.pref;
  return `<section class="ed-sec">
    <h2 class="ed-h2">${esc(fill(T.foodH, { pref: prefName }))}</h2>
    <p class="ed-sub">${esc(T.foodSub)}</p>
    <ul class="ed-foods">${items}</ul>
    <p class="ed-more ed-more-d"><a href="${up(depth)}${LANG}/ranking.html">${esc(T.foodMore)}</a></p>
    ${credits.length ? `<p class="ed-credits">${({ ko: '사진', zh: '照片', es: 'Fotos' })[LANG] || 'Photos'} (Wikimedia Commons): ${credits.join(' · ')}</p>` : ''}
  </section>`;
}
function miniCards(depth, base) {
  return `<section class="ed-sec ed-row3">
    <a class="ed-mini" href="${base}guide/">${ICON.torii}<span>${T.miniGuide}</span></a>
    <a class="ed-mini" href="${base}plan/">${ICON.cal}<span>${T.miniPlan}</span></a>
    <a class="ed-mini" href="${up(depth)}${LANG}/gourmet.html">${ICON.bowl}<span>${T.miniFood}</span></a>
  </section>`;
}

// ---------- 都市の一覧 ----------
function citiesIndex() {
  const depth = 2;
  return head({ title: T.citiesTitle + ' | ' + ED.siteName, desc: T.citiesDesc, canon: OUT + '/cities/', depth }) + `
<main class="ed-main">
  <section class="ed-sec"><nav class="ed-crumbs ed-crumbs-d"><a href="../">${esc(T.home)}</a> › ${esc(T.cities)}</nav><h1 class="ed-h1">${esc(T.citiesH1)}</h1><p class="ed-lead">${esc(T.citiesLead)}</p></section>
  <section class="ed-band"><ul class="ed-cities">${cityCfg.map((c) => cityCard(c, '')).join('\n')}</ul></section>
  <p class="ed-credits" data-credits hidden></p>
</main>
` + foot(depth);
}
// 都市のタイル。背景の写真は、その都市でいちばん有名なスポットの写真(ui.js が入れる)
function cityCard(c, base) {
  const top = cityData(c).near[0];
  return `<li class="ed-city" data-q="${top ? top.s.wikidata : ''}"><a href="${base}${c.slug}/"><span class="ed-city-name">${esc(c.name)}</span><span class="ed-city-tag">${esc(c.tagline)}</span><span class="ed-chev" aria-hidden="true">›</span></a></li>`;
}

// ---------- 作り直す前のトップ(固定したひな形)から欄を取る ----------
// 英語:scripts/i18n/base-en-index.html(en/ にあった形)、韓国語など:scripts/i18n/base-<言語>-index.html(build_lang_pages.js が作る、<言語>/ にあった形)
const TOP = fs.readFileSync(r('scripts/i18n/base-' + LANG + '-index.html'), 'utf8');
function sectionById(id) {
  const start = TOP.search(new RegExp('<section[^>]*(id="' + id + '"|class="[^"]*' + id + '[^"]*")'));
  if (start < 0) throw new Error('ひな形に欄が見つからない:' + id);
  const re = /<\/?section\b[^>]*>/g; re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(TOP))) { depth += m[0][1] === '/' ? -1 : 1; if (!depth) return TOP.slice(start, re.lastIndex); }
  throw new Error('欄の終わりが見つからない:' + id);
}
// ひな形は <言語>/ の高さのページ。1段深いページ(finder/ など)に置くので、相対のリンクに ../ を足す
function fixLinks(html) {
  return html.replace(/href="#(planner|mylist|finder)"/g, (m, k) => `href="../${k === 'planner' ? 'plan' : k === 'mylist' ? 'my-list' : 'finder'}/"`)
    .replace(/(href|src)="(?!https?:|#|mailto:|\/|data:)([^"]+)"/g, '$1="../$2"');
}
function appScripts(depth) {
  const R = up(depth);
  const tail = TOP.slice(TOP.indexOf('<script src="https://unpkg.com/leaflet'), TOP.indexOf('<script src="../assets/js/pwa.js"'));
  return tail.replace(/src="(?!https?:)([^"]+)"/g, 'src="../$1"')
    .replace(/src="\.\.\/i18n\.js/, 'src="' + R + LANG + '/i18n.js')   // 言語ごとの訳(ko/i18n.js など)。確認用の ko-next/ からも読めるように
    .replace(/src="[^"]*app-en\.js(\?v=[^"]*)?"/, 'src="' + R + 'assets/js/edition/app.js"');
}
const LEAFLET_CSS = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">';
function toolPage({ rel, title, desc, crumb, ids }) {
  const depth = 2;
  const body = ids.map((id) => fixLinks(sectionById(id))).join('\n');
  return head({ title: title + ' | ' + ED.siteName, desc, canon: OUT + '/' + rel + '/', depth, extra: LEAFLET_CSS }) + `
<main class="en-main ed-main ed-tool">
  <nav class="ed-crumbs ed-crumbs-d"><a href="../">${esc(T.home)}</a> › ${esc(crumb)}</nav>
${body}
</main>
` + foot(depth, appScripts(depth));
}

// ---------- 参拝ガイド(作り直す前のトップの文章を使う) ----------
function guidePage() {
  const depth = 2;
  const m = TOP.match(/<section class="panel" id="manners"[\s\S]*?<\/section>/);
  if (!m) throw new Error('ひな形に参拝の作法の欄が見つからない');
  const body = fixLinks(m[0].replace(/<section[^>]*>/, '').replace(/<\/section>$/, '').replace(/<h2[^>]*>[\s\S]*?<\/h2>/, ''));
  return head({ title: T.guideTitle + ' | ' + ED.siteName, desc: T.guideDesc, canon: OUT + '/guide/', depth }) + `
<main class="en-main ed-main ed-tool">
  <nav class="ed-crumbs ed-crumbs-d"><a href="../">${esc(T.home)}</a> › ${esc(T.guideCrumb)}</nav>
  <section class="panel" id="manners"><h1>${esc(T.guideH1)}</h1>${body}</section>
</main>
` + foot(depth);
}

// ---------- トップ ----------
function homePage() {
  const depth = 1;
  const seen = {};
  const featured = SPOTS.filter((s) => s.verified).sort((a, b) => b.fame - a.fame)
    .filter((s) => (seen[s.prefecture_code] = (seen[s.prefecture_code] || 0) + 1) <= 1).slice(0, ED.home.featuredCount);
  const img = '../assets/img/edition/';
  const BITES = !!HERO || (MONZEN.live && LANG === 'en');
  const bySlug = {};
  SPOTS.forEach((s) => { bySlug[s.wikidata] = s.slug; });
  const biteHref = (q) => (PREVIEW ? '../en-food/spots/' : '../en/spots/') + bySlug[q] + '.html#bite';
  const mz = '../assets/img/edition/monzen/';
  const heroText = `<div class="ed-hero-text">
    <h1>Japan's sacred places —<br> and the local bite after</h1>
    <p>Shrines and temples, and the old shops at their gates. We checked that each shop still serves it.</p>
  </div>`;
  const doors = `<nav class="ed-doors" aria-label="${esc(T.doorsAria)}">
    <a class="ed-door" href="cities/">${ICON.bed}<span>${T.door1}</span></a>
    <a class="ed-door" href="finder/">${ICON.torii}<span>${T.door2}</span></a>
    <a class="ed-door" href="../en/spots/">${ICON.pin}<span>${T.door3}</span></a>
  </nav>`;
  let hero;
  if (HERO === 'a') {
    hero = `<header class="ed-hero ed-hero-pair" data-pairs>
  ${MONZEN.hero.map((h, i) => `<div class="ed-pair${i ? '' : ' on'}">
    <picture><source type="image/webp" srcset="${mz}${h.img}-800.webp 800w, ${mz}${h.img}-1600.webp 1600w" sizes="100vw"><img src="${mz}${h.img}-1600.jpg" alt="${esc(h.place)}" ${i ? 'loading="lazy" ' : ''}decoding="async"></picture>
    <a class="ed-pair-food" href="${biteHref(h.q)}"><picture><source type="image/webp" srcset="${mz}${h.food.slice(3)}-480.webp"><img src="${mz}${h.food.slice(3)}-480.jpg" alt="${esc(h.bite)}" ${i ? 'loading="lazy" ' : ''}decoding="async"></picture>
      <span class="ed-pair-cap"><small>${esc(h.place)}, then</small><b>${esc(h.bite)}</b><small>${esc(h.shop)}</small></span></a>
  </div>`).join('\n  ')}
  <div class="ed-pair-dots" role="tablist">${MONZEN.hero.map((h, i) => `<button type="button" aria-label="${esc(h.place)}"${i ? '' : ' aria-selected="true"'}></button>`).join('')}</div>
  ${heroText}
  ${doors}
</header>
<script>(function(){var r=document.querySelector('[data-pairs]');if(!r)return;var p=r.querySelectorAll('.ed-pair'),d=r.querySelectorAll('.ed-pair-dots button'),i=0,t;function go(n){p[i].classList.remove('on');d[i].removeAttribute('aria-selected');i=(n+p.length)%p.length;p[i].classList.add('on');d[i].setAttribute('aria-selected','true');}function run(){clearInterval(t);t=setInterval(function(){go(i+1);},6500);}d.forEach(function(b,k){b.addEventListener('click',function(){go(k);run();});});if(!matchMedia('(prefers-reduced-motion: reduce)').matches)run();})();</script>`;
  } else if (HERO === 'b' || /^p\d$/.test(HERO)) {
    // b:後ろ姿の絵 / p1〜p3:顔の見える旅行者の絵(縦長の絵があればスマホ用に使う)
    const hi = HERO === 'b' ? 'bite' : 'face' + HERO.slice(1);
    const hasV = fs.existsSync(r('assets/img/edition/monzen/' + hi + '-v-941.jpg'));
    const alt = HERO === 'b' ? 'A traveler holding freshly grilled mitarashi dango on a shrine approach' : 'A traveler smiling and enjoying a local snack on a shrine approach';
    hero = `<header class="ed-hero ed-hero-b ed-hero-${HERO}">
  <picture>${hasV ? `<source media="(max-width: 700px)" type="image/webp" srcset="${mz}${hi}-v-640.webp 640w, ${mz}${hi}-v-941.webp 941w" sizes="100vw"><source media="(max-width: 700px)" srcset="${mz}${hi}-v-941.jpg" sizes="100vw">` : ''}<source type="image/webp" srcset="${mz}${hi}-800.webp 800w, ${mz}${hi}-1672.webp 1672w" sizes="100vw"><img src="${mz}${hi}-1672.jpg" alt="${alt}" width="1672" height="941"></picture>
  ${heroText}
  ${doors}
</header>`;
  }
  const biteCards = MONZEN.items.filter((m) => bySlug[m.q[0]]).slice(0, 12).map((m) => {
    const sp = SPOTS.find((s) => s.wikidata === m.q[0]);
    const f = m.photo && m.photo.startsWith('mz-') ? MONZEN.photos[m.photo] : null;
    const fp = m.photo && m.photo.startsWith('fp:') ? FOOD_PHOTOS[m.photo.slice(3)] : null;
    const src = f ? '../' + f.f + '-480.jpg' : fp ? fp[0] : '';
    return `<li><a class="ed-bitecard" href="${biteHref(m.q[0])}">${src ? `<span class="ed-bitecard-img" style="background-image:url('${esc(src)}')"></span>` : `<span class="ed-bitecard-img ed-bitecard-noimg" lang="ja">${esc(m.ja)}</span>`}
      <span class="ed-bitecard-t"><small>${esc(sp.en)}</small><b>${esc(m.en)}</b><small>${esc(m.shop_en)}${m.since ? ' · since ' + m.since : ''}</small></span></a></li>`;
  }).join('\n');
  const biteSec = BITES ? `<section class="ed-sec ed-bites">
    <h2 class="ed-h2">After you pray: one local bite</h2>
    <p class="ed-sub">The snack pilgrims have eaten at each shrine's gate for generations. We checked that every shop still sells it (November 2026).</p>
    <ul class="ed-bitecards">${biteCards}</ul>
  </section>` : '';
  const cardCredits = BITES ? (() => { const seen = {}; const out = [];
    MONZEN.items.filter((m) => bySlug[m.q[0]]).slice(0, 12).forEach((m) => {
      const f = m.photo && m.photo.startsWith('mz-') ? MONZEN.photos[m.photo] : null;
      const fp = m.photo && m.photo.startsWith('fp:') ? FOOD_PHOTOS[m.photo.slice(3)] : null;
      const c = f ? [f.page, f.artist, f.license] : fp ? [fp[1], fp[2], fp[3]] : null;
      if (c && !seen[c[0]]) { seen[c[0]] = 1; out.push(`<a href="${esc(c[0])}" target="_blank" rel="noopener">${esc(c[1])} (${esc(c[2])})</a>`); }
    });
    return out.length ? `<p class="ed-hero-credit">Food photos show a typical example of each dish, not necessarily the shop's own (Wikimedia Commons): ${out.join(' · ')}</p>` : ''; })() : '';
  const heroCredits = HERO === 'a' ? `<p class="ed-hero-credit">Top photos (Wikimedia Commons): ${MONZEN.hero.map((h) => `<a href="${esc(h.page)}" target="_blank" rel="noopener">${esc(h.artist)} (${esc(h.license)})</a>`).join(' · ')} · Food: ${MONZEN.hero.map((h) => MONZEN.photos[h.food]).filter(Boolean).map((f) => `<a href="${esc(f.page)}" target="_blank" rel="noopener">${esc(f.artist)} (${esc(f.license)})</a>`).join(' · ')}</p>`
    : (HERO === 'b' || /^p\d$/.test(HERO)) ? `<p class="ed-hero-credit">Top image: AI-generated illustration (not a real person or a specific shrine).</p>` : '';
  return head({ home: true, title: fill(T.homeTitle, { site: ED.siteName }), desc: T.homeDesc, canon: OUT + '/', depth }) + `
${hero || `<header class="ed-hero">
  <picture data-hero><source media="(max-width: 700px)" type="image/webp" srcset="${img}hero-v-autumn-640.webp 640w, ${img}hero-v-autumn-941.webp 941w" sizes="100vw"><source media="(max-width: 700px)" srcset="${img}hero-v-autumn-640.jpg 640w, ${img}hero-v-autumn-941.jpg 941w" sizes="100vw"><source type="image/webp" srcset="${img}hero-autumn-800.webp 800w, ${img}hero-autumn-1200.webp 1200w, ${img}hero-autumn-1672.webp 1672w" sizes="100vw"><img src="${img}hero-autumn-1200.jpg" alt="${esc(T.heroAlt)}" width="1672" height="941"></picture>
  <div class="ed-hero-text">
    <h1>${T.heroH1}</h1>
    <p>${esc(T.heroP)}</p>
  </div>
  <nav class="ed-doors" aria-label="${esc(T.doorsAria)}">
    <a class="ed-door" href="cities/">${ICON.bed}<span>${T.door1}</span></a>
    <a class="ed-door" href="finder/">${ICON.torii}<span>${T.door2}</span></a>
    <a class="ed-door" href="../en/spots/">${ICON.pin}<span>${T.door3}</span></a>
  </nav>
</header>`}
<main class="ed-main">
  <section class="ed-sec">
    <h2 class="ed-h2">${esc(T.featH)}</h2>
    <p class="ed-sub">${esc(T.featSub)}</p>
    <ul class="ed-spots">${featured.map((s) => spotItem(s, depth)).join('\n')}</ul>
  </section>${biteSec ? '\n  ' + biteSec : ''}
  <section class="ed-band">
    <h2 class="ed-h2">${esc(T.planByCity)}</h2>
    <ul class="ed-cities ed-cities-3">${cityCfg.slice(0, 6).map((c) => cityCard(c, 'cities/')).join('\n')}</ul>
    <p class="ed-more"><a href="cities/">${esc(fill(T.allCities, { n: cityCfg.length }))}</a></p>
  </section>
  ${miniCards(depth, '')}
  <section class="ed-akki" aria-labelledby="h-guide">
    <img src="../en/img/akki-240.jpg" srcset="../en/img/akki-240.jpg 1x, ../en/img/akki-480.jpg 2x" width="96" height="96" alt="${esc(T.akkiAlt)}" loading="lazy" decoding="async">
    <div>
      <h2 id="h-guide">${esc(T.akkiH)}</h2>
      <p>${T.akkiP}</p>
      <p>${T.akkiLinks}</p>
    </div>
  </section>
  ${heroCredits || cardCredits ? heroCredits + cardCredits + '\n  ' : ''}<p class="ed-credits" data-credits hidden></p>
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
write('finder/index.html', toolPage({ rel: 'finder', crumb: T.finderCrumb, title: T.finderTitle, desc: T.finderDesc, ids: ['panel-wish', 'finder', 'results'] }));
write('plan/index.html', toolPage({ rel: 'plan', crumb: T.planCrumb, title: T.planTitle, desc: T.planDesc, ids: ['planner'] }));
write('my-list/index.html', toolPage({ rel: 'my-list', crumb: T.listCrumb, title: T.listTitle, desc: T.listDesc, ids: ['mylist'] }));
console.log(OUT + '/ を作りました(' + LANG + '、都市 ' + ED.buildCities.join(', ') + ')');
