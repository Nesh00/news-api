const db = require('../connection');
const format = require('pg-format');

exports.dropTable = (table_name) => {
  return db.query(`DROP TABLE IF EXISTS ${table_name}`);
};

exports.createTopicsTable = () => {
  return db.query(`
    CREATE TABLE IF NOT EXISTS topics (
      slug TEXT NOT NULL PRIMARY KEY,
      description VARCHAR(250) NOT NULL,
    )
  `);
};

exports.createUsersTable = () => {
  return db.query(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      avatar_url TEXT NOT NULL
    )
  `);
};
