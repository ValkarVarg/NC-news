const { fetchArticle, fetchAllArticles } = require("../models/articles.model");

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