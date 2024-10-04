describe('FreelanceFusion E2E Freelancer Search Test', () => {

    describe('Freelancer Search Page Test', () => {

        beforeEach(() => {
            // Visiting the freelancer search page before each test case
            cy.visit("http://localhost:3000/freelancers/search"); // Adjust URL based on your routing
        });

        it('Freelancer list is visible', () => {
            // Ensure that the freelancer list is displayed
            cy.get('#freelancer-list').should("exist");
            cy.get('#freelancer-list .freelancer-item').should('have.length.greaterThan', 0); // Ensure at least one freelancer is present
        });

        it('Freelancer details are displayed when a freelancer is clicked', () => {
            // Simulate clicking on the first freelancer in the list
            cy.get('#freelancer-list .freelancer-item').first().click();

            // Wait for the freelancer details section to update
            cy.get('#freelancer-details').should('exist'); // Ensure freelancer details container exists

            // Check that the freelancer details are loaded properly
            cy.get('#freelancer-details .card-title').should('contain.text', 'Alice Smith'); // Adjust based on expected freelancer name or use a real one
        });

        it('Filters apply correctly', () => {
            // Test that filtering works by typing a keyword and selecting filters
            cy.get('input[name="keyword"]').type('React');
            
            // Submit the filter form
            cy.get('#freelancer-filter-form').submit();

            // Check if freelancers are filtered (intercepted response can be mocked)
            cy.get('#freelancer-list .freelancer-item').should('have.length.greaterThan', 0);
        });


    });
});
