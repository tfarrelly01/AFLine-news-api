const models = require('../models/models');
const userData = require('./data/user_data.js');
const async = require('async');
const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger();
const DBs = require('../config').DB;

mongoose.connect(DBs.dev, function (err) {
  if (!err) {
    logger.info(`connected to database ${DBs.dev}`);
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addUsers,
      addAflineUser
    ], function (err) {
      if (err) {
        logger.error('ERROR SEEDING :O');
        console.log(JSON.stringify(err));
        process.exit();
      }
      logger.info('DONE SEEDING!!');
      process.exit();
    });
  } else {
    logger.error('DB ERROR');
    console.log(JSON.stringify(err));
    process.exit();
  }
});

function addAflineUser(done) {
  var userDoc = new models.Users(
    {
      username: 'afline',
      name: 'AF Line Ltd',
      avatar_url: 'https://www.linkedin.com/in/tfarrelly01'
    }
  );
  userDoc.save(function (err) {
    if (err) {
      return done(err);
    }
    return done();
  });
}

function addUsers(done) {
  logger.info('adding users');
  async.eachSeries(userData, function (user, cb) {
    var userDoc = new models.Users(user);
    userDoc.save(function (err) {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }, function (error) {
    if (error) return done(error);
    return done(null);
  });
}