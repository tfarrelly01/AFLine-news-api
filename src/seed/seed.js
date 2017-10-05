/* eslint-disable no-console */
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
require('dotenv').config({ path: `./.${process.env.NODE_ENV}.env` });
// console.log(process.env);
 
const models = require('../models/models');
const userData = require('./data/user_data.js');
const articleData = require('./data/articles.js');
const async = require('async');
const mongoose = require('mongoose');
const log4js = require('log4js');
const logger = log4js.getLogger();
const _ = require('underscore');
const Chance = require('chance');
const chance = new Chance();
const moment = require('moment');
// const DBs = require('../config').DB;

mongoose.connect(process.env.DB_URI, {useMongoClient: true}, (err) => {
  if (!err) {
    logger.info(`connected to database ${process.env.DB_URI}`);
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addUsers,
      addNorthcoderUser,
      addTopics,
      addArticles,
      addComments
    ], (err) => {
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

const addNorthcoderUser = (done) => {
  var userDoc = new models.Users(
    {
      username: 'northcoder',
      name: 'Awesome Northcoder',
      avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
    }
  );
  userDoc.save((err) => {
    if (err) {
      return done(err);
    }
    return done();
  });
};

const addUsers = (done) => {
  logger.info('adding users');
  async.eachSeries(userData, (user, cb) => {
    var userDoc = new models.Users(user);
    userDoc.save((err) => {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }, (error) => {
    if (error) return done(error);
    return done(null);
  });
};

const addTopics = (done) => {
  logger.info('adding topics');
  var topicDocs = [];
  async.eachSeries(['Football', 'Cooking', 'Coding'], (topic, cb) => {
    var topicObj = {
      title: topic,
      slug: topic.toLowerCase()
    };
    var topicDoc = new models.Topics(topicObj);
    topicDoc.save((err, doc) => {
      if (err) {
        logger.error(JSON.stringify(err));
        return cb(err);
      }
      logger.info(JSON.stringify(doc));
      topicDocs.push(topicObj);
      return cb();
    });
  }, (error) => {
    if (error) return done(error);
    return done(null, topicDocs);
  });
};

const addArticles = (topicDocs, done) => {
  logger.info('adding articles');
  // will be a big array of strings
  var docIds = [];
  async.eachSeries(topicDocs, (topic, cb) => {
    var articles = articleData[topic.slug];
    async.eachSeries(userData, (user, cbTwo) => {
      var usersArticle = articles[0];
      usersArticle.created_by = user.username;
      usersArticle.belongs_to = topic.slug;
      usersArticle.votes = _.sample(_.range(2, 11));
      var usersArticleDoc = new models.Articles(usersArticle);
      usersArticleDoc.save((err, doc) => {
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
        usersArticleTwoDoc.save((err, doc2) => {
          if (err) {
            logger.error(JSON.stringify(err));
            return cb(err);
          }
          articles.shift();
          docIds.push(doc2._id);
          return cbTwo();
        });
      });
    }, (error) => {
      if (error) return cb(error);
      return cb(null, docIds);
    });

  }, (error) => {
    if (error) return done(error);
    return done(null, docIds);
  });
};

const addComments = (docIds, done) => {
  logger.info('adding comments');
  async.eachSeries(docIds, (id, cb) => {
    async.eachSeries(_.range(_.sample(_.range(5, 11))), (x, cbTwo) => {
      var comment = {
        body: chance.paragraph({sentences: _.sample(_.range(2, 5))}),
        belongs_to: id,
        created_by: userData[_.sample(_.range(6))].username,
        votes: _.sample(_.range(2, 11)),
        created_at: getRandomStamp()
      };
      var commentDoc = new models.Comments(comment);
      commentDoc.save((err) => {
        if (err) {
          return cb(err);
        }
        return cbTwo();
      });
    }, (error) => {
      if (error) return done(error);
      return cb();
    });

  }, (err) => {
    if (err) return done(err);
    return done();
  });
};

const getRandomStamp = () => {
  return new Date (
    moment().subtract(_.sample(_.range(1,7)), 'days')
    .subtract(_.sample(_.range(1,24)), 'hours')
    .subtract(_.sample(_.range(1,60)), 'minutes')
    .format()
  ).getTime();
};
