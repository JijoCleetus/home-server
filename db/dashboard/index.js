const pool = require('../index.js').mysql_pool;

let dashboarddb = {};

dashboarddb.getCounts = () => {
    return new Promise((resolve, reject) => {
        pool.query(`select COUNT(*) as 'total', 
        SUM(status='submitted') as 'submitted',
        SUM(status='resubmitted') as 'resubmitted',
        SUM(status='rejected') as 'rejected',
        SUM(status='approved') as 'approved',
        SUM(status='sendtobank') as 'sendtoBank'
        from kswfapplication`, (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

dashboarddb.getDTReport = () => {
    return new Promise((resolve, reject) => {
        pool.query(`select district, 
        SUM(status='submitted') as 'submitted',
        SUM(status='resubmitted') as 'resubmitted',
        SUM(status='rejected') as 'rejected',
        SUM(status='approved') as 'approved',
        SUM(status='sendtobank') as 'sendtoBank'
        from kswfapplication group by district`, (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

dashboarddb.getDistrictCounts = (districtName) => {
    return new Promise((resolve, reject) => {
        pool.query(`select COUNT(*) as 'total', 
        SUM(status='submitted') as 'submitted',
        SUM(status='resubmitted') as 'resubmitted',
        SUM(status='rejected') as 'rejected',
        SUM(status='approved') as 'approved',
        SUM(status='sendtobank') as 'sendtoBank'
        from kswfapplication WHERE district = ?`, districtName, (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

dashboarddb.getDistrictReport = (districtName, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT applicationId as 'Application ID',name as 'Name',registrationNo as 'Registration Number',
        mobile as 'Mobile number',adhaarNumber as 'Aadhaar Number',address as Address,bankAccNumber as 'Bank Account Number',IFSCcode as 'IFSC Code',
        nameInBank as 'Name in Bank',bankName as 'Name of Bank and Branch', status as 'Status' FROM kswfapplication 
        WHERE (approvedDate between ? AND ?) AND district = ? AND status =?`,
            [startDate, endDate, districtName, 'approved'], (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

dashboarddb.getAgentList = (districtName, role) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT name as 'agentName',username as userName FROM admin 
        WHERE district_name = ? AND role =?`,
            [districtName, 'AGENT'], (err, results) => {
                if (err) {
                    reject(err);
                }
                return resolve(results)
            })
    })
}

module.exports = dashboarddb;