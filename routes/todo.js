const express = require("express");
const todoRouter = express.Router();
const db = require("../db/todo");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/tokenVerify").verifyToken;

todoRouter.get("/", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.getAllTodoList();
        res.send({
          success: true,
          shopping: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

module.exports = todoRouter;
