let express = require('express');
let router = express.Router();
let controller = require('../controllers/jobController');
let isAuthenticated = require('../middleware/auth');

router.get('/search', controller.getJobList);
router.get('/', controller.getClientJobs);
router.get('/search/:id', controller.getJobDetail);
router.get('/add', isAuthenticated, controller.getAddJobForm);
router.get('/:id', controller.getJobDetail);
router.post('/add', isAuthenticated, controller.addJob);
router.get('/edit/:id', isAuthenticated, controller.getEditJobForm);
router.post('/edit/:id', isAuthenticated, controller.editJob);
router.post('/apply/:jobId', isAuthenticated, controller.applyForJob);

module.exports = router;
