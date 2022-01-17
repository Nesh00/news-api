const db = require('../db/connection');
const format = require('pg-format');
const { formatTopic } = require('../utils/format-table');

exports.insertIntoTopics = (topicData) => {
  const dataValues = topicData.map(formatTopic);

  console.log(dataValues);

  const queryFormat = format(
    `
    INSERT INTO topics
    (slug, description)
    VALUES
    %L
    RETURNING *;
    `,
    dataValues
  );

  return db.query(queryFormat);
};
