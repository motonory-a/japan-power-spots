/*
 * English edition: which spots visitors see, and how famous they are (英語版で扱うスポットと知名度)
 *   Shared by the finder (app-en.js) and the page builder (scripts/build_en_pages.js).
 *   公式確認済み、または Wikipedia が3言語以上（自然のスポットは2言語以上）の、有名な約1,200件。
 */
(function (root) {
  'use strict';
  var NATURE = ['滝', '山', '湧水', '温泉', '巨木', '岩・磐座', '洞窟', '絶景', '湖'];
  function include(s) {
    if (!s.wikidata || s.category === '祠') return false;
    var sl = s.sitelinks || 0;
    return !!s.verified || sl >= 3 || (sl >= 2 && NATURE.indexOf(s.category) !== -1);
  }
  // International fame: number of Wikipedia language editions, plus a bonus for officially checked places
  function fame(s) { return Math.min(250, (s.sitelinks || 0) * 8 + (s.verified ? 30 : 0)); }
  function build(all) {
    var seen = {};
    return (all || []).filter(function (s) {
      if (!include(s) || seen[s.wikidata]) return false;
      seen[s.wikidata] = true;
      return true;
    }).map(function (s) { return Object.assign({}, s, { fame: fame(s) }); });
  }
  var api = { include: include, fame: fame, build: build, NATURE: NATURE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.EnPool = api;
})(this);
