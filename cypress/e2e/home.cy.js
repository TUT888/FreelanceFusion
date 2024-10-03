describe('FreelanceFusion E2E profile test', () => {
    describe('Homepage test', () => {
        beforeEach(() => {
            cy.visit("http://localhost:3000/");
        })
        it('Should include key components', () => {
            cy.get('[id="welcome"]').should("exist");
            cy.get('[class="section popular-services"]').should("exist");
            cy.get('[id="testimonials"]').should("exist");
            cy.get('[class="section how-it-works"]').should("exist");
            cy.get('[class="section contact-section"]').should("exist");
        })
    })

    describe('Navigation bar test', () => {
        beforeEach(() => {
            cy.visit("http://localhost:3000/");
        })
        it('Should include essential working component', () => {
            cy.get('[class="nav-wrapper"]').should("exist");

            // Brand name is clickable
            cy.get('a[href="/"]').should("be.visible").click();
            cy.url().should('contain', '/');
            // Find jobs is clickable
            cy.get('a[href="/jobs/search"]').should("be.visible").click();
            cy.url().should('contain', '/jobs/search');
            // Find freelancer is clickable
            cy.get('a[href="/freelancers/search"]').should("be.visible").click();
            cy.url().should('contain', '/freelancers/search');
            // Sign In is clickable
            cy.get('a[href="/sign-in"]').should("be.visible").click();
            cy.url().should('contain', '/sign-in');
            // Register is clickable
            cy.get('a[href="/register"]').should("be.visible").click();
            cy.url().should('contain', '/register');
        })

        it('Should not include authentication-required features', () => {
            cy.get('[class="nav-wrapper"]').should("exist");
            
            // Some components should not exist
            cy.get('a[href="/messages"]').should("not.exist");
            cy.get('[data-cy="account-dropdown-trigger"]').should("not.exist");
        })
    })
})