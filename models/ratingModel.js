let client = require('../dbConnection');
let collection = client.db().collection('ratings');
let projectCollection = client.db().collection('projects');
let userModel = require('../models/user');
let jobModel = require('../models/jobModel');
const { ObjectId } = require('mongodb');

const getUserRating = async (userID, userRole, callback) => {
    let query;
    if (userRole==='freelancer') {
        query = { ratee_id: userID };
    } else {
        query = { rater_id: userID };
    }
    
    const cursor = collection.find(query);
    if ( (await !collection.countDocuments(query))===0 ) {
        console.log("No user rating found");
    }
    
    let userRating = await processUserRating(await cursor.toArray());
    
    callback(userRating);
}

const processUserRating = async (allUserRatings) => {
    let processedRatings = [];
    
    for (let i=0; i<allUserRatings.length; i++) {
        let userRating = allUserRatings[i];

        let dateObj = new Date(userRating.timestamp);

        let projectDetail = await getProjectDateAndStatus(userRating.project_id);
        
        let rater_data = await userModel.getNameByUserID(userRating.rater_id);
        let ratee_data = await userModel.getNameByUserID(userRating.ratee_id);

        processedRatings.push({
            rating_id: userRating._id,
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

const deleteGivenRating = async (ratingID, callback) => {
    const query = { _id: new ObjectId(ratingID) };
    let result = await collection.deleteOne(query);

    callback(result);
}

const addNewRating = async (dataObj, callback) => {
    const insertVal = {
        project_id: new ObjectId(dataObj.project_id),
        rater_id: new ObjectId(dataObj.rater_id),
        ratee_id: new ObjectId(dataObj.ratee_id),
        rating: dataObj.rating,
        review: dataObj.review,
        timestamp: dataObj.timestamp,
    }

    let result = await collection.insertOne(insertVal);
    
    if (result.insertedId) {
        console.log(
            `Successfully inserted new rating!`,
        );
    } else {
        console.log(
            `Insertion failed. Please try again later`,
        );
    }
    callback(result);
}

// PROJECT THINGS within RATING MODELS
// Get project date and status
const getProjectDateAndStatus = async (projectID) => {
    console.log(projectID);
    let query = { _id: projectID };
    let result = await projectCollection.findOne(query);

    let projectDetail;
    if (!result) {
        console.log("No user project found");
        projectDetail = {
            status: "Unknown",
            totalDays: 0
        }
    } else {
        // Process data
        let currentDate = new Date();
        projectDetail = {
            status: result.status,
            // totalDays: Math.ceil((result.updated_at-result.created_at)/(1000*60*60*24))
            totalDays: Math.ceil((currentDate-result.created_at)/(1000*60*60*24))
        }
    }

    return projectDetail;
}

// Get available project for selection
const getProjectForRating = async (raterID, callback) => {
    let query = { client_id: raterID };

    const cursor = projectCollection.find(query);
    if ( (await !projectCollection.countDocuments(query))===0 ) {
        console.log("No project found for: ", raterID);
    }
    
    let projectForRating = await processProjectForRating(await cursor.toArray());
    
    callback(projectForRating);
}

const processProjectForRating = async (availableProjects) => {
    let processedProjectData = [];
    
    for (let i=0; i<availableProjects.length; i++) {
        let projectData = availableProjects[i];
        // Check
        let query = { 
            project_id: new ObjectId(projectData._id), 
            rater_id: new ObjectId(projectData.client_id)
        };
        const cursor = collection.find(query);
        const countVal = (await cursor.toArray()).length;
        
        if ( countVal===0 ) {
            // Process
            let freelancer_data = await userModel.getNameByUserID(projectData.freelancer_id);

            let projectCreatedDateObj = new Date(projectData.created_at);
            let projectUpdateDateObj = new Date(projectData.updated_at);
            // let duration = `${projectCreatedDateObj.toLocaleDateString()} - ${projectUpdateDateObj.toLocaleDateString()}`;
            let duration = projectCreatedDateObj.toLocaleDateString();

            let project_info = `${freelancer_data.profile.name}: project ${(projectData.status).replace("_", " ")} (${duration})`
            processedProjectData.push({  
                project_id: projectData._id,
                project_info: project_info
            });
        }        
    };
    return processedProjectData;
}

// Get specific project detail
const getProjectDetailForRating = async (projectID, callback) => {
    let query = { _id: new ObjectId(projectID) };

    let result = await projectCollection.findOne(query);
    if (!result) {
        console.log("No user project found for: ", projectID);
    }
    
    let projectDetailForRating = await processProjectDetailForRating(result);
    
    callback(projectDetailForRating);
}

const processProjectDetailForRating = async (projectData) => {
    let freelancer_data = await userModel.getNameByUserID(projectData.freelancer_id);
    let job_data = await jobModel.getJobById(projectData.job_id);

    let projectCreatedDateObj = new Date(projectData.created_at);
    let projectUpdateDateObj = new Date(projectData.updated_at);
    let jobPostDateObj = new Date(job_data.created_at);

    let start_date = `${projectCreatedDateObj.toLocaleDateString()} - ${projectCreatedDateObj.toLocaleTimeString()}`;
    // let last_date = `${projectUpdateDateObj.toLocaleDateString()} - ${projectUpdateDateObj.toLocaleTimeString()}`;
    let job_post_date = `${jobPostDateObj.toLocaleDateString()} - ${jobPostDateObj.toLocaleTimeString()}`;
    processedProjectData = {  
        project_id: projectData._id,
        client_id: projectData.client_id,
        freelancer_id: projectData.freelancer_id,
        project_info: {
            freelancer_name: freelancer_data.profile.name,
            status: (projectData.status).replace("_", " "),
            // progress: projectData.progress,
            start_date: start_date,
            // last_date: last_date
        },
        job_info: {
            job_title: job_data.title,
            job_desc: job_data.description,
            job_post_date: job_post_date
        } 
    };
    return processedProjectData;
}

// Change project status to done
const changeStatusToDone = async (projectID, callback) => {
    let filter = { _id: new ObjectId(projectID) };
    let updateDoc = { $set: { status: "done" } };
    
    projectCollection.updateOne(filter, updateDoc).then((result)=>{
        console.log(
            `Found ${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
        callback(result);
    })
}

module.exports = {
    getUserRating,
    deleteGivenRating,
    getProjectForRating,
    getProjectDetailForRating,
    addNewRating,
    changeStatusToDone
}