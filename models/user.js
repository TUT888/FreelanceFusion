let client = require('../dbConnection');
let collection = client.db().collection('users');

function getUserData(userEmail, callback) {
    let query = { email: userEmail };
    collection.find(query).toArray(callback);
}

module.exports = {
    getUserData
}