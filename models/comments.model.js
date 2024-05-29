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