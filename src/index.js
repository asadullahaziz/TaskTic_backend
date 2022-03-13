// Libs
const express = require("express");
require("./db");
const usersRouter = require("./routers/users");
const tasksRouter = require("./routers/tasks");

// Vals
const app = express();
const port = process.env.PORT || 3000;


// Middle ware
app.use(express.json());

// Routes
app.use(usersRouter);
app.use(tasksRouter);

// Init Server
app.listen(port, () => {
    console.log("server is up on port " + port);
});