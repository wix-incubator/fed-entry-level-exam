import express from 'express';
import bodyParser = require('body-parser');
import {tempData} from './temp-data';
const {products} = require('./products.json');


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

app.get('/api/orders', (req, res) => {

	const page: any = req.query.page || null;
	const imageSize: any = req.query.imageSize || 'large';

	let orders = page ? tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : tempData;

	orders.forEach((order: any) => {
		order.items = order.items.map((item: any) => {
			return {id: item.id, imageUrl: products[item.id].images[imageSize]}
		});
	});

	res.send(orders);
});

app.listen(PORT);
console.log('Listening on port', PORT);

// const {generateOrders} = require('./creator');
// generateOrders();
