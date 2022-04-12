const mongoose = require("mongoose");

const Task = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

module.exports = mongoose.model("Task", Task);