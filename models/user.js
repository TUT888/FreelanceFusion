let client = require('../dbConnection');
const bcrypt = require('bcrypt');
let collection = client.db().collection('users');

function getUserData(userEmail, callback) {
    let query = { email: userEmail };
    collection.find(query).toArray(callback);
}


function registerUser(user, callback) {
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return callback(err);
        user.password = hash;
        collection.insertOne(user, callback);
    });
}


function authenticateUser(email, password, callback) {
    collection.findOne({ email }, (err, user) => {
        if (err || !user) return callback(err || 'User not found');
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) callback(null, user);
            else callback('Incorrect password');
        });
    });
}



module.exports = {
    getUserData,
    registerUser,
    authenticateUser
}