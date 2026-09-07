const router = require('express').Router();
const routerOTP = require('./routerOTP');
const routerHealth = require('./routerHealth');
const routerAuth = require('./routerAuth');
const routerUser = require('./routerUser');
const routerPost = require('./routerPost');
const routerNoAuth = require('./routerNoAuth');
const routerComment = require('./routerComment');
const routerMessage = require('./routerMessage');

const jwt = require('../utilities/jwt');
const errorLogger = require('../utilities/errorLogger');
const requestLogger = require('../utilities/requestLogger');

router.use(requestLogger);
router.use('/health', routerHealth);
router.use('/otp', routerOTP);
router.use('/noAuth', routerNoAuth);
router.use(jwt.ValidateToken);
router.use('/auth', routerAuth);
router.use('/user', routerUser);
router.use('/post', routerPost);
router.use('/comment', routerComment);
router.use('/message', routerMessage);

router.use(errorLogger);

module.exports = router;