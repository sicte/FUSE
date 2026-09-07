const router = require('express').Router();
const serviceUser = require('../services/serviceUser');
const serviceCloudinary = require('../services/serviceCloudinary');

router.get('/', async (req, res, next) => {
    try {
        let id = req.query.id;
        if (!id) id = req.user.id;
        const response = await serviceUser.GetUser(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/categories', async (req, res, next) => {
    try {
        const page = req.query.page;
        const response = await serviceUser.GetCategories(page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const id = req.user.id;
        const body = req.body;
        const response = await serviceUser.UpdateUser(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.delete('/image', async (req, res, next) => {
    try {
        const publicId = req.body.publicId;
        const response = await serviceCloudinary.DeleteMedia(publicId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        const term = req.query.term;
        const page = req.query.page;
        const userId = req.user.id;
        const response = await serviceUser.Search(userId, term, page);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;