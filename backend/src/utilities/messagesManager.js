const fs = require('fs');
const path = require('path');

const messagesError = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/messagesError.json'), 'utf-8'));
const messagesSuccess = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/messagesSuccess.json'), 'utf-8'));

exports.Error = function Error(category) {
    const messages = messagesError[category];
    if (!messages || messages.length === 0) return "An error occurred";
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}

exports.Success = function Success(category) {
    const messages = messagesSuccess[category];
    if (!messages || messages.length === 0) return "An error occurred";
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}