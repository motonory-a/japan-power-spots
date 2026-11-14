/* ご当地グルメ図鑑（gourmet.html）。データは data/gourmet.js（GOURMET）と data/food-photos.js（FOOD_PHOTOS）
   言語は <html data-glang="ja|en|zh|ko|fr|es">。料理の名前と説明は日本語か英語（中国語版は日本語名＋英語の説明）。 */
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
    ja: { regions: ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'], all: 'すべて', search: '料理名や県名でさがす（例：うどん、京都）', none: '見つかりませんでした。別のことばで試してみてください。', maps: 'お店を探す', spots: 'のパワースポットを探す', count: '{n}品', hits: '{n}品が見つかりました', credit: '写真', top: '↑ 上へ' },
    en: { regions: ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu & Okinawa'], all: 'All', search: 'Search by dish or prefecture (e.g. udon, Kyoto)', none: 'Nothing found. Try another word.', maps: 'Find a place', spots: 'Find power spots in ', count: '{n} dishes', hits: '{n} dishes found', credit: 'Photo', top: '↑ Top' },
    zh: { regions: ['北海道', '東北', '關東', '中部', '近畿', '中國', '四國', '九州・沖繩'], all: '全部', search: '輸入料理名或縣名搜尋（例：うどん、Kyoto）', none: '找不到符合的料理，請換個關鍵字。', maps: '找店家', spots: '尋找能量景點：', count: '{n}道', hits: '找到 {n} 道料理', credit: '照片', top: '↑ 回到頂端' },
    ko: { regions: ['홋카이도', '도호쿠', '간토', '주부', '간사이', '주고쿠', '시코쿠', '규슈·오키나와'], all: '전체', search: '요리명이나 지역으로 찾기 (예: udon, Kyoto)', none: '찾을 수 없어요. 다른 단어로 찾아보세요.', maps: '가게 찾기', spots: '파워스폿 찾기: ', count: '{n}가지', hits: '{n}가지 요리를 찾았어요', credit: '사진', top: '↑ 맨 위로' },
    fr: { regions: ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu et Okinawa'], all: 'Tout', search: 'Chercher un plat ou une préfecture (ex. udon, Kyoto)', none: 'Aucun résultat. Essayez un autre mot.', maps: 'Trouver une adresse', spots: 'Lieux sacrés : ', count: '{n} plats', hits: '{n} plats trouvés', credit: 'Photo', top: '↑ Haut' },
    es: { regions: ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu y Okinawa'], all: 'Todo', search: 'Busca un plato o una prefectura (p. ej. udon, Kyoto)', none: 'No hay resultados. Prueba con otra palabra.', maps: 'Buscar un sitio', spots: 'Lugares sagrados: ', count: '{n} platos', hits: '{n} platos encontrados', credit: 'Foto', top: '↑ Arriba' }
  };
  var lang = document.documentElement.getAttribute('data-glang') || 'ja';
  var L = T[lang] || T.en, ja = lang === 'ja';
  var G = window.GOURMET || {}, P = window.FOOD_PHOTOS || {};
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fmt(s, n) { return s.replace('{n}', n); }
  function prefName(p) { return ja ? p[0] : p[1]; }
  function dishName(d) { return ja || lang === 'zh' ? d[0] : d[1]; }
  function dishSub(d) { return lang === 'zh' ? d[1] : ''; }
  function dishDesc(d) { return ja ? d[2] : d[3]; }
  var spotsHref = document.documentElement.getAttribute('data-spots') || './';

  var root = document.getElementById('gourmet');
  if (!root) return;
  // ヒーローの写真（見た瞬間に「食べたい」と思える、色の明るい料理）
  var mosaic = document.getElementById('g-mosaic');
  if (mosaic) ['海鮮丼', '広島風お好み焼き', 'ひつまぶし', '長崎ちゃんぽん', '鯛めし', 'タコライス'].forEach(function (n) {
    var ph = P[n]; if (!ph) return; var i = el('img'); i.src = ph[0].replace('/250px-', '/500px-'); i.alt = ''; i.decoding = 'async'; mosaic.append(i);
  });
  var total = 0; PREFS.forEach(function (p) { total += (G[p[0]] || []).length; });
  var cnt = document.getElementById('g-total'); if (cnt) cnt.textContent = String(total);

  // 地方のボタンと検索
  var bar = el('div', 'g-bar');
  var input = el('input', 'g-search'); input.type = 'search'; input.placeholder = L.search; input.setAttribute('aria-label', L.search);
  var chips = el('div', 'g-chips');
  var regionSel = -1;
  [L.all].concat(L.regions).forEach(function (name, i) {
    var b = el('button', 'g-chip' + (i === 0 ? ' on' : ''), name); b.type = 'button';
    b.addEventListener('click', function () {
      regionSel = i - 1;
      Array.prototype.forEach.call(chips.children, function (c, j) { c.classList.toggle('on', j === i); });
      apply();
      if (i > 0) { var first = root.querySelector('.g-pref:not([hidden])'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    chips.append(b);
  });
  var status = el('p', 'g-status'); status.setAttribute('aria-live', 'polite');
  bar.append(input, chips);
  root.append(bar, status);

  var sections = [];
  PREFS.forEach(function (p, pi) {
    var list = G[p[0]] || [];
    if (!list.length) return;
    var sec = el('section', 'g-pref'); sec.id = 'p-' + (pi + 1); sec.dataset.region = p[2];
    var h = el('h2', 'g-pref-name'); h.append(document.createTextNode(prefName(p)), el('span', 'g-pref-count', fmt(L.count, list.length)));
    sec.append(h);
    var grid = el('div', 'g-grid'), cards = [];
    list.forEach(function (d) {
      var ph = P[d[0]];
      var card = el('article', 'g-card' + (ph ? '' : ' no-photo'));
      card.dataset.q = (d[0] + ' ' + d[1] + ' ' + p[0] + ' ' + p[1]).toLowerCase();
      if (ph) {
        var a = el('a', 'g-photo'); a.href = ph[1]; a.target = '_blank'; a.rel = 'noopener noreferrer';
        var img = el('img'); img.src = ph[0]; img.srcset = ph[0] + ' 250w, ' + ph[0].replace('/250px-', '/500px-') + ' 500w';
        img.sizes = '(max-width: 560px) 46vw, 240px'; img.alt = dishName(d); img.loading = 'lazy'; img.decoding = 'async';
        img.onerror = function () { a.remove(); card.classList.add('no-photo'); };
        a.append(img); card.append(a);
      }
      var body = el('div', 'g-body');
      body.append(el('h3', 'g-name', dishName(d)));
      if (dishSub(d)) body.append(el('p', 'g-sub', dishSub(d)));
      body.append(el('p', 'g-desc', dishDesc(d)));
      var m = el('a', 'g-maps', L.maps); m.target = '_blank'; m.rel = 'noopener noreferrer'; m.setAttribute('data-track', 'food_search');
      m.href = 'https://www.google.com/maps/search/' + encodeURIComponent(d[0] + ' ' + p[0]);
      body.append(m);
      if (ph) body.append(el('p', 'g-credit', L.credit + ': ' + (ph[2] || 'unknown') + ' / ' + ph[3]));
      card.append(body); grid.append(card); cards.push(card);
    });
    sec.append(grid);
    var go = el('a', 'g-go', ja ? prefName(p) + L.spots : L.spots + prefName(p)); go.href = spotsHref;
    sec.append(go);
    root.append(sec);
    sections.push({ sec: sec, cards: cards, region: p[2] });
  });
  var none = el('p', 'g-none', L.none); none.hidden = true; root.append(none);
  var top = el('a', 'g-top', L.top); top.href = '#'; root.append(top);

  function apply() {
    var q = input.value.trim().toLowerCase(), hits = 0;
    sections.forEach(function (s) {
      var inRegion = regionSel < 0 || s.region === regionSel, shown = 0;
      s.cards.forEach(function (c) { var ok = inRegion && (!q || c.dataset.q.indexOf(q) >= 0); c.hidden = !ok; if (ok) shown++; });
      s.sec.hidden = !shown; hits += shown;
    });
    none.hidden = hits > 0;
    status.textContent = q ? fmt(L.hits, hits) : '';
  }
  var timer; input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 150); });
  // #p-13 のように県を指定して開いたとき
  if (/^#p-\d+$/.test(location.hash)) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
})();
