const db = require('../db/connection');
const format = require('pg-format');
const {
  formatTopic,
  formatUser,
  formatArticle,
} = require('../utils/format-table');

exports.insertIntoTopics = (topicData) => {
  const topicValues = topicData.map(formatTopic);
  const queryFormat = format(
    `
    INSERT INTO topics
    (slug, description)
    VALUES
    %L
    RETURNING *;
    `,
    topicValues
  );

  return db.query(queryFormat);
};

exports.insertIntoUsers = (userData) => {
  const userValues = userData.map(formatUser);
  const queryFormat = format(
    `
    INSERT INTO users
    (username, name, avatar_url)
    VALUES
    %L
    RETURNING *;
  `,
    userValues
  );

  return db.query(queryFormat);
};

exports.insertIntoArticles = (articleData) => {
  const articleValues = articleData.map(formatArticle);
  const queryFormat = format(
    `
    INSERT INTO articles
    (title, topic, author, body, created_at, votes)
    VALUES
    %L
    RETURNING *;
    `,
    articleValues
  );

  return db.query(queryFormat);
};
