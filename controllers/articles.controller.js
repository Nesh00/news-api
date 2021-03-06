const {
  fetchArticles,
  fetchArticleById,
  editArticle,
  insertArticle,
} = require('../models/articles.model');
const { checkDataIdExists } = require('../utils/checkDataIdExists.util');
const { checkQueries } = require('../utils/checkQueries.util');

exports.getArticles = (req, res, next) => {
  const { sort_by = 'created_at', order = 'DESC', topic } = req.query;

  return checkQueries(sort_by, order, topic)
    .then((ifTrue) => {
      if (ifTrue) {
        return fetchArticles(sort_by, order, topic).then((articles) => {
          if (articles.length === 0) {
            return Promise.reject({ status: 404, message: 'Not Found' });
          }
          res.status(200).send({ articles });
        });
      } else {
        return Promise.reject({ status: 400, message: 'Bad Request' });
      }
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body } = req.body;

  return insertArticle({ title, topic, author, body })
    .then((article) => res.status(201).send({ article }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return checkDataIdExists('articles', 'article_id', article_id)
    .then((articleExists) => {
      if (articleExists) {
        return fetchArticleById(article_id).then((article) => {
          res.status(200).send({ article });
        });
      } else {
        return Promise.reject({ status: 404, message: 'Not Found' });
      }
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { title, topic, body, inc_votes } = req.body;

  return checkDataIdExists('articles', 'article_id', article_id)
    .then((articleExists) => {
      if (articleExists) {
        return editArticle(article_id, title, topic, body, inc_votes).then(
          (article) => res.status(201).send({ article })
        );
      } else {
        return Promise.reject({ status: 404, message: 'Not Found' });
      }
    })
    .catch(next);
};
