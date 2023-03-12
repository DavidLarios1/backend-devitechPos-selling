import { Pool } from 'pg';
import { Config } from '../../config';
import { PoolConnection } from '../../database/PoolConnection';
import { prcControlarVentasFe } from '../../libraries/querys/FacturacionElectronica';
import { LoggerGenericException } from '../../libraries/tools/LoggerGenericException';

export class ProceduresHandler {
  private coreConnection: Pool;

  private registerConnection: Pool;

  private loggerException: LoggerGenericException;

  constructor() {
    this.loggerException = new LoggerGenericException();
    this.coreConnection = new PoolConnection(Config.dataBaseConfigCore).getPoolConnection();
    this.registerConnection = new PoolConnection(Config.dataBaseConfigRegistry).getPoolConnection();
  }

  /**
     * CreateProceduresCore
     */
  private async CreateProceduresCore():Promise<void> {
    try {
    // CORE
    } catch (error) {
      this.loggerException.logError('Error al crear lo procedimientos en DB CORE :::', error as Error);
    }
  }

  /**
     * CreateProceduresRegistry
     */
  private async CreateProceduresRegistry():Promise<void> {
    try {
    // REGSITRY
      this.registerConnection.query(prcControlarVentasFe);
    } catch (error) {
      this.loggerException.logError('Error al crear lo procedimientos en DB REGISTRY :::', error as Error);
    }
  }

  /**
   * CreateAllProcedures
   */
  public async CreateAllProcedures():Promise<void> {
    try {
      await this.CreateProceduresCore();
      await this.CreateProceduresRegistry();
    } catch (error) {
      this.loggerException.logError(':::', error as Error);
    }
  }
}
