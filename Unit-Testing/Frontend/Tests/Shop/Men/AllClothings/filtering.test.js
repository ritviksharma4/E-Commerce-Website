const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../../sharedDriver');

describe('All Clothings - Filtering Test', function () {
  this.timeout(60000);

  it('applies and clears Black color filter', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/shop/men');

    const filtersToggle = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Filters']")),
      10000
    );
    await filtersToggle.click();

    const blackCheckbox = await driver.wait(
      until.elementLocated(By.css('input#Black')),
      10000
    );
    await blackCheckbox.click();

    const viewItemsBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='view items']")),
      10000
    );
    await viewItemsBtn.click();

    await driver.wait(async () => {
      const countElement = await driver.findElement(By.css('span.men-module--itemCount--4f0cd'));
      const text = await countElement.getText();
      return text.includes('6/16');
    }, 10000);

    const chip = await driver.wait(
      until.elementLocated(By.xpath("//div[@class='Chip-module--root--b4116']//span[text()='Black']")),
      10000
    );
    await chip.click();

    await driver.wait(async () => {
      const countElement = await driver.findElement(By.css('span.men-module--itemCount--4f0cd'));
      const text = await countElement.getText();
      return text.includes('6/87');
    }, 10000);
  });
});