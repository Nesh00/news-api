const db = require('../db/connection.js');
const { checkArticleExists } = require('../db/utils/checkArticleExists');

afterAll(() => db.end());

describe('checkArticleExists', () => {
  test('returns true if the article exists', () => {
    checkArticleExists(3).then((exists) => {
      expect(exists).toBe(true);
      return;
    });
  });
  test('returns false if the article does not exist', () => {
    checkArticleExists('456').then((exists) => {
      expect(exists).toBe(false);
      return;
    });
  });
});
