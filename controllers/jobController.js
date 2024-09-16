let jobCollection = require('../models/job');

// Display all jobs
const displayJobs = (req, res) => {
    jobCollection.getJobsdata((err, result) => {
        if (err) {
            return res.status(500).send("Error fetching jobs.");
        }
        res.render("jobs", {
            jobs: result
        });
    });
}

// Display specific job details using job ID
const displayJobDetails = (req, res) => {
    let jobId = req.params.id; // Assuming job ID is passed via URL parameter
    jobCollection.getJobByIdData(jobId, (err, result) => {
        if (err || !result) {
            return res.status(404).send("Job not found.");
        }
        res.render("job_detail", {
            job: result
        });
    });
}

// Create a new job
const createJob = (req, res) => {
    if (req.method === 'POST') {
        let job = {
            client_id: req.body.client_id,
            title: req.body.title,
            description: req.body.description,
            requirements: req.body.requirements.split(','),
            status: 'open',
            created_at: new Date(),
            updated_at: new Date()
        };
        jobCollection.createJobData(job, (err, result) => {
            if (err) {
                return res.status(500).send("Error creating job.");
            }
            res.redirect('/jobs');
        });
    }
     else {
        res.render('job_form', { job: null });
    }
    
}

// Edit a job
const editJob = (req, res) => {
    let jobId = req.params.id;
    jobCollection.getJobByIdData(jobId, (err, job) => {
        if (err || !job) {
            return res.status(404).send("Job not found.");
        }
        if (req.method === 'POST') {
            let updatedJob = {
                title: req.body.title,
                description: req.body.description,
                requirements: req.body.requirements.split(','),
                status: req.body.status,
                updated_at: new Date()
            };
            jobCollection.updateJobData(jobId, updatedJob, (err, result) => {
                if (err) {
                    return res.status(500).send("Error updating job.");
                }
                res.redirect(`/jobs/${jobId}`);
            });
        } else {
            res.render('job_form', { job });
        }
    });
}

module.exports = {
    displayJobs,
    displayJobDetails,
    createJob,
    editJob
}
