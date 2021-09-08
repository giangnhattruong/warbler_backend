const mongoose = require("mongoose");
const {Schema} = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const jwtExpirationMs = process.env.JWT_EXPIRATION_MS;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
}, {timestamps: true})

userSchema.pre("save", async function(next) {
    try {
        // before save, check if password is modified
        // if not, then leave it alone, other wise hash with bcrypt
        if(!this.isModified("password")) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch(err) {
        return next(err);
    }
})

userSchema.method("comparePassword", async function(candidatePassword, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch(err) {
        return next(err);
    }
})

userSchema.method("createToken", async function() {
    try {
        const expires = Date.now() + parseInt(jwtExpirationMs);
        const payload = {
            id: this.id,
            username: this.username,
            profileImageUrl: this.profileImageUrl,
            expires
        };
        const token = await jwt.sign(payload, secret);
        return token;
    } catch(err) {
        return next(err);
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;