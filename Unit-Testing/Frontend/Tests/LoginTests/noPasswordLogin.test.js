const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

describe('Velvet E-Commerce - Missing Password', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should show error when password is missing but email is entered', async () => {
    const { expect } = await import('chai');

    await driver.get('https://velvet.ritvik-sharma.com/login/');

    // Wait for input fields
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      10000
    );

    // Enter valid email
    await emailInput.sendKeys('ritvik.sharma1@velvet.com');

    // Leave password empty
    await passwordInput.clear();

    // Click "LOG IN"
    const loginButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'LOG IN')]")
    );
    await loginButton.click();

    // Wait for "Field required" message under password input
    const errorMessageElement = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Field required')]")),
      10000
    );

    const errorText = await errorMessageElement.getText();

    expect(errorText).to.equal('Field required');
  });
});
