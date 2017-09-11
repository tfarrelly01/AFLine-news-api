const {Comments} = require('../models/models');

exports.getAllCommentsByArticle = (req, res, next) => {
  // get article id
  const { article_id } = req.params;

  // find all comments made against the article
  Comments.find({ belongs_to: article_id })
    .then((comments) => {
      if (comments.length < 1)
        return next({ status: 404, message: 'Comments Not Found' });
        
      res.status(200).json({ comments });
    })
    .catch(next);
};