const { Articles, Comments } = require('../models/models');

exports.getAllArticlesByTopic = (req, res, next) => {
  // get topic from slug
  const { topic_id } = req.params;

  // find all articles that match the Topic slug
  Articles.find({ belongs_to: topic_id })
    .then((articles) => {
      if (articles.length < 1) 
        return next({ status: 404, message: `No Articles found for topic ${topic_id}` });

      const commentCounts = articles.map((article) => {
        // count number of comments made against each article found
        return Comments.count({belongs_to: article._id});
      });

      Promise.all([articles, ...commentCounts])
        .then(([articles, ...commentCounts]) => {
          const articlesWithCommentCount = articles.map((article, i) => {
            return {
              _id: article._id,
              title: article.title,
              body: article.body,
              created_by: article.created_by,
              belongs_to: article.belongs_to,
              votes: article.votes,
              __v: article.__v,
              comments: commentCounts[i]
            };
          });
          return res.status(200).json({articles: articlesWithCommentCount});
        })
        .catch(next);
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  // for each article, read the comments collection and count number of comments 
  // made against the article
  Articles.find({})
    .then((articles) => {
      if (articles.length < 1) return next({ status: 404, message: 'No Articles Found' });

      const commentCounts = articles.map((article) => {
        // count number of comments made against each article found
        return Comments.count({belongs_to: article._id});
      });

      Promise.all([articles, ...commentCounts])
        .then(([articles, ...commentCounts]) => {
          const articlesWithCommentCount = articles.map((article, i) => {
            return {
              _id: article._id,
              title: article.title,
              body: article.body,
              created_by: article.created_by,
              belongs_to: article.belongs_to,
              votes: article.votes,
              __v: article.__v,
              comments: commentCounts[i]
            };
          });
          return res.status(200).json({articles: articlesWithCommentCount});
        })
        .catch(next);
    })
    .catch(next);
};