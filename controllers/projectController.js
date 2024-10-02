
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
        console.log(req.session.user.id);
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
        const application = await applicationModel.getApplicationByJob(jobId);
        res.json(application);
    } catch (error) {
        console.error('Error fetching project candidates:', error);
        res.status(500).send('Error fetching candidates');
    }
};


const createProject = async (req, res) => {
    const { freelancerId, jobId } = req.body;
    const session = req.session;

    // Validate the input
    if (!freelancerId || !jobId) {
        return res.status(400).json({ success: false, error: 'freelancerId and jobId are required' });
    }

    try {
        // Call the model to insert the new project (hiring the freelancer)
        const projectResult  = await projectModel.insertProject(jobId, freelancerId, session.user.id);
        const applicationResult = await applicationModel.updateApplication(jobId, freelancerId, "hired");

        res.json({ success: true, message: 'Freelancer hired and application status updated.' });

    } catch (error) {
        console.error('Error inserting project:', error);
        res.status(500).json({ success: false, error: 'An error occurred while hiring the freelancer' });
    }
};

const deleteProject = async (req, res) => {
    const { projectId } = req.params; // Get projectId from URL parameters

    console.log("test123")
    console.log(projectId)

    
    // Validate the input
    if (!projectId) {
        return res.status(400).json({ success: false, error: 'Project ID is required' });
    }

    try {
        // Check if the project exists and belongs to the logged-in user (optional check)
        let filter = {};
        filter.id = projectId;

        const project = await projectModel.getProject(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        console.log(project.job_id)
        const applicationResult = await applicationModel.updateApplication(project.job_id, "", "pending");


        // Call the model to delete the project
        await projectModel.deleteProject(projectId);
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, error: 'An error occurred while deleting the project' });
    }
};

module.exports = {
    getProjectList,
    getDefaultProject,
    getCandidateList,
    getCandidate,
    createProject,
    deleteProject

};
