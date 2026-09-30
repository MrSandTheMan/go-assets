<script>
/* GoKasia: The Go page for Kasia Dabrowski-Bardi (Rahme Team, Compass).
   Renders the 60-day Instagram audit natively from the public gist; all
   copy updates are data-only (edit state, run go-tracker.py update gokasia).
   Local source: ~/workspace/client-tracker/gokasia-injection.js */
(function () {
  var GIST_URL = "https://gist.githubusercontent.com/MrSandTheMan/3f4e05d6684a7600875b05c8af2d9c90/raw/gokasia-tracker.json";
  var RED = "#E00020";
  var YELLOW = "#FFD60A";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var CSS =
    "#go-root{max-width:960px;margin:0 auto;padding:32px 20px 8px;color:#fff;" +
    "font-family:Inter,-apple-system,'Segoe UI',sans-serif;}" +
    "#go-root .go-eyebrow{letter-spacing:.25em;font-size:12px;color:#999;" +
    "text-transform:uppercase;margin:0 0 8px;text-align:center;}" +
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
    "letter-spacing:.2em;text-transform:uppercase;color:#888;margin:32px 0 12px;}" +
    "#go-root .go-btn{display:inline-block;background:" + RED + ";color:#fff;border:0;" +
    "border-radius:999px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer;" +
    "text-decoration:none;}" +
    "#go-root .go-btn.yellow{background:" + YELLOW + ";color:#111;}" +
    "#go-root .go-btn.ghost{background:transparent;border:1px solid #555;color:#fff;}" +
    "#go-root .go-btn.active{border-color:" + RED + ";color:#fff;" +
    "background:rgba(224,0,32,.12);}" +
    /* KPI stat grid */
    "#go-root .go-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;" +
    "margin:0 0 16px;}" +
    "#go-root .go-stat{background:#111;border:1px solid #2a2a2a;border-radius:12px;" +
    "padding:14px 10px;text-align:center;}" +
    "#go-root .go-stat b{display:block;font-family:Archivo,Inter,sans-serif;" +
    "font-size:26px;font-weight:800;}" +
    "#go-root .go-stat span{font-size:12px;color:#999;}" +
    "@media(max-width:640px){#go-root .go-stats{grid-template-columns:repeat(2,1fr);}}" +
    /* works / nots two-column cards */
    "#go-root .go-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;" +
    "margin:0 0 16px;}" +
    "#go-root .go-minicard{background:#111;border:1px solid #2a2a2a;border-radius:12px;" +
    "padding:16px;}" +
    "#go-root .go-minicard h3{font-family:Archivo,Inter,sans-serif;font-size:15px;" +
    "font-weight:800;margin:0 0 8px;}" +
    "#go-root .go-minicard p{color:#bbb;font-size:14px;line-height:1.55;margin:0;}" +
    "#go-root .go-minicard .go-tick{color:#5ce08a;font-weight:800;margin-right:6px;}" +
    "#go-root .go-minicard .go-cross{color:" + RED + ";font-weight:800;margin-right:6px;}" +
    "@media(max-width:640px){#go-root .go-cols{grid-template-columns:1fr;}}" +
    /* SVG bar charts */
    "#go-root .go-chart{background:#111;border:1px solid #2a2a2a;border-radius:16px;" +
    "padding:22px;margin:0 0 16px;}" +
    "#go-root .go-chart h2{font-family:Archivo,Inter,sans-serif;font-size:20px;" +
    "margin:0 0 4px;}" +
    "#go-root .go-chart .go-chartsub{color:#999;font-size:13px;margin:0 0 16px;}" +
    "#go-root .go-bar-row{display:flex;align-items:center;gap:10px;margin:0 0 10px;}" +
    "#go-root .go-bar-label{width:44%;font-size:13px;color:#ccc;text-align:right;" +
    "flex-shrink:0;line-height:1.35;}" +
    "#go-root .go-bar-track{flex:1;background:#222;border-radius:6px;height:22px;" +
    "position:relative;overflow:hidden;}" +
    "#go-root .go-bar-fill{height:100%;border-radius:6px;}" +
    "#go-root .go-bar-val{font-size:13px;font-weight:700;color:#fff;min-width:34px;}" +
    /* top 5 table */
    "#go-root .go-table{width:100%;border-collapse:collapse;font-size:14px;}" +
    "#go-root .go-table th{text-align:left;color:#888;font-size:12px;" +
    "text-transform:uppercase;letter-spacing:.1em;padding:8px 10px;" +
    "border-bottom:1px solid #2a2a2a;font-weight:700;}" +
    "#go-root .go-table td{padding:10px;border-bottom:1px solid #1f1f1f;color:#ddd;}" +
    "#go-root .go-table tr:last-child td{border-bottom:0;}" +
    "#go-root .go-table td.go-num{font-weight:800;color:#fff;white-space:nowrap;}" +
    "#go-root .go-table td.go-rank{color:#888;font-weight:700;}" +
    /* gap callout */
    "#go-root .go-gap{background:rgba(255,214,10,.06);border:1px solid " + YELLOW + ";" +
    "border-radius:16px;padding:22px;margin:0 0 16px;}" +
    "#go-root .go-gap h2{font-family:Archivo,Inter,sans-serif;font-size:20px;" +
    "margin:0 0 10px;color:" + YELLOW + ";}" +
    "#go-root .go-gap p{color:#eee;line-height:1.65;font-size:15px;margin:0;}" +
    /* CTA card */
    "#go-root .go-cta{background:rgba(224,0,32,.08);border:1px solid " + RED + ";" +
    "border-radius:16px;padding:26px;margin:0 0 16px;text-align:center;}" +
    "#go-root .go-cta h2{font-family:Archivo,Inter,sans-serif;font-size:22px;" +
    "margin:0 0 10px;}" +
    "#go-root .go-cta p{color:#ddd;line-height:1.6;font-size:15px;margin:0 0 18px;" +
    "max-width:560px;margin-left:auto;margin-right:auto;}" +
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
    "#go-root .go-footer a{color:#fff;}";

  function bars(items, max, color) {
    return items.map(function (it) {
      var w = Math.max(2, Math.round((it.value / max) * 100));
      return '<div class="go-bar-row"><div class="go-bar-label">' + esc(it.label) + "</div>" +
        '<div class="go-bar-track"><div class="go-bar-fill" style="width:' + w + "%;background:" +
        color + ';"></div></div><div class="go-bar-val">' + esc(String(it.value)) + "</div></div>";
    }).join("");
  }

  function render(d) {
    var c = d.card;
    var h = "";

    h += '<p class="go-eyebrow">' + esc(c.eyebrow) + "</p><h1>" + esc(c.title) + "</h1>" +
      '<p class="go-sub">' + esc(c.subtitle) + "</p>";

    /* KPI cards */
    if (c.kpis && c.kpis.length) {
      h += '<div class="go-stats">' + c.kpis.map(function (k) {
        return '<div class="go-stat"><b>' + esc(k.value) + "</b><span>" + esc(k.label) + "</span></div>";
      }).join("") + "</div>";
    }

    /* snapshot */
    if (c.snapshot) {
      h += '<div class="go-card"><h2>Snapshot</h2><p>' + esc(c.snapshot) + "</p></div>";
    }

    /* what is working */
    if (c.works && c.works.length) {
      h += '<div class="go-sect">What is working</div><div class="go-cols">' +
        c.works.map(function (w) {
          return '<div class="go-minicard"><h3><span class="go-tick">&#10003;</span>' +
            esc(w.t) + "</h3><p>" + esc(w.d) + "</p></div>";
        }).join("") + "</div>";
    }

    /* content mix chart */
    if (c.mix && c.mix.length) {
      var mixMax = Math.max.apply(null, c.mix.map(function (m) { return m.value; }));
      h += '<div class="go-chart"><h2>Content mix</h2>' +
        '<p class="go-chartsub">26 posts in 60 days, about 3 per week, no gaps.</p>' +
        bars(c.mix, mixMax, RED) + "</div>";
    }

    /* top 5 by likes chart */
    if (c.top5 && c.top5.length) {
      var topMax = Math.max.apply(null, c.top5.map(function (t) { return t.likes; }));
      h += '<div class="go-chart"><h2>Top 5 posts by likes</h2>' +
        '<p class="go-chartsub">60-day window, Aug 4 to Sep 29, 2026.</p>' +
        bars(c.top5.map(function (t) { return { label: t.post, value: t.likes }; }), topMax, YELLOW) +
        "</div>";
    }

    /* top 5 table */
    if (c.top5 && c.top5.length) {
      h += '<div class="go-card"><h2>Top 5 posts</h2>' +
        '<table class="go-table"><thead><tr><th></th><th>Post</th><th>Likes</th><th>Comments</th></tr></thead><tbody>' +
        c.top5.map(function (t, i) {
          return "<tr><td class=\"go-rank\">" + (i + 1) + "</td><td>" + esc(t.post) +
            "</td><td class=\"go-num\">" + t.likes + "</td><td class=\"go-num\">" + t.comments + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    /* what is not working */
    if (c.nots && c.nots.length) {
      h += '<div class="go-sect">What is not working</div><div class="go-cols">' +
        c.nots.map(function (n) {
          return '<div class="go-minicard"><h3><span class="go-cross">&times;</span>' +
            esc(n.t) + "</h3><p>" + esc(n.d) + "</p></div>";
        }).join("") + "</div>";
    }

    /* the one gap */
    if (c.gap) {
      h += '<div class="go-gap"><h2>' + esc(c.gap.heading) + "</h2><p>" +
        esc(c.gap.text) + "</p></div>";
    }

    /* CTA: the Script Scan ask */
    if (c.cta) {
      h += '<div class="go-cta"><h2>' + esc(c.cta.heading) + "</h2><p>" +
        esc(c.cta.text) + '</p><a class="go-btn yellow" href="' + esc(c.cta.href) + '">' +
        esc(c.cta.button) + "</a></div>";
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

    var root = document.createElement("div");
    root.id = "go-root";
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
