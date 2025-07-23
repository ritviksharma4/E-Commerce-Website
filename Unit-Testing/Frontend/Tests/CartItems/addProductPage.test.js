const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../sharedDriver');

describe('Cart - Add from Product Page Test', function () {
  this.timeout(60000);

  it('adds product to cart and increases quantity', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/product/M-JKT-RS008');

    const addToBag = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Add to Bag']")),
      10000
    );
    await addToBag.click();

    const cartPanel = await driver.wait(
      until.elementLocated(By.css('div.CartDrawer-module--root--c6933')),
      10000
    );

    const increaseBtn = await driver.wait(
      until.elementLocated(By.css('div.AdjustItem-module--iconContainer--a2f36')),
      10000
    );
    await increaseBtn.click();

    const quantity = await driver.wait(
      until.elementLocated(By.css('span.AdjustItem-module--count--c3099')),
      10000
    );
    await driver.wait(async () => {
      return (await quantity.getText()) === '2';
    }, 10000);

    const quantityText = await quantity.getText();
    expect(quantityText).to.equal('2');

    const closeBtn = await driver.findElement(
      By.css('div.Drawer-module--iconContainer--250fe')
    );
    await closeBtn.click();

    await driver.wait(until.stalenessOf(cartPanel), 10000);
  });
});