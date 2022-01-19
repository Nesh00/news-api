const express = require('express');
const apiRouter = require('./routes/api.router');
const {
  handle404Errors,
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require('./errors/errors');
const app = express();

app
  .use(express.json())
  .use('/api', apiRouter)
  .all('*', handle404Errors)
  .use(handlePsqlErrors)
  .use(handleCustomErrors)
  .use(handleServerErrors);

module.exports = app;
