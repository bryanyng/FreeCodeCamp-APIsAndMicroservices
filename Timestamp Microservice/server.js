// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// === IMPLEMENTATION STARTS ===
app.get("/api/timestamp/:ts", (req, res) => {
  let ts = req.params.ts;
  if(/\d{5,}/.test(ts)) {
    res.json({unix: parseInt(ts), utc: new Date(parseInt(ts)).toUTCString()});
  } else {
    d = new Date(ts)
    if (d.toString() === "Invalid Date") {
      res.json({ error: "Invalid Date" });
    } else {
      res.json({unix: d.valueOf(), utc: d.toUTCString()});
    }
  }
});

app.get("/api/timestamp", (req, res) => {
  now = new Date();
  res.json({unix: now.valueOf(), utc: now.toUTCString()});
});

// === IMPLEMENTATION ENDS ===

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
