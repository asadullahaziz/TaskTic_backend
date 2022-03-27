const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    try {
        let token = req.header("authenctication").replace("Bearer ", "");
        console.log(token);
        let decodedToken = jwt.verify(token, "TaskTicSuperSecureSecretKey");
        console.log(decodedToken);
        let user = User.findOne({_id: decodedToken._id, "tokens.token": token});
        
        if(!user) {
            throw new Error("Authentication Error");
        }
        
        req.token = token;
        req.user = user;
        
        next();
    }
    catch (error) {
        res.status(400).error({error});
    }
}

module.exports = auth;