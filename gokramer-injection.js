<script>
/* GoKramer — The Go page for Steven Kramer. Renders from the public gist; all
   copy updates are data-only (edit state, run go-tracker.py update gokramer).
   Local source: ~/workspace/client-tracker/gokramer-injection.js */
(function () {
  var GIST_URL = "https://gist.githubusercontent.com/MrSandTheMan/bdcb880a4a68a4c945cc0e35b4a39c65/raw/gokramer-tracker.json";
  var RED = "#E00020";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function today() {
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  var CSS =
    "#go-root{max-width:960px;margin:0 auto;padding:32px 20px 8px;color:#fff;" +
    "font-family:Inter,-apple-system,'Segoe UI',sans-serif;}" +
    "#go-root .go-eyebrow{letter-spacing:.25em;font-size:12px;color:#999;" +
    "margin:0 0 8px;text-align:center;}" +
    "#go-root h1{font-family:Archivo,Inter,sans-serif;font-weight:800;" +
    "font-size:clamp(28px,5vw,44px);margin:0 0 6px;text-align:center;}" +
    "#go-root .go-sub{text-align:center;color:#999;font-size:15px;margin:0 0 28px;}" +
    "#go-root .go-card{background:#111;border:1px solid #2a2a2a;border-radius:16px;" +
    "padding:22px;margin:0 0 16px;}" +
    "#go-root .go-card h2{font-family:Archivo,Inter,sans-serif;font-size:20px;" +
    "margin:0 0 10px;}" +
    "#go-root .go-card p{color:#ddd;line-height:1.55;margin:0 0 12px;font-size:15px;}" +
    "#go-root .go-sect{font-family:Archivo,Inter,sans-serif;font-size:13px;" +
    "letter-spacing:.2em;text-transform:uppercase;color:#888;margin:28px 0 12px;}" +
    "#go-root .go-btn{display:inline-block;background:" + RED + ";color:#fff;border:0;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;}" +
    "#go-root .go-btn.ghost{background:transparent;border:1px solid #555;color:#fff;}" +
    "#go-root .go-btn.armed{background:#fff;color:#000;}" +
    "#go-root .go-btn:disabled{opacity:.55;cursor:default;}" +
    "#go-root .go-done{color:#5ce08a;font-weight:700;}" +
    "#go-root .go-pp{display:flex;justify-content:center;margin:0 0 18px;}" +
    "#go-root .go-pp img{width:104px;height:104px;border-radius:50%;object-fit:cover;" +
    "border:3px solid " + RED + ";}" +
    /* how it works phases image */
    "#go-root .go-hiw{margin:0 0 16px;text-align:center;}" +
    "#go-root .go-hiw-h{font-family:Archivo,Inter,sans-serif;font-size:13px;" +
    "letter-spacing:.25em;text-transform:uppercase;color:#888;margin:0 0 12px;" +
    "font-weight:600;}" +
    "#go-root .go-hiw img{width:100%;border-radius:16px;display:block;}" +
    /* test mode banner */
    "#go-root .go-testbanner{background:#3a2c00;border:1px solid #8a6d00;color:#ffd75e;" +
    "border-radius:12px;padding:10px 16px;font-size:13px;font-weight:600;text-align:center;" +
    "margin:0 0 16px;}" +
    /* homescreen: two phone-type buttons, guide swaps (Beatrice pattern) */
    "#go-root .go-hs{background:#111;border:1px solid #2a2a2a;border-radius:16px;" +
    "padding:22px;margin:0 0 16px;text-align:center;}" +
    "#go-root .go-hs p{font-size:16px;color:#f5f5f5;margin:0 0 16px;}" +
    "#go-root .go-hsbtns{display:flex;gap:12px;justify-content:center;}" +
    "#go-root .go-hsbtns .go-btn{background:transparent;border:1.5px solid #555;" +
    "color:#ccc;}" +
    "#go-root .go-hsbtns .go-btn.active{border-color:" + RED + ";color:#fff;" +
    "background:rgba(224,0,32,.12);}" +
    "#go-root .go-hsguide{display:none;}" +
    "#go-root .go-hsguide img{width:100%;max-width:440px;border-radius:12px;" +
    "margin:14px auto 0;border:1px solid #333;display:block;}" +
    "#go-root .go-footer{text-align:center;color:#888;font-size:14px;" +
    "margin:32px 0 8px;line-height:1.7;}" +
    "#go-root .go-footer a{color:#fff;}" +
    /* modal */
    "#go-modal{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;" +
    "display:none;align-items:center;justify-content:center;padding:18px;}" +
    "#go-modal.open{display:flex;}" +
    "#go-modal .go-mbox{background:#141414;border:1px solid #333;border-radius:18px;" +
    "max-width:640px;width:100%;max-height:86vh;overflow:auto;padding:26px;color:#fff;}" +
    "#go-modal .go-mbox h2{font-family:Archivo,Inter,sans-serif;margin:0 0 6px;" +
    "font-size:22px;}" +
    "#go-modal .go-mbox p{color:#ccc;line-height:1.55;font-size:15px;}" +
    "#go-modal .go-x{float:right;background:none;border:0;color:#888;font-size:22px;" +
    "cursor:pointer;}" +
    "#go-modal .go-item{border-top:1px solid #2a2a2a;padding:16px 0;}" +
    "#go-modal .go-item b{font-size:16px;}" +
    "#go-modal .go-item .go-sub2{color:#999;font-size:13px;font-weight:400;}" +
    "#go-modal .go-btn{display:inline-block;background:" + RED + ";color:#fff;border:0;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;}" +
    "#go-modal .go-btn.ghost{background:transparent;border:1px solid #555;color:#fff;}" +
    "#go-modal .go-btn.armed{background:#fff;color:#000;}" +
    "#go-modal .go-btn:disabled{opacity:.55;cursor:default;}" +
    "#go-modal .go-done{color:#5ce08a;font-weight:700;}" +
    "#go-modal textarea{width:100%;box-sizing:border-box;background:#0a0a0a;" +
    "border:1px solid #333;border-radius:10px;color:#fff;padding:12px;font-size:15px;" +
    "font-family:inherit;min-height:70px;margin:10px 0;}" +
    "#go-modal .go-notesbtn{margin-top:4px;}" +
    "#go-modal .go-msg{font-size:13px;color:#999;margin:8px 0 0;min-height:18px;}" +
    /* video player (custom, no native controls) */
    "#go-modal .rv-player{position:relative;background:#000;border-radius:12px;" +
    "overflow:hidden;cursor:pointer;margin:10px 0;}" +
    "#go-modal .rv-player video{width:100%;aspect-ratio:16/9;display:block;" +
    "background:#000;border-radius:12px;}" +
    "#go-modal .rv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" +
    "width:68px;height:68px;border-radius:50%;border:0;background:rgba(0,0,0,.55);" +
    "color:#fff;font-size:24px;cursor:pointer;}" +
    "#go-modal .rv-progress{position:absolute;left:0;right:0;bottom:0;height:5px;" +
    "background:rgba(255,255,255,.25);cursor:pointer;}" +
    "#go-modal .rv-progress-fill{height:100%;width:0%;background:" + RED + ";}" +
    /* accounts modal rows */
    "#go-modal .go-acc{border-top:1px solid #2a2a2a;padding:14px 0;}" +
    "#go-modal .go-acc b{font-size:16px;display:block;margin:0 0 8px;}" +
    "#go-modal .go-acc input{width:100%;box-sizing:border-box;background:#0a0a0a;" +
    "border:1px solid #333;border-radius:10px;color:#fff;padding:11px 12px;" +
    "font-size:15px;font-family:inherit;margin:0 0 8px;}" +
    "#go-modal .go-acc input:disabled{opacity:.35;}" +
    "#go-modal .go-acc .go-nonebtn{background:transparent;border:1px solid #555;" +
    "color:#ccc;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;" +
    "cursor:pointer;font-family:inherit;}" +
    "#go-modal .go-acc .go-nonebtn.on{border-color:" + RED + ";color:#fff;" +
    "background:rgba(224,0,32,.12);}" +
    "#go-modal .go-acc .go-nonelabel{color:#5ce08a;font-size:13px;font-weight:700;" +
    "margin-left:10px;display:none;}" +
    /* show/hide password toggle inside password fields */
    "#go-modal .go-passwrap{position:relative;margin:0 0 8px;}" +
    "#go-modal .go-passwrap .acc-pass{margin:0;padding-right:62px;}" +
    "#go-modal .go-showpass{position:absolute;right:6px;top:50%;transform:translateY(-50%);" +
    "background:none;border:0;color:#999;font-size:13px;font-weight:600;cursor:pointer;" +
    "font-family:inherit;padding:8px 6px;}" +
    "#go-modal .go-showpass:disabled{opacity:.3;cursor:default;}" +
    "#go-root .go-field{margin:0 0 12px;}" +
    "#go-root .go-field label{display:block;font-size:13px;color:#999;margin:0 0 6px;" +
    "letter-spacing:.04em;}" +
    "#go-root .go-field input{width:100%;box-sizing:border-box;background:#0a0a0a;" +
    "border:1px solid #333;border-radius:10px;color:#fff;padding:12px;font-size:15px;" +
    "font-family:inherit;}" +
    "#go-root .go-formrow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}" +
    "@media(max-width:560px){#go-root .go-formrow{grid-template-columns:1fr;}}";

  var BACKEND = null;
  /* test mode: open the page with ?test=1 and every submission is tagged [TEST]
     in the notification email, so tests are never confused with real client submissions */
  var TEST_MODE = /(?:\?|&)test=1(?:&|$)/.test(window.location.search);
  function post(payload) {
    var p = Object.assign({ token: BACKEND.token }, payload);
    if (TEST_MODE) {
      p.subject = "[TEST] " + (p.subject || p.action || "");
      p.body = "TEST SUBMISSION - sent from a ?test=1 page load, not by the client.\n\n" + (p.body || "");
    }
    return fetch(BACKEND.url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(p)
    }).then(function (r) { return r.json(); });
  }

  function twoTap(btn, idleText, onConfirm) {
    btn.addEventListener("click", function () {
      if (!btn.classList.contains("armed")) {
        btn.classList.add("armed");
        btn.textContent = "Tap again to confirm";
        setTimeout(function () {
          btn.classList.remove("armed");
          btn.textContent = idleText;
        }, 6000);
        return;
      }
      btn.classList.remove("armed");
      btn.disabled = true;
      btn.textContent = "Sending...";
      onConfirm(function done(okText) {
        btn.textContent = okText;
      }, function fail() {
        btn.disabled = false;
        btn.textContent = idleText;
      });
    });
  }

  /* ---------- modal ---------- */
  var modal, mbox;
  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.id = "go-modal";
    modal.innerHTML = '<div class="go-mbox"><button class="go-x" aria-label="Close">×</button><div class="go-mbody"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector(".go-x").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
    mbox = modal.querySelector(".go-mbody");
  }
  function openModal(html) {
    ensureModal();
    mbox.innerHTML = html;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    return mbox;
  }
  function closeModal() {
    if (!modal) return;
    modal.querySelectorAll("video").forEach(function (v) { try { v.pause(); } catch (e) {} v.removeAttribute("src"); v.load(); });
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- rough draft review modal ---------- */
  function openReview(videos) {
    var pending = videos.filter(function (v) { return v.status !== "approved"; });
    var html = "<h2>Review your rough drafts</h2>" +
      "<p>Tap play on each trim. Approve the ones you love, or send notes on what to change.</p>";
    pending.forEach(function (v) {
      var key = "gokramer_appr2_trim" + v.n;
      var done = null;
      try {
        var vs = JSON.parse(localStorage.getItem(key) || "null");
        if (vs && vs.date) done = vs.date;
      } catch (e) {}
      html += '<div class="go-item" data-n="' + v.n + '">' +
        "<b>" + esc(v.label) + ' <span class="go-sub2">' + esc(v.title || "") + "</span></b>" +
        '<div class="rv-player"><video playsinline preload="none" data-src="' + esc(v.src) + '"></video>' +
        '<button class="rv-play" aria-label="Play video">&#9654;</button>' +
        '<div class="rv-progress"><div class="rv-progress-fill"></div></div></div>' +
        (done
          ? '<p class="go-done">Approved ' + esc(done) + " — thank you.</p>"
          : '<button class="go-btn rv-approve">Approve ' + esc((v.label || "").toLowerCase()) + "</button>") +
        '<textarea class="rv-notes" rows="2" placeholder="Want changes to ' + esc((v.label || "").toLowerCase()) + '? Write them here..."></textarea>' +
        '<button class="go-btn ghost go-notesbtn rv-notesbtn">Send notes</button>' +
        '<p class="go-msg rv-msg"></p></div>';
    });
    var box = openModal(html);
    box.querySelectorAll(".go-item").forEach(function (row, i) {
      wireReviewRow(row, pending[i]);
    });
  }

  function wireReviewRow(row, v) {
    var label = v.label || ("Trim " + v.n);
    var labelLower = label.toLowerCase();
    var nativeVideo = row.querySelector("video");
    var playBtn = row.querySelector(".rv-play");
    var progBar = row.querySelector(".rv-progress");
    var progFill = row.querySelector(".rv-progress-fill");

    var togglePlay = function () {
      if (!nativeVideo.getAttribute("src")) nativeVideo.setAttribute("src", nativeVideo.getAttribute("data-src"));
      if (nativeVideo.paused) {
        var pr = nativeVideo.play();
        if (pr && pr.catch) pr.catch(function () {});
      } else {
        nativeVideo.pause();
      }
    };
    nativeVideo.addEventListener("click", togglePlay);
    playBtn.addEventListener("click", function (e) { e.stopPropagation(); togglePlay(); });
    nativeVideo.addEventListener("play", function () { playBtn.style.display = "none"; });
    nativeVideo.addEventListener("pause", function () { playBtn.style.display = ""; });
    nativeVideo.addEventListener("timeupdate", function () {
      if (nativeVideo.duration) progFill.style.width = (nativeVideo.currentTime / nativeVideo.duration * 100) + "%";
    });
    progBar.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!nativeVideo.getAttribute("src")) nativeVideo.setAttribute("src", nativeVideo.getAttribute("data-src"));
      var r = progBar.getBoundingClientRect();
      var ratio = (e.clientX - r.left) / r.width;
      if (ratio < 0) ratio = 0;
      if (ratio > 1) ratio = 1;
      if (nativeVideo.duration) nativeVideo.currentTime = ratio * nativeVideo.duration;
    });

    var approveBtn = row.querySelector(".rv-approve");
    var notesArea = row.querySelector(".rv-notes");
    var notesBtn = row.querySelector(".rv-notesbtn");
    var msg = row.querySelector(".rv-msg");
    var key = "gokramer_appr2_trim" + v.n;

    if (approveBtn) {
      twoTap(approveBtn, "Approve " + labelLower, function (doneFn, fail) {
        post({ action: "approval", subject: "Steven approved " + label + ": " + (v.title || ""), item: "trim-" + v.n, body: "Approved " + label + "." })
          .then(function () {
            localStorage.setItem(key, JSON.stringify({ date: today() }));
            doneFn("Approved — thank you!");
          })
          .catch(fail);
      });
    }
    notesBtn.addEventListener("click", function () {
      var t = notesArea.value.trim();
      if (!t) { notesArea.focus(); return; }
      notesBtn.disabled = true; notesBtn.textContent = "Sending...";
      post({ action: "notes", subject: "Notes on " + label + ": " + (v.title || ""), item: "trim-" + v.n, body: t })
        .then(function () {
          msg.textContent = "Notes sent — thank you!";
          notesArea.value = "";
          notesBtn.disabled = false; notesBtn.textContent = "Send notes";
        })
        .catch(function () {
          msg.textContent = "Something went wrong — try again.";
          notesBtn.disabled = false; notesBtn.textContent = "Send notes";
        });
    });
  }

  /* ---------- accounts access modal ---------- */
  function openAccounts(acct) {
    var html = "<h2>" + esc(acct.title) + "</h2><p>" + esc(acct.text) + "</p>";
    acct.platforms.forEach(function (p, i) {
      html += '<div class="go-acc" data-p="' + esc(p) + '">' +
        "<b>" + esc(p) + "</b>" +
        '<input type="text" class="acc-user" placeholder="Username" autocomplete="off">' +
        '<div class="go-passwrap"><input type="password" class="acc-pass" placeholder="Password" autocomplete="off">' +
        '<button class="go-showpass" type="button" aria-label="Show password">Show</button></div>' +
        '<button class="go-nonebtn" type="button">Don\'t have one</button>' +
        '<span class="go-nonelabel">No account — noted.</span></div>';
    });
    html += '<div style="margin-top:18px;"><button class="go-btn" id="go-accsend">Send logins</button>' +
      '<p class="go-msg" id="go-accmsg"></p></div>';
    var box = openModal(html);

    box.querySelectorAll(".go-acc").forEach(function (row) {
      var noneBtn = row.querySelector(".go-nonebtn");
      var user = row.querySelector(".acc-user");
      var pass = row.querySelector(".acc-pass");
      var showBtn = row.querySelector(".go-showpass");
      var label = row.querySelector(".go-nonelabel");
      showBtn.addEventListener("click", function () {
        var showing = pass.type === "text";
        pass.type = showing ? "password" : "text";
        showBtn.textContent = showing ? "Show" : "Hide";
        showBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      });
      noneBtn.addEventListener("click", function () {
        var on = noneBtn.classList.toggle("on");
        user.disabled = on; pass.disabled = on; showBtn.disabled = on;
        label.style.display = on ? "inline" : "none";
        noneBtn.textContent = on ? "Undo" : "Don't have one";
        if (on) {
          user.value = ""; pass.value = "";
          pass.type = "password"; showBtn.textContent = "Show";
          showBtn.setAttribute("aria-label", "Show password");
        }
      });
    });

    var sent = localStorage.getItem("gokramer_accounts_sent");
    if (sent) {
      box.querySelector("#go-accsend").outerHTML = '<p class="go-done">Logins received ' + esc(sent) + " — thank you.</p>";
      return;
    }

    box.querySelector("#go-accsend").addEventListener("click", function () {
      var btn = this, msg = box.querySelector("#go-accmsg");
      var lines = [];
      var anyFilled = false;
      box.querySelectorAll(".go-acc").forEach(function (row) {
        var p = row.getAttribute("data-p");
        var isNone = row.querySelector(".go-nonebtn").classList.contains("on");
        var u = row.querySelector(".acc-user").value.trim();
        var pw = row.querySelector(".acc-pass").value;
        if (isNone) { lines.push(p + ": no account"); anyFilled = true; }
        else if (u || pw) { lines.push(p + ": username=" + u + " password=" + pw); anyFilled = true; }
        else { lines.push(p + ": (skipped)"); }
      });
      if (!anyFilled) { msg.textContent = "Fill in at least one platform, or tap \"Don't have one\"."; return; }
      btn.disabled = true; btn.textContent = "Sending...";
      post({ action: "accounts", subject: "Steven sent account logins", item: "accounts", body: lines.join("\n") })
        .then(function () {
          localStorage.setItem("gokramer_accounts_sent", today());
          btn.outerHTML = '<p class="go-done">Logins received — thank you.</p>';
        })
        .catch(function () {
          msg.textContent = "Something went wrong — try again.";
          btn.disabled = false; btn.textContent = "Send logins";
        });
    });
  }

  /* ---------- render ---------- */
  function render(d) {
    var c = d.card;
    BACKEND = d.backend;
    var h = "";

    if (c.profile_pic) {
      h += '<div class="go-pp"><img loading="lazy" src="' + esc(c.profile_pic) +
        '" alt="' + esc(c.profile_pic_alt || "") + '"></div>';
    }
    h += '<p class="go-eyebrow">' + esc(c.eyebrow) + "</p><h1>" + esc(c.title) + "</h1>" +
      '<p class="go-sub">' + esc(c.subtitle) + "</p>";

    /* how it works (up top): project phases image */
    if (c.how_it_works && c.how_it_works.image) {
      h += '<div class="go-hiw"><h2 class="go-hiw-h">' + esc(c.how_it_works.heading || "How it works") + "</h2>" +
        '<img loading="lazy" src="' + esc(c.how_it_works.image) + '" alt="' +
        esc(c.how_it_works.alt || "How your project moves") + '"></div>';
    }

    /* approvals: rough draft review */
    h += '<div class="go-sect">Needs your approval</div>';
    c.approvals.forEach(function (ap) {
      h += '<div class="go-card"><h2>' + esc(ap.title) + "</h2><p>" +
        esc(ap.text).replace(/\n/g, "<br><br>") + "</p>" +
        '<button class="go-btn" data-ap="' + esc(ap.id) + '">' + esc(ap.cta) + "</button></div>";
    });

    /* accounts access */
    h += '<div class="go-sect">Account access</div>' +
      '<div class="go-card"><h2>' + esc(c.accounts.title) + "</h2><p>" + esc(c.accounts.text) + "</p>" +
      '<button class="go-btn" id="go-accountsbtn">' + esc(c.accounts.cta) + "</button></div>";

    /* part 2 shoot form */
    var rDone = localStorage.getItem("gokramer_reshoot_sent2");
    h += '<div class="go-sect">Part 2 shoot</div>' +
      '<div class="go-card"><h2>' + esc(c.reshoot.title) + "</h2><p>" + esc(c.reshoot.text) + "</p>";
    if (rDone) {
      h += '<p class="go-done">Received ' + esc(rDone) + " — thank you.</p>";
    } else {
      h += '<div class="go-formrow">' +
        '<div class="go-field"><label>Start time</label><input id="go-time" placeholder="e.g. 10:00 AM"></div></div>' +
        '<div class="go-formrow">' +
        '<div class="go-field"><label>Guest name 1</label><input id="go-guest1" placeholder="Full name"></div>' +
        '<div class="go-field"><label>Guest name 2</label><input id="go-guest2" placeholder="Full name"></div></div>' +
        '<button class="go-btn" id="go-reshootsend">Send shoot details</button>' +
        '<p class="go-msg" id="go-reshootmsg" style="font-size:13px;color:#999;margin:8px 0 0;"></p>';
    }
    h += "</div>";

    h += '<p class="go-footer">Questions? Email <a href="mailto:' + esc(c.footer_email) + '">' +
      esc(c.footer_email) + "</a><br>This page updates live as your project moves.</p>";

    if (c.homescreen && c.homescreen.enabled) {
      h += '<div class="go-hs"><p>Want to add this page to your home screen?</p>' +
        '<div class="go-hsbtns">' +
        '<button class="go-btn" data-guide="iphone">iPhone</button>' +
        '<button class="go-btn" data-guide="android">Android</button></div>' +
        '<div class="go-hsguide"><img alt="Add to home screen guide"></div></div>';
    }

    var root = document.createElement("div");
    root.id = "go-root";
    if (TEST_MODE) {
      h = '<div class="go-testbanner">TEST MODE - submissions from this visit will be tagged [TEST] in the notification email.</div>' + h;
    }
    root.innerHTML = h;
    var mount = document.querySelector("main") || document.getElementById("page") || document.body;
    mount.insertBefore(root, mount.firstChild);

    /* homescreen buttons */
    var hsEl = root.querySelector(".go-hs");
    if (hsEl) {
      var guideBox = hsEl.querySelector(".go-hsguide");
      var guideImg = guideBox.querySelector("img");
      var current = null;
      hsEl.querySelectorAll("[data-guide]").forEach(function (b) {
        b.addEventListener("click", function () {
          var which = b.getAttribute("data-guide");
          if (current === which) {
            guideBox.style.display = "none"; current = null;
            b.classList.remove("active"); return;
          }
          guideImg.src = which === "iphone" ? c.homescreen.iphone_img : c.homescreen.android_img;
          guideImg.alt = (which === "iphone" ? "iPhone" : "Android") + " add to home screen guide";
          guideBox.style.display = "block";
          hsEl.querySelectorAll("[data-guide]").forEach(function (o) { o.classList.remove("active"); });
          b.classList.add("active");
          current = which;
        });
      });
    }

    /* approval modal open */
    root.querySelectorAll("[data-ap]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openReview(c.review_videos);
      });
    });

    /* accounts modal open */
    var accBtn = root.querySelector("#go-accountsbtn");
    if (accBtn) accBtn.addEventListener("click", function () { openAccounts(c.accounts); });

    /* reshoot form */
    var rsBtn = root.querySelector("#go-reshootsend");
    if (rsBtn) {
      rsBtn.addEventListener("click", function () {
        var msg = root.querySelector("#go-reshootmsg");
        var vals = {
          "Shoot day": "Thursday, Oct 8",
          "Start time": root.querySelector("#go-time").value.trim(),
          "Guest 1": root.querySelector("#go-guest1").value.trim(),
          "Guest 2": root.querySelector("#go-guest2").value.trim()
        };
        var filled = Object.keys(vals).filter(function (k) { return vals[k]; });
        if (!filled.length) { msg.textContent = "Fill in at least one field first."; return; }
        rsBtn.disabled = true; rsBtn.textContent = "Sending...";
        var body = Object.keys(vals).map(function (k) { return k + ": " + (vals[k] || "-"); }).join("\n");
        post({ action: "reshoot", subject: "Steven sent part 2 shoot details", item: "reshoot", body: body })
          .then(function () {
            localStorage.setItem("gokramer_reshoot_sent2", today());
            rsBtn.outerHTML = '<p class="go-done">Received — thank you.</p>';
            msg.textContent = "";
          })
          .catch(function () {
            msg.textContent = "Something went wrong — try again.";
            rsBtn.disabled = false; rsBtn.textContent = "Send shoot details";
          });
      });
    }
  }

  function init() {
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    fetch(GIST_URL + "?t=" + Date.now(), { cache: "no-store" })
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
</script>
