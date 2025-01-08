const pool = require("../index.js").mysql_pool;
const cryptoEngine = require("../../services/crypto-engine.js");

let logindb = {};

logindb.login = (email, password) => {
  const pswd = cryptoEngine.encode(password);
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id,role,name,email FROM user WHERE email = ? AND password = ?`,
      [email, pswd],
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
