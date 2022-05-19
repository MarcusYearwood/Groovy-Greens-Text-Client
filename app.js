
// configures access to .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// authenticate twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);
const sheets = require(__dirname + "/sheets.js");

// set up node apps
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));



app.get("/", async (req, res) => {
  const sheetData = await sheets.AuthenticateGoogle('Test');
  const parsed = parseSheet(sheetData);
  const columns = sheetData[0];
  res.render("customers", {data:parsed, columns:columns});
});

app.post("/", async (req, res) => {
  const message = req.body.message;
  const sheetData = await sheets.AuthenticateGoogle('Test');
  const data = parseSheet(sheetData);
  const columns = sheetData[0];
  if (typeof req.body.number == "string") {
    let idx = req.body.number
    let name = data[idx][columns[0]];
    let number = data[idx][columns[2]];
    let finalMessage = AddName(message, name);
    SendText(number, finalMessage);
  } else {
    req.body.number.forEach(function(idx) {
      let name = data[idx][columns[0]];
      let number = data[idx][columns[2]];
      let finalMessage = AddName(message, name);
      SendText(number, finalMessage);
    });
  }

  res.redirect("/");
});

app.listen(PORT, (req, res) => {
  console.log(`Running on port ${PORT}`);
});



// transforms sheet data from list of lists to list of dictionaries with column headers as keys
function parseSheet(sheetData) {
  var parsedData = []
  var columns = sheetData[0]
  for (let i=0; i < sheetData.length; i++){
    if (i !== 0) {
      var values = sheetData[i];
      parsedData.push(zipObject(columns, values));
    }
  }
  return parsedData;

}

function zipObject(keys, values) {
  const obj = {};

  // Assuming the length of keys always equals the length of values to simplify the example.
  keys.forEach((key, index) => {
    obj[key] = values[index];
  })

  return obj;
}

// add number and message as a parameter
function SendText(number, finalMessage) {
  twilioClient.messages
    .create({
       body: finalMessage,
       from: '+13208533192',
       to: `+1${number}`
     })
    .then(message => console.log(message.sid));
}

// add first name to message
function AddName(message, name) {
  const idx = message.indexOf("{name}");
  if (idx < 0) {
    return message;
  } else {
    const newMessage = message.substring(0, idx) + name + message.substring(idx+6);
    return newMessage;
  }
}
