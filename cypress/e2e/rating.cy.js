describe('FreelanceFusion E2E rating and review test', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    describe('Freelancer features tests', () => {
        beforeEach(() => {
            // Visit website and login with freelancer account
            cy.visit("http://localhost:3000/");
            cy.get('a[href="/sign-in"]').should("exist").click();
            cy.get('input[id="email"]').should("exist").type("freelancertest@gmail.com", { force: true })
            cy.get('input[id="password"]').should("exist").type("Password1!", { force: true })
            cy.get('form').submit()	
        })

        it('Should be able to view received rating', () => {
            // View received rating
            cy.get('a[id="ratingreview_btn"]').should('exist').click();
            cy.get('[data-cy="overall-rating-section"]').should('exist');
            cy.get('[data-cy="received-rating-section"]').should('exist');
        })
    })

    describe('Client features tests', () => {
        beforeEach(() => {
            // Visit website and login with freelancer account
            cy.visit("http://localhost:3000/");
            cy.get('a[href="/sign-in"]').should("exist").click();
            cy.get('input[id="email"]').should("exist").type("clienttest@gmail.com", { force: true })
            cy.get('input[id="password"]').should("exist").type("Password1!", { force: true })
            cy.get('form').submit()	
        })

        it('Should be able to view given rating', () => {
            // View given rating
            cy.get('a[id="ratingreview_btn"]').should('exist').click();
            cy.get('[data-cy="overall-rating-text"]').should('exist');
            cy.get('[data-cy="given-rating-section"]').should('exist');
        })

        let newReview = 'A new review is given to you, great job!';
        it('Should be able to add new rating', () => {
            // Add new rating
            cy.get('a[id="ratingreview_btn"]').should('exist').click();
            cy.get('a[id="add_rating_btn"]').should('exist').click();

            // Check rating form format
            cy.get('form[id="add_rating_form"]').should('exist');
            cy.get('[id="project_detail_section"]').should('not.be.visible');
            cy.get('[id="rating_annoucement_section"]').should('not.be.visible');
            cy.get('[id="give_rating_section"]').should('not.be.visible');

            // Add rating
            cy.get('select[id="project_selection"]').should('exist').then(($selection) => {
                // Test the first selection
                cy.wrap($selection).select(1, { force: true });
                cy.get('[id="project_detail_section"]').should('be.visible');
                cy.contains('Status').next().should('not.be.empty').then(($status) => {
                    if ($status.text().includes('done')) {
                        cy.get('[id="rating_annoucement_section"]').should('not.be.visible');
                        cy.get('[id="give_rating_section"]').should('be.visible');
                        
                        // Add rating
                        cy.get('[type="radio"]').should('exist').check('5', { force: true });
                        cy.get('textarea[id="input_review"]').should('exist').type(newReview, { force: true });
                        cy.get('button[id="submit_rating"]').should('exist').click();
                    } else {
                        // If the project is not done yet, we should be able to change it status first
                        cy.get('[id="rating_annoucement_section"]').should('be.visible');
                        cy.get('[id="give_rating_section"]').should('not.be.visible');

                        // Change project status
                        cy.get('[id="change_status_btn"]').should('exist').click();
                        cy.reload()

                        // Check the status
                        cy.get('select[id="project_selection"]').should('exist').select(1, { force: true });
                        cy.get('[id="project_detail_section"]').should('be.visible');
                        cy.contains('Status').next().should('not.be.empty').should('include.text', 'done');

                        // Add rating
                        cy.get('[id="rating_annoucement_section"]').should('not.be.visible');
                        cy.get('[id="give_rating_section"]').should('be.visible');
                        
                        cy.get('[type="radio"]').should('exist').check('5', { force: true });
                        cy.get('textarea[id="input_review"]').should('exist').type(newReview, { force: true });
                        cy.get('button[id="submit_rating"]').should('exist').click();
                    }
                })
            });

            // Check the newly added rating
            cy.get('a[id="ratingreview_btn"]').should('exist').click();
            cy.contains(newReview).should('exist');
        })

        it('Should be able to delete rating', () => {
            // Delete the newly added rating
            cy.get('a[id="ratingreview_btn"]').should('exist').click();
            
            cy.contains(newReview).should('exist')          // get new review paragraph
              .parent().parent()                            // find the parent
              .children().first()                           // First element (the card header)
              .children().last()                            // Last element, the button section
              .children('[data-cy="delete-review-btn"]')    // Find the button
              .should('exist').click()
            
            cy.get('a[id="ratingreview_btn"]').should('exist').click();
            cy.contains(newReview).should('not.exist')
        })
    })
})