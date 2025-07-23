const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../sharedDriver');

describe('Cart - Delete Item', function () {
  this.timeout(40000);

  it('removes item from cart', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com');

    const cartCountEl = await driver.findElement(By.css('div.Header-module--bagNotification--96980 span'));
    const initialCount = parseInt(await cartCountEl.getText()) || 0;

    const cartBtn = await driver.findElement(By.css('button[aria-label="Bag"]'));
    await cartBtn.click();

    const removeBtn = await driver.wait(until.elementLocated(By.css('div.RemoveItem-module--root--ed714')), 10000);
    await removeBtn.click();

    const closeBtn = await driver.findElement(By.css('div.Drawer-module--iconContainer--250fe'));
    await closeBtn.click();

    const newCartCountEl = await driver.wait(until.elementLocated(By.css('div.Header-module--bagNotification--96980 span')), 10000);
    const newCount = parseInt(await newCartCountEl.getText()) || 0;

    expect(newCount).to.be.lessThan(initialCount);
  });
});