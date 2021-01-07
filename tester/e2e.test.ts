const puppeteer = require('puppeteer');

test('test 1 ', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  await page.screenshot({ path: 'main_page.png' });

  await browser.close();
});
