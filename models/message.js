const mongoose = require("mongoose");
const {Schema} = mongoose;
const User = require("./user");

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
        maxlength: 160
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true})

messageSchema.pre("remove", async function(next) {
    // find a user
    // remove the id of the message from their messages list
    // save user and return next
    try {
        const user = await User.findById(this.user);
        user.messages.remove(this.id);
        await user.save();
        return next();
    } catch(err) {
        return next(err);
    }
})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;