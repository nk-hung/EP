const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();


// init middleware
// morgan => library export log
app.use(morgan("dev")) // trang thai code dc to mau => 
app.use(helmet())
app.use(compression())
// init db

// init routes
app.get('/', (req, res, next) => {
  const strCompress = 'Hello World!'
  return res.status(200).json({
    msg: 'welcome my chanel',
    metadata: strCompress.repeat(10000)
  })
})
// handling error

module.exports = app;
// 