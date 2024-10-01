let express = require('express');
let router = express.Router();
let freelancerController = require('../controllers/freelancerController');

router.get('/search', freelancerController.getFreelancerList);
router.get('/search/:id', freelancerController.getFreelancerDetail);

module.exports = router;
