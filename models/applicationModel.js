const { ObjectId } = require('mongodb');
let client = require('../dbConnection');
let applicationCollection = client.db().collection('applications');

// Get all applications for a specific project
const getApplicationsByJob = async (jobId) => {
    console.log("jobId")
    console.log(jobId)
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
        { $unwind: '$freelancer_info' },
        {
            $lookup: {
                from: 'projects',         
                localField: 'freelancer_id',     
                foreignField: 'freelancer_id',       
                as: 'project_info'                   
            }
        },

        // Filter out applications where no project is found for the freelancer (project_info is empty)
        { $match: { 'project_info.0': { $exists: true } } },

        // Optional: unwind project_info to work with single project records
        { $unwind: '$project_info' }
    ]).toArray();
};

module.exports = {
    getApplicationsByJob
};
