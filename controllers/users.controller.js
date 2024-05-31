const { fetchUsers, fetchUsername } = require("../models/users.model");

const { checkExists } = require("../db/seeds/utils.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const param = req.params
  fetchUsername(param)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
