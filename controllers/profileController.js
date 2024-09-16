// let collection = require('../models/user');


// const displayProfile = (req, res) => {
//     // Simulate a hardcoded user for testing
//     const hardcodedUserData = {
//         email: 'testuser@example.com',
//         username: 'Test User',
//         role: 'freelancer',
//         profile: {
//             name: 'Test User',
//             // add other profile fields as necessary
//         }
//     };

//     if (!req.session.user) {
//         return res.redirect('/sign-in');
//     }

//     // You can skip the database fetch for now
//     // collection.getUserData(userEmail, (err, result) => {
//     //     if (err) {
//     //         console.error('Error retrieving user data:', err);
//     //         return res.redirect('/sign-in'); // Redirect if error occurs
//     //     }

//     //     if (result.length === 0) {
//     //         return res.redirect('/sign-in'); // Redirect if no user found
//     //     }

//     //     console.log('User Data:', result);

//     res.render("profile", {
//         userData: hardcodedUserData, // Use hardcoded data here
//         session: req.session
//     });
//     // });
// };

// module.exports = {
//     displayProfile
// };



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



module.exports = {
    getUserData,
    registerUser,
    authenticateUser,
    displayProfile
}
