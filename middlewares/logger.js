module.exports.log = function (req, res, next) {
    let url = req.originalUrl;
    let date = new Date();
    console.log(`called ${url} on ${date}`);
    next();
}

