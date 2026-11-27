/*
 * 新しい海外版の画面の小さな動き(2026-11-27)
 *  ・トップの大きな画像を季節で替える(3〜5月 春、6〜8月 夏、9〜11月 秋、12〜2月 冬)
 *  ・カード・都市のタイル・都市の見出しに、スポットの写真(Wikimedia Commons)を入れる。撮影者とライセンスはページの下にまとめて出す
 */
(function () {
  'use strict';
  // 季節の画像
  var pic = document.querySelector('[data-hero]');
  if (pic) {
    var m = new Date().getMonth() + 1;
    var season = m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';
    if (season !== 'autumn') {
      var src = pic.querySelector('source'), img = pic.querySelector('img');
      if (src) src.srcset = src.srcset.split('autumn').join(season);
      if (img) img.src = img.src.split('autumn').join(season);
    }
  }

  // 写真
  if (!window.SpotPhotos) return;
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-q]')).filter(function (e) { return e.getAttribute('data-q'); });
  if (!els.length) return;
  var qs = els.map(function (e) { return e.getAttribute('data-q'); });
  window.SpotPhotos.lookup(qs).then(function (res) {
    var used = {};
    els.forEach(function (e) {
      var info = res[e.getAttribute('data-q')];
      if (!info) return;
      var url = 'url("' + info.thumb.replace(/"/g, '%22') + '")';
      var slot = e.querySelector('.ed-thumb');
      if (slot) slot.style.backgroundImage = url;
      else if (e.classList.contains('ed-city')) e.style.setProperty('--bg', url);
      else if (e.classList.contains('ed-cityhero')) e.style.setProperty('--bg', url);
      used[info.page] = info;
    });
    var box = document.querySelector('[data-credits]');
    var list = Object.keys(used);
    if (!box || !list.length) return;
    box.append('Photos (Wikimedia Commons): ');
    list.forEach(function (page, i) {
      var a = document.createElement('a');
      a.href = page; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = used[page].artist + ' (' + used[page].license + ')';
      if (i) box.append(' · ');
      box.append(a);
    });
    box.hidden = false;
  });
})();
