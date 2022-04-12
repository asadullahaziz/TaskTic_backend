const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

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

// schema virtual obj
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "user"
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

// hide sensitive data from client (toJSON method from a Js object is called by stringify method everytime and its return value is returned)
userSchema.method("toJSON", function() {
    let user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user;
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

// remove user tasks when a user is deleted
userSchema.pre("remove", async function (next) {
    await Task.deleteMany({user: this._id});
    next();
});

module.exports = model("User", userSchema);