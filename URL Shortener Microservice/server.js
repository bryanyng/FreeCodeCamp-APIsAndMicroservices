require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
var validUrl = require("valid-url");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI);

// on connection
mongoose.connection.on("connected", () => {
  console.log(`Connected to database`);
});

// on error
mongoose.connection.on("error", (err) => {
  console.log(`Database error: ${err}`);
});

const urlSchema = new Schema({
  original_url: { type: String, required: true },
  key: { type: String, required: true },
});

const URL_DB = mongoose.model("URL", urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.post("/api/shorturl/new", (req, res) => {
  console.log(req.body);
  if (validUrl.isUri(req.body["url"]) && req.body["url"].startsWith("http")) {
    // Generate Key
    let key = generateKey();

    // Check Duplicates
    URL_DB.findOne({ original_url: req.body["url"] }, (err, doc) => {
      if (doc) {
        res.json({ original_url: req.body["url"], short_url: `${key}` });
      } else {
        // Create new short url
        const newURL = new URL_DB({
          original_url: req.body["url"],
          key: key,
        });
        newURL.save((err, data) => {
          if (err) return console.log(err);
        });
        res.json({ original_url: req.body["url"], short_url: `${key}` });
      }
    });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  URL_DB.findOne({ key: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
    } else if (!data) {
      res.json({ error: "invalid url" });
    } else {
      res.redirect(data.original_url);
    }
  });
});

function generateKey() {
  let chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  chars = chars.split("");
  return shuffleArr(chars).join("");
}

function shuffleArr(arr) {
  let shuffledArr = [];
  var length = 6;
  var i = arr.length - 1,
    j,
    temp;
  if (length === -1) return false;
  while (length--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    shuffledArr.push(temp);
  }
  return shuffledArr;
}
