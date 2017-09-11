const { Articles } = require('../models/models');

exports.getAllArticlesByTopic = (req, res, next) => {
    // get topic from slug
    const { topic_id } = req.params;
    // find all articles that match the slug
    Articles.find({ belongs_to: topic_id })
        .then((articles) => {
            if (articles.length < 1) {
                return next({ status: 404, message: 'No Articles found for topic cooking' });
            }
            const foundArticles = articles.map((article) => {
                return {
                    title: article.title,
                    body: article.body,
                    belongs_to: article.belongs_to,
                    created_by: article.created_by,
                    votes: article.votes
                };
            });
            res.status(200).json({ topic: topic_id, articles: foundArticles });
            //        res.status(200).json({ articles });
        })
        .catch(next);
};