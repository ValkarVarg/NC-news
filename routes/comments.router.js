const commentsRouter = require('express').Router();
const {deleteComment} = require("../controllers/comments.controller");

commentsRouter
.delete("/:commentId", deleteComment)

module.exports = commentsRouter;