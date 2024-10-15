function createResponse(status, message) {
    return {
        status,
        msg: message,
    };
}

module.exports = {
    createResponse
}