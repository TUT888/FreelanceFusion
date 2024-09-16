const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.displayJobs);
router.get('/:id', jobController.displayJobDetails);
router.get('/create', jobController.createJob);
router.post('/create', jobController.createJob);
router.get('/edit/:id', jobController.editJob);
router.post('/edit/:id', jobController.editJob);

module.exports = router;
