const { startDriver, quitDriver } = require('./sharedDriver');
const { loginIfNeeded } = require('./login.helper');

exports.mochaHooks = {
  beforeAll: [
    async function () {
      this.timeout(60000);
      const driver = await startDriver();
      await driver.get('https://velvet.ritvik-sharma.com/login/');
      await loginIfNeeded();
    }
  ],

  afterAll: [
    async function () {
      await quitDriver();
    }
  ]
};