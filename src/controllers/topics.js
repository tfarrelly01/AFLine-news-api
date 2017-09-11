const { Topics } = require('../models/models');

exports.getAllTopics = (req, res, next) => {
  Topics.find()
    .then((topics) => {
      if (topics.length < 1)
        return next({ status: 404, message: 'No Topics Found' });

      res.status(200).json({ topics });
    })
    .catch(next);
};