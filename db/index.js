const mysql = require('mysql');
module.exports = {
    mysql_pool: mysql.createPool({
        connectionLimit: 10,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER, 
        database: process.env.DB_DATABASE, 
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    })
};

