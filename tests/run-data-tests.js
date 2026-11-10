/*
 * 全国スポットデータ（data/spots-osm.js）の検査
 * 実行方法： node tests/run-data-tests.js
 */
'use strict';
const assert = require('assert');
const { SPOTS_OSM, SPOTS_OSM_META } = require('../data/spots-osm.js');
global.PREFECTURES = require('../data/spots-demo.js').PREFECTURES;
global.SPOTS = require('../data/spots-demo.js').SPOTS;
global.WISH_OPTIONS = require('../data/spots-demo.js').WISH_OPTIONS;
global.SPOTS_OSM = SPOTS_OSM;
global.SPOTS_OSM_META = SPOTS_OSM_META;
const SpotData = require('../assets/js/data.js');
const D = require('../assets/js/diagnosis.js');
const cfg = require('../assets/js/config.js');
const { WISH_OPTIONS } = require('../data/spots-demo.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log('  OK  ' + name); }
  catch (e) { fail++; console.log('  NG  ' + name + '\n      ' + e.message); }
}

const core = SpotData.mergeCurated(SPOTS_OSM.map(SpotData.fromRow), global.SPOTS);
const path = require('path');
const extraRows = (SPOTS_OSM_META.extraParts || []).map((p) => require(path.join('..', p))).reduce((a, b) => a.concat(b), []);
const all = core.concat(extraRows.map(SpotData.fromRow));

console.log('全国データ');
test('最初に読み込む中心データは1万件前後（9,900件以上）', () => assert.ok(SPOTS_OSM.length >= 9900, String(SPOTS_OSM.length)));
test('追加分を含めて9万件以上・10万件以内', () => assert.ok(all.length >= 90000 && all.length <= 100000, String(all.length)));
test('追加データは複数ファイル（各2MB以下）', () => {
  const fs = require('fs');
  assert.ok((SPOTS_OSM_META.extraParts || []).length >= 4);
  SPOTS_OSM_META.extraParts.forEach((p) => assert.ok(fs.statSync(path.join(__dirname, '..', p)).size < 2.2e6, p));
});
test('メタ情報の合計件数と一致', () => assert.strictEqual(SPOTS_OSM_META.total, SPOTS_OSM.length + extraRows.length));
test('IDの重複なし', () => assert.strictEqual(new Set(all.map((s) => s.id)).size, all.length));
test('名前・座標・都道府県がそろっている', () => all.forEach((s) => {
  assert.ok(s.name && s.prefecture, s.id);
  assert.ok(s.lat > 20 && s.lat < 46 && s.lon > 122 && s.lon < 154, s.id + ' ' + s.lat + ',' + s.lon);
}));
test('47都道府県すべてに30件以上', () => {
  const c = {};
  all.forEach((s) => { c[s.prefecture] = (c[s.prefecture] || 0) + 1; });
  global.PREFECTURES.forEach((p) => assert.ok((c[p[1]] || 0) >= 30, p[1] + ' ' + c[p[1]]));
});
test('都道府県の判定が大きく外れていない（県庁から600km以内、北海道・東京・鹿児島・沖縄は離島があるため除く）', () => {
  const far = all.filter((s) => {
    if (['北海道', '東京都', '鹿児島県', '沖縄県'].indexOf(s.prefecture) !== -1) return false;
    const p = global.PREFECTURES.find((x) => x[1] === s.prefecture);
    return D.distanceKm(p[2], p[3], s.lat, s.lon) > 600;
  });
  assert.deepStrictEqual(far.map((s) => s.name), []);
});
test('タグはすべて選択肢に存在する', () => {
  const keys = new Set(WISH_OPTIONS.map((w) => w.key));
  all.forEach((s) => s.wishes.forEach((w) => assert.ok(keys.has(w), s.name + ' ' + w)));
});
test('数秘ナンバーは1〜9が1〜3個', () => all.forEach((s) => {
  assert.ok(s.numbers.length >= 1 && s.numbers.length <= 3, s.name);
  s.numbers.forEach((n) => assert.ok(n >= 1 && n <= 9));
}));
test('日本語の名前（英字だけの名前なし）', () => all.forEach((s) => assert.ok(/[぀-ヿ㐀-鿿]/.test(s.name), s.name)));
test('親スポットは実在する', () => {
  const ids = new Set(all.map((s) => s.id));
  all.filter((s) => s.parent_id).forEach((s) => assert.ok(ids.has(s.parent_id), s.name));
});
test('出典URL（OpenStreetMap）が付いている', () => all.filter((s) => s.id.indexOf('osm-') === 0).forEach((s) => assert.ok(/^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/.test(s.source_urls[0]), s.id)));
test('巨樹調査のスポット：出典・樹種・幹周の説明', () => {
  const t = all.filter((s) => s.id.indexOf('bt-') === 0);
  assert.ok(t.length > 3000, String(t.length));
  t.forEach((s) => { assert.strictEqual(s.source_urls[0], 'https://kyoju.biodic.go.jp/'); assert.strictEqual(s.category, '巨木'); });
  assert.ok(t.filter((s) => /幹周 約[0-9.]+m/.test(s.description)).length > t.length * 0.9);
  assert.ok(t.some((s) => s.heritage === '天然記念物（国）'));
});
test('Wikidataだけのスポットは出典がWikidata', () => {
  const w = all.filter((s) => s.id.indexOf('wd-') === 0);
  assert.ok(w.length > 1000);
  w.forEach((s) => assert.ok(/^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/.test(s.source_urls[0]), s.id));
});
test('祭神からご利益（伏見稲荷大社：商売繁盛、太宰府天満宮：学業・合格）', () => {
  const f = all.find((s) => s.name === '伏見稲荷大社' && s.prefecture === '京都府');
  const d = all.find((s) => s.name === '太宰府天満宮');
  assert.ok(f && f.wishes.includes('商売繁盛'));
  assert.ok(d && d.wishes.includes('学業・合格'));
});
test('国宝・世界遺産の情報が入っている（2,000件以上で祭神、100件以上で文化財）', () => {
  assert.ok(all.filter((s) => s.deities && s.deities.length).length > 2000);
  assert.ok(all.filter((s) => s.heritage).length > 100);
});
test('同じ名前で900m以内の重複がない', () => {
  const byName = {};
  all.forEach((s) => (byName[s.name] = byName[s.name] || []).push(s));
  const ng = [];
  Object.values(byName).forEach((list) => {
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      if (D.distanceKm(list[i].lat, list[i].lon, list[j].lat, list[j].lon) < 0.9) ng.push(list[i].name);
    }
  });
  assert.deepStrictEqual(ng, []);
});

