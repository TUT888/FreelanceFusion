let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');
let isAuthenticated = require('../middleware/auth');


router.get('/', isAuthenticated, (req, res) => {

    controller.displayProfile(req, res, req.session);
});

module.exports = router;