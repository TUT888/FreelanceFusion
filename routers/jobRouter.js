let express = require('express');
let router = express.Router();
let controller = require('../controllers/jobController');

router.get('/search', controller.getJobList);
router.get('/search/:id', controller.getJobDetail);

module.exports = router;
