/* Go Dashboard index — lists every live client Go page in one place.
   Internal tool for Sandy. Loaded by the go-dashboard Squarespace page.
   STYLE RULE: this file owns every visual rule for this page. Nothing is left
   to the Squarespace theme, and no other brand's colors are used here.
   Anomalous Go house style: Inter/Archivo type, dark theme, Go yellow accent.
   Never Corestone teal (#00C4C4), never Cinzel/Cormorant.
   Page-only rules (body/main/footer) are safe: this script loads ONLY on
   go-dashboard. */
(function () {
  var PAGES = [
    { name: 'Beatrice Caponnetti Jackson', slug: 'gobeatrice', pic: 'https://images.squarespace-cdn.com/content/v1/5fe3904804e8564c7d72245d/129d9b37-c51c-44e7-846c-22b4d08cd63c/beatrice-photo.png', init: 'BC' },
    { name: 'Corestone', slug: 'gocorestone', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/corestone-profile.png', init: 'CO' },
    { name: 'Courtney Mendez', slug: 'gocourtney', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/courtney-profile.jpg', init: 'CM' },
    { name: 'John Henry', slug: 'gojohn', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/gojohn/john-ig-profile.jpg', init: 'JH' },
    { name: 'Judy Zhou', slug: 'gojudy', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/judy-profile.jpg', init: 'JZ' },
    { name: 'Rahat Kamal', slug: 'gorahat', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/rahat-profile-2.jpg', init: 'RK' },
    { name: 'Rahme Team', slug: 'gorahme', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/rahme-profile.jpg', init: 'RT' },
    { name: 'Socrates Gomez', slug: 'gosocrates', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/gosocrates/profile-pic.jpg', init: 'SG' },
    { name: 'Steven Kramer Team', slug: 'gokramer', pic: 'https://raw.githubusercontent.com/MrSandTheMan/go-assets/main/kramer-profile.png', init: 'SK' }
  ];

  var css = [
    'html,body{background:#0b0b0c !important;}',
    'main.Main,.Main-content,.Site,.page-section,section,.sqs-layout{background:#0b0b0c !important;}',
    'footer.Footer{display:none;}',
    '#go-root{max-width:760px;margin:0 auto;padding:56px 20px 80px;font-family:Inter,-apple-system,"Segoe UI",sans-serif;color:#fff;text-transform:none;}',
    '#go-root .eyebrow{font-family:Archivo,Inter,sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#FFD60A;margin:0 0 14px;text-transform:none;}',
    '#go-root h1{font-family:Archivo,Inter,sans-serif;font-size:42px;line-height:1.1;margin:0 0 10px;color:#fff;text-transform:none;letter-spacing:normal;}',
    '#go-root p{font-family:Inter,-apple-system,"Segoe UI",sans-serif;text-transform:none;}',
    '#go-root .sub{color:#999;font-size:16px;line-height:1.5;margin:0 0 36px;text-transform:none;}',
    '#go-root .sub b{color:#fff;}',
    '#go-root a{font-family:Inter,-apple-system,"Segoe UI",sans-serif;text-transform:none;text-decoration:none;}',
    '#go-root .go-card{display:flex;align-items:center;gap:16px;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;padding:16px 20px;margin:0 0 12px;color:#fff;}',
    '#go-root .go-card:hover{background:#232327;border-color:#FFD60A;}',
    '#go-root .av{position:relative;width:56px;height:56px;flex-shrink:0;}',
    '#go-root .av img{width:56px;height:56px;border-radius:50%;object-fit:cover;display:block;border:2px solid #2a2a2a;}',
    '#go-root .av .init{display:none;width:56px;height:56px;border-radius:50%;background:#2a2a2a;color:#FFD60A;font-family:Archivo,Inter,sans-serif;font-size:18px;font-weight:700;align-items:center;justify-content:center;}',
    '#go-root .go-card .meta{flex:1;min-width:0;}',
    '#go-root .go-card .name{font-family:Archivo,Inter,sans-serif;font-size:19px;font-weight:700;color:#fff;text-transform:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '#go-root .go-card .url{color:#FFD60A;font-size:13px;margin-top:3px;text-transform:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '#go-root .go-card .arrow{color:#FFD60A;font-size:22px;flex-shrink:0;}',
    '#go-root .foot{color:#666;font-size:13px;margin-top:32px;text-transform:none;}'
  ].join('\n');

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function render() {
    var old = document.getElementById('go-root');
    if (old) old.remove();
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    var root = document.createElement('div');
    root.id = 'go-root';
    var html = '<p class="eyebrow">ANOMALOUS · INTERNAL</p>' +
      '<h1>Go Dashboard</h1>' +
      '<p class="sub"><b>9 live pages.</b> Every client Go page, in one place. Tap a client to open their page.</p>';
    PAGES.forEach(function (p) {
      var url = 'https://www.goanomalous.com/' + p.slug;
      html += '<a class="go-card" href="' + url + '">' +
        '<span class="av"><img src="' + p.pic + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
        '<span class="init">' + p.init + '</span></span>' +
        '<span class="meta"><span class="name" style="display:block;">' + esc(p.name) + '</span>' +
        '<span class="url" style="display:block;">' + url + '</span></span>' +
        '<span class="arrow">→</span></a>';
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
