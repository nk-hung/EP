const apiKeyModel = require('../models/apiKey.model');
const crypto = require('node:crypto');
const { generateToken } = require('../utils');

const findByKey = async (key) => {
  // const newKey = await apiKeyModel.create({
  //   key: generateToken(),
  //   permissions: ['0000'],
  // });
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findByKey,
};
