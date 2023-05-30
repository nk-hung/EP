'use strict';
const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const generateToken = () => crypto.randomBytes(64).toString('hex');

const getSelectData = (select) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
};

const unGetSelectData = (select) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = {
  getInfoData,
  generateToken,
  getSelectData,
  unGetSelectData,
};
