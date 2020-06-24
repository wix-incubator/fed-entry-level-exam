import axios from 'axios';

export type Item = {
	id: string
}

export type Customer = {
	name: string
}

export type BillingInfo = {
	status: string
}

export type Order = {
	id: string,
	autoIncrementedId: number;
	createdDate: string;
	fulfillmentStatus: string;
	billingInfo: BillingInfo;
	items: Item[];
	customer: Customer;
}

export type ApiClient = {
	getOrders: () => Promise<Order[]>;
}

export const createApiClient = (): ApiClient => {
	return {
		getOrders: () => {
			return axios.get(`http://localhost:3232/api/orders`).then((res) => res.data);
		}
	}
};



