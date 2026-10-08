/* GoJohn backend: favorites approval + photo notes for John Henry.
   Deploy as web app: Execute as me (team@goanomalous.com), Who has access: Anyone.
   Page posts JSON with Content-Type: text/plain (avoids CORS preflight).
   Payload: { token, action: "approve_favorites"|"photo_notes", subject, item, from, body, test? }
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
    var action = data.action || "approve_favorites";
    var subject = "[GoJohn] " + (data.subject || action);
    var body = "Action: " + action + "\n"
      + "Item: " + (data.item || "-") + "\n"
      + "From: " + (data.from || "John Henry") + "\n"
      + "Time: " + new Date().toString() + "\n\n"
      + (data.body || "");
    MailApp.sendEmail(TEAM_EMAIL, subject, body);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, service: "gojohn-backend" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
