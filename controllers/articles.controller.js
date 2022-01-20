const {
  fetchArticle,
  editArticle,
  fetchArticles,
  fetchCommentsByArticleId,
  insertComment,
} = require('../models/articles.model');
const { checkDataIdExists } = require('../utils/checkDataIdExists.util');
const { extractTopics } = require('../utils/extractTopics.util');
const { extractUsers } = require('../utils/extractUsers.util');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  return checkDataIdExists('articles', article_id)
    .then((articleExists) => {
      if (articleExists) {
        return fetchArticle(article_id).then((selectedArticle) => {
          res.status(200).send({ selectedArticle });
        });
      } else {
        return Promise.reject({ status: 404, message: 'Not Found' });
      }
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return checkDataIdExists('articles', article_id)
    .then((articleExists) => {
      if (articleExists && inc_votes) {
        return editArticle(article_id, inc_votes).then((updatedArticle) =>
          res.status(201).send({ updatedArticle })
        );
      } else {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      }
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  extractTopics()
    .then((topics) => {
      const topicValues = topics.map((topic) => topic.topic);

      if (topicValues.includes(topic)) {
        return fetchArticles(sort_by, order, topic).then((articles) =>
          res.status(200).send({ articles })
        );
      } else {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      }
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return fetchCommentsByArticleId(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  extractUsers()
    .then((users) => {
      if (users.includes(username) && body.length > 0) {
        return insertComment({ article_id, username, body }).then(
          (postedComment) => {
            res.status(201).send({ postedComment });
          }
        );
      } else {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      }
    })
    .catch(next);
};
