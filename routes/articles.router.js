const articlesRouter = require('express').Router();
const {getArticle, getAllArticles, getCommentsForArticle, postComment, patchArticle, postArticle, deleteArticle} = require("../controllers/articles.controller")


articlesRouter
.get("", getAllArticles)
.get("/:articleId", getArticle)
.get("/:articleId/comments", getCommentsForArticle)
.post("", postArticle)
.post("/:articleId/comments", postComment)
.patch("/:articleId", patchArticle)
.delete("/:articleId", deleteArticle)

module.exports = articlesRouter;