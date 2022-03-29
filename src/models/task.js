const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");

const Task = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    detail: {
        type: String
    },
    created: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: ObjectId,
        required: true
    }
});

module.exports = model("Task", Task);