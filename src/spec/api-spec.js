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

});