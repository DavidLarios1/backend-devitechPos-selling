import colors, { Color } from 'colors';
import { IError, ILoggerError } from '../../interfaces/IError';

export class LoggerGenericException implements ILoggerError {
  private color:Color;

  constructor(color?: Color) {
    this.color = color || colors.red;
  }

  public logError(message : string, error : IError) {
    console.log(this.color(message), '[ ERROR ] :: ', error);
  }
}
