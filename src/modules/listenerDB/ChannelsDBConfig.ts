/* eslint-disable @typescript-eslint/naming-convention */
import colors from 'colors';
import { ListenerDataBase } from './LintenerDataBase';
import { IMovement } from '../../interfaces/IMovement';
import { FetchRequest } from '../../libraries/tools/fetchRequest';
import { WebAddress } from '../../libraries/constants/WebAddress';
import { NotifyChannels } from '../../libraries/constants/NotifyChannels';
import { LoggerGenericException } from '../../libraries/tools/LoggerGenericException';

export class ChannelsDBConfig {
  private logException : LoggerGenericException;

  private fechRequest : FetchRequest;

  private listenerDataBase : ListenerDataBase;

  constructor(listenerDataBase: ListenerDataBase) {
    this.listenerDataBase = listenerDataBase;
    this.logException = new LoggerGenericException();
    this.fechRequest = new FetchRequest(WebAddress.VENTA_COMBUSTIBLE);
  }

  public inicializeChannels() {
    this.listenerDataBase.on(NotifyChannels.MOVEMENT, async (eventMessage) => {
      const movementInformation = eventMessage as IMovement;
      console.log(colors.green(`LISTEN Channel ${NotifyChannels.MOVEMENT} :::`), movementInformation);
      try {
        await this.fechRequest.post({ data: movementInformation });
      } catch (error) {
        this.logException.logError('Error : ', error as any);
      }
    });
  }
}
