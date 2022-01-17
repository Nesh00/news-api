const db = require('../connection');

exports.createTopicsTable = () => {
  return db.query(`
    CREATE TABLE IF NOT EXISTS topics (
      slug TEXT NOT NULL UNIQUE,
      description VARCHAR(250) NOT NULL
    )
  `);
};

exports.createUsersTable = () => {
  return db.query(`
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      avatar_url TEXT NOT NULL
    )
  `);
};

exports.createArticlesTable = () => {
  return db.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      topic TEXT REFERENCES topics(slug) NOT NULL,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

exports.createCommentsTable = () => {
  return db.query(`
    CREATE TABLE IF NOT EXISTS comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      article_id INT REFERENCES articles(article_id) NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    )
  `);
};
