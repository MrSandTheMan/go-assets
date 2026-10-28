/* GoBeatrice runtime fixes (2026-10-20): strip ad/landing remnants.
   Loaded from the page code block; the full injection update still
   lives in gobeatrice-injection.html for the next Squarespace paste. */
(function () {
  function fix() {
    var spans = document.querySelectorAll('.meta span');
    for (var i = 0; i < spans.length; i++) {
      if (/landing page rebuild|new trims/i.test(spans[i].textContent)) {
        spans[i].textContent = '3 new edits';
      }
    }
    var lis = document.querySelectorAll('li');
    for (var j = 0; j < lis.length; j++) {
      if (/ad landing page/i.test(lis[j].textContent)) {
        lis[j].style.display = 'none';
      }
    }
  }
  fix();
  var tries = 0;
  var iv = setInterval(function () {
    fix();
    if (++tries > 40) clearInterval(iv);
  }, 500);
})();

/* Before/after section (2026-10-27): render card.before_after from the gist
   under the priority block. No-op until the gist carries the field. */
(function () {
  var GIST_URL = 'https://gist.githubusercontent.com/MrSandTheMan/45bda61d8b76598ff5da58e562463889/raw/gobeatrice-tracker.json';
  var fetched = false;
  function renderBA() {
    if (document.querySelector('.ba-section')) return;
    var pri = document.querySelector('.priority');
    if (!pri || fetched) return;
    fetched = true;
    fetch(GIST_URL + '?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (data) {
      var ba = data && data.card && data.card.before_after;
      if (!ba || !ba.img || document.querySelector('.ba-section')) return;
      var sec = document.createElement('div');
      sec.className = 'ba-section';
      sec.style.marginTop = '18px';
      var h = document.createElement('h3');
      h.textContent = ba.title || 'Before and after';
      h.style.margin = '0 0 10px';
      var img = document.createElement('img');
      img.src = ba.img;
      img.alt = 'Before and after';
      img.style.width = '100%';
      img.style.borderRadius = '12px';
      img.style.display = 'block';
      img.style.cursor = 'zoom-in';
      img.title = 'Tap to view fullscreen';
      img.addEventListener('click', function () { openBALightbox(ba.img); });
      var cap = document.createElement('div');
      cap.textContent = 'Tap the image to view fullscreen';
      cap.style.fontSize = '13px';
      cap.style.color = '#8a8a8e';
      cap.style.textAlign = 'center';
      cap.style.marginTop = '8px';
      sec.appendChild(h);
      sec.appendChild(img);
      sec.appendChild(cap);
      /* Deterministic order from this side too: if the dialogue section
         already rendered (it appends to .priority when BA is absent), insert
         BA before it, so BA always lands above dialogue no matter which
         section renders first. */
      var dlg = document.querySelector('.dialogue-section');
      if (dlg && dlg.parentNode) {
        dlg.parentNode.insertBefore(sec, dlg);
      } else {
        pri.appendChild(sec);
      }
    }).catch(function () { fetched = false; });
  }
  function openBALightbox(src) {
    if (document.querySelector('.ba-lightbox')) return;
    var ov = document.createElement('div');
    ov.className = 'ba-lightbox';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;overflow:auto;padding:16px;box-sizing:border-box;';
    var im = document.createElement('img');
    im.src = src;
    im.alt = 'Before and after, fullscreen';
    im.style.cssText = 'max-width:96vw;max-height:96vh;object-fit:contain;border-radius:8px;cursor:zoom-in;';
    var zoomed = false;
    im.addEventListener('click', function (e) {
      e.stopPropagation();
      zoomed = !zoomed;
      if (zoomed) {
        im.style.maxWidth = 'none';
        im.style.maxHeight = 'none';
        im.style.width = '200%';
        im.style.cursor = 'zoom-out';
      } else {
        im.style.maxWidth = '96vw';
        im.style.maxHeight = '96vh';
        im.style.width = 'auto';
        im.style.cursor = 'zoom-in';
      }
    });
    var x = document.createElement('button');
    x.type = 'button';
    x.textContent = '✕';
    x.setAttribute('aria-label', 'Close');
    x.style.cssText = 'position:fixed;top:14px;right:16px;z-index:10000;background:#fff;color:#111;border:0;border-radius:50%;width:40px;height:40px;font-size:20px;font-weight:700;cursor:pointer;line-height:1;';
    function close() {
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    x.addEventListener('click', close);
    ov.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    ov.appendChild(im);
    ov.appendChild(x);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
  }
  renderBA();
  var tries = 0;
  var iv = setInterval(function () {
    renderBA();
    if (document.querySelector('.ba-section') || ++tries > 40) clearInterval(iv);
  }, 500);
})();

/* Edit 3 dialogue review section (2026-10-27, Change B): render
   card.dialogue_review from the gist under the priority block (after the
   before/after section when present). No-op until the gist carries the
   field. Approval posts to the GoBeatrice Apps Script backend with the
   same goPost pattern as the review modal ([GoPage] subject prefix,
   [TEST] tagging on ?test=1). */
