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
const getProject = async(projectId)=>{
    var query = {
        _id: new ObjectId(projectId),
    }
    return await projectCollection.find(query).toArray();

}

// Insert a new project with the freelancer_id and job_id
const insertProject = async (jobId, freelancerId, clientId) => {
    const newProject = {
        client_id: new ObjectId(clientId),
        job_id: new ObjectId(jobId),
        freelancer_id: new ObjectId(freelancerId),
        status: 'in-progress',
        created_at: new Date()
    };

    return await projectCollection.insertOne(newProject);
};

const deleteProject = async (projectId) => {
    return await projectCollection.deleteOne({ _id: new ObjectId(projectId) });
};


const getProjectById = async (projectId) => {
    try {
        const project = await projectCollection.findOne({ _id: new ObjectId(projectId) });
        return project;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw new Error('Error fetching project');
    }
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




module.exports = {
    getData,
    countData,
    getCandidate,
    insertProject,
    deleteProject,
    getProject,
    getProjectById
};
