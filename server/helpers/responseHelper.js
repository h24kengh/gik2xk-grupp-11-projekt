// Skapar ett lyckat svar med statuskod 200 och returnerad data
function createResponseSuccess(data) {
    return {status: 200, data};
}

// Skapar ett felsvar – använder 500 och 'Okänt fel' som standardvärden
function createResponseError(status, message) {
    return {status: status || 500, data: {error: message || 'Okänt fel' }};
}

// Skapar ett svar med ett meddelandeobjekt – använder 200 som standardstatuskod
function createResponseMessage(status, message) {
     return {status: status || 200, data: {message}};
}

module.exports = {
    createResponseSuccess,
    createResponseError,
    createResponseMessage
}