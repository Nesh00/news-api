const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const {
  getArticle,
  updateArticle,
  getArticles,
  getCommentsByArticleId,
  addComment,
} = require('./controllers/articles.controller');
const { deleteCommentById } = require('./controllers/comments.controller');
const {
  handle404Errors,
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require('./errors/errors');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);
app.patch('/api/articles/:article_id', updateArticle);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', addComment);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.all('*', handle404Errors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
