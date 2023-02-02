/* import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'; */
import { ClientListenerDB } from './Client/Infrastructure/ClientLisenerDB';
import { ChannelsDBConfig } from './Client/Infrastructure/ChannelsDBConfig';
import { NotifyChannels } from './Client/Domain/ValueObjects/NotifyChannels';

const clientListenerDB = new ClientListenerDB();
clientListenerDB.listen(Object.values(NotifyChannels));

const channelsLintener = new ChannelsDBConfig(clientListenerDB);
channelsLintener.inicializeChannels();
/* const environmentPath:string = `environments/${process.env.MODE}.env`;
dotenv.config({ path: environmentPath });

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(process.env.PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${process.env.PORT}`);
});
 */
