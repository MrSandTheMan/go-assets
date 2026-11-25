// Corestone Form Backend — receives ALL form submissions from corestonedevelopers.com
// (quote form, build quiz, lead-magnet gate) and emails each to
// marketing@corestonedevelopers.com.
// Deploy as a web app: Execute as Me, Who has access: Anyone.
// Pages post JSON with Content-Type text/plain.
var TOKEN = '08ee3b92e3a5ce90feabef7e339008119a7776c22e424f3d';
var TO = 'marketing@corestonedevelopers.com';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) {
      return out({ ok: false, error: 'bad token' });
    }
    var type = d.type || 'lead';
    if (type === 'quote') {
      var subject = '[Corestone Quote] ' + d.name + (d.email ? ' (' + d.email + ')' : '');
      var body = 'New quote request from corestonedevelopers.com.\n\n'
        + 'Name: ' + d.name + '\n'
        + 'Phone: ' + (d.phone || 'not given') + '\n'
        + 'Email: ' + d.email + '\n'
        + 'Company: ' + (d.company || 'not given') + '\n\n'
        + 'About the project:\n' + (d.message || 'not given') + '\n';
      MailApp.sendEmail({ to: TO, subject: subject, body: body });
      return out({ ok: true });
    }
    if (type === 'quiz') {
      var a = d.answers || {};
      var subject = '[Corestone Quiz] ' + d.name + ' — ' + (d.tier || 'build profile');
      var body = 'New build quiz result from corestonedevelopers.com.\n\n'
        + 'Name: ' + d.name + '\n'
        + 'Email: ' + d.email + '\n'
        + 'Tier: ' + (d.tier || 'not given') + '\n\n'
        + 'Answers:\n' + JSON.stringify(a, null, 2) + '\n';
      MailApp.sendEmail({ to: TO, subject: subject, body: body });
      return out({ ok: true });
    }
    // default: lead magnet gate
    var subject = '[Corestone Lead] ' + d.name + ' — ' + (d.guide || 'guide');
    var body = 'New lead magnet download from corestonedevelopers.com.\n\n'
      + 'Name: ' + d.name + '\n'
      + 'Email: ' + d.email + '\n'
      + 'Guide: ' + (d.guide || 'not given') + '\n';
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
