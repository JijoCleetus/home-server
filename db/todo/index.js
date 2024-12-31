const pool = require("../index.js").mysql_pool;

let todoListDb = {};

todoListDb.getAllTodoList = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM todo_list`, (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

module.exports = todoListDb;
