const express = require('express');
const {
  getArticleById,
  patchArticle,
  getArticles,
  getCommentsByArticleId,
  postComment,
} = require('../controllers/articles.controller');
const { sanitazeParams } = require('../utils/sanitazeParams.util');
const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id')
  .all(sanitazeParams)
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
