let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');
let isAuthenticated = require('../middleware/auth');

// router.get('/', controller.displayProfile);
router.get('/', isAuthenticated, controller.displayProfile);
router.put('/update', isAuthenticated, controller.updateProfile);

router.delete('/delete_rating', isAuthenticated, controller.deleteRating);

module.exports = router;