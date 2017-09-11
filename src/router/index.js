const express = require('express');
const router = express.Router();

const { getAllTopics } = require('../controllers/topics');
const { getAllArticlesByTopic } = require('../controllers/articles');

// | `GET /api/topics` | Get all the topics |
router.route('/topics')
    .get(getAllTopics);

// | `GET /api/topics/:topic_id/articles` | Return all the articles for a particular topic |
router.route('/topics/:topic_id/articles')
    .get(getAllArticlesByTopic);

module.exports = router;