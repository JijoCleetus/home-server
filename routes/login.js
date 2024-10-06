const express = require("express");
const loginRouter = express.Router();
const db = require("../db/login");
// const encrypto = require('../middlewares/crypto');
// const imageUploader = require('../middlewares/imageUploader');
const jwt = require("jsonwebtoken");
// const verifyToken = require('../middlewares/tokenVerify').verifyToken;

loginRouter.post("/", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let result = await db.login(email, password);
    if (result.length > 0) {
      const user = {
        role: result[0].role,
        email: result[0].email,
        name: result[0].name,
      };

      jwt.sign(
        { user },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10h" },
        (err, token) => {
          user["token"] = token;
          res.json({
            success: true,
            user,
          });
        }
      );
    } else {
      res.send({
        success: false,
        message:
          "Please check your credentials or you may not have the privilege.",
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

loginRouter.post("/agent", async (req, res, next) => {
  const userName = req.body.username;
  const password = req.body.password;
  try {
    let result = await db.login(userName, password);
    if (result.length > 0 && result[0].role === "AGENT") {
      const user = {
        admin_id: result[0].admin_id,
        username: result[0].username,
        name: result[0].name,
        district_name: result[0].district_name,
        district_id: result[0].district_id,
        role: result[0].role,
      };

      jwt.sign(
        { user },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10h" },
        (err, token) => {
          res.json({
            success: true,
            user,
            token,
          });
        }
      );
    } else {
      res.send({
        success: false,
        message:
          "Please check your credentials or you may not have the privilege.",
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = loginRouter;
