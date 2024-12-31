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
          todo: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

todoRouter.post("/", verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.addTodo(req.body);
        res.send({
          success: true,
          todo: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

todoRouter.put("/:todoId", verifyToken, (req, res, next) => {
  let reqData = {};
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        reqData = req.body;

        let results = await db.updateTodoStatus(reqData);
        // console.log(results);
        res.send({
          success: true,
          message: `Successfully updated your todo`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

todoRouter.delete("/:listId", verifyToken, (req, res, next) => {
  const listId = req.params.listId;
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        let results = await db.removeItemFromTodoList(listId);
        res.send({
          success: true,
          message: `Successfully deleted item`,
          status: results,
        });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

module.exports = todoRouter;
