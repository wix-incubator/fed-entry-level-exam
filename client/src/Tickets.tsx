import React from 'react';
import { Ticket } from './api';
export const Tickets = ({ tickets, search }: { tickets: Ticket[], search: string }) => {
    const filteredTickets = tickets
        .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(search.toLowerCase()));

    return (<ul className='tickets'>
        {filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
            <h5 className='title'>{ticket.title}</h5>
            <footer>
                <div className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
            </footer>
        </li>))}
    </ul>);
}