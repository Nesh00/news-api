const express = require('express');
const commentsRouter = express.Router();
const { deleteCommentById } = require('../controllers/comments.controller');

commentsRouter.route('/:comment_id').delete(deleteCommentById);

module.exports = commentsRouter;
