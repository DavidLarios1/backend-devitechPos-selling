export const Config = {
  serverConfig           : { serverPort: 8017 },
  dataBaseConfigRegistry : {
    user     : process.env.USER_REGISTRY || 'pilotico',
    host     : process.env.HOST_REGISTRY || '127.0.0.1',
    database : process.env.DATABASE_REGISTRY || 'lazoexpressregistry',
    password : process.env.PASSWORD_REGISTRY || '$2y$12$UWpxiZi3UaF7ZyKeySCpB.5Z5FfRtAAkgYuQz.m4qnLUFR7CmTOu',
    port     : parseInt(process.env.PORT_DB_REGISTRY || '5432'),
  },
  dataBaseConfigCore: {
    user     : process.env.USER_CORE || 'pilotico',
    host     : process.env.HOST_CORE || '127.0.0.1',
    database : process.env.DATABASE_CORE || 'lazoexpresscore',
    password : process.env.PASSWORD_CORE || '$2y$12$UWpxiZi3UaF7ZyKeySCpB.5Z5FfRtAAkgYuQz.m4qnLUFR7CmTOu',
    port     : parseInt(process.env.PORT_DB_CORE || '5432'),
  },
};
