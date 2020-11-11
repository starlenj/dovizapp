const Express = require('express');
const Router = Express.Router();
const moment = require('moment')


const ListHeader = require('./models/Doviz');


ListHeader.methods(['get', 'post', 'put', 'delete']);
ListHeader.register(Router, '/Doviz');



Router.post('/GetDovizList', async (req, res) => {

    const { Tarih } = req.body;
    const ListData = await ListHeader.find({ Date: moment(Tarih).format('YYYY.MM.DD') });
    res.send({ Result: ListData });
})
module.exports = Router
