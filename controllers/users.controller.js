const { fetchUsers, fetchUserByUsername } = require('../models/users.model');
const { extractUsers } = require('../utils/extractUsers.util');

exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  return extractUsers()
    .then((users) => {
      if (users.includes(username)) {
        return fetchUserByUsername(username).then((user) => {
          res.status(200).send({ user });
        });
      } else {
        return Promise.reject({ status: 404, message: 'Not Found' });
      }
    })
    .catch(next);
};
