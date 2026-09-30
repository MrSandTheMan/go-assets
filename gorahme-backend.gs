/* GoRahme backend — the "Want me to script them?" Script Scan ask.
   Deploy as web app: Execute as me (team@goanomalous.com), Who has access: Anyone.
   Page posts JSON with Content-Type: text/plain (avoids CORS preflight).
   Payload: { token, action: "script_ask", test? }
   test:true skips the email (pipeline checks). */
var SHARED_TOKEN = "8f031131d71824b422fdafc99493eaaa";
var TEAM_EMAIL = "team@goanomalous.com";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data || data.token !== SHARED_TOKEN) {
      return out({ ok: false, error: "bad token" });
    }
    if (data.test === true) {
      return out({ ok: true, test: true });
    }
    var subject = "[GoRahme] Kasia wants the scripts";
    var body = "Kasia Dabrowski-Bardi clicked \"Want me to script them?\" on the GoRahme page.\n"
      + "Time: " + new Date().toString() + "\n"
      + "Next: run the Script Scan (5 personalized scripts) for @rahme.realestate.\n"
      + "Page: https://www.goanomalous.com/gorahme";
    MailApp.sendEmail(TEAM_EMAIL, subject, body);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, service: "gorahme-backend" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
