const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
  describe('GET', () => {
    test('GOOD REQUEST - if pathname is correct responds with an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics).toHaveLength(3);

          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });
    test('BAD REQUEST - if pathname is wrong responds with a status 404 and error message"', () => {
      return request(app)
        .get('/api/topic')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Invalid URL');
        });
    });
  });
});

describe.only('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('GOOD REQUEST - if article_id is correct, will respond with the selected article object', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
          const { selectedArticle } = res.body;

          expect(selectedArticle).toMatchObject([
            {
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            },
          ]);
        });
    });
    test('BAD REQUEST - article_id non-existant but still valid, respond with 404 and error message', () => {
      return request(app)
        .get('/api/articles/564')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('BAD REQUEST - article_id exists but no comments left on that id, respond with 404 and error message', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((res) => {
          const { selectedArticle } = res.body;
          expect(selectedArticle).toHaveLength(0);
        });
    });
  });
});
