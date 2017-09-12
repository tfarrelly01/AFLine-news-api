
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

const saveUser = (cb) => {
  user.save((err) => {
    if (err) cb(err);
    else cb();
  });
};

const saveTopics = (cb) => {
  models.Topics.create(topics, (err) => {
    if (err) cb(err);
    else cb();
  });
};

const saveArticles = (cb) => {
  models.Articles.create(articles, (err, docs) => {
    if (err) cb(err);
    else cb(null, docs);
  });
};

const saveComments = (articlesArray, cb) => {
  const articleId = articlesArray[0]._id;
  const comment = new models.Comments({ body: 'this is a comment', belongs_to: articleId, created_by: 'afline' });
  const comment2 = new models.Comments({ body: 'this is another comment', belongs_to: articleId, created_by: 'afline' });
  models.Comments.create([comment, comment2], err => {
    if (err) cb(err);
    else cb(null, { article_id: articleId, comment_id: comment._id, non_af_line_comment: comment2._id });
  });
};

const saveTestData = (DB, cb) => {
    async.waterfall([saveUser, saveTopics, saveArticles, saveComments], (err, ids) => {
      if (err) cb(err);
      else {
        console.log('Test data seeded successfully.');
        cb(null, ids);
      }
    });
};

module.exports = saveTestData;