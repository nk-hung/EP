const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { AuthFailureError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const { keys } = require('lodash');

const HEADERS = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken',
};

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error:::`, err);
      } else {
        console.log(`Decode :::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error create token', error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1. check userId missing ?
   * 2. get accessToken
   * 3. verify token
   * 4. check user in db
   * 5. check keyStore with this useId
   * 6. Ok all => next
   */

  // 1.
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invaild request user');

  // 2.
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found key');

  // 3.
  if (req.headers[HEADERS.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADERS.REFRESHTOKEN];
    try {
      const decode = JWT.decode(refreshToken, keyStore.privateKey);
      if (userId !== decode.userId) throw new AuthFailureError('Invalid User');
      req.keyStore = keyStore;
      (req.user = decode), (req.refreshToken = refreshToken);
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid accessToken');

  try {
    const decode = JWT.decode(accessToken, keyStore.publicKey);
    if (userId !== decode.userId) throw new AuthFailureError('Invalid User');
    req.keyStore = keyStore;
    req.user = decode;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.decode(token, keySecret);
};
module.exports = {
  createTokensPair,
  authentication,
  verifyJWT,
};
