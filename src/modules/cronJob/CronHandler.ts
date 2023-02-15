import { CronJob } from 'cron';
import { ICronTimesFormat, ITimes } from '../../interfaces/ICron';

export class CronHandler {
  private InstancesList = new Map<number, CronJob>();

  private cronId: number;

  private timeParameters: ITimes;

  constructor(cronId: number, timeParameters : ITimes) {
    this.cronId = cronId;
    this.timeParameters = timeParameters;
  }

  private buildCronExpression():string {
    const { timeUnit, timeInterval } = this.timeParameters;
    const timeConditions : ICronTimesFormat = {
      seconds        : '- * * * * *',
      minutes        : '- * * * *',
      hours          : '0 0 - * * *',
      specificHours  : '0 0 - * * *',
      hoursEveryDays : '0 0 * * *',
      dayOfWeeks     : '0 0 * * -',
      dayOfMonth     : '0 0 1 * *',
    };

    if ([ 'specificHours', 'dayOfWeeks' ].includes(timeUnit)) {
      return timeConditions[timeUnit].replace('-', timeInterval.toString());
    }
    return timeConditions[timeUnit].replace('-', `*/${timeInterval}`);
  }

  public createJob(callback: Function):boolean {
    const time = this.buildCronExpression();
    if (!this.InstancesList.has(this.cronId)) {
      const instanceCronJob : CronJob = new CronJob(time, async () => {
        await callback();
      });
      instanceCronJob.start();
      this.InstancesList.set(this.cronId, instanceCronJob);
      return true;
    }
    return false;
  }

  public updateJob(callback: Function): boolean {
    if (this.InstancesList.has(this.cronId)) {
      const time = this.buildCronExpression();
      this.InstancesList.get(this.cronId)?.stop();
      const instanceCronJob : CronJob = new CronJob(time, async () => {
        await callback();
      });
      this.InstancesList.set(this.cronId, instanceCronJob);
      return true;
    }
    return false;
  }

  public stopJob(cronId: number): boolean {
    if (this.InstancesList.has(cronId)) {
      this.InstancesList.get(cronId)?.stop();
      this.InstancesList.delete(cronId);
      return true;
    }
    return false;
  }

  public setTimeParameters(timeParameters: ITimes) {
    this.timeParameters = timeParameters;
  }
}
