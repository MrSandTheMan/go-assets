<script>
/* GoJohn: The Go page for John Henry (@johnhenrystyle).
   Renders the NYU shoot favorites natively from the public gist; all
   copy updates are data-only (edit state, run go-tracker.py update gojohn).
   Local source: ~/workspace/client-tracker/gojohn-injection.js */
(function () {
  var GIST_URL = "https://gist.githubusercontent.com/MrSandTheMan/7fa687734fcddad0f151113f590b0b22/raw/gojohn-tracker.json";
  var RED = "#E00020";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var CSS =
    "#go-root{text-transform:none;max-width:960px;margin:0 auto;padding:32px 20px 8px;color:#fff;" +
    "font-family:Inter,-apple-system,'Segoe UI',sans-serif;}" +
    "#go-root .go-eyebrow{letter-spacing:.25em;font-size:12px;color:#999;" +
    "margin:0 0 8px;text-align:center;}" +
    "#go-root .go-profile-pic{display:block;width:104px;height:104px;" +
    "border-radius:50%;object-fit:cover;border:3px solid " + RED + ";" +
    "margin:0 auto 16px;}" +
    "#go-root h1{font-family:Archivo,Inter,sans-serif;font-weight:800;" +
    "font-size:clamp(28px,5vw,44px);margin:0 0 6px;text-align:center;}" +
    "#go-root .go-sub{text-align:center;color:#999;font-size:15px;margin:0 0 28px;" +
    "line-height:1.5;}" +
    "#go-root .go-card{background:#111;border:1px solid #2a2a2a;border-radius:16px;" +
    "padding:22px;margin:0 0 16px;}" +
    "#go-root .go-card h2{font-family:Archivo,Inter,sans-serif;font-size:20px;" +
    "margin:0 0 10px;}" +
    "#go-root .go-card p{color:#ddd;line-height:1.6;margin:0 0 12px;font-size:15px;}" +
    "#go-root .go-card p:last-child{margin-bottom:0;}" +
    "#go-root .go-sect{font-family:Archivo,Inter,sans-serif;font-size:13px;" +
    "letter-spacing:.14em;color:#888;margin:32px 0 12px;}" +
    "#go-root .go-btn{display:inline-block;background:" + RED + ";color:#fff;border:0;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;" +
    "text-decoration:none;margin:4px 6px 4px 0;}" +
    "#go-root .go-btn.ghost{background:transparent;border:1px solid #555;color:#fff;}" +
    "#go-root .go-btn.yellow{background:#FFD60A;color:#111;}" +
    "#go-root .go-btn:disabled{opacity:.6;cursor:default;}" +
    "#go-root .go-ctasent{color:#5ce08a;font-weight:700;font-size:16px;margin:12px 0 0;}" +
    "#go-root .go-ctaerr{color:#ff6b6b;font-size:14px;margin:10px 0 0;}" +
    /* photo gallery */
    "#go-root .go-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;" +
    "margin:0 0 16px;}" +
    "#go-root .go-photo{position:relative;aspect-ratio:3/4;overflow:hidden;" +
    "border-radius:12px;border:1px solid #2a2a2a;cursor:pointer;background:#111;}" +
    "#go-root .go-photo img{width:100%;height:100%;object-fit:cover;display:block;" +
    "transition:transform .2s;}" +
    "#go-root .go-photo:hover img{transform:scale(1.03);}" +
    "#go-root .go-photo span{position:absolute;bottom:8px;left:8px;font-size:11px;" +
    "color:#fff;background:rgba(0,0,0,.6);padding:3px 8px;border-radius:6px;}" +
    "@media(max-width:640px){#go-root .go-gallery{grid-template-columns:repeat(2,1fr);}}" +
    /* lightbox */
    "#go-lightbox{text-transform:none;position:fixed;inset:0;background:rgba(0,0,0,.92);" +
    "z-index:99999;display:none;align-items:center;justify-content:center;" +
    "flex-direction:column;padding:20px;}" +
    "#go-lightbox.open{display:flex;}" +
    "#go-lightbox img{max-width:92vw;max-height:78vh;object-fit:contain;border-radius:8px;}" +
    "#go-lightbox .go-lb-label{color:#fff;font-size:14px;margin:12px 0 0;}" +
    "#go-lightbox .go-lb-close{position:absolute;top:16px;right:20px;background:none;" +
    "border:0;color:#fff;font-size:32px;cursor:pointer;line-height:1;}" +
    "#go-lightbox .go-lb-nav{position:absolute;top:50%;transform:translateY(-50%);" +
    "background:rgba(255,255,255,.12);border:0;color:#fff;font-size:24px;cursor:pointer;" +
    "width:48px;height:48px;border-radius:50%;}" +
    "#go-lightbox .go-lb-prev{left:16px;}" +
    "#go-lightbox .go-lb-next{right:16px;}" +
    /* notes modal */
    "#go-modal{text-transform:none;position:fixed;inset:0;background:rgba(0,0,0,.82);" +
    "z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;}" +
    "#go-modal.open{display:flex;}" +
    "#go-modal .go-modal-box{background:#161616;border:1px solid #333;border-radius:16px;" +
    "padding:28px;max-width:520px;width:100%;}" +
    "#go-modal h3{font-family:Archivo,Inter,sans-serif;font-size:20px;margin:0 0 12px;color:#fff;}" +
    "#go-modal textarea{width:100%;min-height:120px;background:#0d0d0d;border:1px solid #444;" +
    "border-radius:10px;color:#fff;font-size:15px;padding:12px;font-family:inherit;" +
    "box-sizing:border-box;margin:0 0 16px;}" +
    "#go-modal .go-modal-btns{display:flex;gap:10px;justify-content:flex-end;}" +
    /* homescreen */
    "#go-root .go-hs{background:#111;border:1px solid #2a2a2a;border-radius:16px;" +
    "padding:22px;margin:0 0 16px;text-align:center;}" +
    "#go-root .go-hs p{font-size:16px;color:#f5f5f5;margin:0 0 16px;}" +
    "#go-root .go-hsbtns{display:flex;gap:12px;justify-content:center;}" +
    "#go-root .go-hsguide{display:none;}" +
    "#go-root .go-hsguide img{width:100%;max-width:440px;border-radius:12px;" +
    "margin:14px auto 0;border:1px solid #333;display:block;}" +
    "#go-root .go-footer{text-align:center;color:#888;font-size:14px;" +
    "margin:32px 0 8px;line-height:1.7;}" +
    "#go-root .go-footer a{color:#fff;}" +
    /* status tracker */
    "#go-root .go-track{list-style:none;margin:0;padding:0;}" +
    "#go-root .go-track li{padding:12px 0;border-bottom:1px solid #222;}" +
    "#go-root .go-track li:last-child{border-bottom:0;}" +
    "#go-root .go-track .t-label{font-weight:700;font-size:15px;margin:0;color:#fff;}" +
    "#go-root .go-track .t-note{color:#999;font-size:13px;margin:6px 0 0;line-height:1.5;}" +
    "#go-root .go-pill{display:inline-block;font-size:11px;font-weight:700;" +
    "padding:3px 10px;border-radius:999px;margin-left:8px;vertical-align:middle;}" +
    "#go-root .go-pill.gold{background:rgba(255,180,0,.10);border:1px solid #a88400;color:#ffd75e;}" +
    "#go-root .go-pill.gray{background:rgba(150,150,150,.10);border:1px solid #555;color:#aaa;}" +
    "#go-root .go-pill.blue{background:rgba(0,120,255,.12);border:1px solid #2f6fd0;color:#8ab8ff;}" +
    "#go-root .go-pill.red{background:rgba(224,0,32,.12);border:1px solid " + RED + ";color:#ff6b81;}" +
    "#go-root .go-pill.green{background:rgba(0,200,80,.10);border:1px solid #1d9e57;color:#5ce08a;}";

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) { return String(iso); }
  }

  /* ---------- status pills ---------- */
  var PILL_LABEL = {
    in_planning: "In planning", not_started: "Not started", in_progress: "In progress",
    awaiting_approval: "Needs your approval", live: "Live", done: "Done"
  };
  var PILL_CLASS = {
    in_planning: "gold", not_started: "gray", in_progress: "blue",
    awaiting_approval: "red", live: "green", done: "green"
  };
  function pill(status) {
    var s = status || "not_started";
    return '<span class="go-pill ' + (PILL_CLASS[s] || "gray") + '">' +
      esc(PILL_LABEL[s] || s) + "</span>";
  }

  function renderTrackList(items) {
    var h = '<ul class="go-track">';
    (items || []).forEach(function (it) {
      h += '<li><p class="t-label">' + esc(it.label) + pill(it.status) + "</p>" +
        (it.note ? '<p class="t-note">' + esc(it.note) + "</p>" : "") + "</li>";
    });
    return h + "</ul>";
  }

  function render(d) {
    var c = d.card;
    var h = "";
    var TEST_MODE = /[?&]test=1/.test(window.location.search);

    if (TEST_MODE) {
      h += '<div style="background:#E00020;color:#fff;font-weight:700;text-align:center;' +
        'padding:10px 16px;font-size:14px;margin-bottom:16px;border-radius:8px;">' +
        'TEST MODE: submissions from this visit are tagged [TEST].</div>';
    }

    if (c.profile_pic) {
      h += '<img class="go-profile-pic" src="' + esc(c.profile_pic) + '" alt="' +
        esc(c.profile_pic_alt || c.title) + '" loading="lazy">';
    }
    h += '<p class="go-eyebrow">' + esc(c.eyebrow) + "</p><h1>" + esc(c.title) + "</h1>" +
      '<p class="go-sub">' + esc(c.subtitle) + "</p>";

    /* master folder up top in yellow */
    if (c.master_folder) {
      h += '<div style="text-align:center;margin:0 0 24px;">' +
        '<a class="go-btn yellow" href="' + esc(c.master_folder.url) + '" target="_blank">' +
        esc(c.master_folder.label) + "</a></div>";
    }

    /* to-do tracker up top */
    if (c.tracker && c.tracker.items && c.tracker.items.length) {
      h += '<div class="go-card"><h2>' + esc(c.tracker.heading || "To do") + "</h2>" +
        renderTrackList(c.tracker.items) + "</div>";
    }

    /* priority: favorites review */
    if (c.priority) {
      var p = c.priority;
      var approvedAt = null;
      try { approvedAt = localStorage.getItem("gojohn_fav_approved"); } catch (e) {}
      h += '<div class="go-card"><h2>' + esc(p.heading) + "</h2><p>" + esc(p.text) + "</p>";
      if (approvedAt) {
        h += '<p class="go-ctasent">Favorites approved on ' + esc(fmtDate(approvedAt)) + ".</p>";
      } else {
        h += '<button class="go-btn" id="go-approve">' + esc(p.button) + "</button>" +
          '<button class="go-btn ghost" id="go-notes">' + esc(p.notes_button) + "</button>" +
          '<p class="go-ctaerr" style="display:none"></p>';
      }
      h += "</div>";
    }

    /* photo gallery */
    if (c.gallery && c.gallery.length) {
      h += '<div class="go-sect">The favorites (' + c.gallery.length + ")</div>" +
        '<div class="go-gallery">' +
        c.gallery.map(function (g, i) {
          return '<div class="go-photo" data-idx="' + i + '">' +
            '<img src="' + esc(g.src) + '" alt="' + esc(g.label) + '" loading="lazy">' +
            "<span>" + esc(g.label) + "</span></div>";
        }).join("") + "</div>";
    }

    /* shoot info */
    if (c.shoot) {
      h += '<div class="go-card"><h2>' + esc(c.shoot.heading) + "</h2><p>" +
        esc(c.shoot.text) + "</p></div>";
    }

    h += '<p class="go-footer">Questions? Email <a href="mailto:' + esc(c.footer_email) + '">' +
      esc(c.footer_email) + "</a><br>This page updates live as your project moves.</p>";

    if (c.homescreen && c.homescreen.enabled) {
      h += '<div class="go-hs"><p>Want to add this page to your home screen?</p>' +
        '<div class="go-hsbtns">' +
        '<button class="go-btn ghost" data-guide="iphone">iPhone</button>' +
        '<button class="go-btn ghost" data-guide="android">Android</button></div>' +
        '<div class="go-hsguide"><img alt="Add to home screen guide"></div></div>';
    }

    /* lightbox */
    h += '<div id="go-lightbox"><button class="go-lb-close">&times;</button>' +
      '<button class="go-lb-nav go-lb-prev">&#8249;</button>' +
      '<img><p class="go-lb-label"></p>' +
      '<button class="go-lb-nav go-lb-next">&#8250;</button></div>';

    /* notes modal */
    h += '<div id="go-modal"><div class="go-modal-box"><h3>Send notes</h3>' +
      '<textarea id="go-notes-text" placeholder="Which photos need swaps or tweaks?"></textarea>' +
      '<div class="go-modal-btns"><button class="go-btn ghost" id="go-notes-cancel">Cancel</button>' +
      '<button class="go-btn" id="go-notes-send">Send notes</button></div>' +
      '<p class="go-ctaerr" style="display:none"></p></div></div>';

    var root = document.createElement("div");
    root.id = "go-root";
    root.innerHTML = h;
    var mount = document.querySelector("main") || document.getElementById("page") || document.body;
    mount.insertBefore(root, mount.firstChild);

    /* gallery lightbox */
    var gallery = c.gallery || [];
    var lb = root.querySelector("#go-lightbox");
    var lbImg = lb.querySelector("img");
    var lbLabel = lb.querySelector(".go-lb-label");
    var lbIdx = 0;
    function showLb(i) {
      lbIdx = (i + gallery.length) % gallery.length;
      lbImg.src = gallery[lbIdx].src;
      lbLabel.textContent = gallery[lbIdx].label + " (" + (lbIdx + 1) + " of " + gallery.length + ")";
      lb.classList.add("open");
    }
    root.querySelectorAll(".go-photo").forEach(function (el) {
      el.addEventListener("click", function () { showLb(parseInt(el.getAttribute("data-idx"), 10)); });
    });
    lb.querySelector(".go-lb-close").addEventListener("click", function () { lb.classList.remove("open"); });
    lb.querySelector(".go-lb-prev").addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIdx - 1); });
    lb.querySelector(".go-lb-next").addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIdx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.classList.remove("open"); });

    /* homescreen */
    var hsEl = root.querySelector(".go-hs");
    if (hsEl) {
      var guideBox = hsEl.querySelector(".go-hsguide");
      var guideImg = guideBox.querySelector("img");
      hsEl.querySelectorAll("[data-guide]").forEach(function (b) {
        b.addEventListener("click", function () {
          var which = b.getAttribute("data-guide");
          guideImg.src = which === "iphone" ? c.homescreen.iphone_img : c.homescreen.android_img;
          guideImg.alt = (which === "iphone" ? "iPhone" : "Android") + " add to home screen guide";
          guideBox.style.display = guideBox.style.display === "block" ? "none" : "block";
        });
      });
    }

    /* approve + notes via backend */
    function postToBackend(payload, onOk, onErr) {
      fetch(c.backend.url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); })
        .then(function (res) { if (res && res.ok) onOk(); else onErr(); })
        .catch(onErr);
    }
    function errMsg(msg, scope) {
      var err = (scope || root).querySelector(".go-ctaerr");
      if (err) { err.style.display = "block"; err.textContent = msg; }
    }

    var approveBtn = root.querySelector("#go-approve");
    if (approveBtn && c.backend && c.backend.url && c.backend.url.indexOf("REPLACE") !== 0) {
      approveBtn.addEventListener("click", function () {
        /* two-tap confirm */
        if (approveBtn.getAttribute("data-confirm") !== "1") {
          approveBtn.setAttribute("data-confirm", "1");
          approveBtn.textContent = "Tap again to confirm approval";
          return;
        }
        approveBtn.disabled = true;
        approveBtn.textContent = "Sending...";
        postToBackend({
          token: c.backend.token,
          action: "approve_favorites",
          subject: (TEST_MODE ? "[TEST] " : "") + "John approved the 14 favorites",
          item: "Favorites approval",
          from: "John Henry",
          body: (TEST_MODE ? "TEST SUBMISSION - sent from a ?test=1 page load.\n\n" : "") +
            "John Henry approved the 14 favorites from the Oct 8 NYU shoot.\n" +
            "Next: deliver final high-res exports.\n" +
            "Page: https://www.goanomalous.com/gojohn"
        }, function () {
          var now = new Date().toISOString();
          try { localStorage.setItem("gojohn_fav_approved", now); } catch (e) {}
          var sent = document.createElement("p");
          sent.className = "go-ctasent";
          sent.textContent = "Favorites approved on " + fmtDate(now) + ".";
          approveBtn.parentNode.replaceChild(sent, approveBtn);
          var nb = root.querySelector("#go-notes");
          if (nb) nb.remove();
        }, function () {
          approveBtn.disabled = false;
          approveBtn.textContent = "Approve the 14 favorites";
          approveBtn.setAttribute("data-confirm", "0");
          errMsg("Something went wrong. Please try again or email team@goanomalous.com.");
        });
      });
    }

    /* notes modal */
    var modal = root.querySelector("#go-modal");
    var notesBtn = root.querySelector("#go-notes");
    if (notesBtn) {
      notesBtn.addEventListener("click", function () { modal.classList.add("open"); });
    }
    root.querySelector("#go-notes-cancel").addEventListener("click", function () {
      modal.classList.remove("open");
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("open"); });
    var sendBtn = root.querySelector("#go-notes-send");
    if (sendBtn && c.backend && c.backend.url && c.backend.url.indexOf("REPLACE") !== 0) {
      sendBtn.addEventListener("click", function () {
        var text = root.querySelector("#go-notes-text").value.trim();
        if (!text) { errMsg("Write your notes first.", modal); return; }
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";
        postToBackend({
          token: c.backend.token,
          action: "photo_notes",
          subject: (TEST_MODE ? "[TEST] " : "") + "John sent photo notes",
          item: "Photo notes",
          from: "John Henry",
          body: (TEST_MODE ? "TEST SUBMISSION - sent from a ?test=1 page load.\n\n" : "") +
            "John Henry sent notes on the favorites:\n\n" + text + "\n\n" +
            "Page: https://www.goanomalous.com/gojohn"
        }, function () {
          modal.classList.remove("open");
          root.querySelector("#go-notes-text").value = "";
          var sent = document.createElement("p");
          sent.className = "go-ctasent";
          sent.textContent = "Notes sent. We'll follow up shortly.";
          notesBtn.parentNode.replaceChild(sent, notesBtn);
        }, function () {
          sendBtn.disabled = false;
          sendBtn.textContent = "Send notes";
          errMsg("Something went wrong. Please try again or email team@goanomalous.com.", modal);
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
