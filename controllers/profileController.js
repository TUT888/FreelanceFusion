let collection = require('../models/user');

const displayProfile = async (req, res) => {

    console.log('Session Data:', req.session);

    try {
        let userEmail = req.session.user.email;

        if (!req.session.user) {
            return res.redirect('/sign-in');
        }

        const result = await collection.getUserData(userEmail);
        if (result.length === 0) {
            return res.redirect('/sign-in'); // Redirect if no user found
        }

        console.log('User Data:', result);

        res.render("profile", {
            userData: result[0], // Ensure userData is defined and passed
            session: req.session
        });
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.redirect('/sign-in');
    }
};

function getUserData(userEmail, callback) {
    let query = { email: userEmail };
    collection.find(query).toArray(callback);

    if (err) {
        console.error('Error querying database:', err);
        return callback(err);
    }

    console.log('Database Query Result:', result);

        callback(null, result);

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

const updateProfile = (req, res) => {
    try {
        let userData = req.body;
        let userEmail = req.session.user.email;

        if (!req.session.user) {
            return res.redirect('/sign-in');
        }

        collection.updateUserData(userEmail, userData, (result) => {
            if (result.matchedCount!=0) {
                if (result.modifiedCount==0) { // No changes made
                    console.log("Failed updated profile!");
                    res.status(400).send("There are no changes made.");
                } else { // Change successfully
                    console.log("Successfully updated profile!");
                    res.status(200).send("Successfully updated profile! Page will be reloaded in few second...");
                }
            } else { // No data found
                console.log("Failed updated profile!");
                res.status(400).send("There is an error when updating your profile. Please try again later!");
            }
        });
    } catch (err) {
        console.error('Error updating user data:', err);
        res.redirect('/sign-in');
    }
}

module.exports = {
    getUserData,
    registerUser,
    authenticateUser,
    displayProfile,
    updateProfile
}