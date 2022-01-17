const db = require('../connection');

exports.dropTable = (table_name) => {
  return db.query(`DROP TABLE IF EXISTS ${table_name}`);
};
