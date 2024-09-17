let collection = require('../models/freelancerModel');
const paginate = require('../utils/pagination');

const getFreelancerList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let filter = { role: 'freelancer' };
    if (req.query.keyword) filter.keyword = req.query.keyword;  

    try {
        // Pass the jobModel to the paginate function
        const paginationResult = await paginate.paginate(
            collection, // Pass the whole model
            { page, limit, filter } // Pagination options
        );

        if (paginationResult.data.length === 0 && page > 1) {
            // Redirect to the previous valid page or the first page if none exists
            return res.redirect(`/freelancers?page=${Math.max(1, paginationResult.totalPages)}`);
        }

        res.render('freelancer', {
            freelancersList: paginationResult.data,
            currentPage: paginationResult.currentPage,
            totalPages: paginationResult.totalPages,
            filters: req.query,
            session: req.session

        });
    } catch (err) {
        console.error("Error fetching freelancers:", err);
        res.status(500).send('Error fetching freelancers');
    }
};

const getFreelancerDetail = async (req, res) => {
    const freelancerId = req.params.id;

    // Assuming the freelancer list is available as dummy data or MongoDB
    let freelancer = await collection.getFreelancerById(freelancerId);
    if (freelancer) {
        res.render('partials/freelancerDetail', { freelancer });
    } else {
        res.status(404).send('Freelancer not found');
    }
};

module.exports = {
    getFreelancerList,
    getFreelancerDetail
};
