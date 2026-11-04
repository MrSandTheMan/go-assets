/* Anomalous portfolio page fix. Code-only, desktop only.
   Problem: the first customer row is split 3/9 (Beatrice 3-wide, Judy 9-wide);
   every other customer pair row is 6/6. Beatrice renders about a third of
   Judy's size on computer.
   Fix: on computer widths (>= 768px), move Beatrice's column into its own
   row at 9-wide, directly above Judy's row, with an empty 3-wide placeholder
   holding Judy's position so Judy is pixel-identical. Result: Beatrice and
   Judy render the same size, same left edge, stacked.
   Below 768px the page is left exactly as Squarespace built it (phone stacks
   fine already). If anything unexpected is found, the script aborts and the
   page is left untouched. */
(function () {
  'use strict';
  if (window.self !== window.top) return; // live page only, not editor frames
  var DESKTOP = window.matchMedia('(min-width: 768px)');
  var NAME_MATCH = /BEATRICE/i;
  var state = null; // { newRow, oldRow, beaCol, phOld, phNew, origClass, judyCol }

  function findBeaCol() {
    var els = document.querySelectorAll('strong');
    for (var i = 0; i < els.length; i++) {
      if (NAME_MATCH.test(els[i].textContent || '')) {
        var col = els[i].closest('[class*="sqs-col-"]');
        if (col) return col;
      }
    }
    return null;
  }

  function directCols(row) {
    var out = [];
    for (var i = 0; i < row.children.length; i++) {
      if (/sqs-col-/.test(row.children[i].className)) out.push(row.children[i]);
    }
    return out;
  }

  function widenCol(col, from, to) {
    var c = col.className;
    var c2 = c.replace(new RegExp('sqs-col-' + from + '\\b'), 'sqs-col-' + to)
              .replace(new RegExp('span-' + from + '\\b'), 'span-' + to);
    if (c2 === c) return false;
    col.className = c2;
    return true;
  }

  function placeholder(span) {
    var d = document.createElement('div');
    d.className = 'col sqs-col-' + span + ' span-' + span;
    d.setAttribute('data-portfolio-fix', 'placeholder');
    return d;
  }

  function apply() {
    if (state) return true;
    var beaCol = findBeaCol();
    if (!beaCol) return false;
    var oldRow = beaCol.closest('.sqs-row');
    if (!oldRow) return false;
    var cols = directCols(oldRow);
    if (cols.length !== 2) return false;
    var judyCol = cols[0] === beaCol ? cols[1] : cols[0];
    if (cols[0] !== beaCol) return false; // Beatrice must be the first column
    if (!/sqs-col-3\b/.test(beaCol.className)) return false;
    if (!/sqs-col-9\b/.test(judyCol.className)) return false;

    var origClass = beaCol.className;
    var newRow = document.createElement('div');
    newRow.className = oldRow.className;
    newRow.setAttribute('data-portfolio-fix', 'row');
    var phNew = placeholder(3);
    var phOld = placeholder(3);
    newRow.appendChild(phNew);
    oldRow.parentNode.insertBefore(newRow, oldRow);
    newRow.appendChild(beaCol);
    if (!widenCol(beaCol, 3, 9)) {
      oldRow.insertBefore(beaCol, judyCol);
      newRow.remove();
      return false;
    }
    oldRow.insertBefore(phOld, judyCol);
    state = { newRow: newRow, oldRow: oldRow, beaCol: beaCol, phOld: phOld, phNew: phNew, origClass: origClass, judyCol: judyCol };
    return true;
  }

  function revert() {
    if (!state) return;
    state.beaCol.className = state.origClass;
    state.oldRow.insertBefore(state.beaCol, state.judyCol);
    state.phOld.remove();
    state.newRow.remove();
    state = null;
  }

  function run() {
    try {
      if (state && (!state.newRow.isConnected || !state.beaCol.isConnected)) state = null;
      if (DESKTOP.matches) {
        if (!state) apply();
      } else {
        revert();
      }
    } catch (e) { /* leave page untouched on any error */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', run);
  else if (DESKTOP.addListener) DESKTOP.addListener(run);
  window.addEventListener('resize', run);
  // Poll briefly to win any async render race; idempotent, stops itself.
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    try {
      if (DESKTOP.matches) {
        if (state && (!state.newRow.isConnected || !state.beaCol.isConnected)) state = null;
        if (!state) apply();
      }
      if (state || tries >= 40) clearInterval(timer);
    } catch (e) { clearInterval(timer); }
  }, 500);
})();
