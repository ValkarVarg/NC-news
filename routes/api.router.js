const apiRouter = require('express').Router();
const {getEndpoints} = require("../controllers/topics.controller");

apiRouter
.get("", getEndpoints)


module.exports = apiRouter;