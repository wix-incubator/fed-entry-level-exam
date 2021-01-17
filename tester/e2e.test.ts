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

describe("Dark Mode", () => {
  test('Background is white and text is grayish without change', async () => {
    await goToMainPage();
    const docBody = await page.$('body')
    const title = await page.$('.title')
    let pageBackGroundColor = await page.evaluate(el => getComputedStyle(el).backgroundColor,docBody)
    let titleColor = await page.evaluate(el => getComputedStyle(el).color,title)
    expect(pageBackGroundColor).toBe('rgb(245, 249, 252)')
    expect(titleColor).toBe('rgb(32, 69, 94)')
  });

  test('Background is black and color is white after click', async () => {
    await goToMainPage();
    const darkModeCheckbox = await page.$('#darkMode')
    await darkModeCheckbox.click();
    const docBody = await page.$('body')
    const title = await page.$('.title')
    let pageBackGroundColor = await page.evaluate(el => getComputedStyle(el).backgroundColor,docBody)
    let titleColor = await page.evaluate(el => getComputedStyle(el).color,title)
    expect(pageBackGroundColor).toBe('rgb(0, 0, 0)')
    expect(titleColor).toBe('rgb(32, 69, 94)')
  });
});

