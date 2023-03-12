import colors from 'colors';
import { TimeUnits } from '../../interfaces/ICron';
import { CronHandler } from '../cronJob/CronHandler';
import { Synchronization } from './Synchronization';

export class RunTasks {
  private synchronization: Synchronization;

  constructor() {
    this.synchronization = new Synchronization();
  }

  /**
     * Run
     */
  public run():void {
    const CronSearchSales = new CronHandler(1, { timeInterval: 1, timeUnit: TimeUnits.minutes });
    const CronConstrolSalesFE = new CronHandler(2, { timeInterval: 15, timeUnit: TimeUnits.seconds });
    const CronReDriveSales = new CronHandler(3, { timeInterval: 15, timeUnit: TimeUnits.seconds });

    CronSearchSales.createJob(async () => {
      console.log(colors.blue(`INICIANDO SINCRONIZACION DE VENTAS ::: ${new Date()}`));
      await this.synchronization.searchSales();
      console.log(colors.blue('::: FINALIZANDO SINCRONIZACION VENTAS :::'));
    });

    CronConstrolSalesFE.createJob(async () => {
      console.log(colors.blue(`INICIANDO CONTROL DE VENTAS FE ::: ${new Date()}`));
      await this.synchronization.constrolSalesFE();
      console.log(colors.blue('::: FINALIZANDO CONTROL DE VENTAS :::'));
    });

    CronReDriveSales.createJob(async () => {
      console.log(colors.blue(`INICIANDO SINCRONIZACION DE MOVIMIENTOS ::: ${new Date()}`));
      await this.synchronization.reDriveSales();
      console.log(colors.blue('::: FINALIZANDO SINCRONIZACION MOVIMIENTOS :::'));
    });
  }
}
