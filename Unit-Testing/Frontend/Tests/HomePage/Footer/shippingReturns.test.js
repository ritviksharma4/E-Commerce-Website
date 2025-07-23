const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Footer - Shipping & Returns Navigation', function () {
  this.timeout(30000);

  it('navigates to Shipping & Returns from footer and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/support/#returns']")),
      10000
    ).then(el => el.click());

    await driver.wait(until.urlContains('/support/#returns'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/support/#returns');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});