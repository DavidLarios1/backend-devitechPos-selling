import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import colors from 'colors';
import { Config } from './config/index';
import { TimeUnits } from './interfaces/ICron';
import { CronHandler } from './modules/cronJob/CronHandler';
import { NotifyChannels } from './libraries/constants/NotifyChannels';
import { ClientListenerDB } from './modules/listenerDB/ClientLisenerDB';
import { ChannelsDBConfig } from './modules/listenerDB/ChannelsDBConfig';

const clientListenerDB = new ClientListenerDB();
clientListenerDB.createFuntions();

clientListenerDB.listen(Object.values(NotifyChannels));

const channelsLintener = new ChannelsDBConfig(clientListenerDB);
channelsLintener.inicializeChannels();

const CronSearchSales = new CronHandler(1, { timeInterval: 50, timeUnit: TimeUnits.seconds });
const CronConstrolSalesFE = new CronHandler(2, { timeInterval: 15, timeUnit: TimeUnits.seconds });
const CronReDriveSales = new CronHandler(3, { timeInterval: 30, timeUnit: TimeUnits.seconds });

CronSearchSales.createJob(async () => {
  console.log(colors.blue(`INICIANDO SINCRONIZACION DE VENTAS ::: ${new Date()}`));
  await clientListenerDB.searchSales();
  console.log(colors.blue('::: FINALIZANDO SINCRONIZACION VENTAS :::'));
});

CronConstrolSalesFE.createJob(async () => {
  console.log(colors.blue(`INICIANDO CONTROL DE VENTAS FE ::: ${new Date()}`));
  await clientListenerDB.constrolSalesFE();
  console.log(colors.blue('::: FINALIZANDO CONTROL DE VENTAS :::'));
});

CronReDriveSales.createJob(async () => {
  console.log(colors.blue(`INICIANDO SINCRONIZACION DE MOVIMIENTOS ::: ${new Date()}`));
  await clientListenerDB.reDriveSales();
  console.log(colors.blue('::: FINALIZANDO SINCRONIZACION MOVIMIENTOS :::'));
});

const environmentPath:string = `environments/${process.env.MODE}.env`;
dotenv.config({ path: environmentPath });

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(Config.serverConfig.serverPort, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${Config.serverConfig.serverPort}`);
});
