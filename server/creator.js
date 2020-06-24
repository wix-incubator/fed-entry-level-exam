import moment from 'moment';

const {products} = require('./products');

function random(max) {
  return Math.floor(Math.random() * Math.floor(max - 1) + 1);
}

function getItems() {
  const count = random(5);
  const items = [];
  let totalPrice = 0;
  let totalQuantity = 0;
  const keys = Object.keys(products);
  for (let i = 0; i < count; i++) {
    const id = keys[random(10)];
    const product = {id: id, ...products[id]};
    const getQuantity = () => {
      const rand = random(100);
      if (rand < 70) {
        return 1;
      }
      if (rand === 96) return 4;
      if (rand === 97) return 5;
      if (rand === 98) return 6;
      if (rand === 99) return 7;
      if (rand === 100) return 10;
      if (rand > 92) {
        return 3;
      }
      return 2;
    };
    const quantity = getQuantity();
    totalPrice += product.price * quantity;
    totalQuantity += quantity;
    items.push({id: product.id, quantity: quantity});
  }
  return {items, totalQuantity, totalPrice};
}

function getFulfillmentStatus(date) {
  const daysPassed = moment().diff(date, "days");
  const x = random(100) - daysPassed;
  if (x <= 50) {
    return 'fulfilled';
  }
  if (x < 94) {
    return 'not-fulfilled';
  }
  return 'canceled';
}

function getPaymentStatus(fulfilmentStatus) {
  switch (fulfilmentStatus) {
    case 'not-fulfilled':
      return random(2) === 1 ? 'paid' : 'not-paid';
    case 'canceled':
      return random(2) === 1 ? 'refunded' : 'not-paid';
    default:
      return 'paid'
  }
}

function getCustomer() {
  const x = Math.floor(Math.random() * Math.floor(63));
  const y = Math.floor(Math.random() * Math.floor(63));
  return {name: `${firstnames[x]} ${surnames[y]}`, id: 'U' + x + '-' + y};
}

export function generateOrders() {
  const arr = [];
  for (let i = 0; i < 2500; i++) {
    const {items, totalQuantity, totalPrice} = getItems();
    const now = moment();
    const date = now.clone().subtract(i * 10, "minutes");
    const fulfilmentStatus = getFulfillmentStatus(date);
    const paymentStatus = getPaymentStatus(fulfilmentStatus);
    arr.push({
      id: 10000 + i,
      currency: "USD",
      createdDate: date.toISOString(),
      itemQuantity: totalQuantity,
      items: items,
      customer: {
        ...getCustomer()
      },
      fulfillmentStatus: fulfilmentStatus,
      billingInfo: {
        status: paymentStatus
      },
      price: {
        total: totalPrice,
        formattedTotalPrice: `$${totalPrice}`
      }
    })
  }
  const fsLibrary  = require('fs');
  fsLibrary.writeFile('orders.json', JSON.stringify({data: arr}), (error) => {
    if (error) throw error;
  })
}

const firstnames = [
  "James", "Daniel", "Matthew", "Andrew", "Joe", "John", "Jessica", "Lily", "Diana", "Donna", "Kelly", "Claire", "Steve", "Mandy", "Sam", "Lori", "Joshua", "David", "Micky", "Jaime", "Matt", "Bruce", "Boris", "Donald", "Dan", "Arnold", "Penny", "Ellie", "Ally", "Hugh", "Fernando", "Ferdinand", "Arthur", "Paul", "George", "Ben", "Bernard", "Oscar", "Denis", "Beyonce", "Mary", "Anna", "Whitney", "Vernon", "Vivian", "Valery", "Kurt", "Tom", "Jackson", "Dean", "Dave", "Francis", "Kimmy", "Suzanne", "Debbie", "Lucy", "Spencer", "Mia", "Steven", "Tori", "Roland", "Parker", "Adam"
];

const surnames = [
  "James", "Daniel", "Matthews", "Brown", "Martin", "Silver", "Walsh", "Sanders", "McKey", "Donovan", "Morrison", "Black", "White", "Lopez", "Phillips", "Hill", "Roberts", "Malkovich", "Springsteen", "Lennon", "Harrison", "Goldberg", "Jones", "Arnold", "Waine", "George", "Bernard", "Oscar", "Denis", "Whitney", "Vernon", "Vedder", "Cohen", "Gold", "King", "Taylor", "Swift", "Anna", "Rodrigez", "Gonzalez", "Diaz", "Sanchez", "Cruz", "Johnson", "Harris", "Thompson", "Lewis", "Robinson", "Wilson", "Garcia", "Davis", "Miller", "Smith", "Walker", "Parker", "Edwards", "Evans", "Young", "Spears", "Crosby", "Stills", "Nash", "Dylan"
];
