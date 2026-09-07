function Throw(msg, status) {
    let error = new Error(msg);
    if (status) error.status = status;
    else error.status = 500;
    throw error;
}

module.exports = Throw;