const db = require('../db/connection');
const format = require('pg-format');

exports.fetchArticles = async (sort_by, order, topic) => {
  const queryValues = [];
  const allowedOrderBys = ['ASC', 'DESC'];
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
  const allowedTopics = [
    'coding',
    'football',
    'cooking',
    'mitch',
    'cats',
    'paper',
  ];

  let queryStr = `
    SELECT articles.*, COUNT(comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    JOIN users
    ON articles.author = users.username`;

  if (allowedTopics.includes(topic)) {
    queryValues.push(topic);
    queryStr += `
    WHERE articles.topic = $1`;
  }

  if (
    allowedSortBys.includes(sort_by) &&
    allowedOrderBys.includes(order.toUpperCase())
  ) {
    queryStr += ` 
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order.toUpperCase()}`;
  }

  const { rows } = await db.query(queryStr, queryValues);

  return rows;
};

exports.fetchArticleById = async (article_id) => {
  const { rows } = await db.query(
    `
      SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
      ORDER BY articles.article_id ASC;
    `,
    [article_id]
  );

  return rows[0];
};

exports.editArticle = async (article_id, title, topic, body, inc_votes) => {
  const queryValues = [];
  let queryStr = `
  UPDATE articles
  SET `;

  queryValues.push(article_id);

  if (inc_votes) {
    queryValues.push(inc_votes);
    queryStr += `votes = votes + $2`;
  }

  if (title) {
    queryValues.push(title);
    queryStr += `title = $2,`;
  }

  if (topic) {
    queryValues.push(topic);
    queryStr += `
      topic = $3,`;
  }

  if (body) {
    queryValues.push(body);
    queryStr += `
      body = $4`;
  }

  queryStr += `
  WHERE article_id = $1
  RETURNING *;
  `;

  const { rows } = await db.query(queryStr, queryValues);

  return rows[0];
};

exports.insertArticle = async (articleData) => {
  const articleValues = [Object.values(articleData)];
  const queryFormat = format(
    `
    INSERT INTO articles
    (title, topic, author, body)
    VALUES
    %L
    RETURNING *;
    `,
    articleValues
  );

  const { rows } = await db.query(queryFormat);

  return rows[0];
};
