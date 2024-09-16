let client = require('../dbConnection');
let collection = client.db().collection('jobs');
const { ObjectId } = require('mongodb');

const dummyJobs = [
    {
        _id: "66e3e9fa43847891e4a86e90",
        title: "Build a React Application",
        description: "Need a skilled React developer to build a web application.",
        requirements: ["React", "Node.js"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e91",
        title: "Design a Marketing Website",
        description: "Looking for a UI/UX designer to create a marketing website.",
        requirements: ["HTML", "CSS", "JavaScript"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e92",
        title: "Mobile App Development",
        description: "Need an experienced developer to create a mobile application.",
        requirements: ["Flutter", "Firebase"],
        status: "closed",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e93",
        title: "E-Commerce Website Development",
        description: "Looking for a developer to create an e-commerce platform with payment integration.",
        requirements: ["Magento", "PHP", "MySQL"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e94",
        title: "SEO Optimization for Existing Website",
        description: "Need an SEO expert to optimize the content and structure of an existing website.",
        requirements: ["SEO", "Google Analytics"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e95",
        title: "Custom CRM Development",
        description: "Need a developer to build a custom CRM system for a small business.",
        requirements: ["PHP", "MySQL", "JavaScript"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e96",
        title: "WordPress Plugin Development",
        description: "Looking for a WordPress developer to create a custom plugin for a client website.",
        requirements: ["WordPress", "PHP"],
        status: "closed",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e97",
        title: "Cloud Migration for Business Application",
        description: "Need a cloud engineer to help migrate a legacy business application to AWS.",
        requirements: ["AWS", "Linux", "Docker"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e98",
        title: "Data Analysis for Marketing Campaign",
        description: "Looking for a data analyst to analyze marketing data and generate reports.",
        requirements: ["Python", "Pandas", "Data Visualization"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        _id: "66e3e9fa43847891e4a86e99",
        title: "Cybersecurity Audit",
        description: "Need a cybersecurity expert to perform a full audit on an internal network.",
        requirements: ["Cybersecurity", "Network Security", "Penetration Testing"],
        status: "open",
        created_at: new Date(),
        updated_at: new Date()
    }
];

// Fetch jobs with optional filtering
function getJobs(filter, callback) {
    let query = {};
    // add filter here

    // retrieve jobs list
    collection.find(query).toArray(callback);

    // uncomment to use dummy data for testing
    // setTimeout(() => {
    //     // Filtering the dummyJobs based on the query
    //     const results = dummyJobs.filter(job => {
    //         return Object.keys(query).every(key => job[key] === query[key]);
    //     });

    //     // Returning the result via the callback
    //     callback(null, results);
    // }, 100);

}

function getJobById(id, callback) {
    collection.findOne({ _id: ObjectId(id) }, (err, job) => {
        if (err) {
            callback(err, null); // Pass error back through callback
        } else if (!job) {
            callback('Job not found', null); // Pass 'not found' error
        } else {
            callback(null, job); // Pass job if found
        }
    });

    // uncomment to use dummy data for testing
    // setTimeout(() => {
    //     const job = dummyJobs.find(job => job._id === id);

    //     if (job) {
    //         callback(null, job); // Return the job via callback
    //     } else {
    //         callback('Job not found', null); // Return error if job not found
    //     }
    // }, 100);

}


module.exports = {
    getJobs,
    getJobById
};
