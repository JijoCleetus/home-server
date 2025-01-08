var CryptoJS = require("crypto-js");
console.log(CryptoJS.SHA256("test123", process.env.MY_SECRET_KEY).toString());
