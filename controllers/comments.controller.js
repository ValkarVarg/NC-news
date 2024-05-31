const {removeComment, updateComment} = require("../models/comments.model");

const {checkExists} = require("../db/seeds/utils.js")

exports.deleteComment = (req, res, next) => {
    const id = req.params.commentId
    removeComment(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

exports.patchComment = (req, res, next) => {
  const id = req.params.commentId
  const votes = req.body
  checkExists("comments", "comment_id", id)
  .then (() => updateComment(votes, id))
  .then((comment) => {
    res.status(200).send({comment});
  })
  .catch(next);
}