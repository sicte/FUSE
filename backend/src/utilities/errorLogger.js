const fs = require('fs');
const path = require('path');

function ErrorLogger(error, req, res, next) {
    if (error) {
        const data = new Date().toString() + " " + req.method + " " + req.url + "->" + error.stack + "\n\n";
        const filePath = path.join(__dirname, '../logs/ErrorLogger.txt');
        console.log("Error: " + data);
        fs.appendFile(filePath, data, (err) => {
            if (err) console.log("Failed to add error log");
        });

        if (!error.status) error.status = 500;
        res.status(error.status).json(error.message);
    }
    else {
        next();
    }
}

module.exports = ErrorLogger;