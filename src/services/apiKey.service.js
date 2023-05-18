const apiKeyModel = require('../models/apiKey.model');
const crypto = require('node:crypto');

const findByKey = async (key) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findByKey,
};
