const taskModel = require('../models/taskModel');
const projectModel = require('../models/projectModel');
const { ObjectId } = require('mongodb');
const socket = require('../utils/projectManagementNotification');

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
    const { projectId } = req.params;
    const { title, content, progress, position} = req.body;

    if (!title) {
        return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    try {
        const newTask = {
            title,
            content,
            progress,
            project_id: new ObjectId(projectId),
            position: position,
            created_at: new Date(),
            updated_at: new Date(),

        };

        const result = await taskModel.insertOne(newTask);
        newTask._id = result.insertedId;
        const io = req.app.get('io');
        io.emit('new-task', { task: newTask, project_id: projectId });
        const project = await projectModel.getProjectById(projectId);
        const createdBy = req.session.user.role;
        const assignedTo = createdBy === 'client' ? project.freelancer_id : project.client_id;

        // Send notification to the assigned user
        socket.sendNotificationToUser(io, assignedTo, `New task created by ${req.session.user.email}`);

        
        // Respond with the newly created task
        res.json({ success: true, task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, error: 'Error creating task' });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    const { taskId, status, position } = req.body;
    try {
        await taskModel.updateTaskStatus(taskId, status, position);
        const io = req.app.get('io');
        io.emit('task-update', { taskId, status, position });
        const task = await taskModel.getTaskById(taskId);
        const project = await projectModel.getProjectById(task.project_id);

        const createdBy = req.session.user.role;
        const assignedTo = createdBy === 'client' ? project.freelancer_id : project.client_id;
        console.log(assignedTo)
        socket.sendNotificationToUser(io, assignedTo, `Task has been updated by ${req.session.user.email}`);
        

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTaskStatus
};
