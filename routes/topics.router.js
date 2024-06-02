const topicsRouter = require('express').Router();
const {getTopics, postTopic} = require("../controllers/topics.controller");

topicsRouter
.get("", getTopics)
.post("", postTopic)

module.exports = topicsRouter;