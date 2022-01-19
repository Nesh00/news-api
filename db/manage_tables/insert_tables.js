const db = require('../connection');
const format = require('pg-format');
const {
  formatTopic,
  formatUser,
  formatArticle,
  formatComment,
} = require('../../utils/format_table-seeding.util');

exports.insertIntoTopics = async (topicData) => {
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

  return await db.query(queryFormat);
};

exports.insertIntoUsers = async (userData) => {
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

  return await db.query(queryFormat);
};

exports.insertIntoArticles = async (articleData) => {
  const articleValues = articleData.map(formatArticle);
  const queryFormat = format(
    `
    INSERT INTO articles
    (title, topic, author, body, votes, created_at)
    VALUES
    %L
    RETURNING *;
    `,
    articleValues
  );

  return await db.query(queryFormat);
};

exports.insertIntoComments = async (commentData) => {
  const commentValues = commentData.map(formatComment);
  const queryFormat = format(
    `
    INSERT INTO comments
    (article_id, author, body, votes, created_at)
    VALUES
    %L
    RETURNING *;
    `,
    commentValues
  );

  return await db.query(queryFormat);
};
