const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

describe('Velvet E-Commerce - Missing Email and Password', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should show both email and password error messages when both fields are empty', async () => {
    const { expect } = await import('chai');

    await driver.get('https://velvet.ritvik-sharma.com/login/');

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      10000
    );

    // Ensure both fields are empty
    await emailInput.clear();
    await passwordInput.clear();

    // Click "LOG IN"
    const loginButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'LOG IN')]")
    );
    await loginButton.click();

    // Wait for both error messages
    const emailError = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Please use a valid email address')]")),
      10000
    );

    const passwordError = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Field required')]")),
      10000
    );

    const emailErrorText = await emailError.getText();
    const passwordErrorText = await passwordError.getText();

    expect(emailErrorText).to.include("Please use a valid email address");
    expect(passwordErrorText).to.equal("Field required");
  });
});