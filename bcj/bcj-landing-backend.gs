/* Beatrice landing page backend — contact + valuation form submissions.
   Deploy as web app: Execute as me (sandy@goanomalous.com), Who has access: Anyone.
   Page posts JSON with Content-Type: text/plain (avoids CORS preflight).
   Payload: { token, action: "landing_contact"|"landing_valuation", fields: {...}, test? }
   test:true skips the email (pipeline checks). ?test=1 page loads send a real
   email tagged [TEST] in the subject and WITHOUT the client cc.
   Live submissions email Sandy and cc Beatrice. */
var SHARED_TOKEN = "dea9bb80cb681bd83e9088344f3ca995";
var SANDY_EMAIL = "sandy@goanomalous.com";
var BEATRICE_EMAIL = "beatrice.jackson@compass.com";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data || data.token !== SHARED_TOKEN) {
      return out({ ok: false, error: "bad token" });
    }
    if (data.test === true) {
      return out({ ok: true, test: true });
    }
    var action = data.action || "landing_contact";
    var f = data.fields || {};
    var isTest = /^(\[TEST\] )/.test(data.subject || "");
    var subject = "[Beatrice Landing] "
      + (action === "landing_valuation" ? "Free valuation request" : "New consultation request");
    if (isTest) subject = "[TEST] " + subject;
    var lines = [];
    if (f.name) lines.push("Name: " + f.name);
    if (f.email) lines.push("Email: " + f.email);
    if (f.phone) lines.push("Phone: " + f.phone);
    if (f.address) lines.push("Property address: " + f.address);
    if (f.message) lines.push("Message: " + f.message);
    var body = (isTest ? "TEST SUBMISSION - sent from a ?test=1 page load, not by a visitor.\n\n" : "")
      + lines.join("\n")
      + "\n\nPage: https://www.bcjteam.com/help"
      + "\nTime: " + new Date().toString();
    var opts = { to: SANDY_EMAIL, subject: subject, body: body };
    if (!isTest) opts.cc = BEATRICE_EMAIL;
    MailApp.sendEmail(opts);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return out({ ok: true, service: "bcj-landing-backend" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
