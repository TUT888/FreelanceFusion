const paginate = async (model, { page = 1, limit = 10, filter = {}}) => {
    const skip = (page - 1) * limit;

    try {
        // Fetch the total count of documents that match the filter using the model's countData method
        const totalCount = await model.countData(filter);

        // Fetch the paginated data using the model's getData method
        const data = await model.getData({ filter, skip, limit });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // Return pagination results
        return {
            data,
            currentPage: page,
            totalPages,
            totalCount,
            limit
        };
    } catch (err) {
        console.error("Error during pagination:", err);
        throw new Error('Error during pagination: ' + err.message);
    }
};

module.exports = {
    paginate
};
