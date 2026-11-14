#!/usr/bin/env node
/*
 * 多言語版のトップページを作る（v3.17）
 *   en/index.html（英語版）をもとに、scripts/i18n/<言語>.js の訳で zh/ ko/ fr/ es/ の index.html と i18n.js を作る。
 *   画面の動き（en/app-en.js）・見た目（en/en.css）・画像（en/img/）は英語版のものを共有する。
 *   英語版の文章を変えたときは、下の PAGE の英語も同じに直し、各言語の訳を足す（見つからない文章があると止まる）。
 *   node scripts/build_lang_pages.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://motonory-a.github.io/japan-power-spots/';
const LANGS = ['zh', 'ko', 'fr', 'es'];

// 英語版の文章（en/index.html にそのままの形である部分）
const PAGE = {
  title: '<title>Japan Power Spot Journey | Find shrines, temples &amp; sacred nature that match you</title>',
  desc: 'Visiting Japan? Tell us your wish, your birthday and where you are staying. We suggest shrines, temples, sacred trees and waterfalls that suit you, using Japanese Nine Star Ki and numerology.',
  ogTitle: 'Japan Power Spot Journey | Find your sacred place in Japan',
  ogDesc: 'Shrines, temples, sacred trees and waterfalls matched to your wish and birthday. Free, no sign-up.',
  ldDesc: '"description": "Find shrines, temples and sacred nature in Japan that match your wish and birthday."',
  navPlan: '<a href="#planner">Plan my trip</a>',
  navAll: '<a href="spots/">All spots</a>',
  navList: '<a href="#mylist">My list <span',
  heroAlts: "{ spring: 'cherry blossoms', summer: 'early summer', autumn: 'autumn leaves', winter: 'snow' }",
  heroAlt: "'alt=\"A traveler opens her arms under a red torii gate, with Mt. Fuji and a five-story pagoda among ' + alt + '\"></picture>'",
  heroAltNs: 'alt="A traveler under a red torii gate with Mt. Fuji and a five-story pagoda"',
  h1: 'Find the sacred place in Japan<br class="pc-br"> that is waiting for you',
  sub: 'Shrines, temples, ancient trees, waterfalls and holy mountains,<br class="pc-br"> chosen by your wish, your birthday and where you are staying.',
  cta1: '>Find my power spot</a>',
  cta2: '>Planning a trip? Make a day-by-day plan</a>',
  heroNote: 'Free · No sign-up · About 1 minute',
  wishH: '>What do you wish for?</h2>',
  wishLead: 'Pick the wish closest to your heart. It will be set in the finder below.',
  finderH: '>Power spot finder</h2>',
  s1: 'Your wishes <span class="opt">optional · choose any</span>',
  s1b: 'Places you would love to experience',
  s2: '</span>Your birthday <span class="req">required</span>',
  bdayNote: 'Used for your Nine Star Ki (a traditional Japanese system of lucky directions) and your life path number. It stays on your device and is never sent anywhere.',
  s3: 'Where are you staying? <span class="req">required</span>',
  cityAria: 'aria-label="City you are staying in"',
  useLoc: '>Use my current location</button>',
  tapMap: 'or tap the map below to set your hotel',
  mapAria: 'aria-label="Map to choose your starting point"',
  s4: 'How will you travel?',
  upTo: '<label class="en-inline">Up to\n          <select id="time-limit"></select> one way\n        </label>',
  s5: 'When will you go? <span class="opt">optional</span>',
  dateNote: "If you pick a date, the direction from your hotel is checked for that exact day. If not, we show this month's lucky directions and suggest good days.",
  submit: '>Show my power spots</button>',
  resH: '>Your power spots</h2>',
  resMapAria: 'aria-label="Map of your power spots"',
  resNote: "Travel times are rough estimates from straight-line distance. Please check routes, opening hours and access on Google Maps or the official site before you go. Blessings are the traditional ones associated with each place's deities or name.",
  planH: 'Plan your trip, day by day',
  planLead: 'Coming to Japan soon? Enter the cities and dates of your trip. For each day, we suggest power spots in a lucky direction from where you stay that night.',
  planBday: '<label>Your birthday <input',
  planWish: '<label>Your wish <select',
  planStay: 'Where will you stay?',
  addLeg: '+ Add another city',
  planSubmit: 'Make my trip plan',
  listH: '>My list <span class="en-count" data-mylist-count></span></h2>',
  listRoute: '>Open as a route in Google Maps</a>',
  listCsv: 'Download for Google My Maps (CSV)',
  listShare: 'Share my list',
  listTip: 'Tip: in <a href="https://www.google.com/maps/d/" target="_blank" rel="noopener">Google My Maps</a>, choose “Import” and select the CSV file to see all your places on one map on your phone.',
  coursesH: 'Model routes by region',
  coursesLead: 'Half-day and day routes around famous shrines and temples. Every stop has been checked on its official website.',
  mannersH: 'How to visit a shrine or temple',
  m1h: '⛩ Shinto shrine (jinja)',
  m1a: '<b>Bow once at the torii gate</b> before you walk in. Walk at the side of the path, as the center is said to be for the gods.',
  m1b: "<b>Purify at the water basin (temizuya).</b> Rinse your left hand, then your right, pour a little water into your left hand to rinse your mouth, then rinse the handle. Don't drink from the ladle.",
  m1c: '<b>Pray: bow twice, clap twice, bow once.</b> Drop a coin in the offering box first. Many people say their name and address in their heart before making a wish.',
  m2h: '🪷 Buddhist temple (tera)',
  m2a: '<b>Bow at the main gate</b> and step over the threshold, not on it.',
  m2b: '<b>Purify at the water basin</b> the same way as at a shrine. If there is an incense burner, waft a little smoke toward yourself.',
  m2c: '<b>Pray with your palms together.</b> Make an offering and bow quietly. <b>Do not clap</b> at temples.',
  m3h: '📜 Good to know',
  m3a: '<b>Goshuin</b> are hand-written seals you can collect in a special book, usually for 300–1,000 yen. Ask at the office (juyosho).',
  m3b: '<b>Omamori</b> (charms) and <b>omikuji</b> (fortune slips) are sold at most shrines and temples. If you draw a bad fortune, tie it to the rack and leave it behind.',
  m3c: 'Many halls do not allow photos inside. Look for signs, keep your voice low, and dress modestly.',
  m3d: "Sacred trees, rocks and waterfalls are places of worship too. Please don't climb or touch where it is roped off.",
  aboutH: '>About this site</h2>',
  aboutBrowse: 'Browse all power spots by region →',
  about1: 'Japan Power Spot Journey is the English edition of <a href="../" lang="ja">開運パワースポット巡り</a>, a free site that lists about 96,000 shrines, temples, sacred trees, waterfalls and mountains across Japan. For visitors, we focus on around 1,400 well-known places.',
  about2: '<b>How we choose:</b> your wishes, your Nine Star Ki lucky directions from your hotel, your life path number, travel time, and how well known each place is. Nine Star Ki (九星気学) is a traditional Japanese practice that many people use when choosing where and when to travel. Please enjoy it as a cultural guide, not as a promise.',
  about3: '<b>Your data:</b> your birthday and location are used only inside your browser. Place names and photos are loaded from Wikidata and Wikimedia Commons.',
  guideAlt: 'alt="Akki, the guide of this site"',
  guideKicker: '<p class="en-guide-kicker">Your guide</p>',
  guideH: '>Hello, I\'m Akki.</h2>',
  guideP1: "<p>In Japan I'm known as <b>the Higher-Dimensional Negotiator</b> (<span lang=\"ja\">高次元ネゴシエイター</span>). I was born in Yokosuka and live in Tokyo, and Japan's shrines and sacred places are a big part of my life and work.</p>",
  guideP2: '<p>Japan has more than 96,000 sacred places, far beyond the famous few. I made this finder so you can meet the one that feels like yours, and visit it with a little more meaning.</p>',
  guideLink: ">Say hello on Instagram @japan_psj</a> \u00b7 <a href=\"https://www.youtube.com/@nigihayahi03\" target=\"_blank\" rel=\"noopener\">Watch my videos on YouTube</a>",
  operator: "Run by <b>Akki, the Higher-Dimensional Negotiator</b> (<span lang=\"ja\">高次元ネゴシエイター アッキー</span>), a Tokyo-based spiritual guide to Japan's sacred places. Follow <a href=\"https://www.instagram.com/japan_psj/\" target=\"_blank\" rel=\"noopener\">@japan_psj on Instagram</a> for sacred places and lucky days. Questions or a place to suggest? Message us there, or on Akki's <a href=\"https://www.instagram.com/nigihayahi03/\" target=\"_blank\" rel=\"noopener\">personal Instagram</a>, <a href=\"https://x.com/nigihayahi03\" target=\"_blank\" rel=\"noopener\">X</a> or <a href=\"https://lin.ee/wHX3skr3\" target=\"_blank\" rel=\"noopener\">LINE</a>. Videos on <a href=\"https://www.youtube.com/@nigihayahi03/videos\" target=\"_blank\" rel=\"noopener\">YouTube</a>.",
  foot1: 'Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · Place data: OpenStreetMap, Wikidata, Ministry of the Environment Japan · Stations: <a href="https://github.com/Seo-4d696b75/station_database" target="_blank" rel="noopener">station_database</a> (CC BY 4.0) · Photos: Wikimedia Commons',
  foot2: '>日本語版</a>'
};

// 英語の文章を訳に置き換える。元の文章がなければエラー
function rep(html, from, to, label) {
  if (html.indexOf(from) === -1) throw new Error('見つからない文章：' + label);
  return html.split(from).join(to);
}
function deepMergeScript(data) {
  return `/* 自動生成：scripts/build_lang_pages.js（訳は scripts/i18n/${data.lang}.js で直す） */
