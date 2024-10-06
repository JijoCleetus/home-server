const pool = require('../index.js').mysql_pool;

let utilitydb = {};

utilitydb.disctricts = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM district`, (err, results) => {
            if (err) {
                reject(err);
            }
            return resolve(results)
        })
    })
};

utilitydb.taluks = (districtId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM taluk WHERE district_id = ?`, districtId, (err, results) => {
            if (err) {
                reject(err);
            }
            return resolve(results);
        })
    })
};

utilitydb.villages = (talukId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM village WHERE taluk_id = ?`, talukId, (err, results) => {
            if (err) {
                reject(err);
            }
            return resolve(results)
        })
    })
};


module.exports = utilitydb;