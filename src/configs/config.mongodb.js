'use strict';

const dev = {
  app: {
    port: process.env.PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};

const prod = {
  app: {
    port: process.env.PORT,
  },
  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME,
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || 'dev';
console.log(config[env]);
module.exports = config[env];