(function () {
  var GIST_URL = 'https://gist.githubusercontent.com/MrSandTheMan/45bda61d8b76598ff5da58e562463889/raw/gobeatrice-tracker.json';
  var BACKEND = { url: 'https://script.google.com/macros/s/AKfycbzrvhRFd9K-zLO_BtmUBAgdWoYlvoKUlcuIF-dInAQ8wwxMLkK4hqiJXCtofsi1wHht/exec', token: '0e5da46e84e4f69a55f413afaed8d348' };
  var CLIENT_NAME = 'Beatrice Caponnetti Jackson';
  var LS_KEY = 'gobeatrice_approval_edit3_dialogue';
  var TEST_MODE = /(?:\?|&)test=1(?:&|$)/.test(window.location.search);
  function goPost(payload) {
    var p = { token: BACKEND.token, action: payload.action, subject: payload.subject, item: payload.item, body: payload.body, from: CLIENT_NAME, attachments: [] };
    if (TEST_MODE) {
      p.subject = '[TEST] ' + (p.subject || p.action || '');
      p.body = 'TEST SUBMISSION - sent from a ?test=1 page load, not by the client.\n\n' + (p.body || '');
    }
    return fetch(BACKEND.url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(p) }).then(function (r) { return r.json(); });
  }
  var baWait = 0;
  function renderDialogue() {
    if (document.querySelector('.dialogue-section')) return;
    var pri = document.querySelector('.priority');
    if (!pri) return;
    fetch(GIST_URL + '?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (data) {
      var d = data && data.card && data.card.dialogue_review;
      if (!d || !d.doc_url || document.querySelector('.dialogue-section')) return;
      /* Deterministic order: when the gist carries a before/after, wait for
         .ba-section to exist before inserting, so dialogue always lands
         after it (both sections race on separate fetches otherwise). After
         ~10s of waiting, fall back to appending, so a BA failure can never
         hide the dialogue section. */
      var hasBA = !!(data && data.card && data.card.before_after && data.card.before_after.img);
      if (hasBA && !document.querySelector('.ba-section') && baWait++ < 20) return;
      var sec = document.createElement('div');
      sec.className = 'dialogue-section';
      sec.style.marginTop = '18px';
      var h = document.createElement('h3');
      h.textContent = d.title || 'Edit 3: Dialogue review';
      h.style.margin = '0 0 10px';
      var p = document.createElement('p');
      p.textContent = d.text || '';
      p.style.color = '#ddd';
      p.style.lineHeight = '1.6';
      p.style.margin = '0 0 14px';
      var row = document.createElement('div');
      row.style.display = 'flex';
      row.style.flexWrap = 'wrap';
      row.style.gap = '10px';
      var docBtn = document.createElement('a');
      docBtn.className = 'btn yellow';
      docBtn.href = d.doc_url;
      docBtn.target = '_blank';
      docBtn.rel = 'noopener';
      docBtn.textContent = d.doc_label || 'Open the transcript doc';
      docBtn.style.cssText = 'display:inline-block;background:#FFD60A;color:#111;border-radius:999px;padding:12px 26px;font-weight:700;font-size:15px;text-decoration:none;text-transform:none;cursor:pointer;';
      var apBtn = document.createElement('button');
      apBtn.className = 'btn';
      apBtn.type = 'button';
      apBtn.style.cssText = 'display:inline-block;background:#E00020;color:#fff;border:0;border-radius:999px;padding:12px 26px;font-weight:700;font-size:15px;text-transform:none;cursor:pointer;';
      var approveLabel = d.approve_label || 'Approve the dialogue as-is';
      var stamp = null;
      try { stamp = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {}
      if (stamp && stamp.date) {
        apBtn.textContent = 'Approved ' + stamp.date + '. Thank you!';
        apBtn.classList.add('done');
      } else {
        apBtn.textContent = approveLabel;
      }
      var armed = false, armTimer = null;
      apBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (apBtn.classList.contains('done')) return;
        if (!armed) {
          armed = true;
          apBtn.textContent = 'Tap again to confirm';
          apBtn.classList.add('armed');
          armTimer = setTimeout(function () {
            armed = false;
            apBtn.classList.remove('armed');
            apBtn.textContent = approveLabel;
          }, 12000);
        } else {
          clearTimeout(armTimer);
          armed = false;
          apBtn.textContent = 'Sending...';
          goPost({ action: 'Approval', subject: 'Beatrice approved Edit 3 transcript dialogue', item: 'Edit 3 (T03) transcript dialogue', body: 'I approve the Edit 3 transcript dialogue as final.' }).then(function () {
            var now = new Date();
            var vd = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
            try { localStorage.setItem(LS_KEY, JSON.stringify({ date: vd })); } catch (e) {}
            apBtn.textContent = 'Approved ' + vd + '. Thank you!';
            apBtn.classList.remove('armed');
            apBtn.classList.add('done');
          }).catch(function () {
            apBtn.textContent = 'Something went wrong. Tap to retry.';
            armed = false;
          });
        }
      });
      row.appendChild(docBtn);
      row.appendChild(apBtn);
      sec.appendChild(h);
      sec.appendChild(p);
      sec.appendChild(row);
      var ba = document.querySelector('.ba-section');
      if (ba && ba.parentNode) {
        ba.parentNode.insertBefore(sec, ba.nextSibling);
      } else {
        pri.appendChild(sec);
      }
    }).catch(function () {});
  }
  renderDialogue();
  var tries = 0;
  var iv = setInterval(function () {
    renderDialogue();
    if (document.querySelector('.dialogue-section') || ++tries > 40) clearInterval(iv);
  }, 500);
})();
