/* Anomalous Squarespace loader v1.
   One line in a Squarespace Code block (Display Source Code UNCHECKED):
   <script src="https://mrsandtheman.github.io/go-assets/anomalous-loader.js" data-page="portfolio"></script>
   data-page: index | portfolio | scripts | conversion | getstarted.
   Fetches that page from the redesign preview, injects its CSS + body,
   rewrites internal links to Squarespace slugs, hides Squarespace chrome,
   then loads the page scripts (hls.js, app.js) in order.
   NOTE: site-wide AJAX loading must be OFF for navigation between loader
   pages to work (each page load re-runs this script). */
(function () {
  "use strict";
  var BASE = "https://mrsandtheman.github.io/anomalous-redesign/";
  var LINKS = {
    "index.html": "/", "portfolio.html": "/portfolio", "scripts.html": "/scripts",
    "conversion.html": "/conversion", "getstarted.html": "/getstarted"
  };
  var BY_SLUG = {
    "": "index", "home": "index", "home-new": "index",
    "portfolio": "portfolio", "portfolio-new": "portfolio",
    "scripts": "scripts", "scripts-new": "scripts",
    "conversion": "conversion", "conversion-new": "conversion",
    "getstarted": "getstarted", "getstarted-new": "getstarted"
  };

  /* Which page? data-page wins; otherwise infer from the URL slug. */
  var page = null;
  try {
    var me = document.currentScript;
    if (me) page = me.getAttribute("data-page");
  } catch (e) { /* currentScript unavailable; fall through to slug */ }
  if (!page) {
    var slug = window.location.pathname.replace(/^\/|\/$/g, "");
    page = BY_SLUG[slug] || "index";
  }

  /* Hide Squarespace chrome + dark background, immediately. */
  var hide = document.createElement("style");
  hide.textContent = ".Header,.Mobile-bar,.sqs-announcement-bar,.announcement-bar-wrapper,#footer,.Footer{display:none!important}body{background:#0c0c0c!important}.Main-content{padding:0!important;margin:0!important;max-width:none!important}";
  document.head.appendChild(hide);

  var mount = document.querySelector(".Main-content") || document.querySelector("main") || document.body;
  mount.innerHTML = '<p style="color:#8a837e;font:16px/1.6 Inter,system-ui,sans-serif;text-align:center;padding:120px 24px">Loading&hellip;</p>';

  function abs(url) {
    if (/^(https?:)?\/\//i.test(url) || url.charAt(0) === "#" || url.indexOf("mailto:") === 0) return url;
    if (url.indexOf("assets/") === 0) return BASE + url;
    return url;
  }
  function rewriteLinks(html) {
    return html.replace(/href="([^"]+)"/g, function (m, u) {
      if (/^(https?:)?\/\//i.test(u) || u.charAt(0) === "#" || u.indexOf("mailto:") === 0) return m;
      var parts = u.split("#");
      var target = LINKS[parts[0]];
      if (!target) return m;
      return 'href="' + target + (parts[1] ? "#" + parts[1] : "") + '"';
    });
  }
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = res;
      s.onerror = function () { rej(new Error("script failed: " + src)); };
      document.head.appendChild(s);
    });
  }

  fetch(BASE + page + ".html", { credentials: "omit" })
    .then(function (r) { if (!r.ok) throw new Error("fetch " + r.status); return r.text(); })
    .then(function (text) {
      var doc = new DOMParser().parseFromString(text, "text/html");
      if (doc.title) document.title = doc.title;
      var md = doc.querySelector('meta[name="description"]');
      if (md) {
        var cur = document.querySelector('meta[name="description"]');
        if (cur) cur.setAttribute("content", md.getAttribute("content"));
      }
      Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"]')).forEach(function (l) {
        var href = abs(l.getAttribute("href"));
        if (!document.querySelector('link[href="' + href + '"]')) {
          var nl = document.createElement("link");
          nl.rel = "stylesheet"; nl.href = href;
          document.head.appendChild(nl);
        }
      });
      var scripts = [];
      var body = doc.body.cloneNode(true);
      Array.prototype.slice.call(body.querySelectorAll("script")).forEach(function (s) {
        var src = s.getAttribute("src");
        if (src) scripts.push(abs(src));
        s.parentNode.removeChild(s);
      });
      mount.innerHTML = rewriteLinks(body.innerHTML);
      var chain = Promise.resolve();
      scripts.forEach(function (src) { chain = chain.then(function () { return loadScript(src); }); });
      return chain;
    })
    .catch(function (err) {
      mount.innerHTML = '<div style="max-width:720px;margin:120px auto;padding:0 24px;color:#f5f0ea;font-family:Georgia,serif;text-align:center"><h1>This page is loading.</h1><p>Please refresh. If the problem continues, email team@goanomalous.com.</p></div>';
      if (window.console) console.error("[anomalous-loader]", err);
    });
})();
