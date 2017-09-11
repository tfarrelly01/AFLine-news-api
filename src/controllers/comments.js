const mongoose = require('mongoose');
const {Articles, Comments} = require('../models/models');

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

exports.addNewComment = (req, res, next) => {
  // get article id
  const { article_id } = req.params;

  // if invalid article_id then return 422
  if (!mongoose.Types.ObjectId.isValid(article_id)) 
    return next({ status: 422, message: 'Invalid Article Id, cannot add comment'});
    
  // Find article to comment against
  Articles.findById({ _id: article_id })
    .then((article) => {
      if (article === null) 
        return next({status: 404, message: 'Article Not Found, cannot add comment'});
      
      let commentDoc = new Comments({
        body: req.body.body,
        belongs_to: article_id
      });

      commentDoc.save()
        .then((comment) => {
          res.status(201).json({ comment });
        });
    })
    .catch(next);
};
