let express = require('express');
let router = express.Router();
let controller = require('../controllers/freelancerController');

router.get('/search', controller.getFreelancerList);
router.get('/search/:id', controller.getFreelancerDetail);

module.exports = router;
