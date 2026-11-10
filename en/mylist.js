/*
 * English edition: "My list" — places saved on this device (行きたい場所リスト。端末内に保存)
 *   item: { q, n (English name), j (Japanese name), lat, lon, s (page slug), c (category), p (prefecture code) }
 */
(function (root) {
  'use strict';
  var KEY = 'jps-en-list';
  var listeners = [];
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; } }
  function write(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* storage blocked */ } listeners.forEach(function (f) { f(a); }); }
  function has(q) { return read().some(function (x) { return x.q === q; }); }
  function add(item) { var a = read(); if (!a.some(function (x) { return x.q === item.q; })) { a.push(item); write(a); } }
  function remove(q) { write(read().filter(function (x) { return x.q !== q; })); }
  function toggle(item) { if (has(item.q)) remove(item.q); else add(item); return has(item.q); }
  function onChange(f) { listeners.push(f); }

  // ♡ Save button
  function button(item, cls) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'en-save ' + (cls || '');
    function paint() {
      var on = has(item.q);
      var ui = (root.EN && root.EN.ui) || {};
      b.textContent = on ? (ui.saved || '♥ Saved') : (ui.save || '♡ Save');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
    }
    b.addEventListener('click', function () { toggle(item); paint(); });
    onChange(paint);
    paint();
    return b;
  }

  function routeUrl(items) {
    return 'https://www.google.com/maps/dir/' + items.slice(0, 10).map(function (x) { return x.lat + ',' + x.lon; }).join('/');
  }
  function csv(items, pageBase) {
    var esc = function (v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [['Name', 'Japanese name', 'Latitude', 'Longitude', 'Page']];
    items.forEach(function (x) { rows.push([x.n || x.j, x.j, x.lat, x.lon, x.s ? pageBase + x.s + '.html' : '']); });
    return '﻿' + rows.map(function (r) { return r.map(esc).join(','); }).join('\r\n');
  }
  function shareHash(items) { return '#list=' + items.map(function (x) { return x.q; }).join(','); }

  root.MyList = { read: read, write: write, has: has, add: add, remove: remove, toggle: toggle, onChange: onChange, button: button, routeUrl: routeUrl, csv: csv, shareHash: shareHash };
})(this);
