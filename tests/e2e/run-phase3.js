/*
 * Phase 3（毎日の楽しみ）の画面テスト
 * 実行方法： cd tests/e2e && node run-phase3.js [index.htmlのパス]
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
const doorText = (p) => p.$eval('#door-content', (e) => e.innerText);

(async () => {
  const browser = await chromium.launch();

  for (const [label, viewport] of [['スマホ 390px', { width: 390, height: 844 }], ['パソコン 1280px', { width: 1280, height: 900 }]]) {
    console.log('[' + label + ']');
    const ctx = await browser.newContext({ viewport, timezoneId: 'Asia/Tokyo' });
    const page = await ctx.newPage();
    const errors = [], dialogs = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
    await route(page);
    await page.clock.setFixedTime(new Date('2026-11-04T01:00:00Z')); // 日本：11/4（水）10:00
    await page.goto('file://' + target);
    await page.waitForSelector('#door-open');

    // 今日の幸せの扉
    check('扉が表示される', await page.isVisible('#door-open'));
    check('扉に日本の日付', /11月4日（水）/.test(await page.getAttribute('#door-open', 'aria-label')));
    check('ひらく前は中身が出ていない', !(await page.$('#door-content')));
    await page.click('#door-open');
    await page.waitForSelector('#door-content', { timeout: 3000 });
    const t1 = await doorText(page);
    check('ひらくと3つ現れる', /今日の聖地/.test(t1) && /今日の小さな幸せ/.test(t1) && /今日の開運ミッション/.test(t1));
    check('効果を約束しない注意書き', /約束するものではありません/.test(t1));
    await page.check('#mission-done');
    check('ミッションの記録は任意でできる', await page.isVisible('.door-thanks'));
    const t1b = await doorText(page);
    await page.reload();
    await page.waitForSelector('#door-content');
    check('同じ日に読み込み直しても、ひらいたまま・同じ内容', (await doorText(page)) === t1b);
    check('ミッションの記録も残る', await page.isChecked('#mission-done'));
    check('連続日数など継続を迫る表示がない', !/連続|日目|ログイン/.test(await page.textContent('main')));

    // 今日の運命の聖地
    const spotName = await page.textContent('#daily-spot .card h3');
    check('今日の聖地のカード', !!spotName, spotName);
    check('扉の聖地と同じ', t1.includes(spotName));
    check('「日替わりおすすめ」と明記', (await page.textContent('#daily-spot .daily-label')).trim() === '日替わりおすすめ');
    check('吉方位とは別だと説明', /吉方位とは関係ありません/.test(await page.textContent('#daily-spot')));

    // 週末のお出かけ提案
    check('週末の提案は次の土日', /11月7日（土）/.test(await page.textContent('.weekend')) && /8日（日）/.test(await page.textContent('.weekend')));
    await page.click('.weekend-btns button:first-child');
    check('土曜日を出かける日に入れる', await page.inputValue('#trip-date') === '2026-11-07');

    // コレクション
    await page.click('#daily-spot .keep-want');
    check('行きたいに保存（ボタンが選択状態）', await page.getAttribute('#daily-spot .keep-want', 'aria-pressed') === 'true');
    check('コレクションに入る', (await page.textContent('#collection .col-list')).includes(spotName));
    check('タブの件数', /行きたい（1）/.test(await page.textContent('#collection .col-tabs')));
    await page.click('#daily-spot .keep-visited');
    check('行ったで都道府県のスタンプ', (await page.textContent('.stamp-count')).trim() === '1 / 47' && (await page.$$('.stamp.on')).length === 1);
    // 検索結果の同じスポットにも反映
    await page.fill('#keyword', spotName);
    await page.waitForTimeout(500);
    const same = await page.$(`#results .keep-row[data-spot-id="${await page.getAttribute('#daily-spot .keep-row', 'data-spot-id')}"] .keep-want`);
    check('同じスポットの別のカードも同じ表示', !!same && await same.getAttribute('aria-pressed') === 'true');
    await page.reload();
    await page.waitForSelector('#collection .col-item');
    check('読み込み直しても残る', (await page.textContent('#collection .col-list')).includes(spotName));
    await page.click('#collection .col-tab[data-kind="visited"]');
    await page.click('#collection .col-item .btn-text:has-text("ここから外す")');
    check('一つずつ外せる', (await page.textContent('.stamp-count')).trim() === '0 / 47');
    await page.click('#collection-clear');
    check('すべて消す：1回目は確認だけ', (await page.$$('#collection .col-tab')).length === 3 && /もう一度/.test(await page.textContent('#collection-clear')));
    await page.click('#collection-clear');
    await page.waitForTimeout(200);
    check('すべて消す：2回目で消える', /行きたい（0）/.test(await page.textContent('#collection .col-tabs')));
    check('localStorageからも消える', await page.evaluate(() => localStorage.getItem('jps.collection.v1')) === null);

    // 友だちに紹介する
    const shares = await page.$$('.share-box');
    check('紹介ボタンが3か所（今日の聖地・診断結果の後・紹介コーナー）', shares.length === 3, String(shares.length));
    const lineHref = await page.getAttribute('#share-site .share-line', 'href');
    check('LINEで送るリンク', lineHref.startsWith('https://line.me/R/share?text=') && decodeURIComponent(lineHref).includes('https://motonory-a.github.io/japan-power-spots/'));
    check('X・Facebookのリンク', (await page.getAttribute('#share-site .share-x', 'href')).startsWith('https://twitter.com/intent/tweet?') && (await page.getAttribute('#share-site .share-fb', 'href')).startsWith('https://www.facebook.com/sharer/'));
    check('外部リンクは新しいタブ・noopener', await page.$$eval('.share-box a', (as) => as.every((a) => a.target === '_blank' && /noopener/.test(a.rel))));
    check('今日の聖地の紹介文に聖地の名前', decodeURIComponent(await page.getAttribute('#daily-spot .share-line', 'href')).includes(spotName));
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.click('#share-site .share-copy');
    await page.waitForTimeout(300);
    check('リンクをコピー：お知らせが出る', /コピー/.test(await page.textContent('#share-site .share-msg')));
    check('紹介文に生年月日や住所を入れない', await page.$$eval('.share-box a', (as) => as.every((a) => !/1974|新宿|生年月日：/.test(decodeURIComponent(a.href)))));

    // 診断結果のカードにも保存ボタン
    await page.selectOption('#bd-y', '1974'); await page.selectOption('#bd-m', '4'); await page.selectOption('#bd-d', '15');
    await page.selectOption('#home', '東京都');
    await page.click('#diagnose');
    await page.waitForSelector('#recommended .card');
    check('診断結果のカードに保存ボタン', (await page.$$('#recommended .keep-row')).length === 5);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check('横にはみ出さない', overflow <= 0, 'overflow=' + overflow);
    check('ダイアログ（alert/confirm）を使わない', dialogs.length === 0);
    check('エラーなし', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  // 日付の境目：日本時間0時で新しい扉、内容も変わる
  console.log('[日付の境目]');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'America/Los_Angeles' });
  const page = await ctx.newPage();
  await route(page);
  await page.clock.setFixedTime(new Date('2026-11-04T14:59:00Z')); // 日本 11/4 23:59
  await page.goto('file://' + target);
  await page.click('#door-open');
  await page.waitForSelector('#door-content');
  const day1 = await page.textContent('#daily-spot .card h3');
  await page.clock.setFixedTime(new Date('2026-11-04T15:00:30Z')); // 日本 11/5 0:00
  await page.reload();
  await page.waitForSelector('#daily-door');
  check('日本時間0時を過ぎると新しい扉（端末がロサンゼルス時間でも）', await page.isVisible('#door-open') && /11月5日（木）/.test(await page.getAttribute('#door-open', 'aria-label')));
  check('今日の聖地も変わる', (await page.textContent('#daily-spot .card h3')) !== day1);
  await ctx.close();

  // 生年月日が保存されていると、数秘ナンバーに合わせた一言
  console.log('[数秘ナンバー]');
  const c2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await c2.newPage();
  await route(p2);
  await p2.goto('file://' + target);
  await p2.selectOption('#bd-y', '1974'); await p2.selectOption('#bd-m', '4'); await p2.selectOption('#bd-d', '15');
  await p2.click('#door-open');
  await p2.waitForSelector('#door-content');
  check('数秘ナンバー4のあなたへ', /数秘ナンバー4（安定・内省）のあなたへ/.test(await p2.textContent('#door-content')));
  await c2.close();

  // 動きを減らす設定
  console.log('[動きを減らす設定]');
  const c3 = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p3 = await c3.newPage();
  await route(p3);
  await p3.goto('file://' + target);
  await p3.click('#door-open');
  const shown = await p3.waitForSelector('#door-content', { timeout: 300 }).then(() => true, () => false);
  check('動きなしで、すぐに中身が出る', shown);
  await c3.close();

  // 保存ができない環境（プライベートブラウズなど）でも動く
  console.log('[保存できない環境]');
  const c4 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await c4.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const p4 = await c4.newPage();
  const e4 = [];
  p4.on('pageerror', (e) => e4.push(e.message));
  await route(p4);
  await p4.goto('file://' + target);
  await p4.click('#door-open');
  await p4.waitForSelector('#door-content');
  await p4.click('#daily-spot .keep-want');
  check('扉もコレクションも動く', (await p4.textContent('#collection .col-list')).length > 0 && await p4.getAttribute('#daily-spot .keep-want', 'aria-pressed') === 'true');
  check('エラーなし', e4.length === 0, e4.join(' | '));
  await c4.close();

  await browser.close();
  const ng = results.filter((r) => !r).length;
  console.log('\n結果：' + (results.length - ng) + '件成功 / ' + ng + '件失敗');
  process.exit(ng ? 1 : 0);
})();
