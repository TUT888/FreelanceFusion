let client = require('../dbConnection');
let collection = client.db().collection('users');

function getUserData(userEmail, callback) {
    let query = { email: userEmail };
    collection.find(query).toArray(callback);
}

function updateUserData(userEmail, updateData, callback) {
    let query = { email: userEmail };
    collection.updateOne(
        query,
        {
            $set: updateData
        }
    )
}

module.exports = {
    getUserData,
    updateUserData
}