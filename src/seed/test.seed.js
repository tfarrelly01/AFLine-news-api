
const async = require('async');

const models = require('../models/models');

const user = new models.Users({
  username: 'afline',
  name: 'AF Line Ltd',
  avatar_url: 'https://www.linkedin.com/in/tfarrelly01'
});

function saveUser(cb) {
  user.save((err) => {
    if (err) cb(err);
    else cb();
  });
}

function saveTestData(DB, cb) {
    async.waterfall([saveUser], (err, ids) => {
      if (err) cb(err);
      else {
        console.log('Test data seeded successfully.');
        cb(null, ids);
      }
    });
}

module.exports = saveTestData;