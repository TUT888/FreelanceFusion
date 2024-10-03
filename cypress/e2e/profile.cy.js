describe('FreelanceFusion E2E profile test', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });
    
    describe('Freelancer features tests', () => {
        beforeEach(() => {
            // Visit website and login with freelancer account
            cy.visit("http://localhost:3000/");
            cy.get('a[href="/sign-in"]').should("exist").click();
            cy.get('input[id="email"]').should("exist").type("freelancertest@gmail.com", { force: true });
            cy.get('input[id="password"]').should("exist").type("Password1!", { force: true });
            cy.get('form').submit();
        })

        it('Should be able to view profile', () => {
            // View profile
            cy.get('div[id="profile"]').should('exist')
            cy.get('[data-cy="user-role-text"]').should('have.attr', 'data-badge-caption', 'freelancer');
            cy.get('[data-cy="user-name-text"]').should('not.be.empty');
            cy.get('[data-cy="user-skill-list"]').should('not.be.empty');
            cy.contains('Email').next().should('not.be.empty');
            cy.contains('Phone').next().should('not.be.empty');
            cy.contains('Address').next().should('not.be.empty');
        })

        it('Should be able to update profile', () => {
            // Edit profile
            cy.get('[id="show_edit_btn"]').should('exist').click();
            cy.get('[id="edit_section"]').should('be.visible');
            let randNum = (Math.floor(Math.random() * 1000000000)).toString();
            cy.get('[id="input_phone"]').should('exist').clear().type(randNum, { force : true });
            cy.get('[id="submit_changes"]').should('exist').click();
            cy.contains('Phone').next().should('include.text', randNum);
        })
    })

    describe('Client features tests', () => {
        beforeEach(() => {
            // Visit website and login with freelancer account
            cy.visit("http://localhost:3000/");
            cy.get('a[href="/sign-in"]').should("exist").click();
            cy.get('input[id="email"]').should("exist").type("clienttest@gmail.com", { force: true });
            cy.get('input[id="password"]').should("exist").type("Password1!", { force: true });
            cy.get('form').submit();
        })

        it('Should be able to view profile', () => {
            // View profile
            cy.get('div[id="profile"]').should('exist');
            cy.get('[data-cy="user-role-text"]').should('have.attr', 'data-badge-caption', 'client');
            cy.get('[data-cy="user-name-text"]').should('not.be.empty');
            cy.get('[data-cy="user-skill-list"]').should('not.be.empty');
            cy.contains('Email').next().should('not.be.empty');
            cy.contains('Phone').next().should('not.be.empty');
            cy.contains('Address').next().should('not.be.empty');
        })

        it('Should be able to update profile', () => {
            // Edit profile
            cy.get('[id="show_edit_btn"]').should('exist').click();
            cy.get('[id="edit_section"]').should('be.visible');
            let randNum = (Math.floor(Math.random() * 1000000000)).toString();
            cy.get('[id="input_phone"]').should('exist').clear().type(randNum, { force : true });
            cy.get('[id="submit_changes"]').should('exist').click();
            cy.contains('Phone').next().should('include.text', randNum);
        })
    })
})