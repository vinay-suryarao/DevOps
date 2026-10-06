/**
 * Google Apps Script for Hackathon Registrations (Supports 4, 5, 6+ Members)
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. In top menu, click Extensions > Apps Script.
 * 3. Replace all code in Code.gs with this script.
 * 4. Click Save (Ctrl + S).
 * 5. Click "Deploy" -> "Manage deployments" -> edit the existing deployment OR "New deployment".
 *    ⚠️ CRITICAL:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the Web app URL (ending in /exec).
 * 7. In your .env file, ensure:
 *    VITE_HACKATHON_REGISTRATION_SCRIPT_URL="<your_web_app_url>"
 */

// 1. Handles GET requests to verify if any email is already registered
function doGet(e) {
  try {
    const params = e.parameter || {};
    const emailsParam = params.emails || "";
    const hackathonName = (params.hackathonName || "").trim().toLowerCase();

    if (!emailsParam) {
      return jsonResponse({ result: "success", isRegistered: false });
    }

    const checkEmails = emailsParam.split(",").map(function (email) {
      return email.trim().toLowerCase();
    }).filter(function (email) {
      return email.length > 0;
    });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, params.hackathonName || "Registrations");

    // In Google Apps Script, the method is getLastRow(), NOT getLastRowNum()
    if (sheet.getLastRow() <= 1) {
      return jsonResponse({ result: "success", isRegistered: false });
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(function (h) { return String(h).trim().toLowerCase(); });
    
    // Automatically find all column indices that contain 'email' (Leader, Member 2, 3, 4, 5, 6...)
    const emailColIndices = [];
    for (let col = 0; col < headers.length; col++) {
      if (headers[col].indexOf("email") !== -1) {
        emailColIndices.push(col);
      }
    }

    // Check all existing rows
    for (let r = 1; r < data.length; r++) {
      const row = data[r];
      for (let i = 0; i < emailColIndices.length; i++) {
        const colIdx = emailColIndices[i];
        const registeredEmail = String(row[colIdx] || "").trim().toLowerCase();
        if (registeredEmail && checkEmails.indexOf(registeredEmail) !== -1) {
          return jsonResponse({
            result: "success",
            isRegistered: true,
            matchedEmail: registeredEmail
          });
        }
      }
    }

    return jsonResponse({ result: "success", isRegistered: false });
  } catch (error) {
    return jsonResponse({ result: "error", message: error.toString() });
  }
}

// 2. Handles POST requests to append registration data into the Google Sheet
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30s to avoid concurrent write collisions

    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    const hackathonName = data.hackathonName || "General";
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, hackathonName);

    // Build headers up to 6 members (and dynamically higher if present in submitted data)
    let maxMembers = 6;
    for (let i = 7; i <= 20; i++) {
      if (data["Member" + i + "Name"] !== undefined || data["Member" + i + "Email"] !== undefined) {
        maxMembers = i;
      }
    }

    const expectedHeaders = [
      "Timestamp",
      "Hackathon Name",
      "Team Name",
      "Leader Name",
      "Leader College",
      "Leader Email",
      "Leader Contact Number"
    ];

    for (let m = 2; m <= maxMembers; m++) {
      expectedHeaders.push("Member " + m + " Name");
      expectedHeaders.push("Member " + m + " College");
      expectedHeaders.push("Member " + m + " Email");
      expectedHeaders.push("Member " + m + " Contact Number");
    }

    // Check if sheet is empty using getLastRow()
    if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
      sheet.appendRow(expectedHeaders);
      const headerRange = sheet.getRange(1, 1, 1, expectedHeaders.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4f46e5");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    } else {
      // If sheet already had fewer columns (e.g. up to Member 4), expand headers if needed
      const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      if (existingHeaders.length < expectedHeaders.length) {
        for (let c = existingHeaders.length; c < expectedHeaders.length; c++) {
          sheet.getRange(1, c + 1).setValue(expectedHeaders[c]).setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
        }
      }
    }

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd HH:mm:ss");

    // Construct the row data
    const row = [
      timestamp,
      data.hackathonName || "",
      data.TeamName || data.teamName || "",
      data.LeaderName || "",
      data.LeaderCollege || "",
      data.LeaderEmail || "",
      data.LeaderContactNumber || ""
    ];

    for (let m = 2; m <= maxMembers; m++) {
      row.push(data["Member" + m + "Name"] || "");
      row.push(data["Member" + m + "College"] || "");
      row.push(data["Member" + m + "Email"] || "");
      row.push(data["Member" + m + "ContactNumber"] || "");
    }

    sheet.appendRow(row);

    return jsonResponse({
      result: "success",
      message: "Registration recorded successfully!"
    });
  } catch (error) {
    return jsonResponse({
      result: "error",
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// Helper: Get or create sheet by name
function getOrCreateSheet(ss, sheetName) {
  const sanitizedName = String(sheetName).replace(/[\\/?*[\]:]/g, " ").trim().substring(0, 50) || "Registrations";
  let sheet = ss.getSheetByName(sanitizedName);
  if (!sheet) {
    sheet = ss.insertSheet(sanitizedName);
  }
  return sheet;
}

// Helper: Return JSON response with CORS mime type
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
