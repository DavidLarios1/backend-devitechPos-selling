/* eslint-disable @typescript-eslint/naming-convention */
import colors from 'colors';
import EventEmitter from 'events';
import fetch, { RequestInit } from 'node-fetch';
import { Client, Notification } from 'pg';
import { IMovement } from '../../interfaces/IMovement';
import { PoolConnection } from '../../database/postgres';
import { WACHERPARAMETERS } from '../../libraries/constants/ParametersDataBase';
import { consumidorFinalFE } from '../../libraries/constants/DefaultParameters';
import { prcControlarVentasFe } from '../../libraries/querys/FacturacionElectronica';
import { LoggerGenericException } from '../../libraries/tools/LoggerGenericException';
import { dataVentaCtMovimiento, wacherParameters } from '../../libraries/querys/others';

export class ClientListenerDB extends EventEmitter {
  private conectionCore: Client;

  private conectionRegistry: Client;

  private logException: LoggerGenericException;

  constructor() {
    super();
    this.conectionCore = PoolConnection.getPoolConnectionCore();
    this.conectionRegistry = PoolConnection.getPoolConnectionRegistry();
    this.logException = new LoggerGenericException();
  }

  public listen(channels: Array<string>): void {
    channels.forEach((notifyChannel) => {
      this.conectionCore.query(`LISTEN ${notifyChannel}`);
      console.log(colors.bgBlue('DB Channels ::>> '), notifyChannel);
    });
    this.conectionCore.on('notification', (message: Notification) => {
      console.info(colors.blue('Emit Channel --> '), message.channel);
      this.emit(message.channel, JSON.parse(JSON.stringify(message.payload)));
    });
  }

  public async createFuntions():Promise<void> {
    try {
      await this.conectionRegistry.query(prcControlarVentasFe);
    } catch (error) {
      this.logException.logError('Creacion de funciones :::: ', error as Error);
    }
  }

  public async searchSales():Promise<void> {
    try {
      const ventaIds = await this.conectionCore.query('select id from ventas v where v.sincronizado = 0 order by id desc');
      console.log(colors.green('VENTAS PENDIENTES ::::'), ventaIds.rowCount);
      if (ventaIds.rowCount > 0) {
        for (const value of ventaIds.rows) {
          console.log(colors.green('Procesando venta ID ::::'), value.id);
          const response = (await this.conectionCore.query("call prc_registro_movimiento($1,'{}'::json)", [ value.id ])).rows[0];
          console.log(colors.blue('::: EJECUCION OK :::'));
          console.log(colors.green('Respuesta Insercion de venta ::::'), response);
        }
      }
    } catch (error) {
      this.logException.logError('Error al traer los Ids de venta ::: ', error as Error);
    }
  }

  public async constrolSalesFE():Promise<void> {
    try {
      const obligatoriaFE = (await this.conectionCore.query(wacherParameters, [ WACHERPARAMETERS.OBLIGATORIO_FE ])).rows[0].valor;

      if (obligatoriaFE === 'N') { console.log(colors.america('FE NO ESTA HABILITADA')); return; }

      const timepoMaximo = (await this.conectionCore.query(wacherParameters, [ WACHERPARAMETERS.TIEMPO_MAXIMO_DATOS_CLIENTE_FE ])).rows[0]?.valor;
      const minute = parseInt(timepoMaximo || 5);

      const saleIds = await this.conectionRegistry.query('call prc_controlar_ventas_fe($1,$2,array[]::integer[])', [ minute, consumidorFinalFE ]);
      const numberOfSales: Array<number> = saleIds.rows[0].o_ventas;

      const requestOptions : RequestInit = {
        method  : 'post',
        body    : JSON.stringify({ numeroVentas: numberOfSales.length }),
        headers : { 'Content-Type': 'application/json' },
      };

      console.log(colors.green('Ventas sin cliente ->'), numberOfSales);
      console.log(colors.america(`${numberOfSales.length}`));

      const result = await fetch('http://localhost:10000/api/informarVentasFE', requestOptions);

      console.log({ url: result.url, status: result.status, statusText: result.statusText });
    } catch (error) {
      this.logException.logError('ERROR AL CONTROLAR FE ::::  ', error as Error);
    }
  }

  public async reDriveSales():Promise<void> {
    try {
      const movimientosIds = await this.conectionCore.query("select id from ct_movimientos cm where cm.sincronizado = '2' order by id desc limit 5");
      console.log(colors.green('MOVIMIENTOS PENDIENTES ::::'), movimientosIds.rowCount);
      if (movimientosIds.rowCount > 0) {
        for (const value of movimientosIds.rows) {
          console.log(colors.green('Procesando Movimiento ID ::::'), value.id);
          const movementInformation: IMovement = (await this.conectionCore.query(dataVentaCtMovimiento, [ value.id ])).rows[0].row_to_json;

          const requestOptions : RequestInit = {
            method  : 'post',
            body    : JSON.stringify({ data: JSON.stringify(movementInformation) }),
            headers : { 'Content-Type': 'application/json' },
          };
          const result = await fetch('http://127.0.0.1:8010/api/venta/combustibleV2/subir', requestOptions);
          const response = { url: result.url, status: result.status, statusText: result.statusText };

          if (response.status === 200) {
            console.log(colors.green('Reponse ::: '), response);
          } else {
            this.logException.logError('Error :::: ', response);
          }
        }
      }
    } catch (error) {
      console.log(error);
      this.logException.logError('Error al traer los Ids de venta ::: ', error as Error);
    }
  }
}
