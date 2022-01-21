const express = require('express');
const apiRouter = express.Router();
const endpoints = require('../endpoints.json');
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router');

apiRouter
  .get('/', (req, res) => {
    res.status(200).send(endpoints);
  })
  .use('/topics', topicsRouter)
  .use('/articles', articlesRouter)
  .use('/comments', commentsRouter)
  .use('/users', usersRouter);

module.exports = apiRouter;
