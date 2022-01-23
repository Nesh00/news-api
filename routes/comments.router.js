const express = require('express');
const commentsRouter = express.Router();
const {
  getComments,
  deleteCommentById,
  patchCommentById,
} = require('../controllers/comments.controller');
const { sanitazeParams } = require('../utils/sanitazeParams.util');

commentsRouter.route('/').get(getComments);

commentsRouter
  .route('/:comment_id')
  .all(sanitazeParams)
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
