/*
 * Phase 5（スポットのくわしい画面・現在地の周辺・確認済みスポット）の画面テスト
 * 実行方法： cd tests/e2e && node run-phase5.js [index.htmlのパス]
 */
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const target = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
const LDIR = path.join(__dirname, 'node_modules/leaflet/dist');
const results = [];
const check = (name, ok, info = '') => { results.push(ok); console.log((ok ? '  OK  ' : '  NG  ') + name + (info ? '  ' + info : '')); };
let wdCalls = 0, wdMaxIds = 0;
async function route(page) {
  await page.route('**/*', (r) => {
    const u = r.request().url();
    if (u.includes('unpkg.com/leaflet')) {
      const f = path.join(LDIR, u.split('/dist/')[1].split('?')[0]);
      return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(f) });
    }
    if (u.includes('tile.openstreetmap.org')) return r.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(path.join(__dirname, 'fixtures/tile.png')) });
    if (u.includes('wikidata.org')) {
      wdCalls++;
      const ids = decodeURIComponent((u.split('ids=')[1] || '').split('&')[0]).split('|');
      wdMaxIds = Math.max(wdMaxIds, ids.length);
      return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"entities":{}}' });
    }
    if (u.includes('commons.wikimedia')) return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
    if (u.startsWith('file:')) return r.continue();
    return r.abort();
  });
}

(async () => {
  const browser = await chromium.launch();
  for (const [label, viewport] of [['スマホ 390px', { width: 390, height: 844 }], ['パソコン 1280px', { width: 1280, height: 900 }]]) {
    console.log('[' + label + ']');
    const ctx = await browser.newContext({ viewport, geolocation: { latitude: 34.9671, longitude: 135.7727 }, permissions: ['geolocation'] });
    const page = await ctx.newPage();
    const errors = [], dialogs = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
    await route(page);

    // #spot=ID で直接ひらく（伏見稲荷大社：公式情報あり）
    await page.goto('file://' + target + '#spot=osm-w96291583');
    await page.waitForSelector('#spot-detail[open]');
    const d1 = await page.textContent('#spot-detail');
    check('URLの #spot= でくわしい画面がひらく', /伏見稲荷大社/.test(await page.textContent('#detail-title')));
    check('公式情報を確認済みと日付', /公式情報を確認済み（2026年11月4日）/.test(d1));
    check('所在地・アクセス・公式サイト・確認した資料', /深草薮之内町68/.test(d1) && /稲荷駅/.test(d1) && /inari\.jp/.test(d1) && /確認した資料/.test(d1));
    check('参拝時間が確認できていないことを正直に表示', /公式サイトに記載が見当たりませんでした/.test(d1));
    check('「週末の候補」を含む4つの保存ボタン', (await page.$$('#spot-detail .keep-btn')).length === 4);
    await page.click('#spot-detail .keep-weekend');
    check('週末の候補に保存', await page.getAttribute('#spot-detail .keep-weekend', 'aria-pressed') === 'true');
    check('地図で行き方を見る（Googleマップ）', /google\.com\/maps\/dir/.test(await page.getAttribute('#spot-detail .detail-btns a', 'href')));
    const nears = await page.$$('#spot-detail .near-btn');
    check('近くの聖地（15km以内）が出る', nears.length > 0, nears.length + '件');
    const before = await page.textContent('#detail-title');
    await nears[0].click();
    check('近くの聖地を押すと、その画面に切りかわる', (await page.textContent('#detail-title')) !== before);
    const shareHref = await page.getAttribute('#spot-detail .share-line', 'href');
    check('この聖地を紹介：#spot= 付きのリンク', decodeURIComponent(shareHref).includes('#spot='));
    await page.click('#spot-detail .detail-close');
    check('閉じると画面とURLの #spot= が消える', !(await page.$eval('#spot-detail', (d) => d.open)) && !(await page.evaluate(() => location.hash)));

    // カードの「くわしく見る」（公式情報のないスポット）
    await page.fill('#keyword', '鹿島神宮');
    await page.waitForTimeout(500);
    await page.click('#results .card .btn-detail');
    await page.waitForSelector('#spot-detail[open]');
    check('カードの「くわしく見る」でひらく', /鹿島神宮/.test(await page.textContent('#detail-title')));
    await page.keyboard.press('Escape');
    check('Escキーで閉じる', !(await page.$eval('#spot-detail', (d) => d.open)));
    await page.fill('#keyword', '');

    // 公式情報を確認済みのスポットだけ
    await page.check('#only-verified');
    await page.waitForTimeout(400);
    const vCount = (await page.textContent('#count')).replace(/[^0-9]/g, '');
    check('確認済みだけに絞り込める', Number(vCount) >= 8 && (await page.$$eval('#results .card .badge', (bs) => bs.every((b) => b.textContent === '公式情報あり'))), vCount + '件');
    await page.uncheck('#only-verified');
    await page.waitForTimeout(400);
    const first = await page.textContent('#results .card h3');
    check('ふだんの検索は確認済みのスポットが先頭', ['明治神宮', '出雲大社', '伊勢神宮 内宮', '伏見稲荷大社', '厳島神社', '太宰府天満宮', '鹿島神宮', '春日大社'].includes(first), first);

    // 現在地の周辺
    await page.selectOption('#near-radius', '5');
    wdCalls = 0;
    await page.click('#near-start');
    await page.waitForSelector('.near-dist');
    check('現在地の周辺：件数のお知らせ', /現在地から5km以内のスポット：/.test(await page.textContent('#near-msg')));
    const dists = await page.$$eval('#results .near-dist', (ps) => ps.map((p) => Number((/約([\d.]+)km/.exec(p.textContent) || [])[1])));
    check('近い順・5km以内', dists.length > 0 && dists.every((x, i) => x <= 5 && (i === 0 || x >= dists[i - 1])), dists.slice(0, 5).join(','));
    await page.waitForTimeout(500);
    check('検索結果の写真は50件ずつまとめて問い合わせ', wdCalls >= 1 && wdMaxIds <= 50, wdCalls + '回・最大' + wdMaxIds + '件');
    await page.click('#near-stop');
    check('周辺検索をやめられる', !(await page.$('.near-dist')));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check('横にはみ出さない', overflow <= 0, 'overflow=' + overflow);
    check('ダイアログ（alert）を使わない', dialogs.length === 0);
    check('エラーなし', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // 位置情報を許可しない場合
  console.log('[位置情報を許可しない]');
  const c2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await c2.newPage();
  await route(p2);
  await p2.goto('file://' + target);
  await p2.evaluate(() => { navigator.geolocation.getCurrentPosition = (ok, ng) => setTimeout(() => ng({ code: 1, message: 'denied' }), 10); });
  await p2.click('#near-start');
  await p2.waitForTimeout(200);
  check('許可されなかったことを案内し、ほかの探し方を示す', /許可されませんでした/.test(await p2.textContent('#near-msg')));
  check('ボタンは押せる状態に戻る', !(await p2.$eval('#near-start', (b) => b.disabled)));
  await c2.close();

  await browser.close();
  const ng = results.filter((r) => !r).length;
  console.log('\n結果：' + (results.length - ng) + '件成功 / ' + ng + '件失敗');
  process.exit(ng ? 1 : 0);
})();
