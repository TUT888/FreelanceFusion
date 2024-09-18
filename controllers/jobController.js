
let collection = require('../models/jobModel');
const paginate = require('../utils/pagination');
const jobModel = require('../models/jobModel');

const getJobList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let filter = {};
    if (req.query.payType) filter.payType = req.query.payType;
    if (req.query.salaryMin) filter.salaryMin = parseFloat(req.query.salaryMin); 
    if (req.query.salaryMax) filter.salaryMax = parseFloat(req.query.salaryMax);  
    if (req.query.requirements) filter.requirements = req.query.requirements.split(',').map(skill => skill.trim());  
    if (req.query.status) filter.status = req.query.status;  
    if (req.query.keyword) filter.keyword = req.query.keyword;  

    try {
        // Pass the jobModel to the paginate function
        const paginationResult = await paginate.paginate(
            collection, // Pass the whole model
            { page, limit, filter } // Pagination options
        );

        if (paginationResult.data.length === 0 && page > 1) {
            // Redirect to the previous valid page or the first page if none exists
            return res.redirect(`/jobs/search?page=${Math.max(1, paginationResult.totalPages)}`);
        }

        res.render('jobSearch', {
            jobsList: paginationResult.data,
            currentPage: paginationResult.currentPage,
            totalPages: paginationResult.totalPages,
            filters: req.query,
            session: req.session
        });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).send('Error fetching jobs');
    }
};


const getJobDetail = async (req, res) => {
    const jobId = req.params.id;
    const session = req.session;
    // Fetch the job details asynchronously from the model
    try {
        let job = await collection.getJobById(jobId);
        if (job) {
            res.render('partials/jobSearchDetail', { job, session });
        } else {
            res.status(404).send('Job not found');
        }
    } catch (error) {
        console.log(error)
    }

};


// Render the Add Job form
const getAddJobForm = (req, res) => {
    res.render('jobForm', { job: null, action: '/jobs/add', formTitle: 'Add Job',session: req.session });
};

// Handle Add Job form submission
const addJob = async (req, res) => {
    const { title, description, payment_type, salary, requirements, status } = req.body;
    const jobData = {
        title,
        description,
        payment_type,
        salary: parseFloat(salary),
        requirements: requirements.split(',').map(skill => skill.trim()),
        status,
        created_at: new Date(),
        updated_at: new Date()
    };

    console.log("TEST:: ", jobData);

    try {
        await jobModel.createJob(jobData);
        res.redirect('/jobs/search');
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).send('Error creating job');
    }
};

// Render the Edit Job form
const getEditJobForm = async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await jobModel.getJobById(jobId);
        res.render('jobForm', { job, action: `/jobs/edit/${jobId}`, formTitle: 'Edit Job' ,session: req.session});
    } catch (error) {
        console.error('Error fetching job for edit:', error);
        res.status(500).send('Error fetching job');
    }
};

// Handle Edit Job form submission
const editJob = async (req, res) => {
    const jobId = req.params.id;
    const { title, description, payment_type, salary, requirements, status } = req.body;
    const jobData = {
        title,
        description,
        payment_type,
        salary: parseFloat(salary),
        requirements: requirements.split(',').map(skill => skill.trim()),
        status,
        updated_at: new Date()
    };

    try {
        await jobModel.updateJob(jobId, jobData);
        res.redirect('/jobs/search');
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).send('Error updating job');
    }
};

module.exports = {
    getJobList,
    getJobDetail,
    getAddJobForm,
    addJob,
    getEditJobForm,
    editJob
};
