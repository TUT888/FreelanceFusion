describe('FreelanceFusion E2E Job Search Test', () => {

    describe('Job Search Page Test', () => {
        beforeEach(() => {
            // Visiting the job search page before each test case
            cy.visit("http://localhost:3000/jobs/search"); // Adjust URL based on your routing
        });

        it('Job list is visible', () => {
            // Ensure that the job list is displayed
            cy.get('#job-list').should("exist");
            cy.get('#job-list .job-item').should('have.length.greaterThan', 0); // Ensure at least one job is present
        });

        it('Job details are displayed when a job is clicked', () => {
            // Simulate clicking on the first job in the list
            cy.get('#job-list .job-item').first().click();

            // Wait for the job details section to update
            cy.get('#job-details').should('exist'); // Ensure job details container exists

            // Check that the job details are loaded properly
            cy.get('#job-details .card-title').should('contain.text', 'Build a React Application'); // Adjust based on expected job title
        });

        it('Filters apply correctly', () => {
            // Test that filtering works by typing a keyword and selecting filters
            cy.get('input[name="keyword"]').type('Developer');
            cy.get('input.select-dropdown').eq(0).click();
            cy.get('ul.dropdown-content.select-dropdown li').contains('Hourly')
                .click({ force: true });

            cy.get('input.select-dropdown').eq(1).click();
            cy.get('ul.dropdown-content.select-dropdown li').contains('Open').click();

            cy.get('ul.dropdown-content.select-dropdown li').contains('Open')
                .click({ force: true });

            // Submit the filter form
            cy.get('#job-filter-form').submit();

            // Check if jobs are filtered (intercepted response can be mocked)
            cy.get('#job-list .job-item').should('have.length.greaterThan', 0);
        });

        it('Freelancers can apply for a job', () => {
            // Mock login as a freelancer using the test route
    cy.visit('http://localhost:3000/test/login/freelancer');

    // Visit the job search page after logging in
    cy.visit('http://localhost:3000/jobs/search');

    // Click on the first job to load its details
    cy.get('#job-list .job-item').first().click();

    // Grab the job ID from the selected job
    cy.get('#job-list .job-item').first().invoke('attr', 'data-id').then((jobId) => {
        // Make a POST request to apply for the job
        cy.request({
            method: 'POST',
            url: `http://localhost:3000/jobs/apply/${jobId}`,  // Adjust this URL based on your app's routes
            headers: {
                Authorization: 'Bearer <YOUR_TOKEN_HERE>',  // Add authorization if needed
            },
            body: {
                cover_letter: "I am excited to apply for this job.",  // Sample cover letter
            },
        }).then((res) => {
            // Assert the response status is 201 (created)
            expect(res.status).to.eq(201);
            
            // Optionally assert response body contains expected data
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('message', 'Application submitted successfully!');
        });
    });
        });

        // Test as a client
        it('Clients should not see the apply button', () => {
            // Use the mock login route to simulate login as a client
            cy.visit('http://localhost:3000/test/login/client');

            // Visit the job search page after logging in
            cy.visit('http://localhost:3000/jobs/search');

            // Click on the first job to load job details
            cy.get('#job-list .job-item').first().click();

            // Ensure the apply button is not visible for clients
            cy.get('#job-details .apply-btn').should('not.exist'); // The apply button should not be present
        });

    });
});
