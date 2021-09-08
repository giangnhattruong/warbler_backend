const {User, Message} = require("../models");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.getAllMessages = wrapAsync(async (req, res, next) => {
    const messages = await Message.find({})
        .sort({createdAt: "desc"})
        .populate("user", {
            username: true,
            profileImageUrl: true
        });
    res.status(200).json(messages);
})

// POST /api/user/:userID/messages
// create message, pass userId into message.user
// find that user
// push the new message to that user.messages and save user
// find and populate the new message with user, username, profileImageUrl then return json
module.exports.createMessage = wrapAsync(async (req, res, next) => {
    const {text} = req.body;
    const {userId} = req.params;
    const message = await Message.create({
        text,
        user: userId
    });
    const foundUser = await User.findById(userId);
    foundUser.messages.push(message._id);
    await foundUser.save();
    const foundMessage = await Message.findById(message._id).populate(
        "user",
        {
            username: true,
            profileImageUrl: true
        }
    );
    res.status(200).json(foundMessage);
})

// GET /api/users/:userId/messages/:messageId
module.exports.getMessage = wrapAsync(async (req, res, next) => {
    const {messageId} = req.params;
    const message = await Message.findById(messageId);
    res.status(200).json(message);
})

// GET /api/users/:userId/messages/:messageId
// we can't use findByIdAndDelete in this situation
// const message = await Message.findByIdAndDelete(messageId);
// because we make a messageSchema.pre("remove", //remove message from user)
// so we must find the message and remove it manually
module.exports.deleteMessage = wrapAsync(async (req, res, next) => {
    const {messageId} = req.params;
    const message = await Message.findById(messageId);
    await message.remove();
    res.status(200).json(message);
})