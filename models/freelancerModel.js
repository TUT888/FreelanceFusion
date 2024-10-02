let client = require("../dbConnection");
let collection = client.db().collection("users");
const { ObjectId } = require("mongodb");

// Fetch freelancers with optional filtering
const getData = async ({ filter, skip, limit }) => {
	let query = buildJobFilterQuery(filter); // Build the query using the filters
	return await collection.find(query).skip(skip).limit(limit).toArray();
};
const countData = async (filter) => {
	let query = buildJobFilterQuery(filter); // Build the query using the filters
	return await collection.countDocuments(query);
};

const getFreelancerById = async (id) => {
	try {
        const freelancer = await collection.findOne({ _id: new ObjectId(id) }); 
        if (!freelancer) {
            throw new Error('Freelancer not found'); // Throw an error if freelancer is not found
        }
        return freelancer; // Return the freelancer if found
    } catch (error) {
        throw error; // Throw the error to be handled by the caller
    }
}


const buildJobFilterQuery = (filter) => {
	let query = {};

	// Ensure freelancers have both skills and experience fields populated
	query.$and = [
		{ "profile.skills": { $exists: true, $ne: [] } }, // Ensure skills exist and are not an empty array
		{ "profile.experience": { $exists: true, $ne: "" } }, // Ensure experience exists and is not an empty string
	];

	// Keyword filtering for name, skills, and experience
	if (filter.keyword) {
		const regexKeyword = new RegExp(filter.keyword, "i"); // Case-insensitive regex for partial matches
		query.$or = [
			{ "profile.skills": { $regex: regexKeyword } },
			{ "profile.experience": { $regex: regexKeyword } },
		];
	}

	return query;
};

module.exports = {
	getData,
	countData,
	getFreelancerById,
};
