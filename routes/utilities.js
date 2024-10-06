const express = require('express');
const utilityRouter = express.Router();
const db = require('../db/utilities');

utilityRouter.get('/district', async (req, res, next) => {
    try {
        let results = await db.disctricts();
        res.status(200).json({
            success: true,
            district: results,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            error: e
        })
    }
});

utilityRouter.get('/onecertificate', async (req, res, next) => {
    try {
        res.download('./public-data/circular.pdf')
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            error: e
        })
    }
});

utilityRouter.get('/taluk/:districtId', async (req, res, next) => {
    const districtId = req.params.districtId;
    try {
        let results = await db.taluks(districtId);
        res.send({
            success: true,
            taluk: results
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            error: e
        })
    }
})

utilityRouter.get('/village/:talukId', async (req, res, next) => {
    const talukId = req.params.talukId;
    try {
        let results = await db.villages(talukId);
        res.send({
            success: true,
            village: results
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

module.exports = utilityRouter;