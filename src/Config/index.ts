export const Config = {
  serverConfig   : { serverPort: 8017 },
  dataBaseConfig : {
    USER             : process.env.USER || 'pilotico',
    HOST             : process.env.HOST || '127.0.0.1',
    DATABASECORE     : process.env.DATABASE_CORE || 'lazoexpresscore',
    DATABASEREGISTRY : process.env.DATABASE_REGISTRY || 'lazoexpressregistry',
    PASSWORD         : process.env.PASSWORD || '$2y$12$UWpxiZi3UaF7ZyKeySCpB.5Z5FfRtAAkgYuQz.m4qnLUFR7CmTOu',
    PORTDB           : parseInt(process.env.PORT_DB || '5432'),
  },
};
