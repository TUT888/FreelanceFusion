describe('FreelanceFusion E2E sample test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
    })
    it('The website runs normally', () => {
        cy.get('body').should("exist");
    })
})