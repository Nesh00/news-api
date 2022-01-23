const db = require('../db/connection');

exports.removeCommentById = async (comment_id) => {
  const { rowCount } = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1;`,
    [comment_id]
  );

  return rowCount;
};

exports.editCommentById = async (comment_id, newVotes = 0) => {
  const { rows } = await db.query(
    `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
    `,
    [newVotes, comment_id]
  );
  return rows[0];
};
