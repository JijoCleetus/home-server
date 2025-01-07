const express = require("express");
const signUpRouter = express.Router();
const signUpDb = require("../../db/signup");
const jwt = require("jsonwebtoken");

signUpRouter.post("/", async (req, res, next) => {
  console.log("called");
  const email = req.body.email;
  try {
    let result = await signUpDb.checkUser(email);
    if (result.length > 0) {
      const email = result[0].email;
      res.send({
        success: false,
        message: `A user with ${email} already exists.`,
      });
    } else {
      const user = {
        role: req.body.role,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      };
      let result = await signUpDb.signUp(user);
      res.send({
        success: true,
        data: result,
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = signUpRouter;
