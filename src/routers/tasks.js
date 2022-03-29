const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

// Create
router.post("/tasks", auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            userId: req.user._id
        });
        await task.save();
        res.send(task);
    } catch(error) {
        res.status(500).send(error);
    }
});

// Read
router.get("/tasks", auth, async (req, res) => {
    try {
        const tasks = await Task.find({userId: req.user._id});
        if(!tasks) {
            res.status(400).send({error: "No task found"});
        }
        res.status(200).send(tasks);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, userId: req.user._id});
        if(!task) {
            res.status(400).send({error: "No task found"});
        }
        res.status(200).send(task);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

// Update
router.patch("/tasks/:id", auth, async (req, res) => {
    try{
        const task = await Task.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, req.body, {new: true, runValidators: true});
        if(!task) {
            res.status(400).send({error: "No task found."});
        }
        res.status(200).send(task);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

// Delete
router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, userId: req.user._id});
        if(!task) {
            res.status(400).send({error: "No task found."});
        }
        res.status(200).send(task);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;