let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');

router.get('/', controller.displayProfile);

module.exports = router;