const express = require("express");


const {getTopics, getEndpoints} = require("./controllers/topics.controller");
const {getArticle, getAllArticles, getCommentsForArticle, postComment, patchArticle} = require("./controllers/articles.controller")
const {deleteComment} = require("./controllers/comments.controller");
const {getUsers} = require("./controllers/users.controller");

const app = express()

app.use(express.json());

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticle)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:articleId/comments", getCommentsForArticle)
app.get("/api/users", getUsers)

app.post("/api/articles/:articleId/comments", postComment)

app.patch("/api/articles/:articleId", patchArticle)

app.delete("/api/comments/:commentId", deleteComment)

app.all('*', (req, res) => {
  res.status(404).send({msg: "Route Not Found"})
    })

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else if (err.code) {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      res.status(500).send({ msg: "Internal Server Error" });
    }
  });

module.exports = app;