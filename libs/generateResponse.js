let sendErrorMessage = (err, message, status) => {
    return { error: true, message, status, data: err };
}

let sendResponse = (message, status, data) => {
    return { error: false, message, status, data };
}

module.exports = {
    sendErrorMessage: sendErrorMessage,
    sendResponse: sendResponse
}