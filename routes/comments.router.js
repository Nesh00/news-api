const express = require('express');
const commentsRouter = express.Router();
const { deleteCommentById } = require('../controllers/comments.controller');
const { sanitazeParams } = require('../utils/sanitazeParams.util');

commentsRouter
  .route('/:comment_id')
  .all(sanitazeParams)
  .delete(deleteCommentById);

module.exports = commentsRouter;
