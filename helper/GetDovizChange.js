const Model = require('../models/Doviz');
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const moment = require('moment');
module.exports = GetDovizChange = async () => {


    let req = https.get("https://www.tcmb.gov.tr/kurlar/today.xml", function (res) {
        let data = '';
        res.on('data', function (stream) {
            data += stream;
        });
        res.on('end', function () {
            parser.parseString(data, function (error, result) {
                if (error === null) {
                    var currency = result.Tarih_Date.Currency
                    currency.map(async (item) => {

                        let result = await Model.find({ dovizName: item['ATTR']['Kod'], Date: moment().format('YYYY.MM.DD') })
                        if (result.length === 0) {
                            Doviz = new Model({
                                name: item['Isim'].toString(),
                                value: item['ForexSelling'].toString(),
                                dovizName: item['ATTR']['Kod'].toString(),
                                Date: moment().format('YYYY.MM.DD')
                            })
                            Doviz.save();
                        }
                    })
                }
                else {
                    console.log(error);
                }
            });
        });
    });


}