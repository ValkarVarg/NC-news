const db = require("../db/connection");

function fetchArticle(id) {
  return db
    .query(
      `SELECT a.*, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

exports.fetchAllArticles = async (query) => {
  const allowedQueries = ["topic", "sort_by", "order", "limit", "p"];
  const allowedColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const allowedOrder = ["ASC", "DESC"];
  const order = query.order || "DESC";
  const limit = Number(query.limit) || 10;
  const page = query.p - 1 || 0;

  if (query.order && !allowedOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (
    query &&
    Object.keys(query).length &&
    !allowedQueries.includes(Object.keys(query)[0])
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (query.sort_by && !allowedColumns.includes(query.sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryString = `
  WITH article_data AS (
    SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    ${query.topic ? `WHERE ${Object.keys(query)[0]} = $1` : ""}
    GROUP BY a.article_id
  )
  SELECT 
    CAST((SELECT COUNT(*) AS total_count FROM article_data) AS INTEGER) as total_count,
    json_agg(t.*) as articles
  FROM (
    SELECT * FROM article_data
    ${query.sort_by ? `ORDER BY ${query.sort_by}` : `ORDER BY created_at`}
    LIMIT ${limit} OFFSET (${page} * ${limit})
  ) AS t
`;

  const results = await db.query(
    queryString,
    query.topic ? [query[Object.keys(query)[0]]] : []
  );

  if (results.rows[0].articles === null) {
    results.rows[0].articles = [];
  }

  return results.rows[0];
};

exports.fetchCommentsForArticle = (id, queries) => {
  const allowedQueries = ["limit", "p"]
  const limit = Number(queries.limit) || 10;
  const page = queries.p - 1 || 0;

  if (
    queries && Object.keys(queries).length && !allowedQueries.includes(Object.keys(queries)[0])
  ) {return Promise.reject({ status: 400, msg: "Bad Request" });}

  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET (${page} * ${limit})`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.postCommentToArticle = (comment, id) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (newArticle, id) => {
  const { inc_votes } = newArticle;
  return db
    .query(
      `UPDATE articles
                  SET votes = votes + $1
                  WHERE article_id = $2
                  RETURNING *`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.postNewArticle = (article) => {
  const { author, title, body, topic, article_img_url } = article;
  let queryString = `INSERT INTO articles (author, title, body, topic`;
  if (article_img_url) {
    queryString += ", article_img_url";
  }
  queryString += `) VALUES ($1, $2, $3, $4`;
  if (article_img_url) {
    queryString += ", $5";
  }
  queryString += `) RETURNING *;`;

  const params = [author, title, body, topic];
  if (article_img_url) {
    params.push(article_img_url);
  }

  return db.query(queryString, params).then(({ rows }) => {
    const articleId = rows[0].article_id;
    return fetchArticle(articleId);
  });
};

exports.removeArticle = (article) => {
  return db.query(`DELETE FROM comments WHERE article_id = $1;`, [article])
  .then(() => {return db.query(`DELETE FROM articles WHERE article_id = $1;`, [article])})
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({status: 404, msg: "Not Found"});
    }
    return result;
  })
};

exports.fetchArticle = fetchArticle;
