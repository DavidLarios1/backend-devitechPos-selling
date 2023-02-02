import EventEmitter from 'events';
import { Client, Notification } from 'pg';
import colors from 'colors';
import { PoolConnection } from '../../Infrastructure/Persistence/postgres/config';

export class ClientListenerDB extends EventEmitter {
  private conection: Client;

  constructor() {
    super();
    this.conection = PoolConnection.getPoolConnection();
  }

  listen(channels: Array<string>): void {
    channels.forEach((notifyChannel) => {
      this.conection.query(`LISTEN ${notifyChannel}`);
      console.log(colors.bgBlue('DB Channels ::>> '), notifyChannel);
    });
    this.conection.on('notification', (message: Notification) => {
      console.info(colors.blue('Emit Channel --> '), message.channel);
      this.emit(message.channel, JSON.parse(JSON.stringify(message.payload)));
    });
  }
}
