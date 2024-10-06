const pool = require("../index.js").mysql_pool;

let logindb = {};

logindb.login = (email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT role,name,email FROM user WHERE email = ? AND password = ?`,
      [email, password],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = logindb;
