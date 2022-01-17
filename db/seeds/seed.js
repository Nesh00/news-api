const { dropTable } = require('../manage_tables/drop_tables');
const {
  createTopicsTable,
  createUsersTable,
  createArticlesTable,
  createCommentsTable,
} = require('../manage_tables/create_tables');

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return dropTable('comments')
    .then(() => dropTable('articles'))
    .then(() => dropTable('users'))
    .then(() => dropTable('topics'))
    .then(() => createTopicsTable())
    .then(() => createUsersTable())
    .then(() => createArticlesTable())
    .then(() => createCommentsTable());
};

module.exports = seed;
