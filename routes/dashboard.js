const express = require('express');
const dashboardRouter = express.Router();
const db = require('../db/dashboard');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/tokenVerify').verifyToken;
const path = require('path');
const XLSX = require('xlsx');

dashboardRouter.post('/count', verifyToken, (req, res, next) => {
    let results;
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        const roleType = authData.user.role;
        const districtName = authData.user.district_name;
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                if (roleType === 'ADMIN') {
                    results = await db.getDistrictCounts(districtName);
                } else {
                    results = await db.getCounts();
                }
                if (results.length > 0) {
                    res.send({
                        success: true,
                        counts: results[0],
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

dashboardRouter.post('/dtreport', verifyToken, (req, res, next) => {
    let results;
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        const roleType = authData.user.role;
        const districtName = authData.user.district_name;
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                if (roleType === 'STATEADMIN' || roleType === 'SUPERADMIN') {
                    results = await db.getDTReport();
                    if (results.length > 0) {
                        res.send({
                            success: true,
                            data: results,
                        });
                    } else {
                        res.send({
                            success: false
                        });
                    }
                } else {
                    res.sendStatus(403);
                }

            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    });
});

dashboardRouter.post('/agentlist', verifyToken, (req, res, next) => {
    let agents;
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        // const roleType = authData.user.role;
        const districtName = authData.user.district_name;
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                agents = await db.getAgentList(districtName);
                console.log(agents);
                if (agents.length > 0) {
                    res.send({
                        success: true,
                        agents: agents
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

dashboardRouter.post('/exportDistrict', verifyToken, (req, res, next) => {

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        const districtName = req.body.districtName || authData.user.district_name;
        if (err) {
            res.sendStatus(403);
        } else {
            try {
                let wb = XLSX.utils.book_new();
                let results = await db.getDistrictReport(districtName, startDate, endDate);
                if (results.length > 0) {
                    var Heading = [
                        ["Approved applications"],
                        ["Date range", startDate, "to", endDate],
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
                    let down = __dirname + '/public/' + districtName + startDate + "-" + endDate + '.xlsx';
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

module.exports = dashboardRouter;