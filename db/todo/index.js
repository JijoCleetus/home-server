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

todoListDb.addTodo = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO todo_list(name,date,image)
        values(?,?,?)`,
      [data.name, data.date, data.image, 0],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

todoListDb.updateTodoStatus = (data) => {
  const query = "UPDATE todo_list SET active = ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    pool.query(query, [data.active, data.id], (err, results, fields) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

todoListDb.removeItemFromTodoList = (id) => {
  const query = `DELETE FROM todo_list WHERE id = ?`;
  return new Promise((resolve, reject) => {
    pool.query(query, [id], (err, results) => {
      if (err) {
        reject(err);
      }
      return resolve(results);
    });
  });
};

module.exports = todoListDb;
