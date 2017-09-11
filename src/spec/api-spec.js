process.env.NODE_ENV = 'test';
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

});