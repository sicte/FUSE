const modelComment = require('../model/modelComment');

const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const validator = require('../utilities/validator');
const messagesManager = require('../utilities/messagesManager');

async function Get(userId, postId, page) {
    validator.ID(postId);

    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelComment.Get(userId, postId, validPage, pageSize);
}

async function GetAllComments(postId) {
    validator.ID(postId);
    return await modelComment.GetAllComments(postId);
}

async function Add(userId, body) {
    validator.ID(userId);
    validator.ID(body.postId);
    validator.Comment(body.comment);
    validator.ValidateDate(body.created_at);

    await modelComment.Add(userId, body.postId, body.comment, body.created_at);
    return messagesManager.Success('commentAdded');
}

async function Delete(commentId) {
    await modelComment.Delete(commentId);
}


module.exports = { Get, Add, Delete, GetAllComments };