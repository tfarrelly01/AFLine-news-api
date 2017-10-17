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
        updateCommentVote,
        deleteCommentById } = require('../controllers/comments');

const { getAllUsers, getUser } = require('../controllers/users');

router.get('/topics', getAllTopics);

router.get('/topics/:topic_id/articles', getAllArticlesByTopic);

router.get('/articles', getAllArticles);

router.route('/articles/:article_id')
    .get(getArticleById)
    .put(updateArticleVote);

router.route('/articles/:article_id/comments')
    .get(getAllCommentsByArticle)
    .post(addNewComment);

router.get('/comments', getAllComments);

router.route('/comments/:comment_id')
    .get(getCommentById)
    .put(updateCommentVote)
    .delete(deleteCommentById);

router.get('/users', getAllUsers);

router.get('/users/:username', getUser);

module.exports = router;