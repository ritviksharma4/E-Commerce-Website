const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');
const { waitForHomepage } = require('../../waitForHomepage');

describe('Main - Navigate to Accessories Section', function () {
  this.timeout(30000);

  it('navigates to accessories page and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const accessoriesLink = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Accessories']/ancestor::div[contains(@class, 'ProductCollection-module--root')]")),
      10000
    );
    await accessoriesLink.click();

    await driver.wait(until.urlContains('/accessories'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/accessories');

    await driver.get('https://velvet.ritvik-sharma.com/');
    await waitForHomepage(driver);
  });
});