let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');
let isAuthenticated = require('../middleware/auth');

router.get('/', isAuthenticated, controller.displayProfile);


module.exports = router;