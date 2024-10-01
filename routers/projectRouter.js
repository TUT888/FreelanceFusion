let express = require('express');
let router = express.Router();
let projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');

let isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', projectController.getProjectList);
router.get('/new', projectController.getDefaultProject);

router.get('/:projectId/tasks', taskController.getTasksByProject);
router.post('/:projectId/tasks', taskController.createTask);
router.put('/tasks/:taskId/status', taskController.updateTaskStatus);


router.get('/:jobId/candidates', projectController.getCandidateList)
router.get('/:jobId/candidate', projectController.getCandidate)




// // Delete a task
// router.delete('/tasks/:id', taskController.deleteTask);

// router.get('/:id', controller.getProjectDetail);
// router.delete('/:id', controller.deleteProjectDetail);
// router.get('/candidates', controller.getProjectCandidate);
// router.put('/candidates/:id', controller.setProjectCandidate);

module.exports = router;
