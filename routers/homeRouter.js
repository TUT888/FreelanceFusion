let express = require('express');
let router = express.Router();
let controller = require('../controllers/homeController');
let userModel = require('../models/user');
let authController = require('../controllers/authController');
let isAuthenticated = require('../middleware/auth');


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

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { session: req.session });
});

router.get('/logout', authController.logout);


module.exports = router;