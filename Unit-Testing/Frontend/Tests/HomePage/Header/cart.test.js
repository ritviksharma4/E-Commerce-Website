const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Header - Cart Interaction', function () {
  this.timeout(30000);

  it('opens and closes cart side panel', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const cartIcon = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(@aria-label, 'Cart')]")),
      10000
    );
    await cartIcon.click();

    const bagTitle = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'My Bag')]")),
      10000
    );
    expect(await bagTitle.isDisplayed()).to.be.true;

    const closeButton = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(@class, 'Drawer-module--iconContainer')]")),
      10000
    );
    await closeButton.click();

    await driver.wait(until.urlIs('https://velvet.ritvik-sharma.com/'), 10000);
  });
});