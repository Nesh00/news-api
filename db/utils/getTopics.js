const db = require('../connection');

exports.getTopics = async () => {
  const { rows } = await db.query(`SELECT DISTINCT(topic) FROM articles`);

  return rows;
};
