const format = require('pg-format');
const db = require('../db/connection');

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

exports.removeCommentById = async (comment_id) => {
  const { rowCount } = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1;`,
    [comment_id]
  );

  return rowCount;
};

exports.editCommentById = async (comment_id, newVotes = 0, body) => {
  let queryStr = `UPDATE comments
  SET `;
  const queryValues = [];
  queryValues.push(comment_id);

  queryValues.push(newVotes);
  queryStr += `votes = votes + $2`;

  if (body) {
    queryValues.push(body);
    queryStr += `, body = $3`;
  }

  queryStr += `
  WHERE comment_id = $1
  RETURNING *;
  `;

  const { rows } = await db.query(queryStr, queryValues);

  return rows[0];
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
