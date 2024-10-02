const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const server = require('../server');
const bcrypt = require('bcrypt');
const client = require('../dbConnection');
const usersCollection = client.db().collection('users');
const authCollection = client.db().collection('auths');

chai.use(chaiHttp);

// Testing 
describe("Profile Management Feature", () => {
    let freelancerAcc, clientAcc;
    let cookie = [];

    before(async () => {
        console.log("TEST STARTED: Creating test data...");
        freelancerAcc = (await createTestFreelancer()).userData;
        clientAcc = (await createTestClient()).userData;
    });

    after(async () => {
        console.log("TEST FINISHED: Removing test data...");
        await clearTestData(freelancerAcc.email);
        await clearTestData(clientAcc.email);
        console.log("Done");
    });

    describe('Freelancer Profile Test', () => {
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
                    console.log(cookie);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('message', 'Logged in successfully! Redirecting...');
                    done();
                });
        });

        describe('Freelancer GET /profile', () => {
            it("Should render profile page", (done) => {
                chai.request(server)
                    .get('/profile')
                    .set('Cookie', cookie)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    })
            })
        })

        describe('Freelancer PUT /profile/update', () => {
            let sampleData = {
                contact_info: {
                    address: "Dev Street",
                    phone: "1234567788"
                },
                profile: {
                    experience: "3 years experience in NodeJS",
                    name: "TestFreelancer",
                    skills: ["NodeJS", "Java"]
                }
            }

            it("Should update successfully", function (done) {
                chai.request(server)
                    .put('/profile/update')
                    .set('Cookie', cookie)
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(sampleData))
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.success).to.equal(true);
                        expect(res.body.modifiedCount).to.equal(1);
                        done();
                    })
            });

            it("Should update failed due to no changes are made", function (done) {
                chai.request(server)
                    .put('/profile/update')
                    .set('Cookie', cookie)
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(sampleData))
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body.success).to.equal(false);
                        expect(res.body.message).to.equal("There are no changes made.");
                        done();
                    })
            });
        });
    })

    describe('Client Profile Test', () => {
        after(async () => {
            await chai.request(server)
                        .post('/logout')
                        .set('Cookie', cookie);
        });

        it('Should log in a user successfully', (done) => {
            chai.request(server)
                .post('/login')
                .send({ email: clientAcc.email, password: clientAcc.password })
                .end((err, res) => {                    
                    cookie = res.header["set-cookie"];
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('message', 'Logged in successfully! Redirecting...');
                    done();
                });
        });

        describe('Client GET /profile', () => {
            it("Should render profile page", (done) => {
                chai.request(server)
                    .get('/profile')
                    .set('Cookie', cookie)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                    })
            })
        })

        describe('Client PUT /profile/update', () => {
            let sampleData = {
                contact_info: {
                    address: "Company Street",
                    phone: "1234567788"
                },
                profile: {
                    company_details: "InnoTech Corp",
                    name: "TestClient"
                }
            }

            it("Should update successfully", function (done) {
                chai.request(server)
                    .put('/profile/update')
                    .set('Cookie', cookie)
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(sampleData))
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.success).to.equal(true);
                        expect(res.body.modifiedCount).to.equal(1);
                        done();
                    })
            });

            it("Should update failed due to no changes are made", function (done) {
                chai.request(server)
                    .put('/profile/update')
                    .set('Cookie', cookie)
                    .set('content-type', 'application/json')
                    .send(JSON.stringify(sampleData))
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body.success).to.equal(false);
                        expect(res.body.message).to.equal("There are no changes made.");
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

const clearTestData = async (userEmail) => {
    await usersCollection.deleteMany({ email: userEmail });
    await authCollection.deleteMany({ email: userEmail });
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

