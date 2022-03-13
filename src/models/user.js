const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tokenSecretKey = "TaskTicSuperSecureSecretKey";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(val) {
            if(!isEmail(val)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Schema Helper Methods
userSchema.static("findByCredentials", async function(email, password) {
    const user = await this.findOne({email});
    
    if(!user) {
        throw new Error("User not found");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch) {
        throw new Error("Incorrect password");
    }
    
    return user;
});

// Model Helper Methods
userSchema.method("generateAuthToken", async function(){
    let token = jwt.sign({ _id: this._id.toString() }, tokenSecretKey);
    this.tokens.push({token});
    await this.save();
    return token;
});

// Schema middle ware
// hashing user password in save and update(if changed)
userSchema.pre("save", async function(next) {
    const user = this;
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

module.exports = model("User", userSchema);