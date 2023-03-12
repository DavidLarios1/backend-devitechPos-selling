import colors from 'colors';
import EventEmitter from 'events';
import { Client, Notification } from 'pg';
import { Config } from '../../config';
import { ClientResilienceController } from '../../database/ClientResilienceController';

export class ListenerDataBase extends EventEmitter {
  private clientCoreConnection: ClientResilienceController;

  constructor() {
    super();
    this.clientCoreConnection = new ClientResilienceController(Config.dataBaseConfigCore);
  }

  public listen(channels: Array<string>): void {
    const clienCore: Client = this.clientCoreConnection.getClient();

    channels.forEach((notifyChannel) => {
      clienCore.query(`LISTEN ${notifyChannel}`);
      console.log(colors.bgBlue('DB Channels ::>> '), notifyChannel);
    });
    clienCore.on('notification', (message: Notification) => {
      console.info(colors.blue('Emit Channel --> '), message.channel);
      this.emit(message.channel, JSON.parse(JSON.stringify(message.payload)));
    });
  }
}
