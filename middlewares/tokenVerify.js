// format of token
// Authorization: Bearer <access_token>


//verify toekn
function verifyToken(req, res, next) {
    // Get auth header
    const bearerHeader = req.headers['authorization'];
    //check bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        //Forbidden
        res.sendStatus(403);
    }

}
module.exports = {
    verifyToken: verifyToken
};