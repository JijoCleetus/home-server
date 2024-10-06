const express = require('express');
const pingRouter = express.Router();

pingRouter.get('/', (req, res) => {
    res.send('Pong');
})

module.exports = pingRouter;