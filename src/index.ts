import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { Config } from './config/index';
import { StartServices } from './start';

const startServices = new StartServices();
startServices.Run();

const environmentPath:string = `environments/${process.env.MODE}.env`;
dotenv.config({ path: environmentPath });

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(Config.serverConfig.serverPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.serverConfig.serverPort}`);
});
