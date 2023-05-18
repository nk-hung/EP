const { findByKey } = require('../services/apiKey.service');

const HEADERS = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
const apiKey = async (req, res, next) => {
  try {
    console.log('headers::', req.headers);
    const key = req.headers[HEADERS.API_KEY]?.toString();
    console.log('key::', key);
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    const objKey = await findByKey(key);
    console.log('objKey::', objKey);
    if (!objKey) {
      return res.status(403).json({
        mesasge: 'Forbidden Error',
      });
    }

    req.objKey = objKey;

    next();
  } catch (error) {
    next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    console.log('permission::', req);
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission Denied!',
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: 'Permissions Denied!' });
    }

    next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
