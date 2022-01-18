const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getArticle } = require('./controllers/articles.controller');
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

app.all('*', handle404Errors);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
