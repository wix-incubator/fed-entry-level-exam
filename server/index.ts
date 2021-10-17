import express from 'express';

import bodyParser = require('body-parser');
import { tempData } from './temp-data';

const app = express();

const PORT = 3232;

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/api/tickets', (req, res) => {

	const page = req.query.page || 1;

	const paginatedData = tempData.slice((Number(page) - 1) * PAGE_SIZE, Number(page) * PAGE_SIZE);

	res.send(paginatedData);
});

app.listen(PORT);
console.log('server running', PORT)

