const { ObjectId } = require('mongodb');
let client = require('../dbConnection');
let applicationCollection = client.db().collection('applications');

// Get all applications for a specific project
const getApplicationsByJob = async (jobId) => {
    console.log(jobId)
    console.log("testing")

    return await applicationCollection.aggregate([
        { $match: { job_id: new ObjectId(jobId) } }, // Match applications with the given job ID
        {
            $lookup: {
                from: 'users',
                localField: 'freelancer_id',
                foreignField: '_id',
                as: 'freelancer_info'
            }
        },
        { 
            $unwind: { path: '$freelancer_info', preserveNullAndEmptyArrays: true }  // Allow missing freelancer info
        },
        {
            $lookup: {
                from: 'projects',
                localField: 'freelancer_id',
                foreignField: 'freelancer_id',
                as: 'project_info'
            }
        },
        { 
            $unwind: { path: '$project_info', preserveNullAndEmptyArrays: true }  // Allow missing project info
        }
    ]).toArray();
   
};

const getApplicationByJob = async (jobId) => {

    return await applicationCollection.aggregate([
        { $match: { job_id: new ObjectId(jobId), status: "hired" } }, // Match applications with the given job ID
        {
            $lookup: {
                from: 'users',
                localField: 'freelancer_id',
                foreignField: '_id',
                as: 'freelancer_info'
            }
        },
        { $unwind: '$freelancer_info' },
        {
            $lookup: {
                from: 'projects',
                localField: 'freelancer_id',
                foreignField: 'freelancer_id',
                as: 'project_info'
            }
        },

        // Optional: unwind project_info to work with single project records
        { $unwind: '$project_info' }
    ]).toArray();
};

const updateApplication = async (jobId, freelancerId, status) => {

    console.log(status)
    console.log("2")
    console.log(freelancerId)
    console.log("2")
    try {
        // Prepare the filter and update objects
        let filter = {};
        let update = { $set: { status: status } };

        if (freelancerId) {
            // If freelancerId is provided, update data for that specific freelancer
            filter = { job_id: new ObjectId(jobId), freelancer_id: new ObjectId(freelancerId) };
        } else {
            // If no freelancerId, update all applications with the given jobId
            filter = { job_id: new ObjectId(jobId) };
        }
        console.log(filter)
        // Perform the update
        const result = await applicationCollection.updateMany(filter, update);

        return result;
    } catch (error) {
        console.error('Error updating application:', error);

    }
};

const insertApplication = async (applicationData) => {
    return await applicationCollection.insertOne(applicationData);
};

const findOne = async (filter) => {
    try {
        return await applicationCollection.findOne(filter);
    } catch (error) {
        throw new Error('Error checking application');
    }
};


module.exports = {
    getApplicationsByJob,
    getApplicationByJob,
    updateApplication,
    insertApplication,
    findOne
};
