/* GoBeatrice runtime fixes (2026-10-20): strip ad/landing remnants.
   Loaded from the page code block; the full injection update still
   lives in gobeatrice-injection.html for the next Squarespace paste. */
(function () {
  function fix() {
    var spans = document.querySelectorAll('.meta span');
    for (var i = 0; i < spans.length; i++) {
      if (/landing page rebuild/i.test(spans[i].textContent)) {
        spans[i].textContent = '4 new trims';
      }
    }
    var lis = document.querySelectorAll('li');
    for (var j = 0; j < lis.length; j++) {
      if (/ad landing page/i.test(lis[j].textContent)) {
        lis[j].style.display = 'none';
      }
    }
  }
  fix();
  var tries = 0;
  var iv = setInterval(function () {
    fix();
    if (++tries > 40) clearInterval(iv);
  }, 500);
})();
