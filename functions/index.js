const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const {google} = require("googleapis");

// Load service account credentials for Sheets API access
const serviceAccount = require("./streetcare-d0f33-912212a9722c.json");

admin.initializeApp();

// Set up GoogleAuth client using service account for Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Google Spreadsheet ID and sheet name where data will be written
const SPREADSHEET_ID = "10PECSocHagkj8rAk6UFRMQmMSMdLL4wRDcAdL0X-bv0";
const SHEET_NAME = "BMEChapterForm";

// 1st Gen Cloud Function triggered when a new document is created
// in the Firestore collection "BMEMembershipForm"
exports.addMembershipToSheetGen1 = functions
    .firestore
    .document("BMEMembershipForm/{docId}")
    .onCreate(async (snap, context) => {
      const data = snap.data();

      // Initialize Sheets API client with authorized credentials
      const sheets = google.sheets({version: "v4",
        auth: await auth.getClient()});

      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedDate = formatter.format(new Date(data.DateOfSignature));

      // Prepare data to be appended to the spreadsheet
      const values = [
        [
          formattedDate,
          "BMEMembershipForm",
          data.FirstName || "",
          data.LastName || "",
          data.EmailAddress || "",
          data.PhoneNumber || "",
          data.AddressLine1 || "",
          data.AddressLine2 || "",
          data.ZipCode || "",
          data.Country || "",
          data.City || "",
          data.State || "",
          data.Weekdays || "",
          data.VolunteerHours || "",
          data.Under18 || "",
          data.HearAboutUs || "",
          data.VolunteerText || "",
          data.Signature || "",
          data.NameForSignature || "",
          data.DateOfSignature || "",
          data.Comments || "",
        ],
      ];

      try {
        // Append the row to the specified Google Sheet
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1`, // Append starting from top
          valueInputOption: "USER_ENTERED", // Accepts formatted user input
          insertDataOption: "INSERT_ROWS", // Always inserts a new row
          requestBody: {
            values: values, // Actual data rows to append
          },
        });

        console.log("Successfully added row to Google Sheet");
      } catch (error) {
        console.error("Error appending to Google Sheet:", error);
      }
    });
