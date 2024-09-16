let collection = require('../models/user');

const displayProfile = (req, res, session) => {
    let userEmail = session.user.email;

    if (!user) {
        return res.redirect('/sign-in');
    }

    // let userEmail = "client@example.com";
    collection.getUserData(userEmail, (err, result) => {
        if (err) throw err;

        res.render("profile", {
            userData: result[0],
            session: session
        });
    });
}

module.exports = {
    displayProfile
}