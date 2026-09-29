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
    "#go-root .go-btn.yellow{background:#FFD60A;color:#111;margin-bottom:14px;}" +
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
    /* track lists (advertising / head-hunting) */
    "#go-root .go-track{list-style:none;margin:0;padding:0;}" +
    "#go-root .go-track li{padding:12px 0;border-bottom:1px solid #222;}" +
    "#go-root .go-track li:last-child{border-bottom:0;}" +
    "#go-root .go-track .t-label{font-weight:700;font-size:15px;margin:0;}" +
    "#go-root .go-track .t-note{color:#999;font-size:13px;margin:6px 0 0;line-height:1.5;}" +
    "#go-root .go-pill{display:inline-block;font-size:11px;font-weight:700;" +
    "letter-spacing:.08em;text-transform:uppercase;border-radius:999px;" +
    "padding:5px 14px;margin-left:8px;vertical-align:middle;}" +
    "#go-root .go-pill.gold{background:rgba(255,180,0,.10);border:1px solid #a88400;color:#ffd75e;}" +
    "#go-root .go-pill.gray{background:rgba(150,150,150,.10);border:1px solid #555;color:#aaa;}" +
    "#go-root .go-pill.blue{background:rgba(0,120,255,.12);border:1px solid #2f6fd0;color:#8ab8ff;}" +
    "#go-root .go-pill.red{background:rgba(224,0,32,.12);border:1px solid " + RED + ";color:#ff6b81;}" +
    "#go-root .go-pill.green{background:rgba(0,200,80,.10);border:1px solid #1d9e57;color:#5ce08a;}" +
    /* stat grid (head-hunt funnel, below how it works) */
    "#go-root .go-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;" +
    "margin:0 0 16px;}" +
    "#go-root .go-stat{background:#111;border:1px solid #2a2a2a;border-radius:12px;" +
    "padding:14px 10px;text-align:center;}" +
    "#go-root .go-stat b{display:block;font-family:Archivo,Inter,sans-serif;" +
    "font-size:26px;font-weight:800;}" +
    "#go-root .go-stat span{font-size:12px;color:#999;}" +
    "#go-root .go-statsnote{color:#999;font-size:13px;line-height:1.6;margin:0 0 16px;" +
    "text-align:center;}" +
    /* task checklists (Judy's / Sandy's) */
    "#go-root .go-tasks{display:grid;grid-template-columns:1fr 1fr;gap:10px;" +
    "margin:0 0 16px;}" +
    "#go-root .go-taskcard{background:#111;border:1px solid #2a2a2a;border-radius:12px;" +
    "padding:14px;}" +
    "#go-root .go-taskcard h3{font-family:Archivo,Inter,sans-serif;font-size:13px;" +
    "font-weight:800;margin:0 0 6px;}" +
    "#go-root .go-task{display:flex;gap:9px;align-items:flex-start;font-size:13px;" +
    "color:#ccc;padding:7px 0;border-top:1px solid #1f1f1f;line-height:1.45;}" +
    "#go-root .go-task .box{width:16px;height:16px;border:1.5px solid #666;" +
    "border-radius:4px;flex-shrink:0;margin-top:2px;}" +
    "#go-root .go-task.done .box{background:#E00020;border-color:#E00020;}" +
    "#go-root .go-task.done span{color:#666;text-decoration:line-through;}" +
    "@media(max-width:640px){#go-root .go-tasks{grid-template-columns:1fr;}}" +
    "@media(max-width:640px){#go-root .go-stats{grid-template-columns:repeat(2,1fr);}}" +
    /* role advert modal */
    "#go-root .go-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:999;" +
    "display:none;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;}" +
    "#go-root .go-modal-overlay.open{display:flex;}" +
    "#go-root .go-modal{background:#141414;border:1px solid #333;border-radius:16px;" +
    "max-width:640px;width:100%;max-height:85vh;overflow-y:auto;padding:26px;box-sizing:border-box;}" +
    "#go-root .go-modal h2{font-family:Archivo,Inter,sans-serif;font-size:20px;margin:0 0 10px;}" +
    "#go-root .go-modal .go-modal-close{float:right;background:none;border:0;color:#999;" +
    "font-size:26px;line-height:1;cursor:pointer;padding:0 0 8px 8px;}" +
    "#go-root .go-modal .advert-head{color:#fff;font-weight:700;font-size:16px;margin:0 0 12px;}" +
    "#go-root .go-modal .advert-body{color:#ddd;line-height:1.65;font-size:15px;}" +
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
  /* ---------- status pills ---------- */
  var PILL_LABEL = {
    in_planning: "In planning", not_started: "Not started", in_progress: "In progress",
    awaiting_approval: "Needs your approval", live: "Live"
  };
  var PILL_CLASS = {
    in_planning: "gold", not_started: "gray", in_progress: "blue",
    awaiting_approval: "red", live: "green"
  };
  function pill(status) {
    var s = status || "not_started";
    return '<span class="go-pill ' + (PILL_CLASS[s] || "gray") + '">' +
      esc(PILL_LABEL[s] || s) + "</span>";
  }

  /* ---------- role advert modal ---------- */
  function openModal(id) {
    document.getElementById(id).classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(el) {
    el.classList.remove("open");
    document.body.style.overflow = "";
  }

  function wireAdvertModal(root, ra) {
    var overlay = root.querySelector("#go-advert-modal");
    var approveBtn = overlay.querySelector(".go-advert-approve");
    var notesArea = overlay.querySelector(".go-advert-notes");
    var notesBtn = overlay.querySelector(".go-advert-notesbtn");
    var msg = overlay.querySelector(".go-advert-msg");
    var key = "gojudy_approval_advert3";
    var heading = (ra && ra.heading) || "";
    var bodyText = (ra && ra.body) || "";

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.getAttribute("data-close") !== null) closeModal(overlay);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeModal(overlay);
    });

    if (approveBtn) {
      twoTap(approveBtn, "Approve Role Advert v3", function (doneFn, fail) {
        post({ action: "approval", subject: "Judy approved Role Advert 3",
               item: "role-advert-3",
               body: "Judy approved Role Advert v3 as-is.\n\nHeading: " + heading })
          .then(function () {
            try { localStorage.setItem(key, JSON.stringify({ date: today() })); } catch (e) {}
            doneFn("Approved, thank you!");
          })
          .catch(fail);
      });
    }
    notesBtn.addEventListener("click", function () {
      var t = notesArea.value.trim();
      if (!t) { notesArea.focus(); return; }
      notesBtn.disabled = true; notesBtn.textContent = "Sending...";
      post({ action: "notes", subject: "Notes on Role Advert 3 from Judy",
             item: "role-advert-3", body: t })
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

  function advertBody(t) {
    return esc(t || "").split(/\n+/).map(function (p) {
      var line = p.trim();
      if (!line) return "";
      var isHead = line.length < 40 && line === line.toUpperCase();
      return (isHead ? "<strong>" : "") + line + (isHead ? "</strong>" : "") + "<br><br>";
    }).join("");
  }

  function renderTrackList(items) {
    var h = '<ul class="go-track">';
    (items || []).forEach(function (it) {
      h += "<li><p class=\"t-label\">" + esc(it.label) + pill(it.status) + "</p>" +
        (it.note ? '<p class="t-note">' + esc(it.note) + "</p>" : "") + "</li>";
    });
    return h + "</ul>";
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

    /* head-hunt funnel stats, right under how it works */
    if (c.stats && c.stats.length) {
      h += '<div class="go-stats">' + c.stats.map(function (s) {
        return '<div class="go-stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>";
      }).join("") + "</div>";
      if (c.stats_note) h += '<p class="go-statsnote">' + esc(c.stats_note) + "</p>";
    }

    /* priority card: opens the Role Advert v3 popup */
    (c.approvals || []).forEach(function (ap) {
      h += '<div class="go-card"><h2>' + esc(ap.title) + "</h2><p>" +
        esc(ap.text).replace(/\n/g, "<br><br>") + "</p>" +
        '<button class="go-btn" data-advert="1">' + esc(ap.cta) + "</button></div>";
    });

    /* tasks: Judy's checklist and Sandy's checklist */
    if (c.tasks && (c.tasks.judy || c.tasks.sandy)) {
      h += '<div class="go-sect">' + esc(c.tasks.heading || "Tasks") + "</div>" +
        '<div class="go-tasks">';
      [["judy"], ["sandy"]].forEach(function (k) {
        var col = c.tasks[k[0]];
        if (!col || !col.items || !col.items.length) return;
        h += '<div class="go-taskcard"><h3>' + esc(col.label) + "</h3>" +
          col.items.map(function (t) {
            return '<div class="go-task' + (t.done ? " done" : "") + '">' +
              '<span class="box"></span><span>' + esc(t.text) + "</span></div>";
          }).join("") + "</div>";
      });
      h += "</div>";
    }

    /* advertising track */
    if (c.advertising) {
      h += '<div class="go-sect">Advertising</div><div class="go-card"><p>' +
        esc(c.advertising.text || "") + "</p>" + renderTrackList(c.advertising.steps) + "</div>";
    }

    /* head-hunting track */
    if (c.headhunt) {
      h += '<div class="go-sect">Head-hunting</div><div class="go-card"><p>' +
        esc(c.headhunt.text || "") + "</p>";
      if (c.headhunt.resource && c.headhunt.resource.url) {
        h += '<a class="go-btn yellow" href="' + esc(c.headhunt.resource.url) +
          '" target="_blank" rel="noopener">' + esc(c.headhunt.resource.label) + "</a>";
      }
      h += renderTrackList(c.headhunt.items) + "</div>";
    }

    /* role advert v3 modal */
    var ra = c.role_advert_3 || {};
    var doneAdvert = null;
    try {
      var avs = JSON.parse(localStorage.getItem("gojudy_approval_advert3") || "null");
      if (avs && avs.date) doneAdvert = avs.date;
    } catch (e) {}
    h += '<div class="go-modal-overlay" id="go-advert-modal"><div class="go-modal">' +
      '<button class="go-modal-close" data-close="1" aria-label="Close">&times;</button>' +
      "<h2>" + esc(ra.title || "Role Advert v3") + "</h2>" +
      '<p class="advert-head">' + esc(ra.heading || "") + "</p>" +
      '<div class="advert-body">' + advertBody(ra.body) + "</div>" +
      (doneAdvert
        ? '<p class="go-done">Approved ' + esc(doneAdvert) + ", thank you.</p>"
        : '<button class="go-btn go-advert-approve" style="margin-top:16px;">Approve Role Advert v3</button>') +
      '<textarea class="go-advert-notes" rows="2" placeholder="Want changes to the advert? Write them here..."></textarea>' +
      '<button class="go-btn ghost go-notesbtn go-advert-notesbtn">Send notes</button>' +
      '<p class="go-msg go-advert-msg"></p>' +
      "</div></div>";

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

    /* priority-card CTA opens the advert popup */
    root.querySelectorAll("[data-advert]").forEach(function (b) {
      b.addEventListener("click", function () { openModal("go-advert-modal"); });
    });

    /* wire the advert modal (approve + notes) */
    wireAdvertModal(root, ra);

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
