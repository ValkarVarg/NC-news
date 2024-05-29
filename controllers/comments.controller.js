const {removeComment} = require("../models/comments.model");

const {checkExists} = require("../db/seeds/utils.js")

exports.deleteComment = (req, res, next) => {
    const id = req.params.commentId
    removeComment(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}