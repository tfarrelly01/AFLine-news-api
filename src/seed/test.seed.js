
const async = require('async');

const models = require('../models/models');

const user = new models.Users({
  username: 'afline',
  name: 'AF Line Ltd',
  avatar_url: 'https://www.linkedin.com/in/tfarrelly01'
});

const topics = [
  new models.Topics({ title: 'Football', slug: 'football' }),
  new models.Topics({ title: 'Cooking', slug: 'cooking' }),
  new models.Topics({ title: 'Cats', slug: 'cats' })
];

const articles = [
  new models.Articles({ title: 'Cats are great', body: 'something', belongs_to: 'cats' }),
  new models.Articles({ title: 'Football is fun', body: 'something', belongs_to: 'football' })
];

function saveUser(cb) {
  user.save((err) => {
    if (err) cb(err);
    else cb();
  });
}

function saveTopics(cb) {
  models.Topics.create(topics, (err) => {
    if (err) cb(err);
    else cb();
  });
}

function saveArticles(cb) {
  models.Articles.create(articles, (err, docs) => {
    if (err) cb(err);
    else cb(null, docs);
  });
}

function saveTestData(DB, cb) {
    async.waterfall([saveUser, saveTopics, saveArticles], (err, ids) => {
      if (err) cb(err);
      else {
        console.log('Test data seeded successfully.');
        cb(null, ids);
      }
    });
}

module.exports = saveTestData;