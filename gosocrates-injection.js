/* GoSocrates: The Go page for Socrates Gomez (@socratesgomez).
   Renders the video review page natively from the public gist; all copy
   updates are data-only (edit state, run go-tracker.py update gosocrates).
   Local source: ~/workspace/client-tracker/gosocrates-injection.js
   Hosted: https://mrsandtheman.github.io/go-assets/gosocrates-injection.js */
(function () {
  var GIST_URL = "https://gist.githubusercontent.com/MrSandTheMan/da159eda983749226ce7aab264199ed0/raw/gosocrates-tracker.json";
  var BACKEND = {url: "https://script.google.com/macros/s/AKfycbxwZ-7s1vGnN7tXljEyHFU4j_ihmCLA7Mq02Lp2JuGM4cLiNaZJ2tgxAAxiyvu3iznC/exec", token: "0e5da46e84e4f69a55f413afaed8d348"};
  var CLIENT_NAME = "Socrates Gomez";
  var LS = "gosocrates";
  var RED = "#E00020";
  var YELLOW = "#FFD60A";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var TEST_MODE = /(?:\?|&)test=1(?:&|$)/.test(window.location.search);
  if (/(?:\?|&)clear=1(?:&|$)/.test(window.location.search)) {
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(LS + "_approval_") === 0) { localStorage.removeItem(k); }
      });
    } catch (e) {}
  }

  /* Go default: approvals and notes send a formatted email to team@ via the
     backend web app. ?test=1 tags the subject [TEST] so tests never mix with
     real client submissions. Never pass test:true: the backend treats that
     as a no-email pipeline check, and the test email must actually arrive. */
  function goPost(payload) {
    var p = {token: BACKEND.token, action: payload.action, subject: payload.subject, item: payload.item, body: payload.body, from: CLIENT_NAME, attachments: []};
    if (TEST_MODE) {
      p.subject = "[TEST] " + (p.subject || p.action || "");
      p.body = "TEST SUBMISSION - sent from a ?test=1 page load, not by the client.\n\n" + (p.body || "");
    }
    return fetch(BACKEND.url, {method: "POST", headers: {"Content-Type": "text/plain"}, body: JSON.stringify(p)}).then(function (r) { return r.json(); });
  }

  function stampKey(n) { return LS + "_approval_video" + n; }
  function getStamp(n) {
    try { return JSON.parse(localStorage.getItem(stampKey(n)) || "null"); } catch (e) { return null; }
  }
  function setStamp(n, date) {
    try { localStorage.setItem(stampKey(n), JSON.stringify({date: date})); } catch (e) {}
  }

  var CSS =
    "#go-root{text-transform:none;max-width:960px;margin:0 auto;padding:32px 20px 8px;color:#fff;" +
    "font-family:Inter,-apple-system,'Segoe UI',sans-serif;}" +
    "#go-root .go-eyebrow{letter-spacing:.08em;font-size:12px;color:#999;" +
    "margin:0 0 8px;text-align:center;}" +
    "#go-root .go-profile-pic{display:block;width:104px;height:104px;" +
    "border-radius:50%;object-fit:cover;border:3px solid " + RED + ";" +
    "margin:0 auto 16px;}" +
    "#go-root h1{font-family:Archivo,Inter,sans-serif;font-weight:800;" +
    "font-size:clamp(28px,5vw,44px);margin:0 0 6px;text-align:center;}" +
    "#go-root .go-sub{text-align:center;color:#999;font-size:15px;margin:0 0 16px;" +
    "line-height:1.5;}" +
    "#go-root .go-master-wrap{text-align:center;margin:0 0 28px;}" +
    "#go-root .go-card{background:#111;border:1px solid #2a2a2a;border-radius:16px;" +
    "padding:22px;margin:0 0 16px;}" +
    "#go-root .go-card h2{font-family:Archivo,Inter,sans-serif;font-size:20px;" +
    "margin:0 0 10px;}" +
    "#go-root .go-card p{color:#ddd;line-height:1.6;margin:0 0 12px;font-size:15px;}" +
    "#go-root .go-card p:last-child{margin-bottom:0;}" +
    "#go-root .go-sect{font-family:Archivo,Inter,sans-serif;font-size:15px;" +
    "letter-spacing:.04em;color:#888;margin:32px 0 12px;}" +
    "#go-root .go-btn{display:inline-block;background:" + RED + ";color:#fff;border:0;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;" +
    "text-decoration:none;}" +
    "#go-root .go-btn.yellow{background:" + YELLOW + ";color:#111;}" +
    "#go-root .go-btn.ghost{background:transparent;border:1px solid #555;color:#fff;}" +
    "#go-root .go-btn:disabled{opacity:.6;cursor:default;}" +
    "#go-root .go-btn.approve{background:transparent;border:1.5px solid #4ade80;color:#4ade80;}" +
    "#go-root .go-btn.approve:hover{background:rgba(74,222,128,0.10);text-decoration:none;}" +
    "#go-root .go-btn.approve.armed{background:#4ade80;border-color:#4ade80;color:#0b0b0c;}" +
    "#go-root .go-btn.approve.done{border-color:#232327;color:#8a8a8e;cursor:default;}" +
    "#go-root .go-ctasent{color:#5ce08a;font-weight:700;font-size:16px;margin:0;}" +
    "#go-root .go-ctaerr{color:#ff6b6b;font-size:14px;margin:10px 0 0;}" +
    "#go-root .go-vrow{background:#111;border:1px solid #2a2a2a;border-radius:12px;" +
    "padding:16px;margin:0 0 10px;display:flex;align-items:center;justify-content:space-between;gap:12px;}" +
    "#go-root .go-vrow b{font-size:15px;}" +
    "#go-root .go-vrow span{font-size:13px;color:#999;}" +
    "#go-root .go-testbanner{background:" + RED + ";color:#fff;font-weight:700;text-align:center;padding:10px 16px;font-size:14px;border-radius:8px;margin:0 0 16px;}" +
    "#go-root .go-footer{text-align:center;color:#888;font-size:13px;line-height:1.8;margin:32px 0 8px;}" +
    "#go-root .go-footer a{color:#ddd;}" +
    "#go-root details.go-hs{max-width:680px;margin:32px auto 8px;text-align:center;}" +
    "#go-root details.go-hs summary{cursor:pointer;font-size:15px;font-weight:600;color:#ddd;}" +
    "#go-root details.go-hs img{display:block;width:100%;max-width:440px;margin:16px auto 0;border-radius:14px;border:1px solid #232327;}" +
    "#go-root details.go-hs .go-hs-btns{display:flex;gap:12px;justify-content:center;margin-top:16px;}" +
    "#go-root details.go-hs .go-hs-btns .go-btn.ghost{margin:0;}" +
    ".go-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.65);" +
    "z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;}" +
    ".go-modal-card{background:#121214;border-radius:16px;padding:24px;width:min(680px,100%);" +
    "max-height:88vh;overflow-y:auto;position:relative;color:#f5f5f5;}" +
    ".go-modal-close{position:absolute;top:6px;right:12px;background:none;border:0;color:#8a8a8e;" +
    "font-size:30px;line-height:1;cursor:pointer;padding:4px 8px;}" +
    ".go-modal-close:hover{color:#ffffff;}" +
    ".go-modal-title{text-align:center;font-size:20px;margin:0 0 20px;color:#f5f5f5;}" +
    ".go-rv{margin-bottom:28px;}" +
    ".go-rv:last-child{margin-bottom:0;}" +
    ".go-rv-title{font-weight:700;font-size:16px;margin:0 0 12px;}" +
    ".go-rv-title span{font-weight:400;color:#8a8a8e;}" +
    ".go-rv-player{display:flex;justify-content:center;background:#000;border-radius:12px;position:relative;" +
    "overflow:hidden;cursor:pointer;}" +
    ".go-rv-player video.vert{height:min(60vh,177.78vw);aspect-ratio:9/16;width:auto;max-width:100%;border-radius:12px;background:#000;}" +
    ".go-rv-player video.wide{width:100%;aspect-ratio:16/9;border-radius:12px;background:#000;}" +
    ".go-rv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72px;height:72px;border-radius:50%;border:0;background:rgba(0,0,0,0.55);color:#fff;font-size:26px;cursor:pointer;}" +
    ".go-rv-progress{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.25);cursor:pointer;}" +
    ".go-rv-progress-fill{height:100%;width:0%;background:#fff;}" +
    ".go-rv .go-btn.rv-approve{margin-top:12px;}" +
    ".go-modal .go-btn{display:inline-block;background:transparent;border:1.5px solid #4ade80;color:#4ade80;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;}" +
    ".go-modal .go-btn.approve.armed{background:#4ade80;border-color:#4ade80;color:#0b0b0c;}" +
    ".go-modal .go-btn.approve.done{border-color:#232327;color:#8a8a8e;cursor:default;}" +
    ".go-modal .go-btn:disabled{opacity:.6;cursor:default;}" +
    ".go-rv textarea{width:100%;padding:10px 12px;border-radius:10px;font:inherit;font-size:14px;" +
    "background:#0b0b0c;border:1px solid #232327;color:#f5f5f5;resize:vertical;box-sizing:border-box;}" +
    ".go-rv .go-btn.rv-notes-btn{margin-top:8px;background:transparent;border:1.5px solid #3a3a3f;color:#c9c9cd;}" +
    ".go-rv .go-btn.rv-notes-btn:hover{border-color:#e8323c;color:#ffffff;}" +
    ".go-rv-msg{font-size:13px;text-align:center;margin:10px 0 0;color:#8a8a8e;}" +
    ".go-rv-msg.ok{color:#4ade80;}" +
    ".go-rv-msg.err{color:#ff6b6b;}";

  function fmtDate(d) {
    try {
      var x = new Date(d);
      return x.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"});
    } catch (e) { return String(d); }
  }

  function openModal(card) {
    closeModal();
    var pending = (card.review_videos || []).filter(function (v) { return v.status !== "approved"; });
    var overlay = document.createElement("div");
    overlay.className = "go-modal";
    overlay.id = "go-modal";
    var html = '<div class="go-modal-card"><button class="go-modal-close" type="button" aria-label="Close">&times;</button>' +
      '<h2 class="go-modal-title">Review your videos</h2>';
    pending.forEach(function (v) {
      var stamp = getStamp(v.n);
      var wide = v.aspect === "16:9";
      html += '<div class="go-rv" data-n="' + v.n + '">' +
        '<p class="go-rv-title">' + esc(v.label) + ' <span>' + esc(v.title) + '</span></p>' +
        '<div class="go-rv-player">' +
        '<video class="' + (wide ? "wide" : "vert") + '" playsinline preload="metadata" src="' + esc(v.src) + '"></video>' +
        '<button class="go-rv-play" type="button" aria-label="Play">&#9654;</button>' +
        '<div class="go-rv-progress"><div class="go-rv-progress-fill"></div></div>' +
        '</div>';
      if (stamp) {
        html += '<p class="go-rv-msg ok">Approved on ' + esc(fmtDate(stamp.date)) + '</p>';
      } else if (v.status === "pending") {
        html += '<button class="go-btn approve rv-approve" type="button">Approve ' + esc(v.label) + '</button>' +
          '<div style="margin-top:14px"><textarea rows="3" placeholder="Notes for ' + esc(v.label) + ' (optional, send only what you want changed)"></textarea>' +
          '<button class="go-btn rv-notes-btn" type="button">Send notes</button>' +
          '<p class="go-rv-msg"></p></div>';
      } else {
        html += '<p class="go-rv-msg">This video is not open for approval right now.</p>';
      }
      html += '</div>';
    });
    html += '</div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelector(".go-modal-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) { closeModal(); } });

    var blocks = overlay.querySelectorAll(".go-rv");
    blocks.forEach(function (block) {
      var n = parseInt(block.getAttribute("data-n"), 10);
      var v = pending.filter(function (x) { return x.n === n; })[0];
      if (!v) { return; }
      var video = block.querySelector("video");
      var playBtn = block.querySelector(".go-rv-play");
      var fill = block.querySelector(".go-rv-progress-fill");
      var bar = block.querySelector(".go-rv-progress");
      function syncPlay() { playBtn.textContent = video.paused ? "\u25b6" : "\u275a\u275a"; }
      function toggle() { if (video.paused) { video.play(); } else { video.pause(); } syncPlay(); }
      playBtn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
      video.addEventListener("click", toggle);
      video.addEventListener("play", syncPlay);
      video.addEventListener("pause", syncPlay);
      video.addEventListener("ended", function () { video.currentTime = 0; syncPlay(); });
      video.addEventListener("timeupdate", function () {
        if (video.duration) { fill.style.width = (video.currentTime / video.duration * 100) + "%"; }
      });
      bar.addEventListener("click", function (e) {
        e.stopPropagation();
        var r = bar.getBoundingClientRect();
        if (video.duration) { video.currentTime = (e.clientX - r.left) / r.width * video.duration; }
      });
      var approveBtn = block.querySelector(".rv-approve");
      if (approveBtn) {
        approveBtn.addEventListener("click", function () {
          if (!approveBtn.classList.contains("armed")) {
            approveBtn.classList.add("armed");
            approveBtn.textContent = "Tap again to confirm approval";
            return;
          }
          approveBtn.disabled = true;
          approveBtn.textContent = "Sending...";
          var today = new Date().toISOString().slice(0, 10);
          goPost({action: "approve", subject: v.label + " approved", item: v.label + " - " + v.title,
            body: CLIENT_NAME + " approved " + v.label + " (" + v.title + ") on " + fmtDate(today) + "."})
            .then(function (res) {
              if (res && res.ok) {
                setStamp(n, today);
                approveBtn.classList.remove("armed");
                approveBtn.classList.add("done");
                approveBtn.textContent = "Approved on " + fmtDate(today);
                var notes = block.querySelector("textarea");
                if (notes) { notes.closest("div").style.display = "none"; }
              } else {
                approveBtn.disabled = false;
                approveBtn.classList.remove("armed");
                approveBtn.textContent = "Approve " + v.label;
                var m = block.querySelector(".go-rv-msg");
                if (m) { m.textContent = "Something went wrong. Please try again."; m.classList.add("err"); }
              }
            })
            .catch(function () {
              approveBtn.disabled = false;
              approveBtn.classList.remove("armed");
              approveBtn.textContent = "Approve " + v.label;
              var m2 = block.querySelector(".go-rv-msg");
              if (m2) { m2.textContent = "Something went wrong. Please try again."; m2.classList.add("err"); }
            });
        });
      }
      var notesBtn = block.querySelector(".rv-notes-btn");
      if (notesBtn) {
        notesBtn.addEventListener("click", function () {
          var ta = block.querySelector("textarea");
          var msg = block.querySelector(".go-rv-msg");
          var text = ta ? ta.value.trim() : "";
          if (!text) { if (msg) { msg.textContent = "Write a note first."; } return; }
          notesBtn.disabled = true;
          notesBtn.textContent = "Sending...";
          goPost({action: "notes", subject: v.label + " notes", item: v.label + " - " + v.title, body: text})
            .then(function (res) {
              if (res && res.ok) {
                if (msg) { msg.textContent = "Notes sent. Thank you."; msg.classList.add("ok"); }
                if (ta) { ta.value = ""; }
              } else if (msg) { msg.textContent = "Something went wrong. Please try again."; msg.classList.add("err"); }
              notesBtn.disabled = false;
              notesBtn.textContent = "Send notes";
            })
            .catch(function () {
              if (msg) { msg.textContent = "Something went wrong. Please try again."; msg.classList.add("err"); }
              notesBtn.disabled = false;
              notesBtn.textContent = "Send notes";
            });
        });
      }
    });
  }

  function closeModal() {
    var m = document.getElementById("go-modal");
    if (!m) { return; }
    var vids = m.querySelectorAll("video");
    vids.forEach(function (v) { try { v.pause(); v.removeAttribute("src"); v.load(); } catch (e) {} });
    m.parentNode.removeChild(m);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) { closeModal(); }
  });

  function render(d) {
    var card = d && d.card;
    if (!card) { return; }
    var root = document.createElement("div");
    root.id = "go-root";
    var h = "";
    if (TEST_MODE) {
      h += '<p class="go-testbanner">TEST MODE: approvals and notes from this visit are tagged [TEST] and do not count.</p>';
    }
    if (card.profile_pic) {
      h += '<img class="go-profile-pic" src="' + esc(card.profile_pic) + '" alt="' +
        esc(card.profile_pic_alt || card.title) + '" loading="lazy">';
    }
    h += '<p class="go-eyebrow">The Go</p><h1>' + esc(card.title) + '</h1>' +
      '<p class="go-sub">' + esc(card.subtitle) + '</p>';
    if (card.master_folder && card.master_folder.url) {
      h += '<div class="go-master-wrap"><a class="go-btn yellow" href="' + esc(card.master_folder.url) +
        '" target="_blank" rel="noopener">' + esc(card.master_folder.label || "Open the master folder") + '</a></div>';
    }
    h += '<div class="go-card"><h2>' + esc(card.priority_heading) + '</h2>' +
      '<p>' + esc(card.priority) + '</p>';
    if (card.button_enabled !== false) {
      h += '<button class="go-btn" id="go-review-btn" type="button">' + esc(card.button_label || "Review the videos") + '</button>';
    }
    h += '</div>';
    var pending = (card.review_videos || []).filter(function (v) { return v.status !== "approved"; });
    if (pending.length) {
      h += '<p class="go-sect">Your videos</p>';
      pending.forEach(function (v) {
        var stamp = getStamp(v.n);
        h += '<div class="go-vrow"><div><b>' + esc(v.label) + ' - ' + esc(v.title) + '</b><br>' +
          '<span>' + (stamp ? "Approved on " + esc(fmtDate(stamp.date)) : "Awaiting your review") + '</span></div></div>';
      });
    }
    if (card.homescreen && card.homescreen.enabled) {
      h += '<details class="go-hs"><summary>Save this page to your home screen</summary>' +
        '<div class="go-hs-btns">' +
        '<button class="go-btn ghost" type="button" data-hs="iphone">iPhone</button>' +
        '<button class="go-btn ghost" type="button" data-hs="android">Android</button></div>' +
        '<img id="go-hs-img" style="display:none" alt="How to save this page to your home screen"></details>';
    }
    h += '<p class="go-footer">Questions? Email <a href="mailto:team@goanomalous.com">team@goanomalous.com</a><br>' +
      'This page updates live as your project moves.</p>';
    root.innerHTML = h;
    var mount = document.querySelector("main") || document.body;
    mount.insertBefore(root, mount.firstChild);

    var reviewBtn = document.getElementById("go-review-btn");
    if (reviewBtn) { reviewBtn.addEventListener("click", function () { openModal(card); }); }
    var hsImg = document.getElementById("go-hs-img");
    if (hsImg) {
      root.querySelectorAll("[data-hs]").forEach(function (b) {
        b.addEventListener("click", function () {
          hsImg.src = b.getAttribute("data-hs") === "iphone" ? card.homescreen.iphone_img : card.homescreen.android_img;
          hsImg.style.display = "block";
        });
      });
    }
  }

  function init() {
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    fetch(GIST_URL + "?t=" + Date.now(), {cache: "no-store"})
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () {
        var d = document.createElement("div");
        d.id = "go-root";
        d.innerHTML = "<p style='color:#888;text-align:center'>Couldn't load the latest update. Refresh to try again.</p>";
        var mount = document.querySelector("main") || document.body;
        mount.insertBefore(d, mount.firstChild);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
