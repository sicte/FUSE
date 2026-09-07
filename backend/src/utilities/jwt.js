const jwt = require('jsonwebtoken');

const throwError = require('./throwError');
const statusCode = require('./statusCodes');
const messagesManager = require('./messagesManager');

require('dotenv').config();

async function GetUser(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throwError(messagesManager.Error('jwtRequired'), statusCode.UNAUTHORIZED);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        return decoded.user;
    } catch (err) {
        throwError(messagesManager.Error('jwtInvalid'), statusCode.FORBIDDEN);
    }
}

function ValidateToken(req, res, next) {
    GetUser(req, res, next)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => next(err));
}

function GenerateToken(user) {

    const jwtUser =
    {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const token = jwt.sign({ user: jwtUser }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
}

module.exports = { ValidateToken, GenerateToken };