const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Header - Journal Navigation', function () {
  this.timeout(30000);

  it('navigates to blog and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const journalLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'journal')]")),
      10000
    );
    await journalLink.click();

    await driver.wait(until.urlContains('/blog'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/blog');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});