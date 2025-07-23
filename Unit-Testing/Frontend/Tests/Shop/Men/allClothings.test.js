const { By, until, Actions } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Shop > Men > All Clothings', function () {
  this.timeout(30000);

  it('navigates to All Clothings under Men and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/');
    const shopMenu = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'shop')]")),
      10000
    );

    const actions = driver.actions({ async: true });
    await actions.move({ origin: shopMenu }).perform();

    const allClothings = await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/shop/men/']")),
      10000
    );
    await allClothings.click();

    await driver.wait(until.urlContains('/shop/men'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/shop/men');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});