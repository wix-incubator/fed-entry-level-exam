import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	pinnedTickets: Ticket[],
	search: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
    pinnedTickets : []
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
  }

  pinTicket = (ticket: Ticket) => {
    if (this.state.tickets) {
      const index = this.state.tickets.indexOf(ticket);
      if (index > -1) {
        this.state.tickets.splice(index, 1);
        this.state.pinnedTickets.push(ticket);

        this.setState({
          tickets: [...this.state.tickets],
          pinnedTickets: [...this.state.pinnedTickets]
        });
      }
    }
  }

  unpinTicket = (ticket: Ticket)=>{
    if (this.state.tickets) {
      const index = this.state.pinnedTickets.indexOf(ticket);
      if (index > -1) {
        this.state.pinnedTickets.splice(index, 1);
        this.state.tickets.push(ticket);

        this.setState({
          tickets: [...this.state.tickets],
          pinnedTickets: [...this.state.pinnedTickets]
        });
      }
    }
  }

  renderTickets = (tickets?: Ticket[], pinnedView : boolean = false) => {
	  if(!tickets)
	    return null;

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		return (<ul className='tickets'>
          {filteredTickets.map((ticket) => (<li key={ticket.id + pinnedView } className='ticket'>
            <button onClick={()=>{
              if (pinnedView)
                this.unpinTicket(ticket)
              else
                this.pinTicket(ticket)
            }}>{pinnedView ? 'Unpin' : 'Pin'}</button>
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
		const {tickets, pinnedTickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length + pinnedTickets.length} results</div> : null }
			{tickets ?
        <React.Fragment>
          {this.renderTickets(pinnedTickets, true)}
          {this.renderTickets(tickets)}
        </React.Fragment>
        : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;
