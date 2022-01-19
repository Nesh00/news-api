const db = require('../db/connection');

exports.extractUsers = async () => {
  const { rows } = await db.query(`SELECT username FROM USERS`);

  return rows.map(({ username }) => username);
};
