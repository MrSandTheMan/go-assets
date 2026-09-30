<script>
/* GoCorestone — The Go page for Corestone. Renders from the public gist; all
   copy updates are data-only (edit gocorestone-data.json, run go-tracker.py).
   Local source: ~/workspace/client-tracker/gocorestone-injection.js */
(function () {
  var GIST_URL = "__GIST_URL__";
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
    "text-transform:uppercase;margin:0 0 8px;}" +
    "#go-root h1{font-family:Archivo,Inter,sans-serif;font-weight:800;" +
    "font-size:clamp(28px,5vw,44px);margin:0 0 24px;}" +
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
    "#go-root textarea{width:100%;box-sizing:border-box;background:#0a0a0a;" +
    "border:1px solid #333;border-radius:10px;color:#fff;padding:12px;font-size:15px;" +
    "font-family:inherit;min-height:84px;margin:0 0 12px;}" +
    "#go-root .go-pill{display:inline-block;font-size:12px;font-weight:700;" +
    "letter-spacing:.08em;text-transform:uppercase;border-radius:999px;" +
    "padding:4px 12px;margin:0 0 8px;}" +
    "#go-root .go-pill.waiting{background:#3a2c00;color:#ffcf5c;}" +
    "#go-root .go-pill.blocked{background:#3d0009;color:#ff6b81;}" +
    "#go-root .go-pill.open{background:#222;color:#bbb;}" +
    "#go-root .go-pill.ready{background:#00331a;color:#5ce08a;}" +
    "#go-root .go-pill.planned{background:#1c1c1c;color:#888;}" +
    "#go-root .go-bn{font-weight:800;font-size:16px;margin:0 0 4px;}" +
    "#go-root .go-pinblock{width:100%;border-radius:10px;margin:10px 0 4px;" +
    "border:1px solid #333;}" +
    "#go-root .go-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;" +
    "margin:0 0 16px;}" +
    "#go-root .go-stat{background:#111;border:1px solid #2a2a2a;border-radius:12px;" +
    "padding:14px 10px;text-align:center;}" +
    "#go-root .go-stat b{display:block;font-family:Archivo,Inter,sans-serif;" +
    "font-size:26px;}" +
    "#go-root .go-stat span{font-size:12px;color:#999;}" +
    "#go-root .go-li{display:flex;gap:10px;align-items:flex-start;padding:10px 0;" +
    "border-top:1px solid #222;font-size:15px;color:#ddd;}" +
    "#go-root .go-li:first-of-type{border-top:0;}" +
    "#go-root .go-note{background:#0d0d0d;border-left:3px solid " + RED + ";" +
    "padding:12px 14px;border-radius:0 10px 10px 0;color:#ccc;font-size:14px;" +
    "line-height:1.55;margin:12px 0 0;}" +
    "#go-root .go-tl{display:flex;gap:14px;padding:10px 0;border-top:1px solid #222;}" +
    "#go-root .go-tl:first-of-type{border-top:0;}" +
    "#go-root .go-tl b{white-space:nowrap;color:#fff;}" +
    "#go-root .go-tl span{color:#ddd;}" +
    "#go-root .go-footer{text-align:center;color:#888;font-size:14px;" +
    "margin:32px 0 8px;line-height:1.7;}" +
    "#go-root .go-footer a{color:#fff;}" +
    "#go-root .go-done{color:#5ce08a;font-weight:700;}" +
    "@media(max-width:640px){#go-root .go-stats{grid-template-columns:repeat(2,1fr);}}" +
    /* pillar status bars */
    "#go-root .go-plan{font-family:Archivo,Inter,sans-serif;font-size:13px;" +
    "letter-spacing:.2em;text-transform:uppercase;color:#888;margin:0 0 10px;}" +
    "#go-root .go-pillars{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;" +
    "margin:0 0 24px;}" +
    "#go-root .go-pillar{display:flex;justify-content:space-between;align-items:center;" +
    "background:#111;border:1px solid #2a2a2a;border-radius:10px;padding:10px 14px;" +
    "font-size:13px;}" +
    "#go-root .go-pillar b{letter-spacing:.06em;}" +
    "#go-root .go-pillar .go-pill{margin:0;}" +
    "@media(max-width:640px){#go-root .go-pillars{grid-template-columns:1fr;}}" +
    /* profile pic + homescreen (universal Go elements) */
    "#go-root .go-pp{display:flex;justify-content:center;margin:0 0 18px;}" +
    "#go-root .go-pp img{width:104px;height:104px;border-radius:50%;object-fit:cover;" +
    "border:3px solid " + RED + ";}" +
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
    "#go-modal .go-item{border-top:1px solid #2a2a2a;padding:14px 0;}" +
    "#go-modal .go-item b{font-size:16px;}" +
    "#go-modal .go-item p{font-size:14px;margin:6px 0 10px;}" +
    "#go-modal .go-tag{display:inline-block;background:" + RED + ";color:#fff;" +
    "font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;" +
    "border-radius:999px;padding:3px 10px;margin-left:8px;vertical-align:2px;}" +
    "#go-modal .go-email{background:#0a0a0a;border:1px solid #2c2c2c;border-radius:12px;" +
    "padding:16px;font-size:14px;line-height:1.65;color:#ddd;white-space:pre-wrap;" +
    "margin:12px 0;}" +
    "#go-modal .go-subj{color:#fff;font-weight:700;}" +
    "#go-modal textarea{width:100%;box-sizing:border-box;background:#0a0a0a;" +
    "border:1px solid #333;border-radius:10px;color:#fff;padding:12px;font-size:15px;" +
    "font-family:inherit;min-height:70px;margin:10px 0;}" +
    /* modal buttons: the #go-root .go-btn rules don't reach the modal (it's on body) */
    "#go-modal .go-btn{display:inline-block;background:" + RED + ";color:#fff;border:0;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;}" +
    "#go-modal .go-btn.ghost{background:transparent;border:1px solid #555;color:#fff;}" +
    "#go-modal .go-btn.armed{background:#fff;color:#000;}" +
    "#go-modal .go-btn:disabled{opacity:.55;cursor:default;}" +
    "#go-root .go-bq{margin-top:14px;padding-top:14px;border-top:1px solid #2a2a2a;}" +
    "#go-root .go-bqq{font-weight:700;color:#fff;margin:0 0 10px;font-size:15px;}" +
    "#go-root .go-bqnotes{display:block;width:100%;box-sizing:border-box;margin:10px 0;" +
    "background:#1a1a1a;border:1px solid #333;border-radius:10px;color:#fff;padding:10px;font-size:14px;}" +
    "#go-root .go-testbanner{background:#3a2c00;border:1px solid #8a6d00;color:#ffd75e;" +
    "border-radius:10px;padding:12px 16px;margin:0 0 16px;font-size:14px;font-weight:700;}";

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
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function notesBlock(itemId, itemLabel) {
    return '<textarea id="go-notes" placeholder="Notes for the team (optional)"></textarea>' +
      '<button class="go-btn ghost" id="go-sendnotes">Send notes</button>' +
      '<span id="go-notesdone" class="go-done" style="display:none;margin-left:12px;">Notes sent.</span>';
  }
  function wireNotes(itemId, itemLabel) {
    var btn = mbox.querySelector("#go-sendnotes");
    var ta = mbox.querySelector("#go-notes");
    btn.addEventListener("click", function () {
      var v = ta.value.trim();
      if (!v) { ta.focus(); return; }
      btn.disabled = true; btn.textContent = "Sending...";
      post({ action: "notes", subject: "Notes: " + itemLabel, item: itemId, body: v })
        .then(function () {
          btn.style.display = "none"; ta.style.display = "none";
          mbox.querySelector("#go-notesdone").style.display = "inline";
        })
        .catch(function () { btn.disabled = false; btn.textContent = "Send notes"; });
    });
  }

  /* ---------- approval modals ---------- */
  function openLeadMagnets(ap) {
    var html = "<h2>" + esc(ap.title) + "</h2><p>" + esc(ap.text) + "</p>";
    ap.items.forEach(function (it) {
      var key = "gocorestone_approved_" + it.id;
      var done = localStorage.getItem(key);
      html += '<div class="go-item" data-id="' + esc(it.id) + '">' +
        "<b>" + esc(it.name) + (it.pick ? '<span class="go-tag">My pick</span>' : "") + "</b>" +
        "<p>" + esc(it.desc) + "</p>" +
        (done
          ? '<span class="go-done">Approved ' + esc(done) + "</span>"
          : '<button class="go-btn">Build this one</button>') +
        "</div>";
    });
    html += notesBlock("lead-magnet", "Lead magnet pick");
    var box = openModal(html);
    wireNotes("lead-magnet", "Lead magnet pick");
    box.querySelectorAll(".go-item").forEach(function (row) {
      var btn = row.querySelector(".go-btn");
      if (!btn) return;
      var id = row.getAttribute("data-id");
      var it = ap.items.filter(function (x) { return x.id === id; })[0];
      var name = it ? it.name : id;
      twoTap(btn, "Build this one", function (done, fail) {
        post({ action: "approval", subject: "Moshe picked a lead magnet: " + name, item: "lead-magnet:" + id, body: name })
          .then(function () {
            localStorage.setItem("gocorestone_approved_" + id, today());
            done("Approved");
          })
          .catch(fail);
      });
    });
  }

  function openFilmEmail(ap) {
    var key = "gocorestone_approved_film-email";
    var done = localStorage.getItem(key);
    var html = "<h2>" + esc(ap.title) + "</h2><p>" + esc(ap.text) + "</p>" +
      '<p class="go-subj">Subject options:</p><p>' +
      ap.email_subjects.map(function (s) { return "· " + esc(s); }).join("<br>") + "</p>" +
      '<div class="go-email">' + esc(ap.email_body) + "</div>" +
      (done
        ? '<p class="go-done">Approved ' + esc(done) + "</p>"
        : '<button class="go-btn" id="go-approvefilm">Approve this email</button>') +
      notesBlock("film-email", "Client filming email");
    var box = openModal(html);
    wireNotes("film-email", "Client filming email");
    var btn = box.querySelector("#go-approvefilm");
    if (btn) {
      twoTap(btn, "Approve this email", function (doneFn, fail) {
        post({ action: "approval", subject: "Moshe approved the client filming email", item: "film-email", body: "Approved." })
          .then(function () {
            localStorage.setItem(key, today());
            doneFn("Approved");
          })
          .catch(fail);
      });
    }
  }

  function openFavProperties(ap) {
    var key = "gocorestone_approved_fav-properties";
    var done = localStorage.getItem(key);
    var html = "<h2>" + esc(ap.title) + "</h2><p>" + esc(ap.text) + "</p>";
    (ap.properties || []).forEach(function (p) {
      html += '<div class="go-item"><b>' + esc(p.name) + "</b>" +
        "<p>" + esc(p.clients) + "<br>" + esc(p.emails) + "</p></div>";
    });
    html += done
      ? '<p class="go-done">Approved ' + esc(done) + "</p>"
      : '<button class="go-btn" id="go-approvefav">Yes, list is right</button>';
    html += notesBlock("fav-properties", "Favorite properties list");
    var box = openModal(html);
    wireNotes("fav-properties", "Favorite properties list");
    var btn = box.querySelector("#go-approvefav");
    if (btn) {
      twoTap(btn, "Yes, list is right", function (doneFn, fail) {
        post({ action: "approval", subject: "Moshe approved the favorite properties list", item: "fav-properties", body: "Approved." })
          .then(function () {
            localStorage.setItem(key, today());
            doneFn("Approved");
          })
          .catch(fail);
      });
    }
  }

  function openAudit(ap) {
    var key = "gocorestone_approved_audit";
    var done = localStorage.getItem(key);
    var html = "<h2>" + esc(ap.title) + "</h2><p>" + esc(ap.text) + "</p>";
    (ap.groups || []).forEach(function (g) {
      html += '<div class="go-item"><b>' + esc(g.heading) + "</b><p>" +
        (g.items || []).map(function (it) { return "· " + esc(it); }).join("<br>") + "</p></div>";
    });
    html += done
      ? '<p class="go-done">Approved ' + esc(done) + "</p>"
      : '<button class="go-btn" id="go-approveaudit">Approve the audit</button>';
    html += notesBlock("audit", "Corestone audit");
    var box = openModal(html);
    wireNotes("audit", "Corestone audit");
    var btn = box.querySelector("#go-approveaudit");
    if (btn) {
      twoTap(btn, "Approve the audit", function (doneFn, fail) {
        post({ action: "approval", subject: "Moshe approved the Corestone audit", item: "audit", body: "Approved." })
          .then(function () {
            localStorage.setItem(key, today());
            doneFn("Approved");
          })
          .catch(fail);
      });
    }
  }

  /* ---------- render ---------- */
  function pill(status) {
    var cls = "planned";
    if (/waiting/i.test(status)) cls = "waiting";
    else if (/blocked/i.test(status)) cls = "blocked";
    else if (/open/i.test(status)) cls = "open";
    else if (/ready/i.test(status) || /done/i.test(status)) cls = "ready";
    else if (/in progress/i.test(status)) cls = "waiting";
    return '<span class="go-pill ' + cls + '">' + esc(status) + "</span>";
  }

  function planDay(planStart) {
    if (!planStart) return null;
    var ms = Date.now() - new Date(planStart + "T00:00:00").getTime();
    return Math.max(1, Math.floor(ms / 86400000) + 1);
  }

  function render(d) {
    var c = d.card;
    BACKEND = d.backend;
    var h = "";

    /* profile pic, up top */
    if (c.profile_pic) {
      h += '<div class="go-pp"><img loading="lazy" src="' + esc(c.profile_pic) +
        '" alt="' + esc(c.profile_pic_alt || "") + '"></div>';
    }

    h += '<p class="go-eyebrow">' + esc(c.eyebrow) + "</p><h1>" + esc(c.title) + "</h1>";

    /* pillar status bars */
    if (c.pillars && c.pillars.length) {
      var day = planDay(c.plan_start);
      h += '<p class="go-plan">' + (day ? "Day " + day + " of the 60-day launch plan" : "60-day launch plan") + "</p>";
      h += '<div class="go-pillars">' + c.pillars.map(function (p) {
        return '<div class="go-pillar"><b>PILLAR ' + p.n + " · " + esc(p.label) + "</b>" + pill(p.status) + "</div>";
      }).join("") + "</div>";
    }

    /* stats, right under the pillars */
    h += '<div class="go-stats">' + c.stats.map(function (s) {
      return '<div class="go-stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>";
    }).join("") + "</div>";

    /* priority */
    var replyDone = localStorage.getItem("gocorestone_reply_sent");
    h += '<div class="go-card"><h2>' + esc(c.priority.heading) + "</h2>" +
      "<p>" + esc(c.priority.text) + "</p>";
    if (replyDone) {
      h += '<p class="go-done">Reply sent ' + esc(replyDone) + ". Thank you.</p>";
    } else {
      h += '<textarea id="go-reply" placeholder="' + esc(c.priority.reply_prompt) + '"></textarea>' +
        '<button class="go-btn" id="go-replysend">Send reply</button>';
    }
    h += "</div>";

    /* approvals, above bottlenecks */
    h += '<div class="go-sect">Needs your approval</div>';
    c.approvals.forEach(function (ap) {
      h += '<div class="go-card"><h2>' + esc(ap.title) + "</h2><p>" + esc(ap.text) + "</p>" +
        '<button class="go-btn" data-ap="' + esc(ap.id) + '">' + esc(ap.cta) + "</button></div>";
    });

    /* bottlenecks */
    h += '<div class="go-sect">Bottlenecks</div>';
    c.bottlenecks.forEach(function (b) {
      h += '<div class="go-card">' + pill(b.status) +
        '<p class="go-bn">' + esc(b.label) + "</p><p>" + esc(b.text) + "</p>";
      if (b.image) {
        h += '<img class="go-pinblock" loading="lazy" src="' + esc(b.image) + '" alt="' + esc(b.image_alt || "") + '">';
      }
      if (b.question) {
        h += '<div class="go-bq" data-qid="' + esc(b.question_id) + '">' +
          '<p class="go-bqq">' + esc(b.question) + "</p>" +
          '<button class="go-btn go-bqyes">Yes</button>' +
          '<textarea class="go-bqnotes" placeholder="Notes for the team (optional)"></textarea>' +
          '<button class="go-btn ghost go-bqsend">Send notes</button></div>';
      }
      h += "</div>";
    });

    /* pipeline */
    h += '<div class="go-sect">Content pipeline</div><div class="go-card"><h2>' +
      esc(c.pipeline.heading) + "</h2>";
    c.pipeline.items.forEach(function (it) {
      h += '<div class="go-li">' + pill(it.status) + "<div>" + esc(it.text) +
        (it.note ? '<br><span style="color:#888;font-size:13px;">' + esc(it.note) + "</span>" : "") +
        "</div></div>";
    });
    h += '<div class="go-note">' + esc(c.pipeline.note) + "</div></div>";

    /* timeline */
    h += '<div class="go-sect">This week</div><div class="go-card">';
    c.timeline.forEach(function (t) {
      h += '<div class="go-tl"><b>' + esc(t.date) + "</b><span>" + esc(t.text) + "</span></div>";
    });
    h += "</div>";

    h += '<p class="go-footer">Questions? Email <a href="mailto:' + esc(c.footer_email) + '">' +
      esc(c.footer_email) + "</a><br>This page updates live as your project moves.</p>";

    /* homescreen, after the footer like Beatrice's */
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

    /* wire homescreen phone-type buttons */
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

    /* wire bottleneck questions (Yes two-tap + notes) */
    root.querySelectorAll(".go-bq").forEach(function (box) {
      var qid = box.getAttribute("data-qid");
      var qtext = box.querySelector(".go-bqq").textContent;
      var yes = box.querySelector(".go-bqyes");
      var ta = box.querySelector(".go-bqnotes");
      var send = box.querySelector(".go-bqsend");
      var ykey = "gocorestone_qdone_" + qid;
      var nkey = "gocorestone_qnotes_" + qid;
      if (localStorage.getItem(ykey)) { yes.textContent = "Sent"; yes.disabled = true; }
      if (localStorage.getItem(nkey)) { ta.style.display = "none"; send.style.display = "none"; }
      twoTap(yes, "Yes", function (doneFn, fail) {
        post({ action: "reply", subject: "Moshe answered: " + qtext, item: qid, body: "Yes." })
          .then(function () { localStorage.setItem(ykey, today()); doneFn("Sent"); })
          .catch(fail);
      });
      send.addEventListener("click", function () {
        var v = ta.value.trim(); if (!v) { ta.focus(); return; }
        send.disabled = true; send.textContent = "Sending...";
        post({ action: "notes", subject: "Notes: " + qtext, item: qid, body: v })
          .then(function () {
            localStorage.setItem(nkey, today());
            ta.style.display = "none"; send.style.display = "none";
          })
          .catch(function () { send.disabled = false; send.textContent = "Send notes"; });
      });
    });

    /* wire reply */
    var sendBtn = document.getElementById("go-replysend");
    if (sendBtn) {
      sendBtn.addEventListener("click", function () {
        var ta = document.getElementById("go-reply");
        var v = ta.value.trim();
        if (!v) { ta.focus(); return; }
        sendBtn.disabled = true; sendBtn.textContent = "Sending...";
        post({ action: "reply", subject: "Moshe replied: BuilderTrend leads", item: "priority-question", body: v })
          .then(function () {
            localStorage.setItem("gocorestone_reply_sent", today());
            ta.outerHTML = '<p class="go-done">Reply sent ' + today() + ". Thank you.</p>";
            sendBtn.remove();
          })
          .catch(function () { sendBtn.disabled = false; sendBtn.textContent = "Send reply"; });
      });
    }

    /* wire approvals */
    root.querySelectorAll("[data-ap]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-ap");
        var ap = c.approvals.filter(function (a) { return a.id === id; })[0];
        if (id === "lead-magnet") openLeadMagnets(ap);
        else if (id === "film-email") openFilmEmail(ap);
        else if (id === "fav-properties") openFavProperties(ap);
        else if (id === "audit") openAudit(ap);
      });
    });
  }

  function hideLegacy() {
    var marks = ["579 Shore Rd - BuilderTrend Footage", "MONDAY CHECK-IN", "DAY 20 OF THE 60-DAY LAUNCH PLAN"];
    document.querySelectorAll("section").forEach(function (s) {
      var t = s.innerText || "";
      for (var i = 0; i < marks.length; i++) {
        if (t.indexOf(marks[i]) !== -1) { s.style.display = "none"; break; }
      }
    });
  }

  function init() {
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    hideLegacy();
    fetch(GIST_URL + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () {
        var d = document.createElement("div");
        d.id = "go-root";
        d.innerHTML = "<p style='color:#888'>Couldn't load the latest update. Refresh to try again.</p>";
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
