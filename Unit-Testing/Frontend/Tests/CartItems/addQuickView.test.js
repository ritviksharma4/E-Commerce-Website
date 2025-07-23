const { By, until, Key } = require('selenium-webdriver');
const { getDriver } = require('../sharedDriver');

describe('Cart - Add to Bag from Quick View', function () {
  this.timeout(60000);

  it('adds one item from quick view modal', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/shop/men');

    const cartCountEl = await driver.findElement(By.css('div.Header-module--bagNotification--96980 span'));
    const initialCount = parseInt(await cartCountEl.getText()) || 0;

    const imageContainer = await driver.findElement(By.css('div.ProductCard-module--imageContainer--00924'));
    await driver.actions({ bridge: true }).move({ origin: imageContainer }).perform();

    const quickViewBtn = await driver.findElement(By.css('div.ProductCard-module--bagContainer--39254'));
    await quickViewBtn.click();

    await new Promise(r => setTimeout(r, 1000));

    const swatch = await driver.findElement(By.css('div.ProductSwatch-module--swatch--84844'));
    await swatch.click();

    const addBtn = await driver.findElement(By.xpath("//button[span[text()='add to bag']]"));
    await addBtn.click();

    await driver.wait(until.elementLocated(By.css('div.Header-module--bagNotification--96980 span')), 10000);
    const newCartCount = parseInt(await driver.findElement(By.css('div.Header-module--bagNotification--96980 span')).getText()) || 0;

    expect(newCartCount).to.equal(initialCount + 1);
  });
});