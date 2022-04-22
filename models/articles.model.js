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

exports.fetchCommentsByArticleId = async (article_id, sort_by, order) => {
  const allowedSortBys = ['author', 'votes', 'created_at'];
  const allowedOrderBys = ['ASC', 'DESC'];

  let queryStr = `
    SELECT comment_id, author, body, votes, created_at FROM comments
    WHERE article_id = $1
  `;

  if (
    allowedSortBys.includes(sort_by) &&
    allowedOrderBys.includes(order.toUpperCase())
  ) {
    queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()};`;
  }

  const { rows } = await db.query(queryStr, [article_id]);

  return rows;
};

exports.insertComment = async (commentData) => {
  const commentValues = [Object.values(commentData)];
  const queryFormat = format(
    `
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    %L
    RETURNING *;
  `,
    commentValues
  );
  const { rows } = await db.query(queryFormat);

  return rows[0];
};