console.log('代表的なスポットが入っている');
['伊勢神宮', '出雲大社', '明治神宮', '伏見稲荷大社', '鹿島神宮', '香取神宮', '熊野那智大社', '那智滝', '金剛峯寺', '富士山',
  '厳島神社', '日光東照宮', '太宰府天満宮', '箱根神社', '戸隠神社', '三峯神社', '宗像大社', '浅草寺', '清水寺', '善光寺',
  '春日大社', '熱田神宮', '住吉大社', '鶴岡八幡宮', '石清水八幡宮', '大神神社', '高千穂峰', '霧島神宮', '諏訪大社'].forEach((n) => {
  test(n, () => assert.ok(all.some((s) => s.name.indexOf(n) !== -1), n));
});
test('推定のご利益にはご利益の項目だけが入る', () => {
  const benefit = new Set(WISH_OPTIONS.filter((w) => w.group === 'ご利益').map((w) => w.key));
  all.forEach((s) => (s.wishesInferred || []).forEach((w) => assert.ok(benefit.has(w), s.name + ' ' + w)));
});
test('手入力の説明文が反映されている（明治神宮）', () => {
  const m = all.find((s) => s.name === '明治神宮' && s.prefecture === '東京都');
  assert.ok(m && m.curated && m.description.indexOf('鎮守の森') !== -1);
});

console.log('推薦の計算（1万件）');
test('東京から、出かける日あり・願いありで全件（9万件）を1秒以内に計算できる', () => {
  const K = require('../assets/js/kyusei.js');
  const t = Date.now();
  const boards = K.boardsFor('2026-11-04', K.birthStars('1974-04-15'));
  const r = D.rankSpots(all, { number: 4, origin: { lat: 35.69, lon: 139.692 }, wishes: ['商売繁盛', '滝'], mode: 'transit', limitMinutes: 180, boards }, cfg, { top: 300 });
  const ms = Date.now() - t;
  assert.ok(ms < 1000, ms + 'ms');
  assert.ok(r[0].withinLimit && r[0].hitWishes.length > 0);
});
test('商売繁盛を選ぶと稲荷・恵比寿などが上位に入る', () => {
  const r = D.rankSpots(all, { number: 8, origin: { lat: 34.686, lon: 135.52 }, wishes: ['商売繁盛'], mode: 'transit' }, cfg);
  assert.ok(r.slice(0, 5).every((s) => s.wishes.indexOf('商売繁盛') !== -1), r.slice(0, 5).map((s) => s.name).join(','));
});

