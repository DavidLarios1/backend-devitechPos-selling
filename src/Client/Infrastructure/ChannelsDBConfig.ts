/* eslint-disable @typescript-eslint/naming-convention */
import colors from 'colors';
import fetch from 'node-fetch';
import { IMovement } from './IMovement';
import { ClientListenerDB } from './ClientLisenerDB';
import { NotifyChannels } from '../Domain/ValueObjects/NotifyChannels';

export class ChannelsDBConfig {
  private clientListenerDB : ClientListenerDB;

  constructor(clientListenerDB:ClientListenerDB) {
    this.clientListenerDB = clientListenerDB;
  }

  public inicializeChannels() {
    this.clientListenerDB.on(NotifyChannels.MOVEMENT, async (eventMessage) => {
      const movementInformation = eventMessage as IMovement;
      console.log(colors.green(`LISTEN Channel ${NotifyChannels.MOVEMENT} :::`), movementInformation);
      try {
        const requestOptions = {
          method  : 'post',
          data    : JSON.stringify(movementInformation),
          headers : { 'Content-Type': 'application/json' },
        };

        const response = await fetch('http://127.0.0.1:8010/api/venta/combustibleV2/subir', requestOptions);
        console.log('RESPONSE ::::', response);
      } catch ({ message }) {
        console.log(colors.red('START Error ::::\n'), message, colors.red('\nEND Error ::::'));
      }
    });

    this.clientListenerDB.on(NotifyChannels.SALES, (eventMessage) => {
      console.log(colors.green(`LISTEN Channel ${NotifyChannels.SALES} :::`), eventMessage);
    });
  }
}
