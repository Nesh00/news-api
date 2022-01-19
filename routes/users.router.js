const express = require('express');
const {
  getUsers,
  getUserByUsername,
} = require('../controllers/users.controller');
const { sanitazeParams } = require('../utils/sanitazeParams.util');
const usersRouter = express.Router();

usersRouter.route('/').get(getUsers);

usersRouter.route('/:username').all(sanitazeParams).get(getUserByUsername);

module.exports = usersRouter;
