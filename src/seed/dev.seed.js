const models = require('../models/models');
const userData = require('./data/user_data.js');
const articleData = require('./data/articles.js');
const async = require('async');
const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger();
const _ = require('underscore');
const DBs = require('../config').DB;

mongoose.connect(DBs.dev, function (err) {
  if (!err) {
    logger.info(`connected to database ${DBs.dev}`);
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addUsers,
      addAflineUser,
      addTopics,
      addArticles
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

function addTopics(done) {
  logger.info('adding topics');
  var topicDocs = [];
  async.eachSeries(['Football', 'Cooking', 'Coding'], function (topic, cb) {
    var topicObj = {
      title: topic,
      slug: topic.toLowerCase()
    };
    var topicDoc = new models.Topics(topicObj);
    topicDoc.save(function (err, doc) {
      if (err) {
        logger.error(JSON.stringify(err));
        return cb(err);
      }
      logger.info(JSON.stringify(doc));
      topicDocs.push(topicObj);
      return cb();
    });
  }, function (error) {
    if (error) return done(error);
    return done(null, topicDocs);
  });
}

function addArticles(topicDocs, done) {
  logger.info('adding articles');
  // will be a big array of strings
  var docIds = [];
  async.eachSeries(topicDocs, function (topic, cb) {
    var articles = articleData[topic.slug];
    async.eachSeries(userData, function (user, cbTwo) {
      var usersArticle = articles[0];
      usersArticle.created_by = user.username;
      usersArticle.belongs_to = topic.slug;
      usersArticle.votes = _.sample(_.range(2, 11));
      var usersArticleDoc = new models.Articles(usersArticle);
      usersArticleDoc.save(function (err, doc) {
        if (err) {
          logger.error(JSON.stringify(err));
          return cb(err);
        }
        articles.shift();
        docIds.push(doc._id);
        var usersArticleTwo = articles[0];
        usersArticleTwo.created_by = user.username;
        usersArticleTwo.belongs_to = topic.slug;
        usersArticleTwo.votes = _.sample(_.range(2, 11));
        var usersArticleTwoDoc = new models.Articles(usersArticleTwo);
        usersArticleTwoDoc.save(function (err, doc2) {
          if (err) {
            logger.error(JSON.stringify(err));
            return cb(err);
          }
          articles.shift();
          docIds.push(doc2._id);
          return cbTwo();
        });
      });
    }, function (error) {
      if (error) return cb(error);
      return cb(null, docIds);
    });

  }, function (error) {
    if (error) return done(error);
    return done(null, docIds);
  });
}