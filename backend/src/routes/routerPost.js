const router = require('express').Router();
const servicePost = require('../services/servicePost');

router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.page;
        const categories = req.query.categories;
        const response = await servicePost.GetCategoriesPosts(userId, categories, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/user', async (req, res, next) => {
    try {
        const id = req.query.userId;
        const currUserId = req.user.id;
        const page = req.query.page;
        const response = await servicePost.GetUserPosts(id, currUserId, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/popular', async (req, res, next) => {
    try {
        const id = req.user.id;
        const page = req.query.page;
        const response = await servicePost.GetPopularPosts(id, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const id = req.user.id;
        const body = req.body;
        const response = await servicePost.Post(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/like', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.query.id;
        const response = await servicePost.Like(userId, postId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const postId = req.query.id;
        const response = await servicePost.Delete(postId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;