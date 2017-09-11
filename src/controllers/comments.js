const mongoose = require('mongoose');
const {Comments} = require('../models/models');

exports.getAllCommentsByArticle = (req, res, next) => {
  // get article id
  const { article_id } = req.params;

    // if invalid article_id then return 422
  if (!mongoose.Types.ObjectId.isValid(article_id))
    return next({ status: 422, message: 'Invalid Article Id' });

  // find all comments made against the article
  Comments.find({ belongs_to: article_id })
    .then((comments) => {
      if (comments.length < 1)
        return next({ status: 404, message: 'Comments Not Found' });

      res.status(200).json({ comments });
    })
    .catch(next);
};
