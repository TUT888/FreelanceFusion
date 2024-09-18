let express = require('express');
let router = express.Router();
let controller = require('../controllers/jobController');
let isAuthenticated = require('../middleware/auth');

router.get('/search', controller.getJobList);
router.get('/search/:id', controller.getJobDetail);
router.get('/add', isAuthenticated, controller.getAddJobForm);
router.post('/add', isAuthenticated, controller.addJob);
router.get('/edit/:id', isAuthenticated, controller.getEditJobForm);
router.post('/edit/:id', isAuthenticated, controller.editJob);

module.exports = router;
