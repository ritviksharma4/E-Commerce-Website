const { By, until, Actions } = require('selenium-webdriver');
const { getDriver } = require('../../../sharedDriver');

describe('All Clothings - Quick View Modal Test', function () {
  this.timeout(60000);

  it('opens and closes quick view modal', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/shop/men');

    const imageContainer = await driver.wait(
      until.elementLocated(By.css('div.ProductCard-module--imageContainer--00924')),
      10000
    );

    const actions = driver.actions({ bridge: true });
    await actions.move({ origin: imageContainer }).perform();

    const quickViewBtn = await driver.wait(
      until.elementLocated(By.css('div.ProductCard-module--bagContainer--39254')),
      10000
    );
    await quickViewBtn.click();

    await driver.sleep(1000);

    const quickViewModal = await driver.wait(
      until.elementLocated(By.css('div.QuickView-module--root--41109')),
      10000
    );
    expect(await quickViewModal.getText()).to.include('Select Options');

    const closeBtn = await driver.wait(
    until.elementLocated(By.css('div.Drawer-module--iconContainer--250fe')),
    10000
  );

  await driver.sleep(1000);

  await driver.executeScript("arguments[0].click();", closeBtn);

    await driver.wait(until.urlContains('/shop/men'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/shop/men');
  });
});