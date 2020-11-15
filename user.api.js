const Express = require("express");
const Router = Express.Router();
const moment = require("moment");
const GetDovizChange = require("./helper/GetDovizChange");
const ListHeader = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
ListHeader.methods(["get", "post", "put", "delete"]);
ListHeader.register(Router, "/User");

Router.post("/Login", async (req, res) => {
  const { token, username, password } = req.body;
  console.log(req.body);
  if (token === undefined) {
    res.status(404);
  }
  let User = await ListHeader.find({ username });
  if (User.length > 0) {
    const CheckPassword = bcrypt.compareSync(password, User[0].password);
    if (CheckPassword) {
      var accessToken = jwt.sign(
        {
          data: { User },
        },
        process.env.SECRET
      );
      res.send({ accessToken });
    } else {
      res.status(401).send("Şifre Hatalıdır");
    }
  } else {
    res.status(401).send("Kullanıcı Bulunamadı");
  }
});

module.exports = Router;
