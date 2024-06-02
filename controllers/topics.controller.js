const { fetchTopics, fetchEndpoints, postNewTopic } = require("../models/topics.model");


exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
      res.status(200).send({topics})
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
  .then((endpoints) => {
    res.status(200).send(endpoints)
  })
  .catch(next);
};

exports.postTopic = (req, res, next) => {
  postNewTopic(req.body)
  .then((topic) => {
    res.status(201).send({topic})
  })
  .catch(next);
}
