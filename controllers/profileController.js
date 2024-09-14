let collection = require('../models/user');

const displayProfile = (req, res) => {
    let userEmail = "freelancer@example.com";
    // let userEmail = "client@example.com";
    collection.getUserData(userEmail, (err, result) => {
        res.render("profile", {
            userData: result[0]
        });
    });
}

module.exports = {
    displayProfile
}