let client = require('../dbConnection');
let collection = client.db().collection('jobs');
const { ObjectId } = require('mongodb');


// Fetch jobs with optional filtering
const getData = async ({ filter, skip, limit }) => {
    let query = buildJobFilterQuery(filter);  // Build the query using the filters
    // return await collection.find(query).skip(skip).limit(limit).toArray();
    let result = await collection.aggregate([
        { $match: query }, // Match projects based on filter criteria
        {
            $lookup: {
                from: 'projects',
                localField: '_id',
                foreignField: 'job_id',
                as: 'project_info'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'freelancer_id',
                foreignField: '_id',
                as: 'freelancer_info'
            }
        },
        { $skip: skip }, // Pagination: Skip the specified number of documents
        { $limit: limit } // Pagination: Limit the number of documents returned
    ]).toArray();
    return result;
};



const countData = async (filter) => {
    let query = buildJobFilterQuery(filter);  // Build the query using the filters
    return await collection.countDocuments(query);
};


const getJobById = async (id) => {

    
    try {
        const job = await collection.findOne({ _id: new ObjectId(id) }); 
        if (!job) {
            throw new Error('Job not found'); // Throw an error if job is not found
        }
        return job; // Return the job if found
    } catch (error) {
        throw error; // Throw the error to be handled by the caller
    }
};


const buildJobFilterQuery = (filter) => {
    let query = {};

    // Filter by pay type (hourly or project-based)
    if (filter.payType) {
        query.payment_type = filter.payType;  // e.g., { payType: 'hourly' }
    }

    // Filter by salary range (min/max)
    if (filter.salaryMin || filter.salaryMax) {
        query.salary = {};
        if (filter.salaryMin) query.salary.$gte = filter.salaryMin;  // e.g., { salary: { $gte: 20 } }
        if (filter.salaryMax) query.salary.$lte = filter.salaryMax;  // e.g., { salary: { $lte: 50 } }
    }

    // Filter by requirements (array of skills)
    if (filter.requirements && filter.requirements.length > 0) {
        // query.requirements = { $all: filter.requirements };  // e.g., { requirements: { $all: ['React', 'Node.js'] } }
        const regexRequirements = filter.requirements.map(req => {
            return { requirements: { $regex: req, $options: 'i' } };  // case-insensitive regex
        });

        // Use $or to match any of the entered skills
        query.$and = regexRequirements;
    }

    if (filter.keyword) {
        const keywordRegex = new RegExp(filter.keyword, 'i');  // case-insensitive regex

        query.$or = [
            { title: { $regex: keywordRegex } },
            { description: { $regex: keywordRegex } },
            { requirements: { $regex: keywordRegex } }
        ];
    }

    // Filter by job status (open or closed)
    if (filter.status) {
        query.status = filter.status;  // e.g., { status: 'open' }
    }

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

// Create a new job
const createJob = async (jobData) => {
    try {
        const result = await collection.insertOne(jobData);
        return await getJobById(result.insertedId);
    } catch (error) {
        throw error;
    }
};

// Update an existing job
const updateJob = async (id, jobData) => {
    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: jobData }
        );
        if (result.matchedCount === 0) {
            throw new Error('Job not found');
        }
        return await getJobById(id);
    } catch (error) {
        throw error;
    }
};

const getJobsByClientId = async (clientId) => {

    try {
        const jobs = await collection.find({ client_id: new ObjectId(clientId) }).toArray();
        return jobs;
    } catch (err) {
        console.error("Error fetching jobs by client ID:", err);
        throw err;
    }
};


module.exports = {
    getData,
    countData,
    getJobById,
    createJob,
    updateJob,
    getJobsByClientId
};