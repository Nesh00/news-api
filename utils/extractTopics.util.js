const db = require('../db/connection');

exports.extractTopics = async () => {
  const { rows } = await db.query(`SELECT DISTINCT(topic) FROM articles`);

  return rows;
};
