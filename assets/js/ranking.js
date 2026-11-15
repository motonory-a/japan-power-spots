/* ご当地グルメランキング（ranking.html）。データは data/ranking.js（GOURMET_RANK・GOURMET_SHOPS）
   料理の名前・説明・写真は ご当地グルメ図鑑 と同じもの（data/gourmet.js・food-photos.js・gourmet-xx.js）
   言語は <html data-glang="ja|en|zh|ko|fr|es"> */
(function () {
  'use strict';
  var PREFS = [
    ['北海道', 'Hokkaido', 0], ['青森県', 'Aomori', 1], ['岩手県', 'Iwate', 1], ['宮城県', 'Miyagi', 1], ['秋田県', 'Akita', 1], ['山形県', 'Yamagata', 1], ['福島県', 'Fukushima', 1],
    ['茨城県', 'Ibaraki', 2], ['栃木県', 'Tochigi', 2], ['群馬県', 'Gunma', 2], ['埼玉県', 'Saitama', 2], ['千葉県', 'Chiba', 2], ['東京都', 'Tokyo', 2], ['神奈川県', 'Kanagawa', 2],
    ['新潟県', 'Niigata', 3], ['富山県', 'Toyama', 3], ['石川県', 'Ishikawa', 3], ['福井県', 'Fukui', 3], ['山梨県', 'Yamanashi', 3], ['長野県', 'Nagano', 3], ['岐阜県', 'Gifu', 3], ['静岡県', 'Shizuoka', 3], ['愛知県', 'Aichi', 3],
    ['三重県', 'Mie', 4], ['滋賀県', 'Shiga', 4], ['京都府', 'Kyoto', 4], ['大阪府', 'Osaka', 4], ['兵庫県', 'Hyogo', 4], ['奈良県', 'Nara', 4], ['和歌山県', 'Wakayama', 4],
    ['鳥取県', 'Tottori', 5], ['島根県', 'Shimane', 5], ['岡山県', 'Okayama', 5], ['広島県', 'Hiroshima', 5], ['山口県', 'Yamaguchi', 5],
    ['徳島県', 'Tokushima', 6], ['香川県', 'Kagawa', 6], ['愛媛県', 'Ehime', 6], ['高知県', 'Kochi', 6],
    ['福岡県', 'Fukuoka', 7], ['佐賀県', 'Saga', 7], ['長崎県', 'Nagasaki', 7], ['熊本県', 'Kumamoto', 7], ['大分県', 'Oita', 7], ['宮崎県', 'Miyazaki', 7], ['鹿児島県', 'Kagoshima', 7], ['沖縄県', 'Okinawa', 7]
  ];
  var T = {
    ja: { regions: ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'], all: 'すべて', pick: '都道府県をえらぶ',
      rank: '{n}位', shopsT: '{d} お店ベスト3', shopsBtn: 'お店ベスト3', find: 'お店を探す', map: '地図で見る', since: '創業{y}年',
      hasShops: 'お店ランキングがある料理', soon: 'お店ランキングは順次ふやしていきます。', top: '↑ 上へ',
      era: { meiji: '明治創業', over100: '創業100年以上', edo_late: '江戸時代後期創業', edo_end: '江戸時代末期創業' }, areaT: 'エリア別 お店ベスト3', aw: { mich: 'ミシュランガイド掲載', mich_bib: 'ミシュランガイド ビブグルマン', mich_star: 'ミシュランガイド {n}つ星', hyaku: '食べログ百名店 {y}', bunka: '建物が国の登録有形文化財' },
      rule: 'お店の順位：ミシュランガイド掲載・食べログ百名店選出・国の登録有形文化財など、公開されている受賞・選出の数が多い順。同じ数なら創業が古い順です（{c}時点で確認）。', src: '確認したページ' },
    en: { regions: ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu & Okinawa'], all: 'All', pick: 'Choose a prefecture',
      rank: 'No.{n}', shopsT: 'Top 3 places for {d}', shopsBtn: 'Top 3 places', find: 'Find a place', map: 'Map', since: 'Since {y}',
      hasShops: 'Dishes with a restaurant ranking', soon: 'More restaurant rankings are on the way.', top: '↑ Top',
      era: { meiji: 'Since the Meiji era', over100: 'Over 100 years old', edo_late: 'Since the late Edo period', edo_end: 'Since the final years of the Edo period' }, areaT: 'Top 3 places by area', aw: { mich: 'Listed in the MICHELIN Guide', mich_bib: 'MICHELIN Guide Bib Gourmand', mich_star: 'MICHELIN Guide {n} star(s)', hyaku: 'Tabelog Hyakumeiten {y}', bunka: 'Building is a registered Tangible Cultural Property' },
      rule: 'How restaurants are ranked: by the number of public awards and selections (MICHELIN Guide, Tabelog Hyakumeiten, national cultural property, etc.). Ties go to the older restaurant. Checked {c}.', src: 'Source' },
    zh: { regions: ['北海道', '東北', '關東', '中部', '近畿', '中國', '四國', '九州・沖繩'], all: '全部', pick: '選擇都道府縣',
      rank: '第{n}名', shopsT: '{d} 名店前三名', shopsBtn: '名店前三名', find: '找店家', map: '地圖', since: '創業於{y}年',
      hasShops: '有店家排行的料理', soon: '店家排行會陸續增加。', top: '↑ 回到頂端',
      era: { meiji: '創業於明治時代', over100: '創業逾100年', edo_late: '創業於江戶時代後期', edo_end: '創業於江戶時代末期' }, areaT: '各地區名店前三名', aw: { mich: '米其林指南推薦', mich_bib: '米其林指南 必比登推介', mich_star: '米其林指南 {n}星', hyaku: 'Tabelog 百名店 {y}', bunka: '建築為日本國家登錄有形文化財' },
      rule: '店家排名方式：依米其林指南、Tabelog 百名店、國家登錄有形文化財等公開獲獎・入選次數由多到少排列；次數相同時，創業較早者在前（{c} 確認）。', src: '資料來源' },
    ko: { regions: ['홋카이도', '도호쿠', '간토', '주부', '간사이', '주고쿠', '시코쿠', '규슈·오키나와'], all: '전체', pick: '지역 선택',
      rank: '{n}위', shopsT: '{d} 맛집 베스트 3', shopsBtn: '맛집 베스트 3', find: '가게 찾기', map: '지도', since: '{y}년 창업',
      hasShops: '맛집 순위가 있는 요리', soon: '맛집 순위는 계속 늘려 갈 예정입니다.', top: '↑ 맨 위로',
      era: { meiji: '메이지 시대 창업', over100: '창업 100년 이상', edo_late: '에도 시대 후기 창업', edo_end: '에도 시대 말기 창업' }, areaT: '지역별 맛집 베스트 3', aw: { mich: '미쉐린 가이드 선정', mich_bib: '미쉐린 가이드 빕 구르망', mich_star: '미쉐린 가이드 {n}스타', hyaku: '타베로그 백명점 {y}', bunka: '건물이 국가 등록유형문화재' },
      rule: '맛집 순위 기준: 미쉐린 가이드, 타베로그 백명점, 국가 등록유형문화재 등 공개된 수상·선정 수가 많은 순. 같으면 창업이 오래된 순입니다({c} 확인).', src: '확인한 페이지' },
    fr: { regions: ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu et Okinawa'], all: 'Tout', pick: 'Choisir une préfecture',
      rank: 'N°{n}', shopsT: 'Top 3 des adresses : {d}', shopsBtn: 'Top 3 des adresses', find: 'Trouver une adresse', map: 'Carte', since: 'Depuis {y}',
      hasShops: 'Plats avec un classement d’adresses', soon: 'D’autres classements d’adresses arrivent.', top: '↑ Haut',
      era: { meiji: 'Fondé à l’ère Meiji', over100: 'Plus de 100 ans d’histoire', edo_late: 'Fondé à la fin de l’époque d’Edo', edo_end: 'Fondé dans les dernières années d’Edo' }, areaT: 'Top 3 des adresses par région', aw: { mich: 'Sélectionné par le Guide MICHELIN', mich_bib: 'Guide MICHELIN Bib Gourmand', mich_star: 'Guide MICHELIN {n} étoile(s)', hyaku: 'Tabelog Hyakumeiten {y}', bunka: 'Bâtiment inscrit bien culturel national' },
      rule: 'Classement des adresses : selon le nombre de distinctions publiques (Guide MICHELIN, Tabelog Hyakumeiten, bien culturel national…). À égalité, la plus ancienne passe devant. Vérifié en {c}.', src: 'Source' },
    es: { regions: ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu y Okinawa'], all: 'Todo', pick: 'Elige una prefectura',
      rank: 'N.º {n}', shopsT: 'Top 3 de sitios: {d}', shopsBtn: 'Top 3 de sitios', find: 'Buscar un sitio', map: 'Mapa', since: 'Desde {y}',
      hasShops: 'Platos con ranking de restaurantes', soon: 'Pronto habrá más rankings de restaurantes.', top: '↑ Arriba',
      era: { meiji: 'Fundado en la era Meiji', over100: 'Más de 100 años de historia', edo_late: 'Fundado a finales del periodo Edo', edo_end: 'Fundado en los últimos años del periodo Edo' }, areaT: 'Top 3 de sitios por zona', aw: { mich: 'Recomendado por la Guía MICHELIN', mich_bib: 'Guía MICHELIN Bib Gourmand', mich_star: 'Guía MICHELIN {n} estrella(s)', hyaku: 'Tabelog Hyakumeiten {y}', bunka: 'Edificio registrado como bien cultural nacional' },
      rule: 'Orden de los restaurantes: por número de premios y selecciones públicas (Guía MICHELIN, Tabelog Hyakumeiten, bien cultural nacional, etc.). En caso de empate, el más antiguo va primero. Comprobado en {c}.', src: 'Fuente' }
  };
  var lang = document.documentElement.getAttribute('data-glang') || 'ja';
  var L = T[lang] || T.en, ja = lang === 'ja';
  var G = window.GOURMET || {}, P = window.FOOD_PHOTOS || {}, TR = window.GOURMET_T || null;
  var RANK = window.GOURMET_RANK || {}, SHOPS = window.GOURMET_SHOPS || {};
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function f(s, o) { return s.replace(/\{(\w)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function prefName(p) { return ja ? p[0] : p[1]; }
  var byName = {};
  Object.keys(G).forEach(function (k) { G[k].forEach(function (d) { byName[k + '|' + d[0]] = d; }); });
  var GX = window.GOURMET_EXTRA || {}, TX = window.GOURMET_EXTRA_T || {};
  Object.keys(GX).forEach(function (k) { GX[k].forEach(function (d) { if (!byName[k + '|' + d[0]]) byName[k + '|' + d[0]] = d; }); });
  function dishName(d) { if (ja) return d[0]; var t = (TX[d[0]] && TX[d[0]][lang]) || (TR && TR[d[0]]); return t && t[0] ? t[0] : d[1]; }
  function dishSub(d) { return ja || lang === 'en' ? '' : d[0]; }
  function dishDesc(d) { if (ja) return d[2]; var t = (TX[d[0]] && TX[d[0]][lang]) || (TR && TR[d[0]]); return t && t[1] ? t[1] : d[3]; }
  function awText(c) { var a = c.split(':'); var s = L.aw[a[0]]; if (!s) return c; return a[1] ? f(s, { n: a[1], y: a[1] }) : s.replace(/\s*\{y\}/, ''); }
  var ERA_Y = { edo_late: 1790, edo_end: 1860, meiji: 1880, over100: 1924 };
  function sortY(s) { return s.y || ERA_Y[s.e] || 9999; }
  function sortShops(list) {
    return list.slice().sort(function (a, b) { return (b.aw || []).length - (a.aw || []).length || sortY(a) - sortY(b); });
  }
  function mapsUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }

  var root = document.getElementById('ranking'); if (!root) return;

  // エリア別 お店ベスト3（上にまとめて表示。料理TOP5からはここへ飛ぶ）
  var AREAS = window.GOURMET_SHOP_AREAS || Object.keys(SHOPS).map(function (k) { return [k, null]; });
  var areaSec = el('section', 'r-areas');
  areaSec.append(el('h2', 'g-pref-name', L.areaT));
  var qrow = el('div', 'r-quick-row');
  var areaList = el('ol', 'r-list');
  AREAS.forEach(function (ar) {
    var k = ar[0], a = k.split('|'), p = PREFS.filter(function (x) { return x[0] === a[0]; })[0], d = byName[k];
    if (!p || !d || !SHOPS[k]) return;
    var label = ar[1] ? (ja || lang === 'zh' ? ar[1][0] : ar[1][1]) : prefName(p);
    var b = el('a', 'r-quick-card'); b.href = '#s-' + encodeURIComponent(k);
    var ph = P[d[0]]; if (ph) { var im = el('img'); im.src = ph[0]; im.alt = ''; im.loading = 'lazy'; b.append(im); }
    var tx = el('span'); tx.append(el('b', null, dishName(d)), el('small', null, label)); b.append(tx);
    qrow.append(b);
    areaList.append(shopBox(k, d, label));
  });
  areaSec.append(qrow, areaList, el('p', 'r-quick-note', L.soon));
  root.append(areaSec);

  // 地方の絞り込みと都道府県の選択
  var bar = el('div', 'g-bar');
  var chips = el('div', 'g-chips'), regSel = -1;
  [L.all].concat(L.regions).forEach(function (name, i) {
    var b = el('button', 'g-chip' + (i === 0 ? ' on' : ''), name); b.type = 'button';
    b.addEventListener('click', function () {
      regSel = i - 1;
      chips.querySelectorAll('.g-chip').forEach(function (c) { c.classList.remove('on'); }); b.classList.add('on');
      secs.forEach(function (s) { s.hidden = regSel >= 0 && +s.dataset.region !== regSel; });
    });
    chips.append(b);
  });
  var sel = el('select', 'r-select'); sel.setAttribute('aria-label', L.pick);
  var o0 = el('option', null, L.pick); o0.value = ''; sel.append(o0);
  PREFS.forEach(function (p, i) { var o = el('option', null, prefName(p)); o.value = 'p-' + (i + 1); sel.append(o); });
  sel.addEventListener('change', function () {
    if (!sel.value) return;
    secs.forEach(function (s) { s.hidden = false; }); chips.querySelector('.g-chip').click();
    var t = document.getElementById(sel.value); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  bar.append(sel, chips);
  root.append(bar);

  var secs = [];
  PREFS.forEach(function (p, pi) {
    var names = RANK[p[0]]; if (!names) return;
    var sec = el('section', 'g-pref'); sec.id = 'p-' + (pi + 1); sec.dataset.region = p[2];
    sec.append(el('h2', 'g-pref-name', prefName(p)));
    var ol = el('ol', 'r-list');
    names.forEach(function (n, i) {
      var d = byName[p[0] + '|' + n]; if (!d) return;
      var li = el('li', 'r-item r-' + (i + 1));
      var no = el('span', 'r-no', f(L.rank, { n: i + 1 }));
      var ph = P[d[0]], pic = el('span', 'r-photo');
      if (ph) { var im = el('img'); im.src = ph[0]; im.alt = dishName(d); im.loading = 'lazy'; im.decoding = 'async'; pic.append(im); }
      var body = el('div', 'r-body');
      body.append(el('b', 'r-name', dishName(d)));
      if (dishSub(d)) body.append(el('span', 'r-sub', dishSub(d)));
      body.append(el('span', 'r-desc', dishDesc(d)));
      var key = p[0] + '|' + d[0], links = el('span', 'r-links');
      if (SHOPS[key]) { var s = el('a', 'r-btn on', L.shopsBtn); s.href = '#s-' + encodeURIComponent(key); links.append(s); }
      var m = el('a', 'r-btn', L.find); m.href = 'https://www.google.com/maps/search/' + encodeURIComponent(d[0] + ' ' + p[0]);
      m.rel = 'noopener noreferrer'; m.setAttribute('data-track', 'rank_food_search'); links.append(m);
      body.append(links);
      li.append(no, pic, body);
      ol.append(li);
    });
    sec.append(ol);
    root.append(sec); secs.push(sec);
  });

  function shopBox(key, d, label) {
    var box = el('li', 'r-shops'); box.id = 's-' + encodeURIComponent(key);
    box.append(el('h3', 'r-shops-t', (label ? label + (ja || lang === 'zh' ? '｜' : ' · ') : '') + f(L.shopsT, { d: dishName(d) })));
    var ol = el('ol', 'r-shop-list');
    sortShops(SHOPS[key]).slice(0, 3).forEach(function (s, i) {
      var li = el('li', 'r-shop');
      li.append(el('span', 'r-medal m' + (i + 1), String(i + 1)));
      var b = el('div', 'r-shop-body');
      var nm = el('b', 'r-shop-name', ja ? s.n : s.r);
      b.append(nm);
      if (!ja) b.append(el('span', 'r-sub', s.n));
      b.append(el('span', 'r-area', ja || lang === 'zh' ? s.a[0] : s.a[1]));
      var tags = el('span', 'r-tags');
      (s.aw || []).forEach(function (c) { tags.append(el('span', 'r-aw', awText(c))); });
      if (s.y) tags.append(el('span', 'r-since', f(L.since, { y: s.y })));
      else if (s.e && L.era[s.e]) tags.append(el('span', 'r-since', L.era[s.e]));
      b.append(tags);
      var lk = el('span', 'r-links');
      var m = el('a', 'r-btn', L.map); m.href = mapsUrl(s.q); m.rel = 'noopener noreferrer'; m.setAttribute('data-track', 'rank_shop_map');
      lk.append(m);
      if (s.src) { var sr = el('a', 'r-src', L.src); sr.href = s.src; sr.rel = 'noopener noreferrer'; lk.append(sr); }
      b.append(lk);
      li.append(b); ol.append(li);
    });
    box.append(ol, el('p', 'r-rule', f(L.rule, { c: window.GOURMET_SHOPS_CHECKED || '' })));
    return box;
  }

  var top = el('a', 'g-top', L.top); top.href = '#'; root.append(top);
  if (location.hash) { var t = document.getElementById(decodeURIComponent(location.hash.slice(1))) || document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
})();
