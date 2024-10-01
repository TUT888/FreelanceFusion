
let jobModel = require('../models/jobModel');
let applicationModel = require('../models/applicationModel');
let projectModel = require('../models/projectModel');
const paginate = require('../utils/pagination');

const getProjectList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let session_user = req.session.user;
    let template = "";
    let filter = {};

    if (session_user.role == "client") {
        template = "projectClient";
        console.log(req.session.user.id)
        filter.client_id = req.session.user.id;
    }else if(session_user.role == "freelancer"){
        console.log("test");
        console.log(req.session.user.id);
        
        template = "projectFreelancer";
        filter.freelancer_id = req.session.user.id;
    }

    try {
        let paginationResult;
        // Pass the jobModel to the paginate function
        if (session_user.role == "client") {
            paginationResult = await paginate.paginate(
                jobModel, // Pass the whole model
                { page, limit, filter } // Pagination options
            );
        }else if(session_user.role == "freelancer"){
            paginationResult = await paginate.paginate(
                projectModel, // Pass the whole model
                { page, limit, filter } // Pagination options
            );
        }

        console.log("test start");
        console.log(paginationResult.data);

        if (paginationResult.data.length === 0 && page > 1) {
            // Redirect to the previous valid page or the first page if none exists
            return res.redirect(`/projects?page=${Math.max(1, paginationResult.totalPages)}`);
        }
        console.log(paginationResult.data)
        res.render(template, {
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

const getDefaultProject  = async (req, res) => {
    const session = req.session;

    res.render('partials/projectProgress', {session });
};


const getCandidateList = async (req, res) => {
    const jobId = req.params.jobId;

    try {
        // Fetch applications for the project
        const applications = await applicationModel.getApplicationsByJob(jobId);
        res.json(applications);

    } catch (error) {
        console.error('Error fetching project candidates:', error);
        res.status(500).send('Error fetching candidates');
    }
};

const getCandidate = async (req, res) => {
    const jobId = req.params.jobId;

    try {
        // Fetch applications for the project
        const application = await applicationModel.getApplicationsByJob(jobId);
        console.log("test")
        console.log(application)
        res.json(application);

    } catch (error) {
        console.error('Error fetching project candidates:', error);
        res.status(500).send('Error fetching candidates');
    }
};

module.exports = {
    getProjectList,
    getDefaultProject,
    getCandidateList,
    getCandidate

};
