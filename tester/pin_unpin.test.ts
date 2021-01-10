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

describe("pin Unpin", () => {
  test('pin element exists', async () => {
    await goToMainPage();
    const pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    expect(pinButtons.length).toBe(20)
  });

  test('pin click works', async () => {
    await goToMainPage();
    const pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    titles = await page.$$('.title')
    firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[indexToPin].title)
  });

  test('unpin element exists after item pinned', async () => {
    await goToMainPage();
    const pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    const unpinButtons = await page.$x("//*[contains(text(), 'unpin') or contains(text(), 'Unpin')]");
    expect(unpinButtons.length).toBe(1)
  });

  test('unpin element click works', async () => {
    await goToMainPage();
    const pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    const unpinButtons = await page.$x("//*[contains(text(), 'unpin') or contains(text(), 'Unpin')]");
    await unpinButtons[0].click();

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)
  });

  test('unpin element disappeared after click', async () => {
    await goToMainPage();
    let pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    let unpinButtons = await page.$x("//*[contains(text(), 'unpin') or contains(text(), 'Unpin')]");
    await unpinButtons[0].click();

    unpinButtons = await page.$x("//*[contains(text(), 'unpin') or contains(text(), 'Unpin')]");
    pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    expect(unpinButtons.length).toBe(0);
    expect(pinButtons.length).toBe(20);
  });

  test('unpin returns the element to the right place', async () => {
    await goToMainPage();
    const pinButtons = await page.$x("//*[contains(text(), 'Pin') or contains(text(), 'pin')]");

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    const unpinButtons = await page.$x("//*[contains(text(), 'unpin') or contains(text(), 'Unpin')]");
    await unpinButtons[0].click();

    let titles = await page.$$('.title')
    let titleValue = await page.evaluate(el => el.textContent, titles[indexToPin])
    expect(titleValue).toBe(serverData[indexToPin].title)
  });

})
