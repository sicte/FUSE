const cloudinary = require('cloudinary').v2;
const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: '577476425439393',
    api_secret: 'VKcQbeLnPXGLE4Wwg01s6-WbFNw',
});

async function DeleteMedia(publicId) {
    if (!publicId) {
        throwError('publicId is required', statusCode.BAD_REQUEST)
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return "Deleted Successfully";
    } catch (error) {
        throwError('Failed to delete', statusCode.INTERNAL_SERVER_ERROR)
    }
}

module.exports = { DeleteMedia };