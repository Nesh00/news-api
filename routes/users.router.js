const express = require('express');
const {
  getUsers,
  getUserByUsername,
  addUser,
} = require('../controllers/users.controller');
const { sanitazeParams } = require('../utils/sanitazeParams.util');
const usersRouter = express.Router();

usersRouter.route('/').get(getUsers).post(addUser);

usersRouter.route('/:username').all(sanitazeParams).get(getUserByUsername);

module.exports = usersRouter;
