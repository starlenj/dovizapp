const https = require("https");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongo = require("mongoose");
const GetDovizChange = require("./helper/GetDovizChange");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const moment = require("moment");
const User = require("./models/User");
const bcrypt = require("bcrypt");

mongo
  .connect(process.env.MONGO_URI)

  .then(() => console.log("Mongo db connected"))
  .catch((err) => console.log(err));
app.use(cors());
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/home", (req, res) => {
  res.render("index.ejs");
});
app.get("/GetKur", async (request, response) => {
  let req = https.get("https://www.tcmb.gov.tr/kurlar/today.xml", function (
    res
  ) {
    let data = "";
    res.on("data", function (stream) {
      data += stream;
    });
    res.on("end", function () {
      parser.parseString(data, function (error, result) {
        if (error === null) {
          var currency = result.Tarih_Date.Currency;
          response.send({ currency });
        } else {
          console.log(error);
        }
      });
    });
  });
});
app.use("/", require("./api.js"));
app.use("/", require("./user.api.js"));
app.listen(process.env.PORT, async () => {
  console.log("STARTED");
  GetDovizChange(moment());
  const FindUser = await User.find({ username: "admin" });
  if (FindUser.length === 0) {
    const NewUser = new User();
    bcrypt.hash("1234", 10, async (err, hash) => {
      NewUser.password = hash;
      NewUser.username = "admin";
      NewUser.save();
    });
  }
});
