const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// Create
router.post("/tasks", async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.send(task);
    } catch(error) {
        res.status(500).send(error);
    }
});

// Read
router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        if(!tasks) {
            res.status(400).send({error: "No task found"});
        }
        res.status(200).send(tasks);
    }
    catch(error) {
        res.status(500).send(error);
    }
});

router.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
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
router.patch("/tasks/:id", async (req, res) => {
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
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
router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
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