let client = require('../dbConnection');
let projectCollection = client.db().collection('projects');
const { ObjectId } = require('mongodb');

// Fetch projects with pagination and include job details
const getData = async ({ filter, skip, limit }) => {
    let query = buildProjectFilterQuery(filter); // Build the query using the filters

    // Fetch the projects and include job information by joining the two collections
    return await projectCollection.aggregate([
        { $match: query }, // Match projects based on filter criteria
        {
            $lookup: {
                from: 'jobs',
                localField: 'job_id',
                foreignField: '_id',
                as: 'job_info'
            }
        },
        { $skip: skip }, // Pagination: Skip the specified number of documents
        { $limit: limit } // Pagination: Limit the number of documents returned
    ]).toArray();
};

// Count projects based on filter
const countData = async (filter) => {
    let query = buildProjectFilterQuery(filter);  // Build the query using the filters
    return await projectCollection.countDocuments(query);
};

const getCandidate = async (projectId) => {
    let query = {
        _id: new ObjectId(projectId)  
    };  // Build the query using the filters
    // return await collection.find(query).skip(skip).limit(limit).toArray();
    let result = await projectCollection.aggregate([
        { $match: query }, // Match projects based on filter criteria
        {
            $lookup: {
                from: 'users',
                localField: 'freelancer_id',
                foreignField: '_id',
                as: 'freelancer_info'
            }
        },
        { $unwind: { path: '$freelancer_info', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'jobs',
                localField: 'job_id',
                foreignField: '_id',
                as: 'job_info'
            }
        },
        {
            $lookup: {
                from: 'application',
                localField: 'job_info.job_id',
                foreignField: '_id',
                as: 'application_info'
            }
        },
    ]).toArray();
    return result;
};

// Build the project filter query (similar to the job filter logic)
const buildProjectFilterQuery = (filter) => {
    let query = {};

    // Filter by project status
    if (filter.status) {
        query.status = filter.status;  // e.g., { status: 'in_progress' }
    }

    // Filter by client_id (if provided)
    if (filter.client_id) {
        query.client_id = new ObjectId(filter.client_id);
    }

    // Filter by freelancer_id (if provided)
    if (filter.freelancer_id) {
        query.freelancer_id = new ObjectId(filter.freelancer_id);
    }
    if (filter.id) {
        query._id = new ObjectId(filter.id);
    }
    return query;
};

// Create a new project
const createProject = async (projectData) => {
    try {
        const result = await projectCollection.insertOne(projectData);
        return await getProjectById(result.insertedId); // Return the newly created project with job info
    } catch (error) {
        throw error;
    }
};



module.exports = {
    getData,       // Ensure the name matches what the paginate utility expects
    countData,     // Ensure the name matches what the paginate utility expects
    createProject,
    getCandidate
};
