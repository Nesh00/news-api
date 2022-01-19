const { removeCommentById } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return removeCommentById(comment_id)
    .then((rowCount) => {
      if (rowCount > 0) {
        res.status(204).end();
      } else {
        return Promise.reject({ status: 404, message: 'Not Found' });
      }
    })
    .catch(next);
};
