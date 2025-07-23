const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Header - Account Navigation', function () {
  this.timeout(30000);

  it('navigates to account orders and returns home', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/');

    const accountIcon = await driver.wait(
      until.elementLocated(By.xpath("//a[@aria-label='Account']")),
      10000
    );
    await accountIcon.click();

    await driver.wait(until.urlContains('/account/orders'), 10000);
    expect(await driver.getCurrentUrl()).to.include('/account/orders');

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});