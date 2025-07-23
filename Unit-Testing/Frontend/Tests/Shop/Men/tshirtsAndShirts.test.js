const { By, until, Actions } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Shop > Men > T-Shirts & Shirts', function () {
  this.timeout(30000);

  it('navigates to T-Shirts & Shirts under Men and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/');
    const shopMenu = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'shop')]")),
      10000
    );

    const actions = driver.actions({ async: true });
    await actions.move({ origin: shopMenu }).perform();

    const tshirts = await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/shop/men/t-shirts-and-shirts/']")),
      10000
    );
    await tshirts.click();

    await driver.wait(until.urlContains('/shop/men/t-shirts-and-shirts'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/shop/men/t-shirts-and-shirts');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});