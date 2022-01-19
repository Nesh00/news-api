const db = require('../connection');

exports.dropTable = async (table_name) => {
  return await db.query(`DROP TABLE IF EXISTS ${table_name}`);
};
