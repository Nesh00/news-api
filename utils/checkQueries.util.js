const db = require('../db/connection');

exports.checkQueries = async (sort_by, order) => {
  const allowedOrderBys = ['ASC', 'DESC'];
  const allowedSortBys = [
    'article_id',
    'title',
    'topic',
    'author',
    'body',
    'votes',
    'created_at',
    'comment_count',
  ];

  return (
    allowedSortBys.includes(sort_by) &&
    allowedOrderBys.includes(order.toUpperCase())
  );
};

exports.checkTopicQuery = async (topic) => {
  const { rows } = await db.query(`SELECT DISTINCT topic FROM articles`);
  const allowedTopics = rows.map((topic) => topic.topic);

  return allowedTopics.includes(topic);
};
