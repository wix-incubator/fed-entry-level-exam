import {Ticket} from '../client/src/api';

const data = require('./../tester/big-data.json');

console.log(data[0]);
export const tempData = data as Ticket[];
