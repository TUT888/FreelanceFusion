let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');
let isAuthenticated = require('../middleware/auth');

// router.get('/', controller.displayProfile);
router.get('/', isAuthenticated, controller.displayProfile);
router.put('/update', controller.updateProfile);

module.exports = router;