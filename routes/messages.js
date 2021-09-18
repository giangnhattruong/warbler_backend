const express = require("express");
const router = express.Router({mergeParams: true});
const {createMessage, getMessage, deleteMessage} = require("../controllers/messages");
const {loginRequired, ensureCorrectUser} = require("../middleware/auth");

router.route("/")
    .post(loginRequired, ensureCorrectUser, createMessage);

router.route("/:messageId")
    .get(getMessage)
    .delete(loginRequired, ensureCorrectUser, deleteMessage);

module.exports = router;
