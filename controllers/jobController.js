
let collection = require('../models/jobModel');
const paginate = require('../utils/pagination');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const { ObjectId } = require('mongodb');

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
            return res.redirect(`/jobs/search?page=${page - 1}`);
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

    try {
        // Fetch the job details asynchronously from the model
        let job = await collection.getJobById(jobId);

        // Check if the user has already applied
        let existingApplication = false;

        // Check if the session and user data exist
        if (session && session.user) {
            existingApplication = await applicationModel.findOne({
                job_id: new ObjectId(jobId),
                freelancer_id: new ObjectId(session.user.id),
            });
        }


        if (job) {
            res.render('partials/jobSearchDetail', { job, session, alreadyApplied: !!existingApplication });
        } else {
            res.status(404).send('Job not found');
        }
    } catch (error) {
        console.error("Error fetching job details:", error);
        res.status(500).send('Error fetching job details');
    }
};



const getAddJobForm = (req, res) => {
    res.render('jobForm', { job: null, action: '/jobs/add', formTitle: 'Add Job',session: req.session });
};

const addJob = async (req, res) => {
    const session = req.session;
    const { title, description, payment_type, salary, requirements, status } = req.body;
    const clientId = req.session.user.id; 
    const userRole = req.session.user.role; 

    if (userRole !== 'client') {
        return res.status(403).send('Forbidden: Only clients can add jobs');
    }
    const jobData = {
        client_id: new ObjectId(session.user.id),
        title,
        description,
        payment_type,
        salary: parseFloat(salary),
        requirements: requirements.split(',').map(skill => skill.trim()),
        status,
        client_id: new ObjectId(clientId),
        created_at: new Date(),
        updated_at: new Date()
    };

    try {
        await jobModel.createJob(jobData);
        res.redirect('/jobs');
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).send('Error creating job');
    }
};

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

const editJob = async (req, res) => {
    const jobId = req.params.id; 
    const userRole = req.session.user.role; 

    if (userRole !== 'client') {
        return res.status(403).send('Forbidden: Only clients can edit jobs');
    }
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
        res.redirect('/jobs');
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).send('Error updating job');
    }
};

const getClientJobs = async (req, res) => {
    const userId = req.session.user.id; 
    const userRole = req.session.user.role; 
   
    if (userRole !== 'client') {
        return res.status(403).send('Access denied');
    }

    try {
        const jobs = await jobModel.getJobsByClientId(userId); 

        res.render('clientJobs', {
            jobsList: jobs,
            session: req.session
        });
    } catch (err) {
        console.error("Error fetching client jobs:", err);
        res.status(500).send('Error fetching client jobs');
    }
};


const applyForJob = async (req, res) => {
    const jobId = req.params.jobId;
    const session = req.session;
    console.log(jobId)
    // Ensure the user is logged in
    if (!session || !session.user || session.user.role !== 'freelancer') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        // Prepare the application data
        const applicationData = {
            job_id: new ObjectId(jobId),
            freelancer_id: new ObjectId(session.user.id),
            status: 'pending',
            cover_letter: req.body.cover_letter || '',
            applied_at: new Date(),
            updated_at: new Date()
        };

        // Insert the application into the collection
        await applicationModel.insertApplication(applicationData);

        // Respond with success
        res.status(201).json({ success: true, message: 'Application submitted successfully!' });

    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ success: false, error: 'Error applying for the job' });
    }
};


module.exports = {
    getJobList,
    getClientJobs,
    getJobDetail,
    getAddJobForm,
    addJob,
    getEditJobForm,
    editJob,
    applyForJob
};
