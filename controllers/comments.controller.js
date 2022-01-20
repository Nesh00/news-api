const {
  removeCommentById,
  editCommentById,
} = require('../models/comments.model');
const { checkDataIdExists } = require('../utils/checkDataIdExists.util');

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

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return checkDataIdExists('comments', comment_id)
    .then((commentExists) => {
      if (commentExists) {
        return editCommentById(comment_id, inc_votes).then((updatedComment) =>
          res.status(201).send({ updatedComment })
        );
      } else {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      }
    })
    .catch(next);
};
