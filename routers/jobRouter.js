let express = require('express');
let router = express.Router();
let controller = require('../controllers/jobController');

router.get('/', controller.displayJobs);
router.get('/:id', controller.getJobDetail);

module.exports = router;
