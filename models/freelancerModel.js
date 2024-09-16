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

function getFreelancerById(id, callback) {
	collection.findOne({ _id: ObjectId(id) }, (err, freelancer) => {
		if (err) {
			callback(err, null); // Pass error back through callback
		} else if (!freelancer) {
			callback("Freelancer not found", null); // Pass 'not found' error
		} else {
			callback(null, freelancer); // Pass freelancer if found
		}
	});
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
