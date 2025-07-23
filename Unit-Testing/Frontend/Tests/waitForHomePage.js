const { By, until } = require('selenium-webdriver');

async function waitForHomepage(driver) {
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(), 'Free Shipping Worldwide')]")),
    10000
  );
}

module.exports = { waitForHomepage };