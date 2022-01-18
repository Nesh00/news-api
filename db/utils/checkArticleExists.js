const db = require('../connection');

exports.checkArticleExists = async (article_id) => {
  return await db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
      [article_id]
    )
    .then(({ rows }) => (rows.length ? true : false));
};
