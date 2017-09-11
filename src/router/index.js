const express = require('express');
const router = express.Router();

const { getAllTopics } = require('../controllers/topics');

// | `GET /api/topics` | Get all the topics |
router.route('/topics')
    .get(getAllTopics);

module.exports = router;