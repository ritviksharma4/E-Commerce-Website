const { By, until } = require('selenium-webdriver');
const { getDriver } = require('./sharedDriver');

async function loginIfNeeded() {
  const driver = getDriver();

  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl.includes('/login')) {
    const guestLoginButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Get Guest Login')]")),
      10000
    );
    await guestLoginButton.click();

    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 10000);
    const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 10000);

    await driver.sleep(2500);
    const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'LOG IN')]"));
    await loginButton.click();

    await driver.wait(until.urlIs('https://velvet.ritvik-sharma.com/'), 10000);
  }
}

module.exports = {
  loginIfNeeded
};