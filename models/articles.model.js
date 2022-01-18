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

exports.fetchArticles = async (
  sort_by = 'created_at',
  order = 'DESC',
  topic
) => {
  const allowedSortBys = [
    'article_id',
    'title',
    'topic',
    'author',
    'body',
    'votes',
    'created_at',
    'comment_count',
  ];
  const queryValues = [];

  let queryStr = `
    SELECT articles.*, COUNT(comment_id)::INT AS comment_count
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    JOIN users
    ON articles.author = users.username
    `;

  if (topic) {
    queryValues.push(topic);
    queryStr += `WHERE articles.topic = $1`;
  }

  queryStr += ` 
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order.toUpperCase()}
  `;

  const { rows } = await db.query(queryStr, queryValues);

  return rows;
};
