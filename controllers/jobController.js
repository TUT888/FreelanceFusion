let collection = require('../models/jobModel');
const paginate = require('../utils/pagination');

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
            filters: req.query
        });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).send('Error fetching jobs');
    }
};


const getJobDetail = async (req, res) => {
    const jobId = req.params.id;
    // Fetch the job details asynchronously from the model
    try {
        let job = await collection.getJobById(jobId);
        if (job) {
            res.render('partials/jobSearchDetail', { job });
        } else {
            res.status(404).send('Job not found');
        }
    } catch (error) {
        console.log(error)
    }

};



module.exports = {
    getJobList,
    getJobDetail
};
