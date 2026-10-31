/* Go Dashboard index — lists every live client Go page in one place.
   Internal tool for Sandy. Loaded by the go-dashboard Squarespace page.
   STYLE RULE: this file owns every visual rule under #go-root. Nothing is left
   to the Squarespace theme, and no other brand's colors are used here.
   Anomalous Go house style: Inter/Archivo type, black cards, Go yellow accent.
   Never Corestone teal (#00C4C4), never Cinzel/Cormorant. */
(function () {
  var PAGES = [
    { name: 'Beatrice Caponnetti Jackson', slug: 'gobeatrice' },
    { name: 'Corestone', slug: 'gocorestone' },
    { name: 'Courtney Mendez', slug: 'gocourtney' },
    { name: 'John Henry', slug: 'gojohn' },
    { name: 'Judy Zhou', slug: 'gojudy' },
    { name: 'Rahat Kamal', slug: 'gorahat' },
    { name: 'Rahme Team', slug: 'gorahme' },
    { name: 'Socrates Gomez', slug: 'gosocrates' },
    { name: 'Steven Kramer Team', slug: 'gokramer' }
  ];

  var css = [
    '#go-root{max-width:720px;margin:0 auto;padding:48px 20px 64px;font-family:Inter,-apple-system,"Segoe UI",sans-serif;color:#111;text-transform:none;}',
    '#go-root h1{font-family:Archivo,Inter,sans-serif;font-size:34px;margin:0 0 8px;color:#111;text-transform:none;letter-spacing:normal;}',
    '#go-root p{font-family:Inter,-apple-system,"Segoe UI",sans-serif;text-transform:none;}',
    '#go-root .sub{color:#666;font-size:16px;margin:0 0 32px;text-transform:none;}',
    '#go-root a{font-family:Inter,-apple-system,"Segoe UI",sans-serif;text-transform:none;text-decoration:none;}',
    '#go-root .go-card{display:block;background:#111;color:#fff;border-radius:10px;padding:20px 24px;margin:0 0 14px;}',
    '#go-root .go-card:hover{background:#1f1f1f;}',
    '#go-root .go-card .name{font-family:Archivo,Inter,sans-serif;font-size:21px;font-weight:700;color:#fff;text-transform:none;}',
    '#go-root .go-card .url{color:#FFD60A;font-size:14px;margin-top:4px;text-transform:none;}',
    '#go-root .foot{color:#888;font-size:13px;margin-top:32px;text-transform:none;}'
  ].join('\n');

  function render() {
    var old = document.getElementById('go-root');
    if (old) old.remove();
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    var root = document.createElement('div');
    root.id = 'go-root';
    var html = '<h1>Go Dashboard</h1><p class="sub">Every live client Go page, in one place.</p>';
    PAGES.forEach(function (p) {
      var url = 'https://www.goanomalous.com/' + p.slug;
      html += '<a class="go-card" href="' + url + '"><div class="name">' + p.name + '</div><div class="url">' + url + '</div></a>';
    });
    html += '<p class="foot">Internal index. Not linked in the site navigation.</p>';
    root.innerHTML = html;
    document.body.appendChild(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
