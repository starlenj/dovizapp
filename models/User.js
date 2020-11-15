const restful = require("node-restful");
const mongoose = restful.mongoose;
//schema
const ListHeaderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = restful.model("Users", ListHeaderSchema);
