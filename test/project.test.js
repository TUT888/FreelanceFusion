const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../server"); // Your Express app
const projectModel = require("../models/projectModel");
const taskModel = require("../models/taskModel");

chai.use(chaiHttp); // Register chai-http

describe("Project Management", () => {
    let mockProjects;
    let mockTasks;

    // Mock session data for tests
    beforeEach(() => {
        app.request.session = {
            user: {
                id: "66f55a859fcd32a0418a2fc1",
                role: "client",
                email: "client@example.com"
            }
        };

        mockProjects = [
            {
                _id: "66f55a859fcd32a0418a2fc2",
                client_id: "66f55a859fcd32a0418a2fc1",
                job_id: "66f55a859fcd32a0418a2fc3",
                freelancer_id: "freelancer123",
                status: "in-progress",
                created_at: new Date()
            }
        ];

        mockTasks = [
            {
                _id: "66f55a859fcd32a0418a2fc4",
                project_id: "66f55a859fcd32a0418a2fc2",
                title: "Test Task",
                content: "Task content",
                progress: "in-progress",
                position: 100000,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        // Mock projectModel.getProjectById
        projectModel.getProjectById = (projectId) => {
            return Promise.resolve(mockProjects.find(p => p._id === projectId));
        };

        // Mock taskModel.getTasksByProject
        taskModel.getTasksByProject = (projectId) => {
            return Promise.resolve(mockTasks.filter(t => t.project_id === projectId));
        };

        // Mock taskModel.insertOne
        taskModel.insertOne = (taskData) => {
            const newTask = { ...taskData, _id: "newTaskId" };
            mockTasks.push(newTask);
            return Promise.resolve({ insertedId: "newTaskId" });
        };

        // Mock taskModel.updateTaskStatus
        taskModel.updateTaskStatus = (taskId, status, position) => {
            const task = mockTasks.find(t => t._id === taskId);
            if (task) {
                task.progress = status;
                task.position = position;
            }
            return Promise.resolve();
        };
    });

    // Test fetching tasks for a project
    describe("GET /projects/:projectId/tasks", () => {
        it("should fetch all tasks for a project", (done) => {
            chai
                .request(app)
                .get("/projects/66f55a859fcd32a0418a2fc2/tasks")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]).to.have.property("title", "Test Task");
                    done();
                });
        });
    });

    // Test creating a task
    describe("POST /projects/:projectId/tasks/create", () => {
        it("should create a new task for the project", (done) => {
            const newTask = {
                title: "New Task",
                content: "Task details",
                progress: "not-started",
                position: 2
            };

            chai
                .request(app)
                .post("/projects/66f55a859fcd32a0418a2fc2/tasks/create")
                .send(newTask)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("success", true);
                    expect(res.body.task).to.have.property("title", "New Task");
                    done();
                });
        });

        it("should return 400 if task title is missing", (done) => {
            const newTask = {
                content: "Task details",
                progress: "not-started",
                position: 2
            };

            chai
                .request(app)
                .post("/projects/66f55a859fcd32a0418a2fc2/tasks/create")
                .send(newTask)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("error", "Task title is required");
                    done();
                });
        });
    });

    // Test updating task status
    describe("PUT projects/tasks/:taskId/status", () => {
        it("should return 500 if task update fails", (done) => {
            taskModel.updateTaskStatus = () => Promise.reject(new Error("Update failed"));

            const updatedTask = {
                taskId: "66f55a859fcd32a0418a2fc4",
                status: "completed",
                position: 2
            };

            chai
                .request(app)
                .put("/projects/tasks/66f55a859fcd32a0418a2fc4/status")
                .send(updatedTask)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body).to.have.property("error", "Update failed");
                    done();
                });
        });
    });
});

