let client = require('../dbConnection');
let collection = client.db().collection('ratings');
let projectCollection = client.db().collection('projects');
let userModel = require('../models/user');

const getUserRating = async (userID, callback) => {
    let query = { ratee_id: userID };

    /*
    collection.findOne(query).then((userRating)=>{
        console.log("Finding for: ", userID);
        console.log(typeof userID);
        if (!userRating) {
            console.log("No user rating found for: ", userRating);
        }
        console.log("userRating: ", userRating);
        callback(userRating);
        // let newQuery = { _id: userData._id };
        // collection.findOne(newQuery).then((result)=>{

        // })
        // collection.findOne(query)
        // callback(userData);
    });
    */
    const cursor = collection.find(query);
    if ( (await !collection.countDocuments(query))===0 ) {
        console.log("No user rating found");
    }
    
    let userRating = await processUserRating(await cursor.toArray());
    console.log("userRating: ", userRating);
    
    callback(userRating);
    /*
    .toArray((err, userRating) => {
        console.log("Finding for: ", userID);
        console.log(typeof userID);
        
        console.log("userRating: ", userRating);
        callback("abc");

        if (err) {
            throw err;
        }
        console.log(userRating);
        
    })
    then((userRating)=>{
        console.log("Finding for: ", userID);
        console.log(typeof userID);
        if (!userRating) {
            console.log("No user rating found for: ", userRating);
        }
        console.log("userRating: ", userRating);
        callback(userRating);
        // let newQuery = { _id: userData._id };
        // collection.findOne(newQuery).then((result)=>{

        // })
        // collection.findOne(query)
        // callback(userData);
    });
    */
}

const processUserRating = async (allUserRatings) => {
    let processedRatings = [];
    
    for (let i=0; i<allUserRatings.length; i++) {
        let userRating = allUserRatings[i];

        let dateObj = new Date(userRating.timestamp);

        let projectDetail = await getProjectDetail(userRating.project_id);

        let rater_data = await userModel.getNameByUserID(userRating.rater_id);
        let ratee_data = await userModel.getNameByUserID(userRating.ratee_id);

        processedRatings.push({
            project_status: projectDetail.status,
            project_duration: projectDetail.totalDays,
            rater_id: rater_data.profile.name,
            ratee_id: ratee_data.profile.name,
            rating: userRating.rating,
            review: userRating.review,
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString().toUpperCase()
        });
    };
    
    return processedRatings;
}

// Project detail: This may be transferred to projectModel
let getProjectDetail = async (projectID) => {
    let query = { _id: projectID };
    let result = await projectCollection.findOne(query);
    if (!result) {
        console.log("No user project found");
    }

    // Process data
    let projectDetail = {
        status: result.status,
        totalDays: Math.ceil((result.updated_at-result.created_at)/(1000*60*60*24))
    }

    return projectDetail;
}

module.exports = {
    getUserRating
}