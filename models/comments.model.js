const db = require("../db/connection");

exports.removeComment = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [id])
      .then((result) => {
        if (result.rowCount === 0) {
          return Promise.reject({status: 404, msg: "Not Found"});
        }
        return result;
      });
  };

exports.updateComment =  (newComment, id) => {
  const {inc_votes} = newComment;
  return db.query(`UPDATE comments
                  SET votes = votes + $1
                  WHERE comment_id = $2
                  RETURNING *`, [inc_votes, id])
  .then (({rows}) => {
    return rows[0]})
}