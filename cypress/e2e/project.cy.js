describe('FreelanceFusion E2E Project Management Test', () => {

    describe('Project Management Page Test', () => {

        // Test for client login and project creation

        it('Client can view the project list', () => {
            // Mock login as a client
            cy.visit('http://localhost:3000/test/login/client');

            // Visit the project page
            cy.visit('http://localhost:3000/projects');

            // Ensure that the project list is displayed
            cy.get('#job-list').should('exist');
            cy.get('#job-list .job-item').should('have.length.greaterThan', 0); // Ensure at least one project is present
        });

        it('Client can view candidates for a project and hire a freelancer', () => {
            // Mock login as a client
            cy.visit('http://localhost:3000/test/login/client');

            // Visit the project page
            cy.visit('http://localhost:3000/projects');

            // Grab the first project ID
            cy.get('#job-list .job-item').first().invoke('attr', 'data-job-id').then((jobId) => {

                // Make a GET request to get candidates for the project
                cy.request({
                    method: 'GET',
                    url: `http://localhost:3000/projects/${jobId}/candidates`,
                }).then((res) => {
                    // Assert the response status is 200 (OK)
                    expect(res.status).to.eq(200);

                    // Assert that candidates are returned
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);

                    const candidate = res.body[0];  // Grab the first candidate

                    // Make a POST request to hire the first freelancer
                    cy.request({
                        method: 'POST',
                        url: `http://localhost:3000/projects/create/${jobId}`,
                        body: {
                            freelancerId: candidate.freelancer_id,
                            jobId: jobId,
                        },
                    }).then((res) => {
                        // Assert the response status is 200 (OK)
                        expect(res.status).to.eq(200);

                        // Assert that the freelancer was hired
                        expect(res.body).to.have.property('success', true);
                        expect(res.body).to.have.property('message', 'Freelancer hired and application status updated.');
                    });
                });
            });
        });


        it('Client can create a task using cypress', () => {
            // Mock login as a client
            cy.visit('http://localhost:3000/test/login/client');

            // Visit the project page
            cy.visit('http://localhost:3000/projects');

            // Grab the first project ID
            cy.get('#job-list .job-item').first().invoke('attr', 'data-project-id').then((projectId) => {

                // Make a POST request to create a new task
                cy.request({
                    method: 'POST',
                    url: `http://localhost:3000/projects/${projectId}/tasks/create`,  // Adjust this URL based on your app's routes
                    body: {
                        title: "New Task from Cypress",
                        content: "This is a test task created using cypress",
                        progress: 'todo',
                        position: 100000
                    },
                }).then((res) => {
                    // Assert the response status is 200 (OK)
                    expect(res.status).to.eq(200);

                    // Assert that the task was created successfully
                    expect(res.body).to.have.property('success', true);
                    expect(res.body.task).to.have.property('title', 'New Task from Cypress');
                });
            });
        });

        it('Client can update a task status using cypress', () => {
            // Mock login as a client
            cy.visit('http://localhost:3000/test/login/client');

            // Visit the project page
            cy.visit('http://localhost:3000/projects');

            // Grab the first task ID from the "To-do" list
            cy.get('#todo-list .task').first().invoke('attr', 'data-id').then((taskId) => {

                // Make a PUT request to update the task status
                cy.request({
                    method: 'PUT',
                    url: `http://localhost:3000/projects/tasks/${taskId}/status`,  // Adjust this URL based on your app's routesd
                    body: {
                        taskId: taskId,
                        status: 'in-progress',
                        position: 150000
                    },
                }).then((res) => {
                    // Assert the response status is 200 (OK)
                    expect(res.status).to.eq(200);

                    // Assert that the task status was updated
                    cy.get('#in-progress-list .task').should('have.length.greaterThan', 0); // Check if task moved to "In Progress"
                });
            });
        });

        


    });
});
