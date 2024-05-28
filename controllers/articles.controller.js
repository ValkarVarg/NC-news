const { fetchArticle, fetchAllArticles, fetchCommentsForArticle } = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
    const id = req.params.articleId
    fetchArticle(id)
    .then((article) => {
    res.status(200).send({article})
    })
    .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
        })
        .catch(next);
}

exports.getCommentsForArticle = (req, res, next) => {
    const id = req.params.articleId
    fetchCommentsForArticle(id)
    .then((comments) => {
        res.status(200).send({comments})
        })
        .catch(next);
}