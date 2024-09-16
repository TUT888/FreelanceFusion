let express = require('express');
let router = express.Router();
let controller = require('../controllers/freelancerController');

router.get('/', controller.displayFreelancers);
router.get('/:id', controller.getFreelancerDetail);

module.exports = router;
