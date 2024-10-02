let express = require('express');
let router = express.Router();
let controller = require('../controllers/profileController');
let isAuthenticated = require('../middleware/auth');

// router.get('/', controller.displayProfile);
router.get('/', isAuthenticated, controller.displayProfile);
router.put('/update', isAuthenticated, controller.updateProfile);

router.delete('/rating/delete', isAuthenticated, controller.deleteRating);
router.get('/rating/form', isAuthenticated, controller.displayAddRatingForm);
router.post('/rating/add', isAuthenticated, controller.addNewRating);

router.get('/rating/get_project', isAuthenticated, controller.getProjectDetailForRating);
router.put('/rating/change_project_status', isAuthenticated, controller.changeProjectStatus);

module.exports = router;