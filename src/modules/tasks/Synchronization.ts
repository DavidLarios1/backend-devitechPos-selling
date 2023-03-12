/* eslint-disable @typescript-eslint/naming-convention */
import { Pool } from 'pg';
import colors from 'colors';
import { Config } from '../../config';
import { IMovement } from '../../interfaces/IMovement';
import { PoolConnection } from '../../database/PoolConnection';
import { FetchRequest } from '../../libraries/tools/fetchRequest';
import { WebAddress } from '../../libraries/constants/WebAddress';
import { WACHERPARAMETERS } from '../../libraries/constants/ParametersDataBase';
import { consumidorFinalFE } from '../../libraries/constants/DefaultParameters';
import { LoggerGenericException } from '../../libraries/tools/LoggerGenericException';
import { dataVentaCtMovimiento, wacherParameters } from '../../libraries/querys/others';

export class Synchronization {
  private conectionCore: Pool;

  private fechRequest: FetchRequest;

  private conectionRegistry: Pool;

  private logException: LoggerGenericException;

  constructor() {
    this.fechRequest = new FetchRequest('');

    this.logException = new LoggerGenericException();

    this.conectionCore = new PoolConnection(Config.dataBaseConfigCore).getPoolConnection();

    this.conectionRegistry = new PoolConnection(Config.dataBaseConfigRegistry).getPoolConnection();
  }
  /*
  public async createFuntions():Promise<void> {
    try {
      await this.conectionRegistry.query(prcControlarVentasFe);
    } catch (error) {
      this.logException.logError('Creacion de funciones :::: ', error as Error);
    }
  } */

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

      if (obligatoriaFE === 'N') { console.log(colors.magenta('FE NO ESTA HABILITADA')); return; }

      const timepoMaximo = (await this.conectionCore.query(wacherParameters, [ WACHERPARAMETERS.TIEMPO_MAXIMO_DATOS_CLIENTE_FE ])).rows[0]?.valor;

      const saleIds = await this.conectionRegistry.query('call prc_controlar_ventas_fe($1,$2,array[]::integer[])', [ parseInt(timepoMaximo || 5), consumidorFinalFE ]);
      const numberOfSales: Array<number> = saleIds.rows[0].o_ventas;

      console.log(colors.green('Ventas sin cliente ->'), numberOfSales);
      console.log(colors.magenta(`${numberOfSales.length}`));

      this.fechRequest.setBaseUrl(WebAddress.INFORMAR_VENTA_FE);
      await this.fechRequest.post({ numeroVentas: numberOfSales.length });
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

          this.fechRequest.setBaseUrl(WebAddress.VENTA_COMBUSTIBLE);
          await this.fechRequest.post({ data: movementInformation });
        }
      }
    } catch (error) {
      console.log(error);
      this.logException.logError('Error al traer los Ids de Movimientos ::: ', error as Error);
    }
  }
}
