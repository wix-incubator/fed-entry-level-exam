const nodeFetch = require('node-fetch');
const bigData = require('./big-data.json')

jest.mock('../server/data.json', () => bigData)

describe("super search API tests", () => {
  const URL = 'http://localhost:3232/api/tickets';
  const magicWord = 'kakajsjsjkshdjhshjdsshilo'
  test('no search param', async () => {
    const res = await nodeFetch(URL);
    const resJson = await res.json();
    expect(resJson).toStrictEqual(bigData.slice(0, 20))
  });

  test('empty search param', async () => {
    const res = await nodeFetch(`${URL}?superSearch=`);
    const resJson = await res.json();
    expect(resJson).toStrictEqual(bigData.slice(0, 20))
  });

  test('search value which returns items', async () => {
    const res = await nodeFetch(`${URL}?superSearch=${magicWord}`);
    const resJson = await res.json();

    const responseIds = resJson.map(ticket => ticket.id)
    const serverTicketsIds = bigData.filter(item => item.content.toLowerCase().includes(magicWord)).map(ticket => ticket.id)
    expect(responseIds).toStrictEqual(serverTicketsIds)
  });

  test('benchmark test', async () => {
    const startTime = Date.now()
    const res = await nodeFetch(`${URL}?superSearch=${magicWord}`);
    await res.json();
    const time = Date.now() - startTime
    expect(time < 5).toEqual(true)
  });
});

