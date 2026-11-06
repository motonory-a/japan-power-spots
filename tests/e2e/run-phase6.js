/*
 * Phase 6（集客と公開の準備）の確認
 * 実行方法： cd tests/e2e && node run-phase6.js
 */
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const root = path.join(__dirname, '../..');
const target = path.resolve(process.argv[2] || path.join(root, 'index.html'));
const results = [];
const check = (name, ok, info = '') => { results.push(ok); console.log((ok ? '  OK  ' : '  NG  ') + name + (info ? '  ' + info : '')); };

(async () => {
  console.log('[ファイル]');
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  check('robots.txt にサイトマップの場所', /Sitemap: https:\/\/motonory-a\.github\.io\/japan-power-spots\/sitemap\.xml/.test(robots));
  const sm = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  check('sitemap.xml にトップのURL', /<loc>https:\/\/motonory-a\.github\.io\/japan-power-spots\/<\/loc>/.test(sm));
  ['apple-touch-icon.png', 'assets/img/favicon.svg', 'assets/img/favicon-32.png', 'assets/img/hero-1200.jpg'].forEach((f) => check('ファイルがある：' + f, fs.existsSync(path.join(root, f))));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('**/*', (r) => (r.request().url().startsWith('file:') ? r.continue() : r.abort()));
  await page.goto('file://' + target);
  console.log('[ページの情報]');
  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name=description]').content,
    canon: document.querySelector('link[rel=canonical]').href,
    og: ['og:title', 'og:description', 'og:image', 'og:url'].map((p) => (document.querySelector('meta[property="' + p + '"]') || {}).content),
    ld: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => s.textContent)
  }));
  check('タイトルと説明文', meta.title === '開運パワースポット巡り' && /どこに行こうか/.test(meta.desc));
  check('canonical', meta.canon === 'https://motonory-a.github.io/japan-power-spots/');
  check('OGP（タイトル・説明・画像・URL）', meta.og.every(Boolean) && /^https:\/\//.test(meta.og[2]));
  let ld = null;
  try { ld = JSON.parse(meta.ld[0]); } catch (e) { /* 下でNG */ }
  check('構造化データ（WebSite）が正しいJSON', !!ld && ld['@type'] === 'WebSite' && ld.url === meta.canon);
  console.log('[関連サイト・広告の表示]');
  const cards = await page.$$eval('.more-you-card', (as) => as.map((a) => ({ href: a.href, label: a.querySelector('.ad-label').textContent, rel: a.rel })));
  check('「もっと自分を知る」に魂の系統鑑定と高次元SHOP', cards.length === 2 && cards.some((c) => /my-first-project/.test(c.href)) && cards.some((c) => /kojigen\.base\.shop/.test(c.href)));
  check('どちらも「広告」と表示', cards.every((c) => /広告/.test(c.label)));
  check('販売サイトへのリンクは sponsored', cards.filter((c) => /kojigen/.test(c.href)).every((c) => /sponsored/.test(c.rel)));
  check('外部リンクはすべて新しいタブ・noopener', await page.$$eval('a[target=_blank]', (as) => as.every((a) => /noopener/.test(a.rel))));
  check('個人情報とデータの扱いの説明', /サーバーへは送りません/.test(await page.textContent('#h-privacy + details')));
  await browser.close();
  const ng = results.filter((r) => !r).length;
  console.log('\n結果：' + (results.length - ng) + '件成功 / ' + ng + '件失敗');
  process.exit(ng ? 1 : 0);
})();
