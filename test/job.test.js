const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../server"); // Your Express app
const jobModel = require("../models/jobModel"); // Your Job model

chai.use(chaiHttp); // Register chai-http

describe("Job Controller", () => {
    let mockJobs;

    beforeEach(() => {
        app.request.session = {
            user: {
                id: "66f55a859fcd32a0418a3ccc", // Mock user ID
                role: "freelancer" // Mock user role
            }
        };

        // Define mock job data based on your MongoDB document structure
        mockJobs = [
            {
                _id: "66f55a859fcd32a0418a3bbb",
                client_id: "66f55a859fcd32a0418a3ccc",
                title: "Front-end Developer",
                description: "Looking for a skilled front-end developer",
                payment_type: "hourly",
                salary: 50,
                requirements: ["JavaScript", "React"],
                status: "open",
                created_at: "2024-09-26T12:58:45.545Z",
                updated_at: "2024-09-26T12:58:45.546Z",
                __v: 0,
            },
        ];

        // Mock jobModel.getData() to return mock data for the list of jobs
        jobModel.getData = () => Promise.resolve(mockJobs);

        // Mock jobModel.getJobById() for fetching job details by ID
        jobModel.getJobById = (id) => {
            if (id === "66f55a859fcd32a0418a3bbb") {
                return Promise.resolve(mockJobs[0]);
            } else {
                return Promise.resolve(null);
            }
        };
    });

    describe("GET /jobs/search", () => {
        it("should return a list of jobs and render the job view", (done) => {
            chai
                .request(app)
                .get("/jobs/search")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include("Front-end Developer");
                    expect(res.text).to.include("JavaScript");
                    expect(res.text).to.include("React");
                    expect(res.text).to.include("Looking for a skilled front-end developer");
                    done();
                });
        });

        it("should apply pagination and return the correct page of jobs", (done) => {
            chai
                .request(app)
                .get("/jobs/search?page=1&limit=1")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include("Front-end Developer");
                    done();
                });
        });

        it("should redirect to page 1 if no jobs are found on the current page", (done) => {
            jobModel.getData = () => Promise.resolve([]); // Simulate empty job data
            chai
                .request(app)
                .get("/jobs/search?page=2")
                .redirects(0)
                .end((err, res) => {
                    expect(res).to.have.status(302);
                    expect(res).to.have.header("location", "/jobs/search?page=1");
                    done();
                });
        });

        it("should return a filtered list of jobs based on keyword", (done) => {
            chai
                .request(app)
                .get("/jobs/search?keyword=front-end")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include("Front-end Developer");
                    expect(res.text).to.include("Looking for a skilled front-end developer");
                    done();
                });
        });
    });

    describe("GET /jobs/search/:id", () => {
        it("should return job details for a valid job ID", (done) => {
            chai
                .request(app)
                .get("/jobs/search/66f55a859fcd32a0418a3bbb")
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.text).to.include("Front-end Developer");
                    expect(res.text).to.include("JavaScript");
                    done();
                });
        });

        it("should return 404 if the job is not found", (done) => {
            chai
                .request(app)
                .get("/jobs/search/66f55a859fcd32a0418a3bb2")
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal("Job not found");
                    done();
                });
        });
    });

    describe("POST /jobs/add", () => {
 
        context("when logged in as a freelancer", () => {
            beforeEach(() => {
                // Mock session data for a freelancer user
                app.request.session = {
                    user: {
                        id: "freelancer123",
                        role: "freelancer"
                    }
                };
            });

            it("should return 403 if a freelancer tries to add a job", function (done) {
                const newJob = {
                    title: "Backend Developer",
                    description: "Looking for a skilled backend developer",
                    payment_type: "project",
                    salary: 100,
                    requirements: "Node.js, MongoDB",
                    status: "open"
                };

                chai
                    .request(app)
                    .post("/jobs/add")
                    .send(newJob)
                    .end((err, res) => {
                        expect(res).to.have.status(403); // Expect 403 Forbidden
                        expect(res.text).to.equal("Forbidden: Only clients can add jobs");
                        done();
                    });
            });
        });
    });

    describe("POST /jobs/apply/:id", () => {
        it("should allow a freelancer to apply for a job", (done) => {
            const application = {
                cover_letter: "I am very interested in this position.",
            };

            chai
                .request(app)
                .post("/jobs/apply/66f55a859fcd32a0418a3bbb")
                .send(application)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("success", true);
                    expect(res.body).to.have.property("message", "Application submitted successfully!");
                    done();
                });
        });
    });
});
