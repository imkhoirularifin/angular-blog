const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:4200',
	},
	reporter: 'mochawesome',
	reporterOptions: {
		reportDir: 'cypress/results',
		overwrite: false,
		html: false,
		json: true,
	},
});
