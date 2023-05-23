'use strict';
const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const generateToken = () => crypto.randomBytes(64).toString('hex');

module.exports = {
  getInfoData,
  generateToken,
};
