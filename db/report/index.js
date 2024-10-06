const pool = require('../index.js').mysql_pool;

let reportdb = {};

reportdb.getStateMasterReport = (reqParam) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT applicationId as 'Application ID',name as 'Name',registrationNo as 'Registration Number',
        mobile as 'Mobile number',adhaarNumber as 'Aadhaar Number',address as Address,bankAccNumber as 'Bank Account Number',IFSCcode as 'IFSC Code',
        nameInBank as 'Name in Bank',bankName as 'Name of Bank and Branch', status as 'Status' FROM kswfapplication 
        WHERE (${reqParam.statusString} between ? AND ?) AND status =? LIMIT ? OFFSET ?`,
            [reqParam.startDate, reqParam.endDate, reqParam.status, 20, reqParam.offset], (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}
reportdb.getMasterReport = (reqParam) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT applicationId as 'Application ID',name as 'Name',registrationNo as 'Registration Number',
        mobile as 'Mobile number',adhaarNumber as 'Aadhaar Number',address as Address,bankAccNumber as 'Bank Account Number',IFSCcode as 'IFSC Code',
        nameInBank as 'Name in Bank',bankName as 'Name of Bank and Branch', status as 'Status' FROM kswfapplication 
        WHERE (${reqParam.statusString} between ? AND ?) AND district = ? AND status =? LIMIT ? OFFSET ?`,
            [reqParam.startDate, reqParam.endDate, reqParam.districtName, reqParam.status, 20, reqParam.offset], (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

reportdb.getReportExport = (reqParam) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT applicationId as 'Application ID',name as 'Name',registrationNo as 'Registration Number',
        mobile as 'Mobile number',adhaarNumber as 'Aadhaar Number',address as Address,bankAccNumber as 'Bank Account Number',IFSCcode as 'IFSC Code',
        nameInBank as 'Name in Bank',bankName as 'Name of Bank and Branch', status as 'Status' FROM kswfapplication 
        WHERE (${reqParam.statusString} between ? AND ?) AND district = ? AND status = ?`,
            [reqParam.startDate, reqParam.endDate, reqParam.districtName, reqParam.status], (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

module.exports = reportdb;