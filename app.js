const express = require("express");

const {getTopics, getEndpoints} = require("./controllers/topics.controller");

const app = express()

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics);






app.use((req, res) => {
    res.status(404).send({ msg: "Not Found" });
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