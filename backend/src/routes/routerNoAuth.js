const router = require('express').Router();
const servicePost = require('../services/servicePost');
const serviceComment = require('../services/serviceComment');
const serviceSupport = require('../services/serviceSupport');

router.get('/post', async (req, res, next) => {
    try {
        const postId = req.query.postId;
        const response = await servicePost.GetPostById(postId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/comments', async (req, res, next) => {
    try {
        const postId = req.query.postId;
        const response = await serviceComment.GetAllComments(postId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/feedback', async (req, res, next) => {
    try {
        const body = req.body;
        const response = await serviceSupport.sendFeedback(body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/datadeletion', async (req, res, next) => {
    try {
        const body = req.body;
        res.status(200).json("Request send successfully will get back to you soon.");
    } catch (error) {
        next(error);
    }
});

module.exports = router;