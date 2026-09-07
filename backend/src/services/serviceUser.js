const modelUser = require('../model/modelUser');
const validator = require('../utilities/validator');
const categories = require('../config/categories.json');

const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');


async function UpdateUser(id, body) {

    validator.ID(id);
    if (body.username) validator.Username(body.username);
    if (body.email) validator.Email(body.email);
    if (body.about) validator.About(body.about);
    if (body.image_url) validator.URL(body.image_url);
    if (body.categories) {
        if (!Array.isArray(body.categories)) throwError(messagesManager.Error("categoriesArray"), statusCode.BAD_REQUEST);
        body.categories.forEach(category => validator.Category(category));
    }

    if (body.username) {
        const user = await GetUserByUsername(body.username);
        if (user) throwError(messagesManager.Error("usernameExist"), statusCode.CONFLICT);
    }

    if (body.email) {
        const user = await modelUser.GetUserByEmail(body.email);
        if (user) throwError(messagesManager.Error("emailExist"), statusCode.CONFLICT);
        if (!otp) throwError(messagesManager.Error("otpNF"), statusCode.BAD_REQUEST);

        await otpManager.VerifyOtp(body.email, otp);
    }

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(body)) {
        if (value !== undefined && value !== null) {
            fields.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }
    }

    if (fields.length === 0) {
        throwError(messagesManager.Error("noFieldToUpdate"), statusCode.BAD_REQUEST);
    }

    values.push(id);

    const updatedUser = await modelUser.UpdateUser(fields, index, values);
    return updatedUser;
};

async function GetUser(id) {
    const user = await modelUser.GetUser(id);
    return user;
}

async function GetUserByUsername(username) {
    const user = await modelUser.GetUserByUsername(username);
    return user;
}

async function GetUserByEmail(email) {
    const user = await modelUser.GetUserByEmail(email);
    return user;
}

async function GetOrCreateUserByEmail(email) {
    let user = await GetUserByEmail(email)
    if (!user) user = await CreateUser(email);
    return user;
}

async function CreateUser(email) {
    const user = await modelUser.CreateUser(email);
    return user;
}

async function GetCategories(page) {
    const pageSize = 5;
    const categoryKeys = Object.keys(categories);
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;
    const totalPages = Math.ceil(categoryKeys.length / pageSize);

    const start = validPage * pageSize;
    const end = start + pageSize;
    const slicedKeys = categoryKeys.slice(start, end);

    const result = {};
    if (slicedKeys.length > 0) {
        slicedKeys.forEach(key => {
            result[key] = categories[key];
        })
    }

    return { categories: result, currPage: pageNumber | 1, totalPages: totalPages };
}

async function Search(userId, term, page) {
    const pageSize = 10;
    const pageNumber = parseInt(page);
    const validPage = isNaN(pageNumber) || pageNumber <= 1 ? 0 : pageNumber - 1;

    return await modelUser.Search(userId, term, validPage, pageSize);
}

module.exports = { GetUser, GetOrCreateUserByEmail, UpdateUser, GetCategories, Search };