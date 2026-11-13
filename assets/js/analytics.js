/*
 * アクセス解析（Google アナリティクス 4）
 * config.js の APP_CONFIG.gaId に「G-XXXXXXXXXX」を入れると動きます。空のあいだは何も送りません。
 * 送るのは「どのボタンが押されたか」「診断まで進んだか」などの回数だけです。
 * 生年月日・出発地・住所・ニックネームなどの入力内容は送りません。
 */
(function (root) {
  'use strict';
  var id = (root.APP_CONFIG && root.APP_CONFIG.gaId) || '';
  var on = /^G-[A-Z0-9]+$/.test(id);
  root.dataLayer = root.dataLayer || [];
  function gtag() { root.dataLayer.push(arguments); }
  if (on) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true });
  }
  // track('イベント名', {数値や短い記号だけ})
  root.track = function (name, params) {
    if (!on) return;
    try { gtag('event', name, params || {}); } catch (e) { /* 解析が止まってもサイトは動かす */ }
  };
  var started = false;
  document.addEventListener('focusin', function (e) {
    if (started) return;
    var f = e.target.closest && e.target.closest('form');
    if (f && (f.id === 'diagnose-form' || f.id === 'finder')) { started = true; root.track('form_start', { form: f.id }); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('a,button,summary') : null;
    if (!t) return;
    if (t.dataset && t.dataset.track) return root.track(t.dataset.track);
    var cls = t.className || '';
    if (/btn-detail/.test(cls)) return root.track('spot_detail');
    if (t.tagName === 'A' && /google\.[a-z.]+\/maps|maps\.google/.test(t.href)) return root.track('route_click');
    if (t.id === 'more-results') return root.track('more_results');
    if (/btn-line|share/.test(cls) || (t.closest && t.closest('.share-slot,.share-panel,#share-panel'))) return root.track('share_click');
    if (t.closest && t.closest('.more-you-card')) return root.track('ad_click', { to: (t.querySelector('b') || t).textContent.trim().slice(0, 20) });
    if (t.tagName === 'SUMMARY' && t.parentNode && t.parentNode.id === 'why-box') return root.track('why_open');
    if (/行きたい|行った|お気に入り|Save|Want to go/.test(t.textContent || '')) return root.track('save_spot');
  }, true);
})(this);
