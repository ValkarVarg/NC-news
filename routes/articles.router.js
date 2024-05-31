const articlesRouter = require('express').Router();
const {getArticle, getAllArticles, getCommentsForArticle, postComment, patchArticle} = require("../controllers/articles.controller")


articlesRouter
.get("", getAllArticles)
.get("/:articleId", getArticle)
.get("/:articleId/comments", getCommentsForArticle)
.post("/:articleId/comments", postComment)
.patch("/:articleId", patchArticle)

module.exports = articlesRouter;