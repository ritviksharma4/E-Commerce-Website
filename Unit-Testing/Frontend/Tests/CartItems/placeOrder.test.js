const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../sharedDriver');

describe('Cart - Place Order Flow', function () {
  this.timeout(60000);

  it('goes through checkout to confirmation', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com');

    const cartBtn = await driver.findElement(By.css('button[aria-label="Bag"]'));
    await cartBtn.click();

    const checkoutBtn = await driver.wait(until.elementLocated(By.xpath("//button[span[text()='checkout']]")), 10000);
    await checkoutBtn.click();

    await driver.wait(until.urlContains('/cart'), 10000);

    const secondCheckout = await driver.wait(until.elementLocated(By.xpath("//button[span[text()='checkout']]")), 10000);
    await secondCheckout.click();

    await driver.wait(until.urlContains('/orderConfirm'), 10000);

    const thankYou = await driver.wait(
      until.elementLocated(By.xpath("//h1[text()='Thank You!']")),
      10000
    );
    expect(await thankYou.getText()).to.equal('Thank You!');
  });
});