test('上位だけ詳しく作っても、全件と同じ順位になる', () => {
  const inp = { number: 7, origin: { lat: 34.686, lon: 135.52 }, wishes: ['学業・合格'], mode: 'car', limitMinutes: 120 };
  const a = D.rankSpots(all.slice(0, 20000), inp, cfg), b = D.rankSpots(all.slice(0, 20000), inp, cfg, { top: 50 });
  assert.deepStrictEqual(b.map((s) => s.id), a.slice(0, 50).map((s) => s.id));
  assert.strictEqual(b.withinCount, a.filter((s) => s.withinLimit).length);
  assert.strictEqual(b.anyWishHit, a.some((s) => s.hitWishes.length > 0));
});

console.log('厳選スポットの確認済み情報');
const { CURATED_INFO } = require('../data/curated-info.js');
const ids = Object.keys(CURATED_INFO);
test('どの情報にも公式サイト・確認した資料・最終確認日がある', () => {
  ids.forEach((q) => {
    const v = CURATED_INFO[q];
    assert.ok(/^https?:\/\//.test(v.official), q);
    assert.ok(Array.isArray(v.sources) && v.sources.length && v.sources.every((x) => x[0] && /^https:\/\//.test(x[1])), q);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(v.checked), q);
    assert.ok(v.address, q);
  });
});
test('Wikidataの番号で全国データのスポットに結びつく', () => {
  global.CURATED_INFO = CURATED_INFO;
  const merged = SpotData.mergeCurated(SPOTS_OSM.map(SpotData.fromRow), global.SPOTS).map(SpotData.applyVerified);
  ids.forEach((q) => {
    const s = merged.find((x) => x.wikidata === q);
    assert.ok(s, q + ' ' + CURATED_INFO[q].name);
    assert.strictEqual(s.verification_status, 'verified');
    assert.ok(s.featured);
  });
  assert.strictEqual(merged.filter((s) => s.verified).length, ids.length);
  delete global.CURATED_INFO;
});
test('確認できていない項目は書かない（空文字や「不明」を入れない）', () => {
  ids.forEach((q) => Object.entries(CURATED_INFO[q]).forEach(([k, v]) => {
    if (typeof v === 'string') assert.ok(v.trim() && !/不明|未確認|TODO/.test(v), q + ' ' + k);
  }));
});

console.log('有名スポットのご利益（手入力）');
const { KNOWN_BENEFITS } = require('../data/known-benefits.js');
const benefitKeys = new Set(WISH_OPTIONS.filter((o) => o.group === 'ご利益').map((o) => o.key));
test('ご利益の名前は選択肢と同じ書き方', () => {
  Object.entries(KNOWN_BENEFITS).forEach(([q, ws]) => {
    assert.ok(/^Q\d+$/.test(q), q);
    assert.ok(ws.length && ws.every((w) => benefitKeys.has(w)), q + ' ' + ws.join(','));
  });
});
test('Wikidataの番号で全国データのスポットに結びつき、ご利益が足される', () => {
  global.KNOWN_BENEFITS = KNOWN_BENEFITS;
  const rows = SPOTS_OSM.slice();
  const fsx = require('fs'), vmx = require('vm');
  fsx.readdirSync(__dirname + '/../data/extra').forEach((f) => {
    const sd = { addRows: (a) => a.forEach((r) => rows.push(r)) };
    const sb = { SpotData: sd, window: { SpotData: sd } };
    vmx.runInNewContext(fsx.readFileSync(__dirname + '/../data/extra/' + f, 'utf8'), sb);
  });
  const byQ = {};
  rows.forEach((r) => { if (r[11] && !byQ[r[11]]) byQ[r[11]] = r; });
  Object.keys(KNOWN_BENEFITS).forEach((q) => {
    assert.ok(byQ[q], q + ' が全国データにない');
    const s = SpotData.applyVerified(SpotData.fromRow(byQ[q]));
    KNOWN_BENEFITS[q].forEach((w) => {
      assert.ok(s.wishes.includes(w) && s.wishesInferred.includes(w), q + ' ' + w);
    });
  });
  const kifune = SpotData.applyVerified(SpotData.fromRow(byQ.Q276779));
  assert.ok(kifune.wishes.includes('恋愛・縁結び'), '貴船神社に縁結び');
  delete global.KNOWN_BENEFITS;
});

console.log('\n結果：' + pass + '件成功 / ' + fail + '件失敗');
process.exit(fail ? 1 : 0);
