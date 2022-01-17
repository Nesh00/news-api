const { dropTable } = require('../manage_tables');

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return dropTable(commentData)
    .then(() => dropTable(articleData))
    .then(() => dropTable(userData))
    .then(() => dropTable(topicData));
};

module.exports = seed;
