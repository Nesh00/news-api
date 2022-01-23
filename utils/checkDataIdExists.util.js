const db = require('../db/connection');
const format = require('pg-format');

exports.checkDataIdExists = async (dataTable, column_id, data_id) => {
  const queryFormat = format(
    `
      SELECT * FROM %s
      WHERE ${column_id} = $1
    `,
    dataTable
  );
  const rows = await db.query(queryFormat, [data_id]);

  return rows.rowCount;
};
