const { By, until } = require('selenium-webdriver');
const { getDriver } = require('../../sharedDriver');

describe('Header - Search Dropdown Interaction', function () {
  this.timeout(30000);

  it('opens and closes search dropdown', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    const searchIcon = await driver.wait(
      until.elementLocated(By.xpath("//button[@aria-label='Search']")),
      10000
    );
    await searchIcon.click();

    const searchTitle = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'What are you looking for?')]")),
      10000
    );

    await driver.wait(until.elementIsVisible(searchTitle), 10000);

    await driver.sleep(1000);

    const actualText = await searchTitle.getText();
    expect(actualText).to.include('What are you looking for?');

    await searchIcon.click();

    await driver.wait(until.urlIs('https://velvet.ritvik-sharma.com/'), 10000);
  });
});