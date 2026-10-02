/* GoCourtney backend: the "Want me to script them?" Script Scan ask.
   Deploy as web app: Execute as me (team@goanomalous.com), Who has access: Anyone.
   Page posts JSON with Content-Type: text/plain (avoids CORS preflight).
   Payload: { token, action: "script_ask", subject, item, body, test? }
   test:true skips the email (pipeline checks). The page prefixes [TEST] to the
   subject on ?test=1 loads so test submissions arrive as tagged emails. */
var SHARED_TOKEN = "5b875a96303df094884e69832b757659";
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
    var action = data.action || "script_ask";
    var subject = "[GoCourtney] " + (data.subject || action);
    var body = "Action: " + action + "\n"
      + "Item: " + (data.item || "-") + "\n"
      + "From: " + (data.from || "Courtney Mendez") + "\n"
      + "Time: " + new Date().toString() + "\n\n"
      + (data.body || "");
    MailApp.sendEmail(TEAM_EMAIL, subject, body);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, service: "gocourtney-backend" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
