const db = require('../db/connection');

exports.fetchUsers = async () => {
  const { rows } = await db.query(`SELECT username FROM users`);

  return rows;
};

exports.fetchUserByUsername = async (username) => {
  const { rows } = await db.query(
    `
    SELECT username, name, avatar_url FROM users
    WHERE username = $1;
    `,
    [username]
  );

  return rows[0];
};
