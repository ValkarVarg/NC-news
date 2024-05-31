const commentsRouter = require('express').Router();
const {deleteComment, patchComment} = require("../controllers/comments.controller");

commentsRouter
.patch("/:commentId", patchComment)
.delete("/:commentId", deleteComment)

module.exports = commentsRouter;