import { Client } from 'pg';
import { Config } from '../config/index';

export class PoolConnection {
  private static user:string = Config.dataBaseConfig.USER;

  private static host: string = Config.dataBaseConfig.HOST;

  private static password: string = Config.dataBaseConfig.PASSWORD;

  private static port : number = Config.dataBaseConfig.PORTDB;

  private static databaseCore:string = Config.dataBaseConfig.DATABASECORE;

  private static databaseRegistry:string = Config.dataBaseConfig.DATABASEREGISTRY;

  private static clientCore : Client = new Client({
    host: this.host, user: this.user, database: this.databaseCore, password: this.password, port: this.port,
  });

  private static clientRegistry : Client = new Client({
    host: this.host, user: this.user, database: this.databaseRegistry, password: this.password, port: this.port,
  });

  public static getPoolConnectionCore() : Client {
    this.clientCore.connect().then();
    return this.clientCore;
  }

  public static getPoolConnectionRegistry() : Client {
    this.clientRegistry.connect().then();
    return this.clientRegistry;
  }
}
