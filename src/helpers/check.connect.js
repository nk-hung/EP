'use strict';
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;
// count Connections
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of Connection :: ${numConnection}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Exam maximun number of connection based on number of cores
    const maxConnections = numCores * 5; // core chiu dc 5 connect

    console.log(`Active connections::${numConnection}`);
    console.log(`memory usage 123:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection over load detected!`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = { countConnect, checkOverLoad };
