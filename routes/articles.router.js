const express = require('express');
const {
  getArticleById,
  patchArticle,
  postArticle,
  getArticles,
} = require('../controllers/articles.controller');
const {
  getCommentsByArticleId,
  postComment,
} = require('../controllers/comments.controller');
const { sanitazeParams } = require('../utils/sanitazeParams.util');
const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
  .route('/:article_id')
  .all(sanitazeParams)
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .all(sanitazeParams)
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
