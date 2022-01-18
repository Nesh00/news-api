const {
  fetchArticle,
  editArticle,
  fetchArticles,
} = require('../models/articles.model');
const { checkArticleExists } = require('../db/utils/checkArticleExists');
const { getTopics } = require('../db/utils/getTopics');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  return checkArticleExists(article_id)
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

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return checkArticleExists(article_id)
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

  getTopics()
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
