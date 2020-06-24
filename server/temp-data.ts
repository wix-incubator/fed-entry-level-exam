import {Order} from '@ans-exam/client/src/api';

import * as fs from 'fs';
import Chance from 'chance';

const {data} = require('./orders.json');

export const tempData = data as Order[];

