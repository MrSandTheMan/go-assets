/* GoRahat backend — approvals and notes from the Go page.
   Deploy as web app: Execute as me (team@goanomalous.com), Who has access: Anyone.
   Page posts JSON with Content-Type: text/plain (avoids CORS preflight).
   Payload: { token, action: "approval"|"notes", subject, item, body, test? }
   test:true skips the email (pipeline checks). */
var SHARED_TOKEN="1fcf6351f7b48a6bd953f7bef1005b06f4e7dcc4cee55a7a";
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
    var action = data.action || "note";
    var subject = "[GoRahat] " + (data.subject || action);
    var body = "Action: " + action + "\n"
      + "Item: " + (data.item || "-") + "\n"
      + "From: " + (data.from || "Rahat Kamal") + "\n"
      + "Time: " + new Date().toString() + "\n\n"
      + (data.body || "");
    MailApp.sendEmail(TEAM_EMAIL, subject, body);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, service: "gorahat-backend" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
