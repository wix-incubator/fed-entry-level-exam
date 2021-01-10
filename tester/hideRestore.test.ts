const puppeteer = require('puppeteer');
const serverData = require('../server/data.json');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1080,
    deviceScaleFactor: 1,
  });
})

afterAll(async () => {
  await browser.close();
})

const goToMainPage = async () => {
  await page.goto('http://localhost:3000/');
  //await page.screenshot({ path: 'main_page.png' });
}

describe("Hide Restore", () => {
  test('Hide element exists', async () => {
    await goToMainPage();
    const hideButtons = await page.$x("//*[contains(text(), 'Hide') or contains(text(), 'hide')]");

    expect(hideButtons.length).toBe(20)
  });

  test('Restore element doesnt exists when no hidden items', async () => {
    await goToMainPage();
    const restoreButtons = await page.$x("//*[contains(text(), 'Restore') or contains(text(), 'restore')]");

    expect(restoreButtons.length).toBe(0)
  });

  test('hide click works', async () => {
    await goToMainPage();
    const hideButtons = await page.$x("//*[contains(text(), 'Hide') or contains(text(), 'hide')]");

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)

    await hideButtons[0].click();

    titles = await page.$$('.title')
    firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[1].title)
  });

  test('Several hide clicks works', async () => {
    await goToMainPage();
    const hideButtons = await page.$x("//*[contains(text(), 'Hide') or contains(text(), 'hide')]");

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)

    await hideButtons[0].click();
    await hideButtons[1].click();
    await hideButtons[2].click();

    titles = await page.$$('.title')
    firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[3].title)
  });

  test('Restore element exists after first hide clicks', async () => {
    await goToMainPage();
    const hideButtons = await page.$x("//*[contains(text(), 'Hide') or contains(text(), 'hide')]");

    let indexToPin = 0;
    await hideButtons[indexToPin].click();

    const restoreButton = await page.$x("//*[contains(text(), 'Restore') or contains(text(), 'restore')]");

    expect(restoreButton.length).toBe(1)
  });

  test('Restore click works', async () => {
    await goToMainPage();
    const hideButtons = await page.$x("//*[contains(text(), 'Hide') or contains(text(), 'hide')]");

    await hideButtons[0].click();

    const restoreButton = await page.$x("//*[contains(text(), 'Restore') or contains(text(), 'restore')]");
    await restoreButton[0].click();

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)
  });

})
