const db = require('../db/connection');

exports.fetchArticle = async (article_id) => {
  const { rows } = await db.query(
    `
      SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
      FROM articles
      JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
      ORDER BY articles.article_id ASC;
    `,
    [article_id]
  );

  return rows;
};

exports.editArticle = async (article_id, inc_votes) => {
  const { rows } = await db.query(
    `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `,
    [inc_votes, article_id]
  );

  return rows[0];
};
