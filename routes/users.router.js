const usersRouter = require('express').Router();
const {getUsers, getUsername} = require("../controllers/users.controller");

usersRouter
.get("", getUsers)
.get("/:username", getUsername)

module.exports = usersRouter;