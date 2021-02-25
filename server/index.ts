import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';

type TicketId = string
type InvertedIndexData = Record<TicketId, number[]>

type SearchEfficientTickets = Record<string, InvertedIndexData>
type TicketsMap = Map<TicketId, Ticket>


console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

const buildTicketsMap = (tickets: Ticket[]): TicketsMap => tickets.reduce<TicketsMap>((acc, ticket) => acc.set(ticket.id, ticket), new Map());
const buildInvertedIndexData = (tickets: Ticket[]): SearchEfficientTickets => {
  const unrelevantWords = ['i', 'the', 'we', 'is', 'an'];
  return tickets.reduce<SearchEfficientTickets>((acc, ticket) => {
    ticket.content
      .toLowerCase()
      .split(' ')
      .map(word => word.replace(/[^a-z]/g, ''))
      .filter(word => {
        return !unrelevantWords.includes(word);
      })
      .forEach((word, ind) => {
        if (acc[word]) {
          if (Array.isArray(acc[word][ticket.id])) {
            acc[word][ticket.id].push(ind);
          } else {
            acc[word][ticket.id] = [ind];
          }
        } else {
          acc[word] = { [ticket.id]: [ind] };
        }
      });
    return acc;
  }, {});
};
const invertedIndexData: SearchEfficientTickets = buildInvertedIndexData(tempData);
const ticketsMap = buildTicketsMap(tempData);

app.get(APIPath, (req, res) => {


  // @ts-ignore
  const page: number = req.query.page || 1;
  const word = req.query.superSearch as string;
  if (word) {
    const tickets = Object.keys(invertedIndexData[word] ?? {});
    const paginatedData = tickets.map(id => ticketsMap.get(id)).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    res.send(paginatedData);
  } else {
    const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    res.send(paginatedData);
  }


});


app.listen(serverAPIPort);
console.log('server running', serverAPIPort);

