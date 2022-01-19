exports.sanitazeParams = (req, res, next) => {
  const params = Object.keys(req.params);
  params.forEach(
    (param) => (req.params[param] = req.params[param].toLowerCase().trim())
  );
  next();
};

exports.sanitazeQueries = (queries) => {
  const queryKeys = Object.keys(req.query);
  queryKeys.forEach(
    (queryKey) =>
      (req.query[queryKey] = req.query[queryKey].toLowerCase().trim())
  );

  next();
};