(function () {
  var o = ${JSON.stringify(data)};
  ['ui', 'prefectures', 'categories', 'wishes', 'palaces', 'regions', 'courses', 'fortune'].forEach(function (k) {
    if (!o[k]) return;
    EN[k] = EN[k] || {};
    Object.keys(o[k]).forEach(function (j) {
      if (k === 'fortune') EN.fortune[j] = Object.assign({}, EN.fortune[j], { text: o.fortune[j] });
      else EN[k][j] = o[k][j];
    });
  });
  ['stars', 'starNature', 'numerology'].forEach(function (k) { if (o[k]) EN[k] = o[k]; });
  if (o.modes) Object.keys(o.modes).forEach(function (m) { EN.modes[m] = Object.assign({}, EN.modes[m], o.modes[m]); });
  if (o.wishTiles) EN.wishTiles.forEach(function (t, i) { if (o.wishTiles[i]) t.label = o.wishTiles[i]; });
  if (o.cities) EN.cities.forEach(function (c) { if (o.cities[c.key]) c.label = o.cities[c.key]; });
  ['lang', 'locale', 'wdLangs', 'spotBase', 'exclude'].forEach(function (k) { if (o[k]) EN[k] = o[k]; });
})();
`;
}

const enHtml = fs.readFileSync(path.join(ROOT, 'en/index.html'), 'utf8');
LANGS.forEach((lang) => {
  const T = require('./i18n/' + lang + '.js');
  let h = enHtml;
  // 文章
  Object.keys(PAGE).forEach((k) => {
    if (!(k in T.page)) throw new Error(lang + '：訳がない ' + k);
    h = rep(h, PAGE[k], T.page[k], lang + ' ' + k);
  });
  // 言語・URL
  h = rep(h, '<html lang="en">', `<html lang="${T.meta.htmlLang}">`, 'html lang');
  h = rep(h, '<body class="en">', `<body class="en lang-${lang}">`, 'body');
  h = rep(h, '<link rel="canonical" href="' + SITE + 'en/">', '<link rel="canonical" href="' + SITE + lang + '/">', 'canonical');
  h = rep(h, '<meta property="og:url" content="' + SITE + 'en/">', '<meta property="og:url" content="' + SITE + lang + '/">', 'og:url');
  h = rep(h, '<meta property="og:locale" content="en_US">', `<meta property="og:locale" content="${T.meta.ogLocale}">`, 'og:locale');
  h = rep(h, '"url": "' + SITE + 'en/"', '"url": "' + SITE + lang + '/"', 'ld url');
  h = rep(h, '"inLanguage": "en"', `"inLanguage": "${T.meta.htmlLang}"`, 'ld lang');
  h = rep(h, 'hreflang="en" lang="en" aria-current="page">', 'hreflang="en" lang="en">', 'current en');
  h = h.replace(new RegExp('(href="\\.\\./' + lang + '/"[^>]*)>'), '$1 aria-current="page">');
  // 英語版と共有するファイルへの道すじ
  h = rep(h, 'href="en.css"', 'href="../en/en.css"', 'css');
  h = h.split('img/akki-').join('../en/img/akki-');
  h = h.split("'img/hero-").join("'../en/img/hero-").split('src="img/hero-').join('src="../en/img/hero-');
  h = h.split('href="spots/').join('href="../en/spots/');
  h = rep(h, '<script src="i18n-en.js"></script>', '<script src="../en/i18n-en.js"></script>\n<script src="i18n.js"></script>', 'i18n');
  ['pool-en.js', 'mylist.js', 'app-en.js'].forEach((f) => { h = rep(h, `<script src="${f}"></script>`, `<script src="../en/${f}"></script>`, f); });
  fs.mkdirSync(path.join(ROOT, lang), { recursive: true });
  fs.writeFileSync(path.join(ROOT, lang, 'index.html'), h);
  fs.writeFileSync(path.join(ROOT, lang, 'i18n.js'), deepMergeScript(Object.assign({ lang, spotBase: '../en/spots/' }, T.data)));
  console.log(lang + '/index.html・' + lang + '/i18n.js を作りました');
});
