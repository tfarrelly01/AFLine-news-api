const mongoose = require('mongoose');
const {Articles, Comments} = require('../models/models');

exports.getAllComments = (req, res, next) => {
  Comments.find()
    .then((comments) => {
      if (comments.length < 1) 
        return next({ status: 404, message: 'No comments Found' });

      res.status(200).json({ comments });
    })
    .catch(next);
};

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

exports.getCommentById = (req, res, next) => {
  // find comment by id
  const { comment_id } = req.params;

  // if invalid comment_id then return 422
  if (!mongoose.Types.ObjectId.isValid(comment_id)) 
    return next({ status: 422, message: 'Invalid Comment Id' });

  // find comment that matches comment_id
  Comments.findOne({ _id: comment_id })
    .then((comment) => {
      if (comment === null) 
        return next({ status: 404, message: 'Comment Not Found' });

      res.status(200).json({ comment });
    })
    .catch(next);
};

exports.updateCommentVote = (req, res, next) => {
  // find comment by id
  const { comment_id } = req.params;
  const { vote } = req.query;

  // if invalid comment_id then return 422
  if (!mongoose.Types.ObjectId.isValid(comment_id)) 
    return next({ status: 422, message: 'Comment Id Invalid' });

  Comments.findById({ _id: comment_id })
    .then((comment) => {
      if (comment === null)
        return next({ status: 404, message: 'Comment Not Found' });

      if (vote === 'up') comment.votes += 1;
      if (vote === 'down' && comment.votes > 0) comment.votes -= 1;

      comment.save()
        .then((comment) => {
          res.status(201).json({ comment });
        });
    })
    .catch(next);
};
