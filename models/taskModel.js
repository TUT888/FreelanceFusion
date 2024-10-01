const { ObjectId } = require('mongodb');
let client = require('../dbConnection');
let taskCollection = client.db().collection('tasks');

// Fetch tasks by project ID
const getTasksByProject = async (projectId) => {
    return await taskCollection.find({ project_id: new ObjectId(projectId) }).sort({ position: 1 }).toArray();
};

// Create a new task for a project
const createTask = async (taskData) => {
    const result = await taskCollection.insertOne(taskData);
    return result.ops[0];
};

// Update task status and position
const updateTaskStatus = async (taskId, newStatus, newPosition) => {
 
    console.log(newStatus)
    console.log(newPosition)
    return await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { progress: newStatus, position: parseFloat(newPosition) } }  // Store the new status and position
    );
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTaskStatus
};
