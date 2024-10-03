describe('FreelanceFusion E2E homepage test', () => {
    describe('Homepage components test', () => {
        beforeEach(() => {
            cy.visit("http://localhost:3000/");
        })
        it('Testimonials are visible', () => {
            cy.get('[id="testimonials"]').should("exist");

            
        })
    })
})