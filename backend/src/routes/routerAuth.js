const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
});


module.exports = router;