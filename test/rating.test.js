const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const server = require('../server');
const bcrypt = require('bcrypt');
const client = require('../dbConnection');
const usersCollection = client.db().collection('users');
const authCollection = client.db().collection('auths');
const jobCollection = client.db().collection('jobs');
const projectCollection = client.db().collection('projects');

chai.use(chaiHttp);

// Testing 
describe("Ratings and Reviews Feature", () => {
    let freelancerAcc, clientAcc, jobData, projectData;
    let cookie = [];
    
    before(async () => {
        console.log("TEST STARTED: Creating test data...");
        freelancerAcc = (await createTestFreelancer()).userData;
        clientAcc = (await createTestClient()).userData;
        let data = await createJobAndProjects(clientAcc._id, freelancerAcc._id);
        jobData = data.jobData;
        projectData = data.projectData;
    });

    after(async () => {
        console.log("TEST FINISHED: Removing test data...");
        await clearProfileTestData(freelancerAcc.email);
        await clearProfileTestData(clientAcc.email);
        await clearRatingTestData(jobData._id, projectData._id);
        console.log("Done");
    });

    describe('Rating by Client', () => {
        let ratingID;

        after(async () => {
            await chai.request(server)
                        .post('/logout')
                        .set('Cookie', cookie);
        });

        it('Should log in a user successfully', (done) => {
            chai.request(server)
                .post('/login')
                .send({ email: freelancerAcc.email, password: freelancerAcc.password })
                .end((err, res) => {
                    cookie = res.header["set-cookie"];
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('message', 'Logged in successfully! Redirecting...');
                    done();
                });
        });

        it('POST /profile/rating/add', () => {
            let sampleRating = {
                project_id: projectData._id,
                rater_id: clientAcc._id,
                ratee_id: freelancerAcc._id,
                rating: 5,
                review: "Good work",
                timestamp: new Date()
            }
            it("Should add successfully", function (done) {
                chai.request(server)
                    .post('/profile/rating/add')
                    .set('Cookie', cookie)
                    .send(sampleRating)
                    .end((err, res) => {
                        ratingID = res.body.insertedId;
                        expect(res).to.have.status(200);
                        expect(res.body.success).to.equal(true);
                        expect(res.body.message).to.equal("Successfully added new rating. Redirecting in few seconds...");
                        done();
                    })
            });
        });

        it('DELETE /profile/rating/delete', () => {
            let sampleRating = {
                rating_id: ratingID
            }
            it("Should delete successfully", function (done) {
                chai.request(server)
                    .delete('/profile/rating/delete')
                    .set('Cookie', cookie)
                    .send(sampleRating)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.success).to.equal(true);
                        expect(res.body.message).to.equal("Successfully deleted your review!");
                        done();
                    })
            });
        });
    })
})


// Preparing data for testing
function createTestFreelancer() {
    let testFreelancer = {
        email: 'freelance_test@gmail.com',
        password: 'Password1!',
        username: 'TestFreelancer'
    };
    return createAccount(testFreelancer, 'freelancer');
}

function createTestClient() {
    let testClient = {
        email: 'client_test@gmail.com',
        password: 'Password1!',
        username: 'TestClient'
    };
    return createAccount(testClient, 'client');
}

const clearProfileTestData = async (userEmail) => {
    await usersCollection.deleteMany({ email: userEmail });
    await authCollection.deleteMany({ email: userEmail });
}

const clearRatingTestData = async (jobID, projectID) => {
    await jobCollection.deleteMany({ _id: jobID });
    await projectCollection.deleteMany({ _id: projectID });
}

const createAccount = async (userData, userType) => {
    try {
        let password = userData.password;
        let email = userData.email;
        let username = userData.username;

        let saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await authCollection.insertOne({
            email,
            username,
            password: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });

        const userId = result.insertedId;

        let result2 = await usersCollection.insertOne({
            _id: userId,
            email,
            password: hashedPassword,
            role: userType,
            profile: {
                name: username,
                skills: [], // Default to empty array
                experience: '' // Default to empty string
            },
            contact_info: {
                phone: '', // Default to empty string
                address: '' // Default to empty string
            },
            created_at: new Date(),
            updated_at: new Date()
        });
        userData._id = userId;
        return { success: true, userData: userData };
    } catch (err) {
        console.log("There was an error when creating user account.");
        console.log(err);
        return { success: false, userData: {} };
    }
}

const createJobAndProjects = async (clientID, freelancerID) => {
    try {
        let jobData = {
            client_id: clientID,
            title: "Build a React application",
            description: "Need a skilled React developer to build a commercial application",
            requirements: ["React", "Node.js"],
            status: "open",
            created_at: new Date(),
            updated_at: new Date()
        };
        const jobResult = await jobCollection.insertOne(jobData);
        const jobID = jobResult.insertedId;
        jobData._id = jobID;

        let projectData = {
            client_id: clientID,
            freelancer_id: freelancerID,
            job_id: jobID,
            status: "done",
            // progress: "Finish deployment",
            created_at: new Date(),
            // updated_at: new Date()
        };
        let projectResult = await projectCollection.insertOne(projectData);
        const projectID = projectResult.insertedId;
        projectData._id = projectID;

        return { success: true, jobData: jobData, projectData: projectData };
    } catch (err) {
        console.log("There was an error when creating data.");
        console.log(err);
        return { success: false, jobData: {}, projectData: {} };
    }
}