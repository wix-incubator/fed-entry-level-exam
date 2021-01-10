import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
  tickets?: Ticket[],
  hiddenTickets: Ticket[],
	search: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
    hiddenTickets:[]
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}

	hideItem = (tickets: Ticket)=>{
	  this.state.hiddenTickets.push(tickets)

    this.setState({
      hiddenTickets : [...this.state.hiddenTickets]
    })
	}

  restore = ()=>{
    this.setState({
      hiddenTickets : []
    })
  }

	renderTickets = (tickets: Ticket[]) => {

    const filteredTickets = tickets
      .filter(t => !this.state.hiddenTickets.includes(t))
      .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
        <div onClick={() => this.hideItem(ticket)}>Hide</div>
				<h5 className='title'>{ticket.title}</h5>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {

		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
      {tickets ? <div className='results'>Showing {tickets.length} results
				{this.state.hiddenTickets.length > 0 ? <span>(+ {this.state.hiddenTickets.length} hidden, <span onClick={()=>this.restore()}>click to restore</span>)</span> : null}
      </div> : null }
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;
