const {User} = require("../models");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

module.exports.signin = async (req, res, next) => {
    // finding a user
    // checking if their password matches what was sent to the server
    // if it all matches
        ///log them in
    try {
        let {email, password} = req.body;
        email = email.toLowerCase();
        const user = await User.findOne({email});
        if (!user) {
            return next(new ExpressError("Incorrect username or password! Please try again.", "400"))
        }
        const {id, username, profileImageUrl} = user;
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ExpressError("Incorrect username or password! Please try again.", "400"))
        }
        const token = await user.createToken();
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        });
    } catch(err) {
        return next(new ExpressError("Something went wrong! Please try again.", "400"))
    }
};

module.exports.signup = async (req, res, next) => {
    try {
        // create a user
        // create a token (singin a token)
        // process.env.SECRET_KEY
        let {email, username, password, profileImageUrl} = req.body;
        email = email.toLowerCase();
        username = username.toLowerCase();
        const user = new User({email, username, password, profileImageUrl});
        await user.save();
        const {id} = user;
        const token = await user.createToken();
        return res.status(200).json({
            id,
            username,
            profileImageUrl,
            token
        })
    } catch(err) {
        // for specific error, we do not want to use wrapAsync
        // see what kind of error
        // if it is  a certain error
        // response with username/email already taken
        // otherwise just send back a generic 400
        //if a validation fails! err.code === 11000
        if(err.code === 11000) {
            err.message = "Sorry, that username and/or email is taken.";
        }
        return next(new ExpressError(err.message, "400"));
    }
}