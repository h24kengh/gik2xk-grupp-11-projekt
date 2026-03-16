const db = require ('../models');

const {
    createResponseSuccess,
    createResponseError,
    createResponseMessage
} = require('../Helpers/responsehelper');
const validate = require('validate.js');    
const { post } = require('../server/app');

const constraints = { 
    email: { 
        length: {
        minimun: 4,
        maximum: 200,
        tooShort: "^E-postadressen måste vara minst %{count} tecken lång.",
        tooLong: "^E-postadressen får inte vara längre än %{count} tecken lång."
        },
        email: {
        message: "^E-postadressen måste vara en giltig e-postadress."
        }
},
username: {
length: {
        minimun: 3,
        maximum: 50,
        tooShort: "^Användarnamnet måste vara minst %{count} tecken långt.",
        tooLong: "^Användarnamnet får inte vara längre än %{count} tecken långt."
        }
},
imageurl: {
    url: {
        message: 'Sökvägen är felaktig.'
    }
}
};

async function getAll() {
    try {

        const allPosts =  await db.post.findAll()
        /* Om allt blev bra, returna allPosts */
        return createResponseSuccess(allPosts);
    } catch (error) {
        return createResponseError(error.status, error.message);
    }
 
}
async function create() {
    const invalidData = validate(post, constraints);
    if (invalidData) {
       return createResponseError(422, invalidData);
    } else {
        try {
           const newPost =  await db.post.create(post);
           return createResponseSuccess(newPost);
        } catch (error) {
        return createResponseError(error.status, error.message);
    }
  }
}
function update() {}
function destroy() {}

module.exports = { 
    getAll, create, update, destroy };