/* eslint-disable @typescript-eslint/naming-convention */
import colors from 'colors';
import fetch, { RequestInit } from 'node-fetch';
import { ClientListenerDB } from './ClientLisenerDB';
import { IMovement } from '../../interfaces/IMovement';
import { NotifyChannels } from '../../libraries/constants/NotifyChannels';
import { LoggerGenericException } from '../../libraries/tools/LoggerGenericException';

export class ChannelsDBConfig {
  private clientListenerDB : ClientListenerDB;

  private logException : LoggerGenericException;

  constructor(clientListenerDB:ClientListenerDB) {
    this.clientListenerDB = clientListenerDB;
    this.logException = new LoggerGenericException();
  }

  public inicializeChannels() {
    this.clientListenerDB.on(NotifyChannels.MOVEMENT, async (eventMessage) => {
      const movementInformation = eventMessage as IMovement;
      console.log(colors.green(`LISTEN Channel ${NotifyChannels.MOVEMENT} :::`), movementInformation);
      try {
        const requestOptions : RequestInit = {
          method  : 'post',
          body    : JSON.stringify({ data: movementInformation }),
          headers : { 'Content-Type': 'application/json' },
        };

        const result = await fetch('http://127.0.0.1:8010/api/venta/combustibleV2/subir', requestOptions);
        const response = { url: result.url, status: result.status, statusText: result.statusText };

        if (response.status === 200) {
          console.log(colors.green('Reponse ::: '), response);
        } else {
          this.logException.logError('Error :::: ', response as any);
        }
      } catch (error) {
        this.logException.logError('Error en la Peticion :::: ', error as any);
      }
    });
  }
}
