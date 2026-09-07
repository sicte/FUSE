const router = require('express').Router();
const serviceComment = require('../services/serviceComment');

router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.query.id;
        const page = req.query.page;
        const response = await serviceComment.Get(userId, postId, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const id = req.user.id;
        const body = req.body;
        const response = await serviceComment.Add(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const commentId = req.query.id;
        const response = await serviceComment.Delete(commentId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;