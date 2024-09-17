let express = require('express');
let router = express.Router();
let controller = require('../controllers/homeController');
let userModel = require('../models/user');
let authController = require('../controllers/authController');
let isAuthenticated = require('../middleware/auth');
let client = require('../dbConnection');


router.get('/', (req, res) => {
    res.render('index.ejs', { session: req.session });
});

// Serve the sign in page
router.get('/sign-in', (req, res) => {
    if (req.session.user) {
        return res.redirect('/'); // Redirect to home if already logged in
    }
    res.render('sign-in.ejs', { session: req.session });
});

// Serve the register page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/'); // Redirect to home if already logged in
    }
    res.render('register.ejs', { session: req.session });
});


router.post('/login', authController.login);
router.post('/register', authController.register);

// router.get('/profile', isAuthenticated, (req, res) => {
//     console.log('Profile route hit');
//     res.render('profile', { session: req.session });
// });

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        // Fetch user data from the database
        usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({ email: req.session.user.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Pass the user data to the view
        res.render('profile', { userData: user, session: req.session });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


router.get('/logout', authController.logout);


module.exports = router;