const db = require('../db/connection');
const { extractTopics } = require('../utils/extractTopics.util');
const { checkArticleExists } = require('../utils/checkArticleExists.util');
const {
  formatTopic,
  formatUser,
  formatArticle,
  formatComment,
} = require('../utils/format_table-seeding.util.js');

afterAll(() => db.end());

describe('Seeding util functions', () => {
  test('formatTopic', () => {
    const testTopic = {
      description: 'The man, the Mitch, the legend',
      slug: 'mitch',
    };
    expect(formatTopic(testTopic)).toEqual([
      'mitch',
      'The man, the Mitch, the legend',
    ]);
  });
  test('formatUser', () => {
    const testUser = {
      username: 'butter_bridge',
      name: 'jonny',
      avatar_url:
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
    };

    expect(formatUser(testUser)).toEqual([
      'butter_bridge',
      'jonny',
      'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
    ]);
  });
  test('formatArticle', () => {
    const testArticle = {
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: new Date(1594329060000),
      votes: 100,
    };

    expect(formatArticle(testArticle)).toEqual([
      'Living in the shadow of a great man',
      'mitch',
      'butter_bridge',
      'I find this existence challenging',
      100,
      expect.any(Date),
    ]);
  });
  test('formatComment', () => {
    const testComment = {
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 16,
      author: 'butter_bridge',
      article_id: 9,
      created_at: new Date(1586179020000),
    };

    expect(formatComment(testComment)).toEqual([
      9,
      'butter_bridge',
      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      16,
      expect.any(Date),
    ]);
  });
});

describe('checkArticleExists', () => {
  test('returns true if the article exists', () => {
    checkArticleExists(3).then((exists) => {
      expect(exists).toBe(true);
    });
  });
  test('returns false if the article does not exist', () => {
    checkArticleExists('456').then((exists) => {
      expect(exists).toBe(false);
    });
  });
});

describe('extractTopics', () => {
  test('should return an array of objects with no duplicate property values', () => {
    const testTopics = [
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: new Date(1596464040000),
        votes: 0,
      },
      {
        title: 'A',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Delicious tin of cat food',
        created_at: new Date(1602986400000),
        votes: 0,
      },
      {
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: new Date(1602419040000),
        votes: 0,
      },
    ];
    extractTopics(testTopics).then((topics) => {
      expect(topics).toEqual([{ topic: 'mitch' }, { topic: 'cats' }]);
    });
  });
});
