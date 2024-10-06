const express = require('express');
const reportRouter = express.Router();
const db = require('../db/report');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/tokenVerify').verifyToken;
const path = require('path');
const XLSX = require('xlsx');

reportRouter.post('/', verifyToken, (req, res, next) => {
    let results;
    let reqParam = {};
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        const roleType = authData.user.role;
        reqParam.districtName = authData.user.district_name;
        reqParam.startDate = req.body.startDate;
        reqParam.endDate = req.body.endDate;
        reqParam.status = req.body.status;
        reqParam.offset = req.body.offset * 20;

        if (req.body.status === 'submitted') {
            reqParam.statusString = 'submittedDate'
        } else if (req.body.status === 'rejected') {
            reqParam.statusString = 'rejectedDate'
        } else if (req.body.status === 'approved') {
            reqParam.statusString = 'approvedDate'
        } else if (req.body.status === 'resubmitted') {
            reqParam.statusString = 'submittedDate'
        } else if (req.body.status === 'sendToBank') {
            reqParam.statusString = 'approvedDate'
        }

        if (err) {
            res.sendStatus(403);
        } else {
            try {
                if (roleType === 'STATEADMIN') {
                    // console.log(reqParam);
                    results = await db.getStateMasterReport(reqParam);
                } else {
                    results = await db.getMasterReport(reqParam);
                }
                if (results.length > 0) {
                    res.send({
                        success: true,
                        applications: results,
                    });
                } else {
                    res.send({
                        success: false
                    });
                }
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    });
});

reportRouter.post('/export', verifyToken, (req, res, next) => {
    let reqParam = {};
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        reqParam.districtName = authData.user.district_name;
        reqParam.startDate = req.body.startDate;
        reqParam.endDate = req.body.endDate;
        reqParam.status = req.body.status;
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                if (req.body.status === 'submitted') {
                    reqParam.statusString = 'submittedDate'
                } else if (req.body.status === 'rejected') {
                    reqParam.statusString = 'rejectedDate'
                } else if (req.body.status === 'approved') {
                    reqParam.statusString = 'approvedDate'
                } else if (req.body.status === 'resubmitted') {
                    reqParam.statusString = 'submittedDate'
                } else if (req.body.status === 'sendToBank') {
                    reqParam.statusString = 'approvedDate'
                }

                let wb = XLSX.utils.book_new();
                let results = await db.getReportExport(reqParam);
                if (results.length > 0) {
                    var Heading = [
                        [req.body.status + " applications"],
                        ["Date range", req.body.startDate, "to", req.body.endDate],
                        ["", ""],
                        ["", ""]
                    ];
                    let ws = XLSX.utils.aoa_to_sheet(Heading);
                    XLSX.utils.sheet_add_json(ws, results, {
                        header: [],
                        skipHeader: false,
                        origin: -1
                    });
                    // let ws = XLSX.utils.json_to_sheet(results);
                    let down = __dirname + '/public/' + reqParam.districtName + "-" + reqParam.status + reqParam.startDate + "-" + reqParam.endDate + '.xlsx';
                    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
                    XLSX.writeFile(wb, down);
                    res.download(down);
                } else {
                    res.send({
                        success: false
                    });
                }
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    });
});

module.exports = reportRouter;