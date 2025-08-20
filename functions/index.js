/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

const {onDocumentCreated} = require("firebase-functions/v2/firestore");

const admin = require("firebase-admin");
const {google} = require("googleapis");
const serviceAccount = require("./streetcare-d0f33-912212a9722c.json");

admin.initializeApp();

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "10PECSocHagkj8rAk6UFRMQmMSMdLL4wRDcAdL0X-bv0";
const SHEET_NAME = "BMEChapterForm";

exports.addMembershipToSheet = onDocumentCreated("BMEMembershipForm/{docId}",
    async (event) => {
      const snap = event.data;
      const data = snap.data();

      const sheets = google.sheets({version: "v4",
        auth: await auth.getClient()});
      const authClient = await auth.getClient();

      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const values = [
        [
          formatter.format(new Date()),
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
        await sheets.spreadsheets.values.append({
          auth: authClient,
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1`,
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: values,
          },
        });

        console.log("Successfully added row to Google Sheet");
      } catch (error) {
        console.error("Error appending to Google Sheet:", error);
      }
    });
