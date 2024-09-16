const collection = require('../models/user');

const displayProfile = (req, res) => {
    if (!req.session.user) {
        console.log('No user session found. Redirecting to sign-in.');
        return res.redirect('/sign-in');
    }

    let userEmail = req.session.user.email;
    console.log('Fetching profile for email:', userEmail);

    collection.getUserData(userEmail, (err, result) => {
        if (err) {
            console.error('Error retrieving user data:', err);
            return res.redirect('/sign-in');
        }

        if (result.length === 0) {
            console.error('No user data found for:', userEmail);
            return res.redirect('/sign-in');
        }

        console.log('User Data:', result);

        // Ensure 'userData' is passed to the view
        res.render('profile', {
            userData: result[0],  // Should be correct
            session: req.session
        });
    });
}

module.exports = {
    displayProfile
}
