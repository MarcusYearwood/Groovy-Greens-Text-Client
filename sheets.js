exports.AuthenticateGoogle = async function (sheetName) {
  // configures access to .env file
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

  const {google} = require("googleapis");

  const auth = new google.auth.GoogleAuth({
    keyFile: "creds.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  // create client instance for authorization
  const client = await auth.getClient

  // create instance of google sheets api
  const googleSheets = google.sheets({version: "v4", auth: "client"});

  // get meta data from google sheet
  const sheetID = process.env.SHEET_ID;
  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: sheetID
  });

  // read rows from spreadsheets
  const getRows = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: sheetID,
    // range: metaData.data.sheets[0].properties.title
    // range for testing
    range: sheetName
  });

  return getRows.data.values;
}
