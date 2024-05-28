const db = require("../db/connection");

exports.fetchArticle = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then (({rows}) => {
        if (rows.length === 0) {return Promise.reject({ status: 404, msg: "Not Found" })}
        return rows[0]})
    }

exports.fetchAllArticles = () => {
    return db.query(
    `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COALESCE(COUNT(c.comment_id), 0) AS total_comments
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`)
    .then(({rows}) => {
        return rows
    })
}