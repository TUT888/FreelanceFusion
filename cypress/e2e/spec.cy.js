describe('FreelanceFusion end2end Sample Test', () => {
    describe('Homepage test', () => {
        beforeEach(() => {
            cy.visit("http://localhost:3000/");
        })
        it('The website runs normally', () => {
            cy.get('body').should("exist");
        })
    })
})