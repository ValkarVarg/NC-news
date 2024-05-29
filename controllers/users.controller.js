const { fetchUsers } = require("../models/users.model");

const { checkExists } = require("../db/seeds/utils.js");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
