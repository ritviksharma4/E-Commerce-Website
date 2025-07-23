const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Footer - FAQ Navigation', function () {
  this.timeout(30000);

  it('navigates to FAQ from footer and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/faq/']")),
      10000
    ).then(el => el.click());

    await driver.wait(until.urlContains('/faq'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/faq');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});