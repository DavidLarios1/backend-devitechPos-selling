export interface IQueryExecute<T> {
  query(queryString: string, values?: T):Promise<any>;
}

export interface IQueryValues {
  [index : number]: number | string;
}

export const enum DataBaseName {
  CORE = 'lazoexpresscore',
  REGISTRY = 'lazoexpressregistry',
}
