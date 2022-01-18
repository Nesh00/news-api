exports.handle404Errors = (req, res) => {
  res.status(404).send({ message: 'Invalid URL' });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const errCodes = ['23502', '22P02'];
  if (errCodes.includes(err.code)) {
    res.status(400).send({ message: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ message: 'Internal Server Error' });
};
