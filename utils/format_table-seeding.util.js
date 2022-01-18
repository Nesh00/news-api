exports.formatTopic = (topic) => {
  return [topic.slug, topic.description];
};

exports.formatUser = (user) => {
  return [user.username, user.name, user.avatar_url];
};

exports.formatArticle = (article) => {
  return [
    article.title,
    article.topic,
    article.author,
    article.body,
    article.votes,
    article.created_at,
  ];
};

exports.formatComment = (comment) => {
  return [
    comment.article_id,
    comment.author,
    comment.body,
    comment.votes,
    comment.created_at,
  ];
};
