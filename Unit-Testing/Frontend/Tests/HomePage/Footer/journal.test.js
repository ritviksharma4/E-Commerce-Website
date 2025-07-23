const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Footer - Journal Navigation', function () {
  this.timeout(30000);

  it('navigates to Journal from footer and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/blog/']")),
      10000
    ).then(el => el.click());

    await driver.wait(until.urlContains('/blog'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/blog');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});