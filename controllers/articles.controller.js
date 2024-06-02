const {
  fetchArticle,
  fetchAllArticles,
  fetchCommentsForArticle,
  postCommentToArticle,
  updateArticle,
  postNewArticle,
  removeArticle
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
  const query = req.query;
  if (query.topic) {
    checkExists("topics", "slug", query.topic)
      .then(() => {
      })
      .catch(next);
  }
  fetchAllArticles(query)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
  const id = req.params.articleId;
  const queries = req.query
  checkExists("articles", "article_id", id)
  .then(() => fetchCommentsForArticle(id, queries))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const body = req.body;
  const id = req.params.articleId;

  if(!req.body.username || !req.body.body) {res.status(400).send({msg : "Bad Request"})}
  
  const username = req.body.username

  const checkArticle = checkExists("articles", "article_id", id)
  const checkUser = checkExists("users", "username", username)

  Promise.all([checkArticle,checkUser])
    .then(() => postCommentToArticle(body, id))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next)
};

exports.patchArticle = (req, res, next) => {
  const body = req.body
  const id = req.params.articleId
  checkExists("articles", "article_id", id)
  .then(() => updateArticle(body, id))
  .then((updatedArticle) => {
    res.status(200).send({ updatedArticle });
  })
  .catch(next)
}

exports.postArticle = (req, res, next) => {
  const body = req.body;

  if(!req.body.author || !req.body.body || !req.body.title || !req.body.topic) {res.status(400).send({msg : "Bad Request"})}
  
  const username = req.body.author
  const topic = req.body.topic

  const checkTopic = checkExists("topics", "slug", topic)
  const checkUser = checkExists("users", "username", username)

  Promise.all([checkTopic,checkUser])
    .then(() => postNewArticle(body))
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next)
};

exports.deleteArticle = (req, res, next) => {
  const id = req.params.articleId
  checkExists("articles", "article_id", id)
  .then (() => {removeArticle(id)})
  .then(() => {res.status(204).send()})
  .catch(next)
}