require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middleware
// morgan => library export log
app.use(morgan('dev')); // trang thai code dc to mau =>
app.use(helmet());
app.use(compression());
// init db
require('./dbs/init.mongodb');
// const { checkOverLoad } = require('./helpers/check.connect');
// checkOverLoad();

// init routes
app.use('/', require('./routes'));
// handling error

module.exports = app;
//
