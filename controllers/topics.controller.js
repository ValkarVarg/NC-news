
const { fetchTopics, fetchEndpoints } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
      res.status(200).send(topics)
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
  .then((endpoints) => {
    res.status(200).send(endpoints)
  })
  .catch(next);
}