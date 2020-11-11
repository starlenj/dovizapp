const restful = require('node-restful');
const mongoose = restful.mongoose;
//schema
//
const ListHeaderSchema = new mongoose.Schema({
    value: { type: String, default: "" },
    name: { type: String, required: true },
    dovizName: { type: String, required: true },
    Date: { type: String, required: true },



});

module.exports = restful.model('Doviz', ListHeaderSchema);

