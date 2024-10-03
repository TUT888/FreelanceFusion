describe('FreelanceFusion end2end test', () => {
    describe('Homepage test', () => {
        beforeEach(() => {
            cy.visit("http://localhost:3000/");
        })
        it('Testimonials are visible', () => {
            cy.get('[id="testimonials"]').should("exist");

            
        })
    })
})