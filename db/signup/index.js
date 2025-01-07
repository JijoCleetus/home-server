const pool = require("../index.js").mysql_pool;

let signUpDb = {};

signUpDb.checkUser = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT name,email FROM user WHERE email = ?`,
      [email],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

signUpDb.signUp = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO user(role,name,email,password)
        values(?,?,?,?)`,
      ["user", data.name, data.email, data.password],
      (err, results) => {
        if (err) {
          reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = signUpDb;
