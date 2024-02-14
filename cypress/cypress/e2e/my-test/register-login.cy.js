import GenerateRandomUser from '../../support/generate-random-user';
const user = GenerateRandomUser();

describe('Load, Register and Login test', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('can load website', () => {
		cy.get('#ngb-nav-1').contains('Register');
		cy.get('#ngb-nav-0').contains('Login');
	});

	it('can register new user', () => {
		cy.get('#ngb-nav-1').should('contain', 'Register').click();
		cy.get('#name').type(user);
		cy.get('#username').type(user);
		cy.get('#email').type(`${user}@test.com`);
		cy.get('#password').type('secret_password');
		cy.get('#confirmPassword').type('secret_password');
		cy.get('.btn').should('contain', 'Register').click();
		cy.get('ngb-alert').should(
			'contain',
			'Registration successful. Please login with your new credentials.'
		);
	});

	it('can login with registered user', () => {
		cy.get('#ngb-nav-0').should('contain', 'Login').click();
		cy.get('#usernameOrEmail').type(user);
		cy.get('#password').type('secret_password');
		cy.get('.btn').should('contain', 'Login').click();
		cy.get('ngb-alert').should('contain', 'Login successful.');
	});
});
