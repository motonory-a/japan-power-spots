/*
 * モデルコース（v3.11）の確認
 * 実行方法： cd tests/e2e && node run-courses.js [index.htmlのパス]
 */
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const target = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
const LDIR = path.join(__dirname, 'node_modules/leaflet/dist');
const results = [];
const check = (name, ok, info = '') => { results.push(ok); console.log((ok ? '  OK  ' : '  NG  ') + name + (info ? '  ' + info : '')); };
async function route(page) {
  await page.route('**/*', (r) => {
    const u = r.request().url();
    if (u.includes('unpkg.com/leaflet')) {
      const f = path.join(LDIR, u.split('/dist/')[1].split('?')[0]);
      return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(f) });
    }
    if (u.includes('tile.openstreetmap.org')) return r.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(path.join(__dirname, 'fixtures/tile.png')) });
    if (u.includes('wikidata.org') || u.includes('commons.wikimedia')) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"entities":{}}' });
    if (u.startsWith('file:')) return r.continue();
    return r.abort();
  });
}
async function setBD(page, v) { const [y, m, d] = v.split('-').map(Number); await page.fill('#bd-y', String(y)); await page.selectOption('#bd-m', String(m)); await page.selectOption('#bd-d', String(d)); }
async function setRowBD(row, v) { const s = await row.$$('.bd-row select'); const [y, m, d] = v.split('-').map(Number); await s[0].selectOption(String(y)); await s[1].selectOption(String(m)); await s[2].selectOption(String(d)); }

