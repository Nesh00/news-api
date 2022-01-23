const { fetchUsers, fetchUserByUsername } = require('../models/users.model');
const { checkDataIdExists } = require('../utils/checkDataIdExists.util');

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  return checkDataIdExists('users', 'username', username)
    .then((rowCount) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, message: 'Not Found' });
      } else if (rowCount === 0) {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      } else {
        return fetchUserByUsername(username).then((user) => {
          res.status(200).send({ user });
        });
      }
    })
    .catch(next);
};
