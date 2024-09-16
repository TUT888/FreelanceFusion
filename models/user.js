let client = require('../dbConnection');
const bcrypt = require('bcrypt');
let collection = client.db().collection('users');

function getUserData(userEmail, callback) {
    let query = { email: userEmail };

    console.log("Querying database for:", userEmail); // Add logging here

    const timeout = setTimeout(() => {
        return callback(new Error('Database query timed out'));
    }, 5000);

    collection.find(query).toArray((err, result) => {

        clearTimeout(timeout);
        if (err) {
            console.log("Error during database query:", err);
            return callback(err);
        }
        console.log('Database Result:', result);

        if (!result || result.length === 0) {
            console.log("No user data found for:", userEmail);
        }

        callback(null, result);
    });
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