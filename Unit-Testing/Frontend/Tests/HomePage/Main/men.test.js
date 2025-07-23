const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');
const { waitForHomepage } = require('../../waitForHomepage');

describe('Main - Navigate to Men Section', function () {
  this.timeout(30000);

  it('navigates to men page and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const menLink = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Men']/ancestor::div[contains(@class, 'ProductCollection-module--root')]")),
      10000
    );
    await menLink.click();

    await driver.wait(until.urlContains('/men'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/men');

    await driver.get('https://velvet.ritvik-sharma.com/');
    await waitForHomepage(driver);
  });
});