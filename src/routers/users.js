const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create
router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        let token = await user.generateAuthToken();
        res.send({user, token});
    } 
    catch(error) {
        res.status(500).send(error);
    }
});

// Read
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        if(!users) {
            res.status(400).send({error: "No user found"});
        }
        res.status(200).send(users);
    } 
    catch(error) {
        res.status(500).send(error);
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).send({error: "User not found"});
        }
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

// Update
router.patch("/users/:id", async (req, res) => {
    try{
        let user = await User.findById(req.params.id);
        
        if(!user) {
            res.status(400).send({error: "No user found."});
        }
        
        let userUpdatekeys = Object.keys(req.body);
        userUpdatekeys.forEach((key) => user[key] = req.body[key]);
        let updatedUser = await user.save();
        
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        
        res.status(200).send(updatedUser);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

// Delete
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            res.status(400).send({error: "No user found."});
        }
        res.status(200).send(user);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

// Authentication
router.post("/users/login", async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password);
        let token = await user.generateAuthToken();
        res.status(200).send({user, token});
    }
    catch(error) {
        res.status(400).send({error: "Incorrect credendials."});
    }
});

module.exports = router;