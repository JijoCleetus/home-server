const CryptoJs = require("crypto-js");

let cryptoEngine = {};

cryptoEngine.encode = (password) => {
  return CryptoJs.SHA256(password, process.env.MY_SECRET_KEY, {
    mode: CryptoJs.mode.ECB,
  }).toString();
};

cryptoEngine.encrypt = (password) => {
  return CryptoJs.AES.encrypt(password, process.env.MY_SECRET_KEY, {
    mode: CryptoJs.mode.ECB,
  }).toString();
};

cryptoEngine.decrypt = (encryptedString) => {
  const bytes = CryptoJs.AES.decrypt(
    encryptedString,
    process.env.MY_SECRET_KEY
  );
  return bytes.toString(CryptoJs.enc.Utf8);
};

module.exports = cryptoEngine;
