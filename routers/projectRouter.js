let express = require('express');
let router = express.Router();
let projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');

let isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', projectController.getProjectList);
router.get('/new', projectController.getDefaultProject);
router.get('/:projectId/tasks', taskController.getTasksByProject);
router.post('/:projectId/tasks/create', taskController.createTask);

router.put('/tasks/:taskId/status', taskController.updateTaskStatus);
router.get('/:jobId/candidates', projectController.getCandidateList)
router.get('/:jobId/candidate', projectController.getCandidate)
router.post('/create/:jobId', projectController.createProject);
router.delete('/:projectId', projectController.deleteProject);




module.exports = router;
