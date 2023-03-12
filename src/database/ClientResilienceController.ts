import colors from 'colors';
import { Client, ClientConfig } from 'pg';
import { IQueryExecute, IQueryValues } from '../interfaces/IDataBase';

export class ClientResilienceController implements IQueryExecute<IQueryValues> {
  private client: Client;

  private config: ClientConfig;

  private dataBaseName : string;

  private connected : boolean;

  constructor(config: ClientConfig) {
    this.config = config;
    this.connected = false;
    this.client = new Client(config);
    this.dataBaseName = config.database || 'NOTHING';
  }

  public connect(): void {
    this.client.connect((err) => {
      if (!err) {
        console.error(colors.blue(`[ CLIENTE - ${this.dataBaseName} ]`), colors.blue(' connected ---- succes'));
        this.connected = true;
      } else {
        console.log(colors.yellow(`[ CLIENTE  - ${this.dataBaseName} ]`), colors.red(' connection ----- [error]'));
      }
    });

    this.client.on('error', () => {
      console.log(colors.yellow('[ CLIENTE - CORE ]'), colors.red(' forced disconnection'));
      this.onDisconnec();
      this.connected = false;
    });
  }

  public onDisconnec() : void {
    this.client.off('error', () => {});
  }

  public getClient(): Client {
    this.client.connect().then();
    return this.client;
  }

  public isConnected() : boolean {
    return this.connected;
  }

  public async query(queryString: string, values?: Array<number | string>): Promise<any> {
    try {
      if (!this.connected) {
        this.client = new Client(this.config);
        this.connect();
      }

      const result = await this.client.query(queryString, values);
      return result;
    } catch (error) {
      console.log('Error executing query ::: ', error);
      throw error;
    }
  }
}
