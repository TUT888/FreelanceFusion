const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const isAuthenticated = require('../middleware/auth'); // Ensure this middleware checks for user authentication

router.get('/', isAuthenticated, controller.displayProfile);

module.exports = router;
