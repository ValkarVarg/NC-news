const db = require("../db/connection");

function fetchArticle (id) {
  return db
    .query(`SELECT a.*, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.fetchAllArticles = (query) => {

  const allowedQueries = ["topic", "sort_by", "order"];
  const allowedColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]
  const allowedOrder = ["ASC", "DESC"]
  const order = query.order || 'DESC'
  
  if(query.order && !allowedOrder.includes(order.toUpperCase())) {return Promise.reject({ status: 400, msg: "Bad Request" })}
  

  if (query && Object.keys(query).length && !allowedQueries.includes(Object.keys(query)[0])) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (query.sort_by && !allowedColumns.includes(query.sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" })}
  
  const queryString = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id`;
  
  let preparedQuery = queryString;
  let params = [];
  
  if (query.topic && Object.keys(query).length) {
    const queryKey = Object.keys(query)[0];
    preparedQuery += ` WHERE ${queryKey} = $${params.length+1}`;
    params.push(query[queryKey])
  }
  
  preparedQuery += ` GROUP BY a.article_id`;

  if (query.sort_by && Object.keys(query).length) {
    preparedQuery += ` ORDER BY a.${query.sort_by}`;
  }
  else{preparedQuery += ` ORDER BY a.created_at`}

  preparedQuery += ` ${order}`
  
  return db.query(preparedQuery, params)
    .then(({ rows }) => {
      return rows;
    })
};

exports.fetchCommentsForArticle = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
                    ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.postCommentToArticle = (comment, id) => {
    const {username, body} = comment;
    return db.query(`INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3) RETURNING *;`, [body, username, id])
    .then (({rows}) => {
      return rows[0]})
}

exports.updateArticle = (newArticle, id) => {
  const {inc_votes} = newArticle;
  return db.query(`UPDATE articles
                  SET votes = votes + $1
                  WHERE article_id = $2
                  RETURNING *`, [inc_votes, id])
  .then (({rows}) => {
    return rows[0]})
}

exports.postNewArticle = (article) => {
  const {author, title, body, topic, article_img_url} = article;
  let queryString = `INSERT INTO articles (author, title, body, topic`
  if (article_img_url) {queryString += ', article_img_url'}
  queryString += `) VALUES ($1, $2, $3, $4`
  if (article_img_url) {queryString += ', $5'}
  queryString += `) RETURNING *;`

  const params = [author, title, body, topic]
  if (article_img_url) {params.push(article_img_url)}

  return db.query(queryString, params)
  .then (({rows}) => {
    const articleId = rows[0].article_id
    return fetchArticle(articleId)})
}

exports.fetchArticle = fetchArticle