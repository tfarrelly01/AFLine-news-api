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
            done();
          }
        });
    });

  });

});