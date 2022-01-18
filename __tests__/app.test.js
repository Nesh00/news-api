const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - if pathname is correct responds with an array of topic objects', () => {
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
    test('UNSUCCESSFUL REQUEST - if pathname is wrong responds with a status 404 and error message"', () => {
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

describe('/api/articles', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - returns an array of article objects when all queries are passed', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=ASC&topic=mitch')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test('SUCCESSFUL REQUEST - returns an array of article objects even when sort_by is omitted', () => {
      return request(app)
        .get('/api/articles?order=ASC&topic=mitch')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test('SUCCESSFUL REQUEST - returns an array of article objects even when order is omitted', () => {
      return request(app)
        .get('/api/articles?sort_by=author&topic=mitch')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;

          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when topic is omitted', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=ASC')
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - if article_id is correct, will respond with the selected article object', () => {
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
    test('UNSUCCESSFUL REQUEST - article_id non-existant but still valid, respond with 404 and error message', () => {
      return request(app)
        .get('/api/articles/564')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - article_id exists but no comments left on that id, respond with 404 and error message', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((res) => {
          const { selectedArticle } = res.body;
          expect(selectedArticle).toHaveLength(0);
        });
    });
  });
  describe('PATCH', () => {
    test('SUCCESSFUL REQUEST - increases the votes in the selected article when inc_votes is > 0, and returns the article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 40 })
        .expect(201)
        .then((res) => {
          const { updatedArticle } = res.body;
          expect(updatedArticle.votes).toBe(140);
        });
    });
    test('SUCCESSFUL REQUEST - decreases the votes in the selected article when inc_votes is < 0, and returns the article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -53 })
        .expect(201)
        .then((res) => {
          const { updatedArticle } = res.body;
          expect(updatedArticle.votes).toBe(47);
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when the id is non-existant', () => {
      return request(app)
        .patch('/api/articles/654')
        .send({ inc_votes: -53 })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when the id is invalid', () => {
      return request(app)
        .patch('/api/articles/article_id=1')
        .send({ inc_votes: -53 })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when an empty body is sent', () => {
      return request(app)
        .patch('/api/articles/article_id=1')
        .send()
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when an inc_votes value is not a number', () => {
      return request(app)
        .patch('/api/articles/article_id=1')
        .send({ inc_votes: 'ten' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
  });
});
