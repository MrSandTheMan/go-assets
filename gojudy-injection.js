<script>
/* GoJudy: The Go page for Judy Zhou. Renders from the public gist; all
   copy updates are data-only (edit state, run go-tracker.py update gojudy).
   Local source: ~/workspace/client-tracker/gojudy-injection.js */
(function () {
  var GIST_URL = "https://gist.githubusercontent.com/MrSandTheMan/67d1fd960884fdda8316027dc7ed8660/raw/gojudy-tracker.json";
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
    "text-transform:uppercase;margin:0 0 8px;text-align:center;}" +
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
    /* in-production badge (review cards) */
    "#go-root .go-ipbadge{display:inline-block;background:rgba(255,180,0,.10);" +
    "border:1px solid #a88400;color:#ffd75e;font-size:12px;font-weight:700;" +
    "letter-spacing:.08em;text-transform:uppercase;border-radius:999px;" +
    "padding:6px 16px;margin:2px 0 4px;}" +
    "#go-root .go-sub3{color:#999;font-size:13px;margin:8px 0 0;line-height:1.5;}" +
    /* review player + notes (inline cards) */
    "#go-root .rv-player{position:relative;background:#000;border-radius:12px;" +
    "overflow:hidden;cursor:pointer;margin:10px 0;}" +
    "#go-root .rv-player video{width:100%;aspect-ratio:16/9;display:block;" +
    "background:#000;border-radius:12px;}" +
    "#go-root .rv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" +
    "width:68px;height:68px;border-radius:50%;border:0;background:rgba(0,0,0,.55);" +
    "color:#fff;font-size:24px;cursor:pointer;}" +
    "#go-root .rv-progress{position:absolute;left:0;right:0;bottom:0;height:5px;" +
    "background:rgba(255,255,255,.25);cursor:pointer;}" +
    "#go-root .rv-progress-fill{height:100%;width:0%;background:" + RED + ";}" +
    "#go-root textarea{width:100%;box-sizing:border-box;background:#0a0a0a;" +
    "border:1px solid #333;border-radius:10px;color:#fff;padding:12px;font-size:15px;" +
    "font-family:inherit;min-height:70px;margin:10px 0;}" +
    "#go-root .go-notesbtn{margin-top:4px;}" +
    "#go-root .go-msg{font-size:13px;color:#999;margin:8px 0 0;min-height:18px;}" +
    /* homescreen: two phone-type buttons, guide swaps */
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
    "#go-root .go-footer a{color:#fff;}";

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

  /* ---------- review cards (inline, one per video) ---------- */
  function wireReviewRow(row, v) {
    if (v.status === "in_production") return; // badge only, nothing to wire
    var label = v.label || ("Edit " + v.n);
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
    var key = "gojudy_approval_edit" + v.n;

    if (approveBtn) {
      twoTap(approveBtn, "Approve " + labelLower, function (doneFn, fail) {
        post({ action: "approval", subject: "Judy approved " + label + ": " + (v.title || ""), item: "edit-" + v.n, body: "Approved " + label + "." })
          .then(function () {
            localStorage.setItem(key, JSON.stringify({ date: today() }));
            doneFn("Approved, thank you!");
          })
          .catch(fail);
      });
    }
    notesBtn.addEventListener("click", function () {
      var t = notesArea.value.trim();
      if (!t) { notesArea.focus(); return; }
      notesBtn.disabled = true; notesBtn.textContent = "Sending...";
      post({ action: "notes", subject: "Notes on " + label + ": " + (v.title || ""), item: "edit-" + v.n, body: t })
        .then(function () {
          msg.textContent = "Notes sent, thank you!";
          notesArea.value = "";
          notesBtn.disabled = false; notesBtn.textContent = "Send notes";
        })
        .catch(function () {
          msg.textContent = "Something went wrong. Try again.";
          notesBtn.disabled = false; notesBtn.textContent = "Send notes";
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

    /* priority card */
    (c.approvals || []).forEach(function (ap) {
      h += '<div class="go-card"><h2>' + esc(ap.title) + "</h2><p>" +
        esc(ap.text).replace(/\n/g, "<br><br>") + "</p>" +
        '<button class="go-btn" data-scrollto="go-reviews">' + esc(ap.cta) + "</button></div>";
    });

    /* review section: one card per video */
    h += '<div class="go-sect" id="go-reviews">Your edits</div>';
    var videos = (c.review_videos || []).filter(function (v) { return v.status !== "approved"; });
    videos.forEach(function (v) {
      var label = v.label || ("Edit " + v.n);
      h += '<div class="go-card go-review" data-n="' + v.n + '"><h2>' + esc(label) +
        ' <span style="color:#999;font-size:15px;font-weight:400;">' + esc(v.title || "") + "</span></h2>";
      if (v.status === "in_production") {
        h += '<p><span class="go-ipbadge">In production</span></p>' +
          '<p class="go-sub3">This edit is being cut now. It will appear here for your review when it is ready.</p>';
      } else {
        var key = "gojudy_approval_edit" + v.n;
        var done = null;
        try {
          var vs = JSON.parse(localStorage.getItem(key) || "null");
          if (vs && vs.date) done = vs.date;
        } catch (e) {}
        h += '<div class="rv-player"><video playsinline preload="none" data-src="' + esc(v.src) + '"></video>' +
          '<button class="rv-play" aria-label="Play video">&#9654;</button>' +
          '<div class="rv-progress"><div class="rv-progress-fill"></div></div></div>' +
          (done
            ? '<p class="go-done">Approved ' + esc(done) + ", thank you.</p>"
            : '<button class="go-btn rv-approve">Approve ' + esc(label.toLowerCase()) + "</button>") +
          '<textarea class="rv-notes" rows="2" placeholder="Want changes to ' + esc(label.toLowerCase()) + '? Write them here..."></textarea>' +
          '<button class="go-btn ghost go-notesbtn rv-notesbtn">Send notes</button>' +
          '<p class="go-msg rv-msg"></p>';
      }
      h += "</div>";
    });

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

    /* wire review cards */
    root.querySelectorAll(".go-review").forEach(function (row, i) {
      wireReviewRow(row, videos[i]);
    });

    /* priority-card CTA scroll buttons */
    root.querySelectorAll("[data-scrollto]").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = document.getElementById(b.getAttribute("data-scrollto"));
        if (t && t.scrollIntoView) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

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
