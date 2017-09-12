const express = require('express');
const router = express.Router();

const { getAllTopics } = require('../controllers/topics');

const { getAllArticlesByTopic, 
        getAllArticles, 
        getArticleById, 
        updateArticleVote} = require('../controllers/articles');

const { getAllCommentsByArticle, 
        addNewComment, 
        getAllComments, 
        getCommentById,
        updateCommentVote } = require('../controllers/comments');

// | `GET /api/topics` | Get all the topics |
router.route('/topics')
    .get(getAllTopics);

// | `GET /api/topics/:topic_id/articles` | Return all the articles for a particular topic |
router.route('/topics/:topic_id/articles')
    .get(getAllArticlesByTopic);

// | `GET /api/articles` | Get all the articles |
router.route('/articles')
    .get(getAllArticles);

// | `GET /api/articles/:article_id` | Get individual article by id |
// | `PUT /api/articles/:article_id` | Increment or Decrement the votes of an article by one. This route
// requires a vote query of 'up' or 'down' i.e. /api/articles/:article_id?vote=up OR /api/articles/:article_id?vote=down |
router.route('/articles/:article_id')
    .get(getArticleById)
    .put(updateArticleVote);

// | `GET /api/articles/:article_id/comments` | Get all comments for an individual article |
// | `POST /api/articles/:article_id/comments` | Add a new comment to an article. This route requires a 
// JSON body with  a comment key and value pair e.g: {"comment": "This is my new comment"} |
router.route('/articles/:article_id/comments')
    .get(getAllCommentsByArticle)
    .post(addNewComment);

// |`GET /api/comments` | Get all the comments |
router.route('/comments')
    .get(getAllComments);

// | `GET /api/comments/:comment_id` | Get comment by id |
// | `PUT /api/comments/:comment_id` | Increment or Decrement the votes of a comment by one. This route
// requires a vote query of 'up' or 'down' i.e. /api/comments/:comment_id?vote=up OR /api/comments/:comment_id?vote=down |
router.route('/comments/:comment_id')
    .get(getCommentById)
    .put(updateCommentVote);

module.exports = router;