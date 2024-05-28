const { fetchArticle } = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
    const id = req.params.articleId
    fetchArticle(id)
    .then((article) => {
    res.status(200).send({article})
    })
    .catch(next);
}