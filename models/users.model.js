const db = require('../db/connection');
const format = require('pg-format');

exports.fetchUsers = async () => {
  const { rows } = await db.query(`SELECT username FROM users`);

  return rows;
};

exports.createUser = async (username, name, avatar_url) => {
  const queryValues = [username, name, avatar_url];

  const queryFormat = format(
    `
    INSERT INTO users
    (username, name, avatar_url)
    VALUES
    (%L)
    RETURNING *;
    `,
    queryValues
  );

  const { rows } = await db.query(queryFormat);

  return rows[0];
};

exports.fetchUserByUsername = async (username) => {
  const { rows } = await db.query(
    `
    SELECT * FROM users
    WHERE username = $1;
    `,
    [username]
  );

  return rows[0];
};
