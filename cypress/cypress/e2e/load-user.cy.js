describe('Load users test', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('can load list of users', () => {
		cy.get('#ngb-nav-3').contains('User').click();
		cy.get('thead > tr > :nth-child(2)').should('contain', 'Name');
		cy.get('[class="btn btn-primary"]').contains('Load More').click();
		cy.get(':nth-child(12) > tr > th').should('contain', '11');
	});
});
