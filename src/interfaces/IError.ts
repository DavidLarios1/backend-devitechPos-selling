interface IFetchError {
  url: string;
  status: number;
  statusText: string;
}

export type IError = string | Error | IFetchError | any;

export interface ILoggerError {
  logError(message:string, error:IError):void;
}
