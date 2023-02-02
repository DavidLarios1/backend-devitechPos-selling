import { Client } from 'pg';

export class PoolConnection {
  private static user:string = 'pilotico';

  private static host: string = '127.0.0.1';

  private static database:string = 'lazoexpresscore';

  private static password: string = '$2y$12$UWpxiZi3UaF7ZyKeySCpB.5Z5FfRtAAkgYuQz.m4qnLUFR7CmTOu';

  private static port : number = 5432;

  private static client : Client = new Client({
    host: this.host, user: this.user, database: this.database, password: this.password, port: this.port,
  });

  public static getPoolConnection() : Client {
    this.client.connect().then();
    return this.client;
  }
}
