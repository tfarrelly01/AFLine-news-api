process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const server = require('../server');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
const config = require('../config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;

describe('API', function () {
  let usefullIds;
  before((done) => {
    mongoose.connection.dropDatabase()
      .then(() => saveTestData(db, function (err, ids) {
        if (err) throw err;
        usefullIds = ids;
        console.log(usefullIds);
        done();
      }));
  });

  describe('GET /', function () {
    it('responds with status code 200', function (done) {
      console.log(usefullIds);
      request(server)
        .get('/')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            done();
          }
        });
    });
  });

  describe('GET /api/topics', function () {
    it('responds with all topics', function (done) {
      request(server)
        .get('/api/topics')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.topics.length).to.equal(3);
            done();
          }
        });
    });
  });  

  describe('GET /api/topics/:topic_id/articles', function () {
    it('responds with all articles for a particular topic', function (done) {
      request(server)
        .get('/api/topics/cats/articles')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.articles[0].belongs_to).to.equal('cats');
            expect(res.body.articles.length).to.equal(1);
            expect(res.body.articles[0].title).to.equal('Cats are great');
            expect(res.body.articles[0].comments).to.equal(2);
            done();
          }
        });
    });

    it('responds with 404 if topic doesnt exist', function (done) {
      request(server)
        .get('/api/topics/cooking/articles')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('No Articles found for topic cooking');
            done();
          }
        });
    });
  });

  describe('GET /api/articles', function () {
    it('responds with all articles', function (done) {
      request(server)
        .get('/api/articles')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articles[0].comments).to.equal(2);
            done();
          }
        });
    });
  });

  describe('GET /api/articles/:article_id', function () {
    it('responds with the article record for a particular article id', function (done) {
      request(server)
        .get(`/api/articles/${usefullIds.article_id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.article.title).to.equal('Cats are great');
            expect(res.body.article.comments).to.equal(2);
            done();
          }
        });
    });

    it('responds with 404 if article doesnt exist', function (done) {
      const articleId = usefullIds.comment_id;
      request(server)
        .get(`/api/articles/${articleId}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Article Not Found');
            done();
          }
        });
    });

    it('responds with 422 if the article id is invalid', function (done) {
      request(server)
        .get('/api/articles/fakeid')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body.message).to.equal('Invalid Article Id');
            done();
          }
        });
    });
  });

  describe('PUT /api/articles/:article_id?vote=[up/down]', function () {
    it('should increment the votes of an article by one', function (done) {
      let articleId = usefullIds.article_id;
      request(server)
        .put(`/api/articles/${articleId}?vote=up`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.article.votes).to.equal(1);
            done();
          }
        });
    });

    it('should decrement the votes of an article by one', function (done) {
      let articleId = usefullIds.article_id;
      request(server)
        .put(`/api/articles/${articleId}?vote=down`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.article.votes).to.equal(0);
            done();
          }
        });
    });

    it('does not decrement the votes of an article if already equal to zero', (done) => {
      let articleId = usefullIds.article_id;
      request(server)
        .put(`/api/articles/${articleId}?vote=down`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.article.votes).to.equal(0);
          }
          done();
        });
    });

    it('responds with 404 if article doesnt exist', function (done) {
      let articleId = usefullIds.comment_id;
      request(server)
        .put(`/api/articles/${articleId}?vote=down`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Article Not Found');
            done();
          }
        });
    });

    it('responds with 422 if the article id is invalid', function (done) {
      request(server)
        .put('/api/articles/fakeid?vote=up')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body.message).to.equal('Invalid Article Id');
            done();
          }
        });
    });
  });

  describe('GET /api/articles/:article_id/comments', function () {
    it('responds with all comments for a particular article', function (done) {
      request(server)
        .get(`/api/articles/${usefullIds.article_id}/comments`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.comments.length).to.equal(2);
            done();
          }
        });
    });

    it('responds with 404 if article doesnt exist', function (done) {
      const article_id = usefullIds.comment_id;

      request(server)
        .get(`/api/articles/${article_id}/comments`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Comments Not Found');
            done();
          }
        });
    });

    it('responds with 422 if the article id is invalid', function (done) {
      request(server)
        .get('/api/articles/fakeid/comments')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body.message).to.equal('Invalid Article Id');
            done();
          }
        });
    });
  });
  
  describe('POST /api/articles/:article_id/comments', function () {
    it('creates a new comment for a particular article', function (done) {
      request(server)
        .post(`/api/articles/${usefullIds.article_id}/comments`)
        .send({ body: 'test' })
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.comment._id).to.not.equal(undefined);
            expect(res.body.comment.body).to.equal('test');
            done();
          }
        });
    });

    it('provides appropriate error message if article doesnt exist for the comment to be added', function (done) {
      const article_id = usefullIds.comment_id;
      request(server)
        .post(`/api/articles/${article_id}/comments`)
        .send({ body: 'test' })
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Article Not Found, cannot add comment');
            done();
          }
        });
    });

    it('responds with 422 if the article id is invalid', function (done) {
      request(server)
        .post('/api/articles/fakeid/comments')
        .send({ body: 'test' })
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body.message).to.equal('Invalid Article Id, cannot add comment');
            done();
          }
        });
    });
  });

  describe('GET /api/comments', function () {
    it('responds with all comments', function (done) {
      request(server)
        .get('/api/comments')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.comments.length).to.equal(3);
            done();
          }
        });
    });
  });

  describe('GET /api/comments/:comment_id', function () {
    it('responds with the comment record for a particular comment id', function (done) {
      request(server)
        .get(`/api/comments/${usefullIds.comment_id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.comment.body).to.equal('this is a comment');
            expect(res.body.comment.created_by).to.equal('afline');
            done();
          }
        });
    });

    it('responds with 404 if comment doesnt exist', function (done) {
      let commentId = usefullIds.article_id;
      request(server)
        .get(`/api/comments/${commentId}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Comment Not Found');
            done();
          }
        });
    });

    it('responds with 422 if the comment id is invalid', function (done) {
      request(server)
        .get('/api/comments/fakeid/')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Invalid Comment Id');
            done();
          }
        });
    });
  });

  describe('PUT /api/comments/:comment_id?vote=[up/down]', function () {
    it('Increments the vote of a particular comment by one', function (done) {
      request(server)
        .put(`/api/comments/${usefullIds.comment_id}?vote=up`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.comment.votes).to.equal(1);
            done();
          }
        });
    });

    it('Decrements the vote of a particular comment by one', function (done) {
      request(server)
        .put(`/api/comments/${usefullIds.comment_id}?vote=down`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.comment.votes).to.equal(0);
            done();
          }
        });
    });

    it('does not decrement the votes of a comment if already equal to zero', (done) => {
      let commentId = usefullIds.comment_id;
      request(server)
        .put(`/api/comments/${commentId}?vote=down`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.comment.votes).to.equal(0);
          }
          done();
        });
    });

    it('responds with 404 if comment doesnt exist', function (done) {
      const commentId = usefullIds.article_id;
      request(server)
        .put(`/api/comments/${commentId}?vote=down`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('Comment Not Found');
            done();
          }
        });
    });

    it('responds with 422 if the comment id is invalid', function (done) {
      request(server)
        .put('/api/comments/fakeid?vote=up')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body.message).to.equal('Comment Id Invalid');
            done();
          }
        });
    });
  });

  describe('DELETE /comments/:comment_id', function () {
    it('Deletes a comment from the database', function (done) {
      request(server)
        .delete(`/api/comments/${usefullIds.comment_id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Comment deleted!');
            done();
          }
        });
    });

    it('Provides appropriate error message if comment doesnt exist', function (done) {
      request(server)
        .delete(`/api/comments/${usefullIds.comment_id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Comment doesnt exist!');
            done();
          }
        });
    });

    it('responds with 422 if the comment id is invalid', function (done) {
      request(server)
        .delete('/api/comments/fakeid')
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).to.equal(422);
            expect(res.body.message).to.equal('Invalid Comment Id');
            done();
          }
        });
    });
  });

});