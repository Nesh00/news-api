const express = require('express');
const articlesRouter = express.Router();
const {
  getArticle,
  patchArticle,
  getArticles,
  getCommentsByArticleId,
  postComment,
} = require('../controllers/articles.controller');

articlesRouter.route('/').get(getArticles);

articlesRouter.route('/:article_id').get(getArticle).patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
