const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

describe('Velvet E-Commerce - Guest Login', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should log in successfully using guest credentials', async () => {
    const { expect } = await import('chai');

    await driver.get('https://velvet.ritvik-sharma.com/login/');

    const guestLoginButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Get Guest Login')]")),
      10000
    );
    await guestLoginButton.click();

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      10000
    );

    await driver.sleep(2000); // Allow JS to populate values

    const email = await emailInput.getAttribute('value');
    const password = await passwordInput.getAttribute('value');

    expect(email).to.match(/ritvik\.sharma[1-5]@velvet\.com/);
    expect(password).to.have.length.above(0);

    const loginButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'LOG IN')]")
    );
    await loginButton.click();

    await driver.wait(until.urlIs('https://velvet.ritvik-sharma.com/'), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('https://velvet.ritvik-sharma.com/');
  });
});
