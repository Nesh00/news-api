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
