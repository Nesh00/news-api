const db = require('../db/connection');

exports.dropTable = (table_name) => {
  return db.query(`DROP TABLE IF EXISTS ${table_name}`);
};
