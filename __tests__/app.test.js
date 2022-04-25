const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
  describe('GET', () => {
    test('reads JSON file and returns it', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
          expect(res.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          );
        });
    });
  });
});

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
          expect(message).toBe('Not Found');
        });
    });
  });
});

describe('/api/articles', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - returns an array of article objects when all queries are passed', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=mitch')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).toBeGreaterThan(0);
          expect(articles).toBeSortedBy('author');

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
    test('SUCCESSFUL REQUEST - returns an array of article objects when both sort_by and order are omitted', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
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
    test('SUCCESSFUL REQUEST - returns an array of article objects sorted by votes(sort_by=votes)', () => {
      return request(app)
        .get('/api/articles?sort_by=votes&order=desc&topic=mitch')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy('votes', { descending: true });
        });
    });
    test('SUCCESSFUL REQUEST - returns an ascending array of article object when order=asc', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=mitch')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy('author', { descending: false });
        });
    });
    test('SUCCESSFUL REQUEST - returns an ascending array of article object when topic=cats', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=cats')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).toBeGreaterThan(0);

          articles.forEach((article) => {
            expect(article.topic).toBe('cats');
          });
        });
    });
    test('SUCCESSFUL REQUEST - returns an array of all the articles when topic is omitted', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=ASC')
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).toBeGreaterThan(0);
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error message when topic does not exist', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=asc&topic=paper')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - if sort_by is invalid return 400 and error message', () => {
      return request(app)
        .get('/api/articles?sort_by=bananas&order=ASC')
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - if order is invalid return 400 and error message', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=bananas')
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
  });
  describe('POST', () => {
    test('SUCCESSFUL REQUEST - adds article in table(articles)', () => {
      return request(app)
        .post('/api/articles')
        .send({
          title: 'New Article',
          topic: 'cats',
          author: 'rogersop',
          body: 'New article body',
        })
        .expect(201)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            article_id: 13,
            title: 'New Article',
            topic: 'cats',
            author: 'rogersop',
            body: 'New article body',
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when title is not defined', () => {
      return request(app)
        .post('/api/articles')
        .send({
          topic: 'cats',
          author: 'rogersop',
          body: 'New article body',
        })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when topic is not defined', () => {
      return request(app)
        .post('/api/articles')
        .send({
          title: 'New Article',
          author: 'rogersop',
          body: 'New article body',
        })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when author is not defined', () => {
      return request(app)
        .post('/api/articles')
        .send({
          title: 'New Article',
          topic: 'cats',
          body: 'New article body',
        })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when body is not defined', () => {
      return request(app)
        .post('/api/articles')
        .send({
          title: 'New Article',
          topic: 'cats',
          author: 'rogersop',
        })
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
          const { article } = res.body;

          expect(article).toMatchObject({
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 100,
          });
        });
    });
    test('SUCCESSFUL REQUEST - will respond with the selected article object even when there are no comments left on that id', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((res) => {
          const { article } = res.body;

          expect(article.comment_count).toBe(0);
          expect(article).toMatchObject({
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: expect.any(String),
            votes: 0,
          });
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
    test('UNSUCCESSFUL REQUEST - if article_id is invalid, respond with 400 and error message', () => {
      return request(app)
        .get('/api/articles/article_id=2')
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
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
          const { article } = res.body;
          expect(article.votes).toBe(140);
        });
    });
    test('SUCCESSFUL REQUEST - decreases the votes in the selected article when inc_votes is < 0, and returns the article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -53 })
        .expect(201)
        .then((res) => {
          const { article } = res.body;
          expect(article.votes).toBe(47);
        });
    });
    test('SUCCESSFUL REQUEST - updates an article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({
          title: 'New Article',
          topic: 'cats',
          body: 'New article body',
        })
        .expect(201)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            article_id: 1,
            title: 'New Article',
            topic: 'cats',
            author: 'butter_bridge',
            body: 'New article body',
            votes: 100,
            created_at: expect.any(String),
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when the id is non-existant', () => {
      return request(app)
        .patch('/api/articles/654')
        .send({ inc_votes: -53 })
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
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

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - returns an array of comments for the given article_id', () => {
      return request(app)
        .get('/api/articles/3/comments?sort_by=author&order=asc')
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments.length).toBe(2);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });
    test('SUCCESSFUL REQUEST - returns an empty array of comments when article_id has no comments', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          expect(comments.length).toBe(0);
          expect(comments).toEqual([]);
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when article_id is undefined', () => {
      return request(app)
        .get('/api/articles//comments')
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when last segment of URL is invalid', () => {
      return request(app)
        .get('/api/articles/3/comment')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when article_id is non-existant', () => {
      return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
  });
  describe('POST', () => {
    test('SUCCESSFUL REQUEST - adds comment in table(comments) with the selected article_id, username and body', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({ username: 'butter_bridge', body: 'Interesting article!' })
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          expect(comment).toMatchObject({
            comment_id: 19,
            article_id: 3,
            author: 'butter_bridge',
            body: 'Interesting article!',
            votes: 0,
            created_at: expect.any(String),
          });

          return db
            .query(`SELECT * FROM comments`)
            .then(({ rows }) => expect(rows).toHaveLength(19));
        });
    });
    test('SUCCESSFUL REQUEST - ignores unnecessary properties', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({
          username: 'butter_bridge',
          body: 'Interesting article!',
          votes: 5,
        })
        .expect(201)
        .then((res) => {
          const { comment } = res.body;
          expect(comment).toMatchObject({
            comment_id: 19,
            article_id: 3,
            author: 'butter_bridge',
            body: 'Interesting article!',
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when article_id is undefined', () => {
      return request(app)
        .post('/api/articles//comments')
        .send({ username: 'butter_bridge', body: 'Interesting article!' })
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when article_id is invalid', () => {
      return request(app)
        .post('/api/articles/article_id=1/comments')
        .send({ username: 'butter_bridge', body: 'Interesting article!' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when username dont match users table', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({ username: 'butter_bri', body: 'Interesting article!' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when body is empty', () => {
      return request(app)
        .post('/api/articles/3/comments')
        .send({ username: 'butter_bridge', body: '' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when last URL segment is incorrect', () => {
      return request(app)
        .post('/api/articles/3/comment')
        .send({ username: 'butter_bri', body: 'Interesting article!' })
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    test('SUCCESSFUL REQUEST - removes selected comment_id and returns no content', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(() => {
          return db
            .query(
              `
              SELECT * FROM comments
              WHERE comment_id = 1;`
            )
            .then(({ rows }) => expect(rows).toEqual([]));
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error and message when the comment_id is valid but non-existant', () => {
      return request(app)
        .delete('/api/comments/100')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error when the comment_id is invalid', () => {
      return request(app)
        .delete('/api/comments/comment_id=1')
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
  });
  describe('PATCH', () => {
    test('SUCCESSFUL REQUEST - increases the votes in the selected comment when inc_votes is > 0, and returns the comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 40 })
        .expect(200)
        .then((res) => {
          const { comment } = res.body;
          expect(comment.votes).toBe(56);
        });
    });
    test('SUCCESSFUL REQUEST - decreases the votes in the selected comment when inc_votes is < 0, and returns the comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: -53 })
        .expect(200)
        .then((res) => {
          const { comment } = res.body;
          expect(comment.votes).toBe(-37);
        });
    });
    test('SUCCESSFUL REQUEST - will not affect comment, when an empty body is sent', () => {
      return request(app)
        .patch('/api/comments/1')
        .send()
        .expect(200)
        .then((res) => {
          const { comment } = res.body;
          expect(comment.votes).toBe(16);
        });
    });
    test('SUCCESSFUL REQUEST - will update the comment body, when new comment is sent', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ body: 'new comment' })
        .expect(200)
        .then((res) => {
          const { comment } = res.body;
          expect(comment.votes).toBe(16);
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when the id is non-existent', () => {
      return request(app)
        .patch('/api/comments/654')
        .send({ inc_votes: -53 })
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when the id is invalid', () => {
      return request(app)
        .patch('/api/comments/comment_id=1')
        .send({ inc_votes: -53 })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns an error status & message, when an inc_votes value is not a number', () => {
      return request(app)
        .patch('/api/comments/comment_id=1')
        .send({ inc_votes: 'ten' })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - returns array of objects with property username', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
          const { users } = res.body;
          expect(users.length).toBeGreaterThan(0);

          users.forEach((user) => {
            expect(user).toMatchObject({ username: expect.any(String) });
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - returns error and message', () => {
      return request(app)
        .get('/api/user')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
  });
  describe('POST', () => {
    test('SUCCESSFUL REQUEST - adds new user to users table', () => {
      return request(app)
        .post('/api/users')
        .send({
          username: 'cyclop',
          name: 'luke',
          avatar_url:
            'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        })
        .expect(201)
        .then((res) => {
          const { user } = res.body;
          expect(user).toMatchObject({
            username: 'cyclop',
            name: 'luke',
            avatar_url:
              'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - returns error message when username is undefined', () => {
      return request(app)
        .post('/api/users')
        .send({
          name: 'luke',
          avatar_url:
            'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns error message when name is undefined', () => {
      return request(app)
        .post('/api/users')
        .send({
          username: 'cyclop',
          avatar_url:
            'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
    test('UNSUCCESSFUL REQUEST - returns error message when avatar_url is undefined', () => {
      return request(app)
        .post('/api/users')
        .send({
          username: 'cyclop',
          name: 'luke',
        })
        .expect(400)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Bad Request');
        });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    test('SUCCESSFUL REQUEST - returns object from the selected username', () => {
      return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then((res) => {
          const { user } = res.body;
          expect(user).toEqual({
            username: 'rogersop',
            name: 'paul',
            avatar_url:
              'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
          });
        });
    });
    test('UNSUCCESSFUL REQUEST - username is non-existent but still valid, respond with 404 and error message', () => {
      return request(app)
        .get('/api/users/rogersopp')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
    test('UNSUCCESSFUL REQUEST - username is invalid, respond with 400 and error message', () => {
      return request(app)
        .get('/api/users/username=john')
        .expect(404)
        .then((res) => {
          const { message } = res.body;
          expect(message).toBe('Not Found');
        });
    });
  });
});
