const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Footer - About Us Navigation', function () {
  this.timeout(30000);

  it('navigates to About Us from footer and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.wait(
      until.elementLocated(By.xpath("//a[@href='/about/']")),
      10000
    ).then(el => el.click());

    await driver.wait(until.urlContains('/about'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/about');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});