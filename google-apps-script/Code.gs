const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'RSVP';
const EMAIL_RECIPIENT = ''; // Optional, e.g. 'you@gmail.com'

function doGet() {
  return ContentService.createTextOutput('RSVP endpoint is live');
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    appendRsvp_(p);
    return ContentService.createTextOutput('OK');
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(`ERROR: ${err.message}`);
  }
}

function testWrite() {
  appendRsvp_({
    name: 'Test Guest',
    status: 'attending',
    events: 'Wedding Ceremony',
    message: 'Apps Script test row',
    invitation: 'test',
    guestLinkName: 'Test Guest',
    pageUrl: 'Apps Script editor'
  });
}

function appendRsvp_(p) {
  const sheet = getSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.status || '',
      p.events || '',
      p.message || '',
      p.invitation || '',
      p.guestLinkName || '',
      p.pageUrl || ''
    ]);
  } finally {
    lock.releaseLock();
  }

  if (EMAIL_RECIPIENT) {
    const subject = `Wedding RSVP: ${p.name || 'Guest'} — ${p.status || ''}`;
    const body = [
      `Name: ${p.name || ''}`,
      `Status: ${p.status || ''}`,
      `Events: ${p.events || ''}`,
      `Message: ${p.message || ''}`,
      `Invitation type: ${p.invitation || ''}`,
      `Personalized name: ${p.guestLinkName || ''}`,
      `Page: ${p.pageUrl || ''}`
    ].join('\n');
    MailApp.sendEmail(EMAIL_RECIPIENT, subject, body);
  }
}

function getSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PASTE_YOUR_SPREADSHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID at the top of Code.gs.');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Status',
      'Events',
      'Message',
      'Invitation Type',
      'Personalized Name',
      'Page URL'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
