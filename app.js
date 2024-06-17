const express = require("express");
const apiRouter = require("./routes/api.router");
const topicsRouter = require("./routes/topics.router");
const articlesRouter = require("./routes/articles.router");
const commentsRouter = require("./routes/comments.router"); 
const usersRouter = require("./routes/users.router");
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);


app.all('*', (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});


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