const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');
const { waitForHomepage } = require('../../waitForHomepage');

describe('Main - Navigate to Footwear Section', function () {
  this.timeout(30000);

  it('navigates to footwear page and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const footwearLink = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Footwear']/ancestor::div[contains(@class, 'ProductCollection-module--root')]")),
      10000
    );
    await footwearLink.click();

    await driver.wait(until.urlContains('/footwear'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/footwear');

    await driver.get('https://velvet.ritvik-sharma.com/');
    await waitForHomepage(driver);
  });
});