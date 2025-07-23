const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../../sharedDriver');

describe('All Clothings - Sorting Test', function () {
  this.timeout(50000);

  it('sorts products by price high to low and validates top price', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/shop/men');

    const sortToggle = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Sort by']")),
      10000
    );
    await sortToggle.click();

    const sortOption = await driver.wait(
      until.elementLocated(By.xpath("//div[text()='Price: High → Low']")),
      10000
    );
    await sortOption.click();

    const topPrice = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='122.99']")),
      10000
    );
    expect(await topPrice.getText()).to.equal('122.99');
  });
});