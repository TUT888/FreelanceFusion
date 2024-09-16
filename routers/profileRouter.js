let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');

router.get('/', controller.displayProfile);
router.put('/update', controller.updateProfile);

module.exports = router;