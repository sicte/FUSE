const router = require('express').Router();
const serviceOTP = require('../services/serviceOTP');

router.get('/', async (req, res, next) => {
    try {
        const email = req.query.email;
        const response = await serviceOTP.GetOtp(email, 'Login');
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const response = await serviceOTP.VerifyOtp(email, otp);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;