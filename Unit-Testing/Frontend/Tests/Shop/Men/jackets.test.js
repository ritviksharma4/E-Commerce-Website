const { By, until, Actions } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Shop > Men > Jackets', function () {
  this.timeout(30000);

  it('navigates to Jackets under Men and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/');
    const shopMenu = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'shop')]")),
      10000
    );

    const actions = driver.actions({ async: true });
    await actions.move({ origin: shopMenu }).perform();

    const jackets = await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/shop/men/jackets/']")),
      10000
    );
    await jackets.click();

    await driver.wait(until.urlContains('/shop/men/jackets'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/shop/men/jackets');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});