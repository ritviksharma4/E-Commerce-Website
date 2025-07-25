const { By, Key, until } = require('selenium-webdriver');
const { getDriver } = require('../sharedDriver');

describe('Search - Product Discovery', function () {
  this.timeout(30000);

  it('searches for "Large Green Trousers Men" and validates product results', async () => {
    const { expect } = await import('chai');
    const driver = await getDriver();

    await driver.get('https://velvet.ritvik-sharma.com/');
    const searchIcon = await driver.wait(
      until.elementLocated(By.xpath("//button[@aria-label='Search']")),
      10000
    );
    await searchIcon.click();

    const searchInput = await driver.wait(
      until.elementLocated(By.id('searchInput')),
      10000
    );

    await driver.wait(until.elementIsVisible(searchInput), 10000);

    await searchInput.sendKeys('Large Green Trousers Men', Key.ENTER);

    await driver.sleep(2000);

    const allResultElements = await driver.wait(
        until.elementsLocated(By.xpath("//span[contains(., 'results')]")),
        10000
    );

    let correctText = null;

    for (const el of allResultElements) {
        const text = await driver.executeScript("return arguments[0].textContent;", el);
        const cleanedText = text.replace(/\s+/g, ' ').trim(); // normalize spacing
        if (/^\d+ results$/.test(cleanedText)) {
            correctText = cleanedText;
            break;
        }
    }

    if (!correctText) {
        throw new Error("Could not find element matching pattern '[0-9]+ results'");
    }

    expect(correctText).to.equal('2 results');

    const productImage1 = await driver.wait(
      until.elementLocated(By.css('img[src*="M-TRS-RS004"]')),
      10000
    );
    await driver.wait(until.elementIsVisible(productImage1), 5000);

    const productImage2 = await driver.wait(
      until.elementLocated(By.css('img[src*="M-TRS-RS008"]')),
      10000
    );
    await driver.wait(until.elementIsVisible(productImage2), 5000);

    await driver.get('https://velvet.ritvik-sharma.com/');
  });
});