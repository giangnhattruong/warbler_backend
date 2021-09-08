// require("dotenv").load();
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");
const secret = process.env.SECRET_KEY;

// make sure the user is logged in - Authentication
// get token from req.headers.authorization
// decodable payload
// verify jwt
module.exports.loginRequired = (req, res, next) => {
    const rawToken = req.headers.authorization; // "Authorization:Bearer <token>"
    if (!rawToken) {
        console.log("pass this")
        return next(new ExpressError("Please login first!", "401"))
    }
    const token = rawToken.split(" ")[1];
    const payload = (err, decoded) => {
        if (!decoded) {
            return next(new ExpressError("Please login first!", "401"));
        } else if (Date.now() > parseInt(decoded.expires)) {
            return next(new ExpressError("Please login again to verify it's you!", "401"));
        }
        return next();
    };
    jwt.verify(token, secret, payload);
}

// make sure we get the correct user - Authorization
// api/users/:userId/messages
// get token from req.headers.authorization
// decodable payload && decoded must equal message's userId
// verify jwt
module.exports.ensureCorrectUser = (req, res, next) => {
    const {userId} = req.params;
    const rawToken = req.headers.authorization;
    if (!rawToken) {
        return next(new ExpressError("You don't have permission!", "401"))
    }
    const token = rawToken.split(" ")[1];
    const payload = (err, decoded) => {
        if (!decoded || decoded.id !== userId) {
            return next(new ExpressError("You don't have permission!", "401"));
        } else if (Date.now() > parseInt(decoded.expires)) {
            return next(new ExpressError("Please login again to verify it's you!", "401"));
        }
        return next();
    };
    jwt.verify(token, secret, payload);
}