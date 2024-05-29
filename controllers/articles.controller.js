const {
  fetchArticle,
  fetchAllArticles,
  fetchCommentsForArticle,
  postCommentToArticle,
} = require("../models/articles.model");

const {checkExists} = require("../db/seeds/utils.js")

exports.getArticle = (req, res, next) => {
  const id = req.params.articleId;
  fetchArticle(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
  const id = req.params.articleId;
  checkExists("articles", "article_id", id)
  .then(() => fetchCommentsForArticle(id))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const body = req.body;
  const id = req.params.articleId;

  checkExists("articles", "article_id", id)
    .then(() => postCommentToArticle(body, id))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next)
};
