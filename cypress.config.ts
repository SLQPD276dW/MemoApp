import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        Hello() {
          console.log('Hello');
          return null;
        },
      });
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
  },
});
