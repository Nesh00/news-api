exports.sanitazeParams = (req, res, next) => {
  const params = Object.keys(req.params);
  params.forEach(
    (param) => (req.params[param] = req.params[param].toLowerCase().trim())
  );
  next();
};
