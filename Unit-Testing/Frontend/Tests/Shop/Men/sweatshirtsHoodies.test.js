const { By, until, Actions } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Shop > Men > Sweatshirts & Hoodies', function () {
  this.timeout(30000);

  it('navigates to Sweatshirts & Hoodies under Men and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/');
    const shopMenu = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'shop')]")),
      10000
    );

    const actions = driver.actions({ async: true });
    await actions.move({ origin: shopMenu }).perform();

    const sweatshirts = await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/shop/men/sweatshirts-and-hoodies/']")),
      10000
    );
    await sweatshirts.click();

    await driver.wait(until.urlContains('/shop/men/sweatshirts-and-hoodies'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/shop/men/sweatshirts-and-hoodies');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});