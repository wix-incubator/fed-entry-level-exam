import React from 'react';
import './App.scss';
import {createApiClient, Order} from './api';

export type AppState = {
	orders?: Order[],
	search: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: ''
	};

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			orders: await api.getOrders()
		});
	}

	renderOrders = (orders: Order[]) => {
		const filteredOrders = orders
			.filter((order) => (order.customer.name.toLowerCase() + order.autoIncrementedId).includes(this.state.search.toLowerCase()));

		return (
			<ul className='orders'>
				{filteredOrders.map((order) => (<li key={order.autoIncrementedId} className='order'>
					<h5 className='title'>{order.customer.name}</h5>
					<footer>
						<div
							className='meta-data'>{order.fulfillmentStatus} | {new Date(order.createdDate).toLocaleString()}</div>
					</footer>
				</li>))}
			</ul>
		);
	};

	onSearch = async (value: string, newPage?: number) => {

		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: value
			});
		}, 300);
	};

	render() {
		const {orders} = this.state;
		return (
			<main>
				<h1>Orders</h1>
				<header>
					<input type="search" placeholder="Search" onChange={(e) => this.onSearch(e.target.value)}/>
				</header>
				{orders ? <div className='results'>Showing {orders.length} results</div> : null}
				{orders ? this.renderOrders(orders) : <h2>Loading...</h2>}

			</main>
		)
	}
}

export default App;
