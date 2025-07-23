const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Header - About Navigation', function () {
  this.timeout(30000);

  it('navigates to about page and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const aboutLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'about')]")),
      10000
    );
    await aboutLink.click();

    await driver.wait(until.urlContains('/about'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/about');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});