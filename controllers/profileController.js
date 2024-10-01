let collection = require('../models/user');
let ratingCollection = require('../models/ratingModel');
let projectCollection = require('../models/ratingModel');

// PROFILE MANAGEMENT feature (view), RATING AND REVIEW feature (view)
const displayProfile = (req, res) => {
    try {
        // Get user email from session
        let userEmail = req.session.user.email;
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }

        // Get user data
        collection.getUserProfile(userEmail, (userData) => {     
            if (!userData) {
                res.redirect('/');
            }
            
            // Get ratings data
            ratingCollection.getUserRating(userData._id, userData.role, (userRating) => {
                res.render("profile", {
                    userData: userData,
                    allUserRating: userRating,
                    session: req.session
                });
            });
        });
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.redirect('/');
    }
}

// USER AUTHENTICATION feature
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

// PROFILE MANAGEMENT feature (update)
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

// RATING & REVIEW feature
const deleteRating = async (req, res) => {
    try {
        let rating_id = req.body.ratingID; 
        
        ratingCollection.deleteGivenRating(rating_id, (result) => {
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
                res.status(200).send("Successfully deleted your review!");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
                res.status(400).send("No documents matched the query. Deleted 0 documents.");   
            }
        })
    } catch (err) {
        console.error("There was an error when trying to delete a document: ", err);
        res.status(400).send("There was an error when trying to delete a document: ", err);   
    }
}

const addNewRating = (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }

        let data = req.body;
        console.log("RECEIVED REQUEST FROM USER: ", data);

        ratingCollection.addNewRating(data, (result) => {
            if (result.insertedId) {
                res.json({
                    statuscocde:200, 
                    message: `Successfully added new rating. Redirecting in few seconds...`
                });
            } else {
                res.json({
                    statuscocde:400, 
                    message: `Insertion failed. Please try again later.`
                });
            }
        })
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.redirect('/');
    }
}

const displayAddRatingForm = (req, res) => {
    try {
        // Get user email from session
        let userEmail = req.session.user.email;
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }

        // Get user data
        collection.getUserProfile(userEmail, (userData) => {     
            if (!userData) {
                res.redirect('/');
            }
            
            // Get available projects for rating
            projectCollection.getProjectForRating(userData._id, (allProjectsForRating) => {
                res.render("ratingForm", {
                    allProjectsForRating: allProjectsForRating,
                    session: req.session
                });
            });
        });
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.redirect('/');
    }
}

const getProjectDetailForRating = (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }

        let projectID = req.query.id;

        // Get project detail for rating
        projectCollection.getProjectDetailForRating(projectID, (projectDetailForRating) => {
            res.json({
                statuscocde:200, 
                projectDetail: projectDetailForRating
            });
        });
    } catch (err) {
        console.error('Error retrieving user data:', err);
        res.redirect('/');
    }
}

module.exports = {
    registerUser,
    authenticateUser,
    displayProfile,
    updateProfile,
    deleteRating,
    displayAddRatingForm,
    getProjectDetailForRating,
    addNewRating
}