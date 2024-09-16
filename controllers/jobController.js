let collection = require('../models/jobModel');

const displayJobs = (req, res) => {
    let filter = {
        jobType: req.query.jobType || null // Get jobType from query parameters if present
    };

    // Fetch jobs based on the filter
    collection.getJobs(filter, (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching jobs');
        }

        // Render the jobs view
        res.render("job", {
            jobsList: result
        });
    });
};


const getJobDetail = (req, res) => {
    const jobId = req.params.id;
    // Fetch the job details asynchronously from the model
    collection.getJobById(jobId, (err, job) => {
        if (err) {
            return res.status(404).send('Job not found');
        }

        if (job) {
            res.render('partials/jobDetail', { job });
        } else {
            res.status(404).send('Job not found');
        }
    });
};



module.exports = {
    displayJobs,
    getJobDetail
};
