const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

describe('Velvet E-Commerce - Invalid Email Login', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should show error when email is missing but password is entered', async () => {
    const { expect } = await import('chai');

    await driver.get('https://velvet.ritvik-sharma.com/login/');

    // Wait for email and password fields
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      10000
    );

    // Clear and leave email blank
    await emailInput.clear();

    // Type in some password
    await passwordInput.sendKeys('dummy-password');

    // Click "LOG IN"
    const loginButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'LOG IN')]")
    );
    await loginButton.click();

    // Wait for error message to appear under email field
    const errorMessageElement = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Please use a valid email address')]")),
      10000
    );

    const errorText = await errorMessageElement.getText();

    expect(errorText).to.include("Please use a valid email address");
  });
});