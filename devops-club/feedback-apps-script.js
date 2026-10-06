/**
 * ==============================================================================
 * APSIT DevOps Club - Event Feedback Google Apps Script (Code.gs)
 * ==============================================================================
 * 
 * Step-by-Step Deployment Instructions:
 * ------------------------------------------------------------------------------
 * 1. Open your Google Sheet where you want feedback to be saved.
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click Save (Ctrl + S).
 * 4. Click the blue "Deploy" button (top right) -> "Manage deployments" (or "New deployment").
 * 5. If creating a new deployment:
 *      - Select type: "Web app" (click the gear icon ⚙️ if not selected).
 *      - Description: "Feedback Webhook v1"
 *      - Execute as: "Me" (your Google account)
 *      - ⚠️ CRITICAL: Who has access: "Anyone"
 *        (If you leave it as "Only myself", submissions will fail with Error 401 Unauthorized!)
 * 6. Click "Deploy".
 * 7. Click "Authorize access" -> Choose your Google Account -> Click "Advanced" -> Click "Go to Untitled project (unsafe)" -> Click "Allow".
 * 8. Copy the Web app URL (it ends in /exec).
 * 9. In your project's .env file, update:
 *      VITE_EVENTS_FEEDBACK_SCRIPT_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
 * 10. Restart your Vite dev server (or let Vite reload) and test submitting feedback!
 * ==============================================================================
 */

// 1. Handles GET requests (Health Check / Browser Verification)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      result: "success",
      status: "active",
      message: "APSIT DevOps Club Feedback Webhook is online and ready to receive submissions.",
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// 2. Handles POST requests (Receives Feedback Form Submissions)
function doPost(e) {
  // Use a ScriptLock to prevent simultaneous submissions from overwriting each other
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30 seconds

    let data = {};

    // Support both FormData (e.parameter) and JSON payload (e.postData.contents)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Extract fields with fallbacks for case-sensitivity
    const dateSubmitted = data.Date || data.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM d, yyyy");
    const name = data.Name || data.name || data.fullName || "Anonymous";
    const email = data.Email || data.email || "";
    const moodleId = data.MoodleID || data.moodleId || data.moodle_id || "";
    const department = data.Department || data.department || "";
    const eventName = data.Event || data.event || "General Feedback";
    const feedback = data.Feedback || data.feedback || data.comments || "";
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

    // Open active spreadsheet and get or create the Feedback sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Event Feedback";
    const sheet = getOrCreateFeedbackSheet(ss, sheetName);

    // Append the row
    sheet.appendRow([
      timestamp,
      dateSubmitted,
      name,
      email,
      moodleId,
      department,
      eventName,
      feedback
    ]);

    // Format new row styling
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 8).setVerticalAlignment("middle");

    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
        message: "Feedback submitted successfully! Thank you.",
        row: lastRow
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper: Finds an existing sheet tab or creates and styles a new one with proper headers
 */
function getOrCreateFeedbackSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // If sheet is brand new (only 0 or 1 row without headers)
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Timestamp",
      "Event Date",
      "Student Name",
      "Email Address",
      "Moodle ID",
      "Department",
      "Event Name",
      "Feedback"
    ];

    sheet.appendRow(headers);

    // Header styling: Dark blue background (#2c3e50), white bold text, freeze top row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#2c3e50");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);

    // Column widths for optimal readability
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 130); // Event Date
    sheet.setColumnWidth(3, 180); // Student Name
    sheet.setColumnWidth(4, 220); // Email Address
    sheet.setColumnWidth(5, 120); // Moodle ID
    sheet.setColumnWidth(6, 180); // Department
    sheet.setColumnWidth(7, 240); // Event Name
    sheet.setColumnWidth(8, 400); // Feedback Comments
  }

  return sheet;
}
