const { checkArticleExists } = require('../db/utils/checkArticleExists');
const { fetchArticle } = require('../models/articles.model');

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
