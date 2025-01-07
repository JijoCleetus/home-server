const express = require("express");
const loginRouter = express.Router();
const db = require("../../db/login");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    let result = await db.login(email, password);
    if (result.length > 0) {
      const user = {
        id: result[0].id,
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

module.exports = loginRouter;
