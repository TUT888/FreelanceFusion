let client = require('../dbConnection');
let collection = client.db('freelancefusion_dev').collection('jobs');
const { ObjectId } = require('mongodb');

// Function to get all jobs
function getJobsdata(callback) {
    collection.find({}).toArray(callback);
}

// Function to get a specific job by its job ID
function getJobByIdData(jobId, callback) {
    let query = { _id: ObjectId(jobId) };
    collection.findOne(query, callback);
}

// Function to create a new job
function createJobData(job, callback) {
    collection.insertOne(job, callback);
}

// Function to update a job by its job ID
function updateJobData(jobId, updatedJob, callback) {
    let query = { _id: ObjectId(jobId) };
    collection.updateOne(query, { $set: updatedJob }, callback);
}

module.exports = {
    getJobsdata,
    getJobByIdData,
    createJobData,
    updateJobData
}
