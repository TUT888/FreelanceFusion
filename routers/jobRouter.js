let express = require('express');
let router = express.Router();
let controller = require('../controllers/jobController');

router.get('/search', controller.getJobList);
router.get('/search/:id', controller.getJobDetail);
router.get('/add', controller.getAddJobForm);
router.post('/add', controller.addJob);
router.get('/edit/:id', controller.getEditJobForm);
router.post('/edit/:id', controller.editJob);

module.exports = router;
