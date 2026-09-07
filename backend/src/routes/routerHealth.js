const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        res.status(200).json("Ok");
    } catch (error) {
        next(error);
    }
});

module.exports = router;