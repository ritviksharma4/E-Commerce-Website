const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');
const { waitForHomepage } = require('../../waitForHomepage');

describe('Main - Navigate to Women Section', function () {
  this.timeout(30000);

  it('navigates to women page and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const womenLink = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Women']/ancestor::div[contains(@class, 'ProductCollection-module--root')]")),
      10000
    );
    await womenLink.click();

    await driver.wait(until.urlContains('/women'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/women');

    await driver.get('https://velvet.ritvik-sharma.com/');
    await waitForHomepage(driver);
  });
});