const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const express = require('express');
const ejs = require('ejs');
const app = express();
const mongo = require('mongoose');
const GetDovizChange = require('./helper/GetDovizChange');
const bodyParser = require('body-parser');
require('dotenv').config();

mongo.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongo db connected'))
    .catch(err => console.log(err))


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.render('index.ejs');
})


app.get('/GetKur', async (request, response) => {

    let req = https.get("https://www.tcmb.gov.tr/kurlar/today.xml", function (res) {
        let data = '';
        res.on('data', function (stream) {
            data += stream;
        });
        res.on('end', function () {
            parser.parseString(data, function (error, result) {
                if (error === null) {
                    var currency = result.Tarih_Date.Currency
                    response.send({ currency });
                }
                else {
                    console.log(error);
                }
            });
        });
    });
})
app.use('/', require('./api.js'));
app.listen(process.env.PORT, async () => {

    console.log("STARTED")
    GetDovizChange();

});

