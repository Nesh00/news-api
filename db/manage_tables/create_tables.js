const db = require('../connection');

exports.createTopicsTable = async () => {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS topics (
      slug TEXT PRIMARY KEY,
      description VARCHAR(250) NOT NULL
    )
  `);
};

exports.createUsersTable = async () => {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      avatar_url TEXT NOT NULL
    )
  `);
};

exports.createArticlesTable = async () => {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      topic TEXT REFERENCES topics(slug) NOT NULL,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.createCommentsTable = async () => {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) NOT NULL,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
