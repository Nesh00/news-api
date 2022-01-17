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
    article.created_at,
    article.votes,
  ];
};
