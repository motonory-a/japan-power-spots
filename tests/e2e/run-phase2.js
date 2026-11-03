/*
 * Phase 2（トップ画面とデザイン）の画面テスト
 * 実行方法： cd tests/e2e && npm install && node run-phase2.js [index.htmlのパス]
 * 外部への通信はすべて止め、地図ライブラリと地図タイルは手元のファイルで代用する。
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
    if (u.startsWith('file:')) return r.continue();
    return r.abort();
  });
}

(async () => {
  const browser = await chromium.launch();

  for (const [label, viewport] of [['スマホ 390px', { width: 390, height: 844 }], ['パソコン 1280px', { width: 1280, height: 900 }]]) {
    console.log('[' + label + ']');
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await route(page);
    await page.goto('file://' + target);
    await page.waitForSelector('.wish-tile');

    // 1. メイン画像・コピー・ボタン
    const img = await page.$eval('.hero-img', (i) => ({ w: i.naturalWidth, alt: i.alt, top: i.getBoundingClientRect().top }));
    check('メイン画像が読み込まれる', img.w > 0, 'naturalWidth=' + img.w);
    check('メイン画像が画面のいちばん上', Math.abs(img.top) < 1);
    check('見出し(h1)がサイト名として読み上げられる', /日本全国パワースポット巡り/.test(img.alt) && await page.$eval('h1', (h) => !!h.querySelector('img')));
    check('トップコピー', (await page.textContent('.hero-catch')).trim() === '次のお休み、運命の聖地へ。');
    check('サブコピー', (await page.textContent('.hero-sub')).replace(/\s/g, '') === 'あなたの毎日に、小さな奇跡とときめくお出かけを。');
    check('メインボタンの文言', (await page.textContent('.hero-cta')).trim() === '私だけの聖地を見つける');
    const cta = await page.$eval('.hero-cta', (a) => { const r = a.getBoundingClientRect(); return { h: r.height, bottom: r.bottom }; });
    check('メインボタンの高さが48px以上', cta.h >= 48, Math.round(cta.h) + 'px');
    check('最初の画面にメインボタンが見えている', cta.bottom <= viewport.height, 'bottom=' + Math.round(cta.bottom));
    await page.click('.hero-cta');
    await page.waitForTimeout(900);
    const diagTop = await page.$eval('#h-diagnose', (h) => h.getBoundingClientRect().top);
    check('メインボタンで診断へ移動する', diagTop >= -5 && diagTop < 200, 'top=' + Math.round(diagTop));

    // 2. コーナーの並び（仕様書03の順）
    const order = await page.$$eval('main > section', (ss) => ss.map((s) => s.id || s.getAttribute('aria-labelledby')));
    const idx = (k) => order.indexOf(k);
    check('並び順：幸せの扉 → 願いごと → 診断 → 今日の聖地 → スタンプ帳 → 検索',
      idx('daily-door') < idx('wish-entry') && idx('wish-entry') < idx('h-diagnose') && idx('h-diagnose') < idx('daily-spot') &&
      idx('daily-spot') < idx('collection') && idx('collection') < idx('h-search'), order.join(' / '));
    const hiddenOk = await page.$$eval('#daily-door, #daily-spot, #collection', (ss) => ss.every((s) => s.hidden && s.offsetHeight === 0));
    check('Phase 3 の枠は中身が入るまで表示しない', hiddenOk);

    // 3. 願いごとから探す
    check('願いごとのタイルが8つ', (await page.$$('.wish-tile')).length === 8);
    const tileH = await page.$$eval('.wish-tile', (ts) => Math.min(...ts.map((t) => t.getBoundingClientRect().height)));
    check('タイルの高さが48px以上', tileH >= 48, Math.round(tileH) + 'px');
    await page.click('.wish-tile:has-text("金運")');
    await page.waitForTimeout(600);
    const checked = await page.$$eval('input[name=wish]:checked', (cs) => cs.map((c) => c.value).sort());
    check('「金運」で 金運・商売繁盛 が選ばれる', JSON.stringify(checked) === JSON.stringify(['商売繁盛', '金運']), checked.join('・'));
    check('選択中の表示が更新される', /金運/.test(await page.textContent('#wish-selected')));
    check('押したタイルが選択状態になる', await page.$eval('.wish-tile:has-text("金運")', (b) => b.getAttribute('aria-pressed') === 'true'));
    check('お知らせの文が出る', /金運/.test(await page.textContent('#wish-tile-msg')));
    await page.click('.wish-tile:has-text("癒やし")');
    await page.waitForTimeout(300);
    const checked2 = await page.$$eval('input[name=wish]:checked', (cs) => cs.map((c) => c.value).sort());
    check('別のタイルで選び直せる（前の選択は外れる）', JSON.stringify(checked2) === JSON.stringify(['森林', '浄化', '自然'].sort()), checked2.join('・'));
    check('選択状態は1つだけ', (await page.$$('.wish-tile[aria-pressed=true]')).length === 1);

    // 診断ボタン：入力の途中でも画面の下に見えている
    await page.$eval('#wishes', (e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(300);
    const goBtn = await page.$eval('#diagnose', (b) => { const r = b.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, h: r.height }; });
    check('入力の途中でも診断ボタンが画面内に見える', goBtn.top >= 0 && goBtn.bottom <= viewport.height, 'top=' + Math.round(goBtn.top));
    check('診断ボタンの高さが56px以上', goBtn.h >= 56, Math.round(goBtn.h) + 'px');
    check('診断ボタンの文言', (await page.textContent('#diagnose')).replace(/✦/g, '').trim() === 'おすすめスポットを診断する');

    // 4. 診断が今まで通り動く（TOP5）
    await page.selectOption('#bd-y', '1974'); await page.selectOption('#bd-m', '4'); await page.selectOption('#bd-d', '15');
    await page.selectOption('#home', '東京都');
    await page.click('#diagnose');
    await page.waitForSelector('#recommended .card', { timeout: 30000 });
    check('診断結果はTOP5', (await page.$$('#recommended .card')).length === 5);
    check('診断の後に公式LINEの案内', await page.$eval('.line-box .btn-line', (a) => a.href === 'https://lin.ee/wHX3skr3' && a.target === '_blank' && /noopener/.test(a.rel)));

    // 5. 関連サイト・広告表示・使い方
    check('魂の系統鑑定バナーに「広告」表示', (await page.textContent('.ad-banner .ad-label')).trim() === '広告');
    check('バナー画像に説明文', await page.$eval('.ad-banner img', (i) => i.alt.includes('魂の系統鑑定')));
    check('使い方が4段階', (await page.$$('.howto li')).length === 4);

    // 6. 表示崩れ・エラー
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check('横にはみ出さない', overflow <= 0, 'overflow=' + overflow);
    check('エラーなし', errors.length === 0, errors.join(' | '));
    await page.close();
  }

  // 7. 日本時間の「今日」（端末がロサンゼルス時間でも日本の日付になる）
  console.log('[日本時間]');
  const ctx = await browser.newContext({ timezoneId: 'America/Los_Angeles', viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await route(page);
  await page.clock.setFixedTime(new Date('2026-12-31T15:30:00Z')); // 日本：2027-01-01 0:30、LA：2026-12-31 7:30
  await page.goto('file://' + target);
  await page.waitForSelector('.wish-tile');
  check('今日は日本の日付（2027-01-01）', await page.evaluate(() => JSTDate.today()) === '2027-01-01');
  check('端末の日付は2026-12-31（前提の確認）', await page.evaluate(() => new Date().getDate()) === 31);
  check('生年の選択肢は日本の今年（2027年）から', await page.$eval('#bd-y option:nth-child(2)', (o) => o.value) === '2027');
  await page.selectOption('#bd-y', '1974'); await page.selectOption('#bd-m', '4'); await page.selectOption('#bd-d', '15');
  await page.selectOption('#home', '東京都');
  await page.click('#diagnose');
  await page.waitForSelector('#recommended .card', { timeout: 30000 });
  const kg = await page.textContent('#kigaku-panel');
  check('「あなたの気学」の基準日も日本の日付', /2027年1月1日/.test(kg));
  await ctx.close();

  // 8. 動きを減らす設定
  console.log('[動きを減らす設定]');
  const rctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const rp = await rctx.newPage();
  await route(rp);
  await rp.goto('file://' + target);
  await rp.waitForSelector('.wish-tile');
  check('スクロールの動きを止める', await rp.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior) === 'auto');
  await rctx.close();

  await browser.close();
  const ng = results.filter((r) => !r).length;
  console.log('\n結果：' + (results.length - ng) + '件成功 / ' + ng + '件失敗');
  process.exit(ng ? 1 : 0);
})();
