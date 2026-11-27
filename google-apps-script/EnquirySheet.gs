/**
 * Private enquiry sheet for Vignesh Anugraha Enterprises.
 *
 * The website adds one row when the contact form is submitted.
 * Status, note, award date and amount are edited in the sheet.
 *
 * Setup, once, in the Google account that should own the sheet:
 * 1. Create a blank spreadsheet named "Vignesh Anugraha enquiries".
 * 2. Extensions → Apps Script, replace the default file with this one, and save.
 * 3. Project settings → Script properties → add ENQUIRY_SECRET.
 *    Use the same value as VITE_ENQUIRY_SHEET_SECRET. Do not paste it into this file.
 * 4. Select setupSheet and run it. Authorise the spreadsheet when asked.
 * 5. Deploy → New deployment → Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 6. Copy the web app URL into VITE_ENQUIRY_SHEET_URL and rebuild the site.
 *
 * The script only appends a row. It never returns existing enquiries.
 */

var HEADERS = [
  "Received",
  "Name",
  "Phone",
  "Email",
  "Interest",
  "Language",
  "Message",
  "WhatsApp number",
  "Status",
  "Note",
  "Award date",
  "Amount",
];

var STATUSES = [
  "Received",
  "In conversation",
  "Work awarded",
  "In progress",
  "Completed",
  "Closed without work",
];

var CONVERTED = ["Work awarded", "In progress", "Completed"];

var INTERESTS = [
  "General enquiry",
  "Civil construction",
  "Material supply and installation",
  "Renovation and refurbishment",
  "Plumbing and electrical",
  "Infrastructure works",
  "Interior works",
  "Structural fabrication",
  "Sports infrastructure",
  "Building maintenance",
];

var WHATSAPP_NUMBERS = ["+91 79964 63956", "+91 63605 39661"];

function setupSheet() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone("Asia/Kolkata");
  ss.rename("Vignesh Anugraha enquiries");

  var enquiries = ss.getSheetByName("Enquiries") || ss.insertSheet("Enquiries");
  if (enquiries.getRange("A1").getValue() !== "Received") {
    enquiries.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  enquiries.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#142F50").setFontColor("#FFFFFF");
  enquiries.setFrozenRows(1);
  enquiries.getRange("A2:A").setNumberFormat("yyyy-mm-dd hh:mm");
  enquiries.getRange("C2:C").setNumberFormat("@");
  enquiries.getRange("H2:H").setNumberFormat("@");
  enquiries.getRange("K2:K").setNumberFormat("yyyy-mm-dd");
  enquiries.getRange("L2:L").setNumberFormat("#,##0");
  enquiries.setColumnWidth(7, 360);
  enquiries.getRange("I2:I").setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  );

  var summary = ss.getSheetByName("Summary") || ss.insertSheet("Summary");
  summary.clear();
  summary.getRange("A1").setValue("Enquiry summary").setFontWeight("bold");
  summary.getRange("A3").setValue("Enquiries received");
  summary.getRange("B3").setFormula('=COUNTA(Enquiries!B2:B)');
  summary.getRange("A4").setValue("Converted to real work");
  summary.getRange("B4").setFormula(
    "=" + CONVERTED.map(function (status) {
      return 'COUNTIF(Enquiries!I2:I,"' + status + '")';
    }).join("+")
  );
  summary.getRange("C4").setValue("Work awarded, in progress, and completed.");
  summary.getRange("A5").setValue("Conversion");
  summary.getRange("B5").setFormula('=IF(B3=0,"",B4/B3)');
  summary.getRange("B5").setNumberFormat("0%");
  summary.getRange("A7").setValue("By interest").setFontWeight("bold");
  summary.getRange(8, 1, INTERESTS.length, 1).setValues(INTERESTS.map(function (item) { return [item]; }));
  for (var i = 0; i < INTERESTS.length; i++) {
    summary.getRange(8 + i, 2).setFormula("=COUNTIF(Enquiries!E2:E,A" + (8 + i) + ")");
  }
  var numberRow = 8 + INTERESTS.length + 2;
  summary.getRange(numberRow, 1).setValue("By WhatsApp number").setFontWeight("bold");
  for (var n = 0; n < WHATSAPP_NUMBERS.length; n++) {
    summary.getRange(numberRow + 1 + n, 1).setValue(WHATSAPP_NUMBERS[n]);
    summary.getRange(numberRow + 1 + n, 2).setFormula(
      '=COUNTIF(Enquiries!H2:H,A' + (numberRow + 1 + n) + ')'
    );
  }
  summary.autoResizeColumn(1);
  summary.setColumnWidth(3, 360);
  summary.getRange("A3:A5").setFontWeight("bold");

  var blank = ss.getSheetByName("Sheet1");
  if (blank && ss.getSheets().length > 1 && blank.getLastRow() === 0) ss.deleteSheet(blank);
}

function doGet() {
  var ready = Boolean(PropertiesService.getScriptProperties().getProperty("ENQUIRY_SECRET"));
  return json({ ok: true, ready: ready });
}

function doPost(e) {
  try {
    var data = JSON.parse((e.postData && e.postData.contents) || "{}");
    var expected = PropertiesService.getScriptProperties().getProperty("ENQUIRY_SECRET");
    if (!expected || data.secret !== expected) return json({ ok: false });
    var name = clip(data.name, 200);
    var phone = clip(data.phone, 32);
    var message = clip(data.message, 2000);
    if (!name || !phone || !message) return json({ ok: false });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = SpreadsheetApp.getActive().getSheetByName("Enquiries");
      if (!sheet) return json({ ok: false });
      if (recentCount(sheet) >= 20) return json({ ok: false });
      sheet.appendRow([
        new Date(),
        name,
        phone,
        clip(data.email, 200),
        allowed(data.interest, INTERESTS),
        data.language === "Kannada" ? "Kannada" : "English",
        message,
        allowed(data.whatsappNumber, WHATSAPP_NUMBERS),
        "Received",
        "",
        "",
        "",
      ]);
    } finally {
      lock.releaseLock();
    }
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false });
  }
}

function recentCount(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var start = Math.max(2, last - 29);
  var stamps = sheet.getRange(start, 1, last - start + 1, 1).getValues();
  var cutoff = Date.now() - 10 * 60 * 1000;
  return stamps.filter(function (row) {
    return row[0] instanceof Date && row[0].getTime() > cutoff;
  }).length;
}

function allowed(value, list) {
  var text = clip(value, 120);
  return list.indexOf(text) === -1 ? "" : text;
}

function clip(value, max) {
  return String(value || "").trim().slice(0, max);
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
