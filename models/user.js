const { ObjectId } = require('mongodb');
let client = require('../dbConnection');
const bcrypt = require('bcrypt');
let collection = client.db().collection('users');

function getUserProfile(userEmail, callback) {
    let query = { email: userEmail };

    collection.findOne(query).then((result)=>{
        if (!result) {
            console.log("No user data found for: ", userEmail);
        }
        callback(result);
    });
}

function getNameByUserID(userID) {
    let query = { _id: userID };
    let projection = { projection: { 'profile.name': 1 } };

    return collection.findOne(query, projection);
}

function getEmailByUserID(userID) {
    let query = { _id: new ObjectId(userID) };
    let projection = { projection: { email: 1 } };

    return collection.findOne(query, projection);
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

function updateUserData(userEmail, updateData, callback) {
    let filter = { email: userEmail };
    let updateDoc = { $set: updateData };
    collection.updateOne(filter, updateDoc).then((result)=>{
        console.log(
            `Found ${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
        callback(result);
    })
}

module.exports = {
    registerUser,
    authenticateUser,
    updateUserData,
    getUserProfile,
    getNameByUserID,
    getEmailByUserID
}