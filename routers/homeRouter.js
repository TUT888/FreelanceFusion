let express = require('express');
let router = express.Router();
let controller = require('../controllers/homeController');

router.get('/', (req, res) => {
    res.render('index.ejs');
});

// Serve the sign in page
router.get('/sign-in', (req, res) => {
    res.render('sign-in.ejs');
});

// Serve the register page
router.get('/register', (req, res) => {
    res.render('register.ejs');
});

module.exports = router;