(async () => {
  console.log('[コースのデータ]');
  const vm = require('vm');
  const root = path.join(__dirname, '../..');
  const sb = {}; vm.createContext(sb);
  for (const f of ['data/curated-info.js', 'data/model-courses.js']) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8').replace(/^var (\w+)/m, 'globalThis.$1'), sb);
  const C = sb.MODEL_COURSES, INFO = sb.CURATED_INFO;
  const regions = ['北海道・東北', '関東', '中部', '近畿', '中国・四国', '九州・沖縄'];
  const dist = (a, b) => { const r = Math.PI / 180; const x = Math.sin((b.lat - a.lat) * r / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin((b.lon - a.lon) * r / 2) ** 2; return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); };
  check('コースが40以上', C.length >= 40, C.length + 'コース');
  check('コースIDが重ならない', new Set(C.map((c) => c.id)).size === C.length);
  check('どのコースも地方・タイトル・説明・移動手段がある', C.every((c) => regions.includes(c.region) && c.title && c.lead && ['train', 'car'].includes(c.mode)));
  check('6つの地方すべてにコース', regions.every((r) => C.some((c) => c.region === r)));
  check('どのコースも2〜5か所', C.every((c) => c.stops.length >= 2 && c.stops.length <= 5));
  check('すべてのスポットが公式情報を確認済み', C.every((c) => c.stops.every((s) => INFO[s.q])));
  check('1つのコースに同じスポットが重ならない', C.every((c) => new Set(c.stops.map((s) => s.q)).size === c.stops.length));
  const maxLeg = Math.max(...C.flatMap((c) => c.stops.slice(1).map((s, i) => dist(c.stops[i], s))));
  check('となりのスポットまで直線35km以内', maxLeg <= 35, '最大' + maxLeg.toFixed(1) + 'km');
  check('電車・バス向きのコースは、となりまで直線12km以内', C.filter((c) => c.mode === 'train').every((c) => c.stops.slice(1).every((s, i) => dist(c.stops[i], s) <= 12)));
  check('説明文にご利益の言葉を書かない', C.every((c) => !/ご利益|縁結び|金運|開運|厄除|パワー/.test(c.title + c.lead + (c.caution || ''))));

  const browser = await chromium.launch();
  for (const [label, viewport] of [['スマホ 390px', { width: 390, height: 844 }], ['パソコン 1280px', { width: 1280, height: 900 }]]) {
    console.log('[' + label + ']');
    const ctx = await browser.newContext({ viewport, timezoneId: 'Asia/Tokyo' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await route(page);
    await page.clock.setFixedTime(new Date('2026-11-05T01:00:00Z'));
    await page.goto('file://' + target);
    await page.waitForSelector('#courses:not([hidden]) .course-card');
    check('モデルコースの欄が出る', (await page.textContent('#h-courses')).trim() === 'モデルコース');
    check('最初は6コース', (await page.$$('.course-card')).length === 6);
    check('地方のボタン（すべて＋6地方）', (await page.$$('.course-chip')).length === 7);
    await page.click('#course-more');
    check('「ほかのコースも見る」で全部', (await page.$$('.course-card')).length === C.length);
    await page.click('.course-chip:has-text("近畿")');
    const kinki = await page.$$eval('.course-card .course-title', (t) => t.map((x) => x.textContent));
    check('地方で絞りこめる（近畿）', kinki.length === Math.min(6, C.filter((c) => c.region === '近畿').length) && kinki.some((t) => /奈良公園/.test(t)));
    check('押した地方のボタンが選択中', (await page.getAttribute('.course-chip:has-text("近畿")', 'aria-pressed')) === 'true');
    const card = await page.$('#course-nara-park');
    check('番号つきで順番が出る', (await card.$$('.course-num')).length === 4);
    check('となりまでの直線距離', /直線で約\d/.test(await card.textContent()));
    check('参拝時間を表示', /参拝時間：/.test(await card.textContent()));
    const href = await card.$eval('a.btn-sub', (a) => a.href);
    check('Googleマップの道順（経由地つき）', /google\.com\/maps\/dir\/\?api=1&origin=.+&destination=.+&waypoints=/.test(href));
    check('LINEで誘うにコースのURL', /course%3Dnara-park/.test(await card.$eval('.btn-invite', (a) => a.href)));
    await card.$eval('.course-stop-name', (b) => b.click());
    await page.waitForSelector('#spot-detail[open]');
    check('スポット名でくわしい画面', /東大寺/.test(await page.textContent('#detail-title')));
    check('くわしい画面に「このスポットをめぐるモデルコース」', /奈良公園の社寺/.test(await page.textContent('.detail-courses')));
    await page.click('.detail-close');
    // 注意書き
    await page.click('.course-chip:has-text("中部")');
    if (!(await page.$('#course-kanazawa'))) await page.click('#course-more');
    check('予約が必要なスポットの注意書き', /電話での事前予約/.test(await page.textContent('#course-kanazawa .course-caution')));

    // 診断すると出発地から近い順に
    await page.click('.chip-cat:has-text("金運")');
    await setBD(page, '1974-04-15');
    await page.selectOption('#home', '大阪府');
    await page.click('#diagnose');
    await page.waitForSelector('#recommended .card', { timeout: 30000 });
    await page.waitForTimeout(300);
    check('出発地から近い順の説明', /出発地（.*大阪.*）から近い順/.test(await page.textContent('#course-note')));
    const firstRegion = await page.$eval('.course-card .tag-near', (t) => t.textContent);
    const kms = await page.$$eval('.course-card .tag-near', (ts) => ts.map((t) => parseFloat(t.textContent.replace(/[^\d.]/g, ''))));
    check('距離が近い順に並ぶ', kms.length > 0 && kms.every((k, i) => !i || kms[i - 1] <= k), firstRegion);
    await page.click('.course-chip:has-text("すべて")');
    const top = await page.$eval('.course-card', (c) => ({ t: c.querySelector('.course-title').textContent, km: parseFloat(c.querySelector('.tag-near').textContent.replace(/[^\d.]/g, '')) }));
    check('「すべて」なら大阪のコースがいちばん近い', /大阪/.test(top.t) && top.km < 10, top.t + ' ' + top.km + 'km');
    const oc = await page.$('#outing .outing-course');
    if (oc) {
      await page.click('#outing .btn-course');
      await page.waitForTimeout(800);
      check('お出かけ提案から近くのモデルコースへ', (await page.$$('.course-card.course-focus')).length === 1);
    } else check('お出かけ提案（近くにコースがないときは出さない）', true);

    // #course= で直接ひらく
    await page.goto('file://' + target + '#course=kumano');
    await page.waitForSelector('#course-kumano');
    check('#course=ID でそのコースが出る', !!(await page.$('#course-kumano')));
    check('画面のエラーなし', errors.length === 0, errors.join(' / '));
    await ctx.close();
  }
  await browser.close();
  const ng = results.filter((r) => !r).length;
  console.log('\n結果：' + (results.length - ng) + '件成功 / ' + ng + '件失敗');
  process.exit(ng ? 1 : 0);
})();
