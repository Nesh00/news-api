const {
  fetchComments,
  removeCommentById,
  editCommentById,
} = require('../models/comments.model');
const { checkDataIdExists } = require('../utils/checkDataIdExists.util');

exports.getComments = (req, res, next) => {
  return fetchComments;
};

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

  return checkDataIdExists('comments', 'comment_id', comment_id)
    .then((rowCount) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, message: 'Not Found' });
      } else if (rowCount === 0) {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      } else {
        return editCommentById(comment_id, inc_votes).then((comment) => {
          res.status(200).send({ comment });
        });
      }
    })
    .catch(next);
};
