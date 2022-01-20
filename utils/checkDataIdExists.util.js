const db = require('../db/connection');
const format = require('pg-format');

exports.checkDataIdExists = async (dataTable, data_id) => {
  const queryFormat = format(
    `
      SELECT * FROM %s
      WHERE article_id = $1
    `,
    dataTable
  );
  const { rows } = await db.query(queryFormat, [data_id]);

  return rows.length ? true : false;
};
