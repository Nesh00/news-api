const express = require('express');
const apiRouter = express.Router();
const endpoints = require('../endpoints.json');
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');

apiRouter
  .get((req, res, next) => {
    res.send(endpoints);
  })
  .use('/topics', topicsRouter)
  .use('/articles', articlesRouter)
  .use('/comments', commentsRouter);

module.exports = apiRouter;
