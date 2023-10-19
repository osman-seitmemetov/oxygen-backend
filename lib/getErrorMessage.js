const getErrorMessage = (message) => {
    return {type: "ERROR", message}
}

module.exports = getErrorMessage;