// Anomalous Form Backend — receives form submissions from goanomalous.com
// (5-scripts lead magnet, conversion estimator, LOVE Estate inquiry)
// and emails each to team@goanomalous.com.
// Deploy as a web app: Execute as Me, Who has access: Anyone.
// Pages post JSON with Content-Type text/plain.
var TOKEN = '5b6c23719188da0d5dacbc295763ddae77166a87c022df41';
var TO = 'team@goanomalous.com';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.token !== TOKEN) {
      return out({ ok: false, error: 'bad token' });
    }
    var type = d.type || 'lead';
    if (type === 'scripts') {
      var subject = '[Anomalous Scripts] ' + d.name + (d.email ? ' (' + d.email + ')' : '');
      var body = 'New 5-scripts lead from goanomalous.com.\n\n'
        + 'Name: ' + d.name + '\n'
        + 'Email: ' + d.email + '\n'
        + 'Phone: ' + (d.phone || 'not given') + '\n\n'
        + 'Answers:\n' + JSON.stringify(d.answers || {}, null, 2) + '\n\n'
        + 'Generated outlines:\n' + (d.outlines || 'not given') + '\n';
      MailApp.sendEmail({ to: TO, subject: subject, body: body });
      // Send the visitor their 5 outlines, as the page promises.
      if (d.email) {
        MailApp.sendEmail({
          to: d.email,
          subject: 'Your 5 scripts from Anomalous',
          body: 'Hi ' + d.name + ',\n\nHere are your 5 script outlines, built from your answers. Film them in order, one a day.\n\n' + (d.outlines || '') + '\n\nWant the full system behind them? Book a diagnosis call: https://www.goanomalous.com/getstarted\n\n— Anomalous'
        });
      }
      return out({ ok: true });
    }
    if (type === 'conversion') {
      var subject = '[Anomalous Conversion] ' + (d.name || 'Estimate') + (d.email ? ' (' + d.email + ')' : '');
      var body = 'New conversion estimate from goanomalous.com.\n\n'
        + 'Name: ' + (d.name || 'not given') + '\n'
        + 'Email: ' + (d.email || 'not given') + '\n'
        + 'Phone: ' + (d.phone || 'not given') + '\n\n'
        + 'Estimates:\n' + JSON.stringify(d.estimates || {}, null, 2) + '\n\n'
        + 'Answers:\n' + JSON.stringify(d.answers || {}, null, 2) + '\n';
      MailApp.sendEmail({ to: TO, subject: subject, body: body });
      return out({ ok: true });
    }
    if (type === 'love') {
      var subject = '[LOVE Estate Inquiry] ' + d.name + (d.email ? ' (' + d.email + ')' : '');
      var body = 'New stay inquiry from goanomalous.com/love.\n\n'
        + 'Name: ' + d.name + '\n'
        + 'Email: ' + d.email + '\n'
        + 'Dates: ' + (d.dates || 'not given') + '\n'
        + 'Occasion: ' + (d.occasion || 'not given') + '\n\n'
        + 'Message:\n' + (d.message || 'not given') + '\n';
      MailApp.sendEmail({ to: TO, subject: subject, body: body });
      return out({ ok: true });
    }
    return out({ ok: false, error: 'unknown type' });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
