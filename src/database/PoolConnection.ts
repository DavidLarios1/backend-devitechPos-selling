import colors from 'colors';
import { Pool, PoolConfig } from 'pg';

export class PoolConnection {
  private poolConnection: Pool;

  private nameDataBase: string;

  constructor(poolConfig: PoolConfig) {
    this.nameDataBase = poolConfig.database || 'NOTHING';
    this.poolConnection = new Pool({ ...poolConfig, max: 10 });
  }

  /**
   * getPoolConnection
   */
  public getPoolConnection(): Pool {
    this.poolConnection.on('error', (err: Error) => {
      let message: string = '';
      message += `${colors.magenta('[  DB  ]')} *** CONEXION ${this.nameDataBase} FINALIZADA POR:\n`;
      message += `${colors.magenta('[  DB  ]')} *** NOMBRE:\t${err.name}\n`;
      message += `${colors.magenta('[  DB  ]')} *** MENSAJE:\t${err.message}`;
      console.error(message);
    });

    this.poolConnection.on('connect', () => {
      console.info(`${colors.magenta('[  DB  ]')} *** ${this.nameDataBase}`);
    });

    return this.poolConnection;
  }
}
