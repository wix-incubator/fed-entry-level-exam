const puppeteer = require('puppeteer');
import axios from 'axios';

import * as unidriver from '@unidriver/puppeteer';

const host = 'http://localhost'
const staticsPort = 3000;
const staticsUrl = `${host}:${staticsPort}/`;
const serverAPIPort = 3232;
const APIDomain = 'tickets';
const APIPath = `/api/${APIDomain}`;
const APIRootPath = `${host}:${serverAPIPort}${APIPath}`

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

afterEach(async () => {
  try {
    await page.screenshot({
      path: `results/screenshots/${expect.getState().currentTestName}.png`,
      fullPage: true
    });
  } catch (e) {
    console.error('screenshot failed.');
  }


})

const goToMainPage = async () => {
  await page.goto(staticsUrl);
}

describe("Time Format", () => {

  const MILISEC_IN_MINUTE = 60000;

  test('shows minutes ago', async () => {
    const additionalMinutes = 1 + Math.floor(Math.random() * 58)

    const ticket = {
      id: "7181cec4-cf43-5936-a75b-c1d5f8a7e00e",
      title: "I am title",
      content: "\nhi \ni'm newbie/beginer to buid webside\ni want to use sms authentication mobile number\nfor newuser register\n\nnow fucntion don't work\n\nplese help me fix this\n\nthank you\n\n(sorry for english)\n\n\n\n\n\n \n\n\n",
      userEmail: "zorjubuw@us.mh",
      creationTime: Date.now() - additionalMinutes * MILISEC_IN_MINUTE
    };

    await axios.post(APIRootPath, [ticket])
    await goToMainPage();
    // await new Promise(res => setTimeout(res, 6000000));
    const driver = unidriver.pupUniDriver({page, selector: 'body'});

    const dateElements = await driver.$$('.time-ago');
   
    const currentElem = dateElements.get(0)

    expect((await currentElem.text()).toLocaleLowerCase()).toContain(additionalMinutes); 

  }, 60000000);

  test('shows hours ago', async () => {
    const additionalHours = 1 + Math.floor(Math.random() * 23)

    const ticket = {
      id: "7181cec4-cf43-5936-a75b-c1d5f8a7e00e",
      title: "I am title",
      content: "\nhi \ni'm newbie/beginer to buid webside\ni want to use sms authentication mobile number\nfor newuser register\n\nnow fucntion don't work\n\nplese help me fix this\n\nthank you\n\n(sorry for english)\n\n\n\n\n\n \n\n\n",
      userEmail: "zorjubuw@us.mh",
      creationTime: Date.now() - additionalHours * 60 * MILISEC_IN_MINUTE
    };

    await axios.post(APIRootPath, [ticket])
    await goToMainPage();
    // await new Promise(res => setTimeout(res, 6000000));
    const driver = unidriver.pupUniDriver({page, selector: 'body'});

    const dateElements = await driver.$$('.time-ago');
   
    const currentElem = dateElements.get(0)

    expect((await currentElem.text()).toLocaleLowerCase()).toContain(additionalHours); 

  }, 60000000);
  test('shows days ago', async () => {
    const additionalDays = 1 + Math.floor(Math.random() * 100)

    const ticket = {
      id: "7181cec4-cf43-5936-a75b-c1d5f8a7e00e",
      title: "I am title",
      content: "\nhi \ni'm newbie/beginer to buid webside\ni want to use sms authentication mobile number\nfor newuser register\n\nnow fucntion don't work\n\nplese help me fix this\n\nthank you\n\n(sorry for english)\n\n\n\n\n\n \n\n\n",
      userEmail: "zorjubuw@us.mh",
      creationTime: Date.now() - additionalDays * 24 * 60 * MILISEC_IN_MINUTE
    };

    await axios.post(APIRootPath, [ticket])
    await goToMainPage();
    // await new Promise(res => setTimeout(res, 6000000));
    const driver = unidriver.pupUniDriver({page, selector: 'body'});

    const dateElements = await driver.$$('.time-ago');
   
    const currentElem = dateElements.get(0)

    expect((await currentElem.text()).toLocaleLowerCase()).toContain(additionalDays); 

  }, 60000000);

});

