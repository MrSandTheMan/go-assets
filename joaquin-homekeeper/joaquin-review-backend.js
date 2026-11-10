// Joaquin Review Backend — receives review form POSTs from the Monticello Homekeeper
// gallery page, emails the review to team@. Deploy as a web app: Execute as Me,
// Who has access: Anyone. The page posts JSON with Content-Type text/plain.
var TOKEN = 'joaquin-review-2026';
var TO = 'team@goanomalous.com';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) {
      return out({ ok: false, error: 'bad token' });
    }
    var stars = '';
    for (var i = 0; i < d.rating; i++) stars += '\u2605';
    var subject = '[Joaquin Review] ' + d.rating + ' stars from ' + d.name;
    var body = 'New review for Joaquin Romero (Monticello Homekeeper).\n\n'
      + 'Name: ' + d.name + '\n'
      + 'Rating: ' + d.rating + ' / 5 ' + stars + '\n'
      + 'Service: ' + (d.service || 'not given') + '\n\n'
      + 'Review:\n' + d.review + '\n';
    MailApp.sendEmail({ to: TO, subject: subject, body: body });
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
