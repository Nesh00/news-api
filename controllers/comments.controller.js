const {
  removeCommentById,
  editCommentById,
  fetchCommentsByArticleId,
  insertComment,
} = require('../models/comments.model');
const { checkDataIdExists } = require('../utils/checkDataIdExists.util');
const { extractUsers } = require('../utils/extractUsers.util');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by = 'created_at', order = 'DESC' } = req.query;

  return checkDataIdExists('articles', 'article_id', article_id)
    .then((articleExists) => {
      if (articleExists) {
        return fetchCommentsByArticleId(article_id, sort_by, order).then(
          (comments) => {
            res.status(200).send({ comments });
          }
        );
      } else {
        return Promise.reject({ status: 404, message: 'Not Found' });
      }
    })
    .catch(next);
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
  const { inc_votes, body } = req.body;

  return checkDataIdExists('comments', 'comment_id', comment_id)
    .then((rowCount) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, message: 'Not Found' });
      } else if (rowCount === 0) {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      } else {
        return editCommentById(comment_id, inc_votes, body).then((comment) => {
          res.status(200).send({ comment });
        });
      }
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return extractUsers()
    .then((users) => {
      if (users.includes(username) && body.length > 0 && article_id) {
        return insertComment({ article_id, username, body }).then((comment) => {
          res.status(201).send({ comment });
        });
      } else {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      }
    })
    .catch(next);
};
