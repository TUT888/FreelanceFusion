const taskModel = require('../models/taskModel');

// Get tasks by project ID
const getTasksByProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await taskModel.getTasksByProject(projectId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a task for a project
const createTask = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const taskData = { ...req.body, project_id: new ObjectId(projectId) };
        const task = await taskModel.createTask(taskData);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    const { taskId, status, position } = req.body;
    try {
        await taskModel.updateTaskStatus(taskId, status, position);
        const io = req.app.get('io');
        io.emit('task-update', { taskId, status, position });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTaskStatus
};
