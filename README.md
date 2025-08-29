# Firestore to Google Sheets Integration (Cloud Function)

This Firebase Cloud Function listens for new documents created in the BMEMembershipForm Firestore collection and appends the submitted form data as a row in a connected Google Sheet.

## Features

- Triggered on document creation in Firestore
- Uses Google Sheets API (via Service Account)
- Formats and appends a row of user data to a sheet
- Configured as a 1st Gen Firebase Function

## Technologies Used

- Firebase Cloud Functions (1st Gen)
- Google Sheets API (via googleapis npm package)
- Firestore (Native Firebase)
- Node.js v20

## Prerequisites

- [Firebase project](https://console.firebase.google.com/u/4/project/streetcare-d0f33/overview) set up
- [Firestore](https://console.firebase.google.com/u/4/project/streetcare-d0f33/firestore/databases/-default-/data/~2FBMEMembershipForm~2FALni5gOtrU3nMAX3v4zd) enabled
- Google Cloud Console editor access(IAM) to deploy functions
- Node.js (v18+ recommended)

## Setup Instructions
1. Clone this Repository

   ```
   git clone https://github.com/yourusername/firestore-gsheets-integration-function.git
   cd firestore-gsheets-integration-function
   ```
2. Create and Configure a Service Account
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to IAM & Admin → Service Accounts
   - Click Create Service Account
   - Name it (e.g., firestore-sheets-writer)
   - Grant role: Editor
   - After creating, go to Keys → Add Key → JSON
   - Download the JSON key and place it inside the functions/ directory
   - **IMPORTANT:** This is used for authenticating with the Google Sheets API.

3. Enable Google Sheets API
   + In Google Cloud Console, search for Google Sheets API
   + Click **Enable**

4. Share Your Google Sheet
   * Open your target Google Sheet and click Share
   * Share with the Service Account email from the downloaded JSON key (e.g.,firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com)
   * Give Editor access

## Install Dependencies
**Global tools**
```
npm install -g firebase-tools
npm install -g npm@11.4.2
```

**Initialize Firebase Functions**<br/>
- Inside your project directory:
```
firebase init functions
```
Choose JavaScript as language and install dependencies.

- Inside the functions/ directory:
```
npm install googleapis
```

## Deploy the Function

Make sure you're logged in and then deploy:
```
firebase login
firebase use --add  # Choose your project and alias
firebase deploy --only functions
```

## How It Works
- Trigger: Fires when a new document is added to BMEMembershipForm collection
- Reads the document fields and formats them
- Appends a new row in the BMEChapterForm sheet in BME_Form_Data




