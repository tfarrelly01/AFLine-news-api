const express = require('express');
const router = express.Router();

const { getAllTopics } = require('../controllers/topics');
const { getAllArticlesByTopic, getAllArticles, getArticleById } = require('../controllers/articles');

// | `GET /api/topics` | Get all the topics |
router.route('/topics')
    .get(getAllTopics);

// | `GET /api/topics/:topic_id/articles` | Return all the articles for a particular topic |
router.route('/topics/:topic_id/articles')
    .get(getAllArticlesByTopic);

// | `GET /api/articles` | Get all the articles |
router.route('/articles')
    .get(getAllArticles);

// | `GET /api/articles/:article_id` | Get individual article by id
router.route('/articles/:article_id')
    .get(getArticleById);

module.exports = router;