const bcrypt = require('bcrypt');
const crypto = require('crypto');

const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokensPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

const RoleShop = {
  SHOP: 'SHOP',
  WRITTER: 'WRITTER',
  CREATED: 'CREATED',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // check email registed
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Error:: Shop already registed!');
      // return {
      //   code: 'xxxx',
      //   message: 'Email already registed!',
      // };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    // newShop created success -> create publicKey and accessToken, refreshToken
    if (newShop) {
      // create privateKey, publicKey
      // Thuat toan bat doi xung thuong duoc su dung o cac ung dung lon nhu Amazon, Cloud Google, ...
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1', // Public Key CryptoGraphic Standards 1
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');
      console.log({ privateKey, publicKey });

      // Save collection KeyStore->keytokenModel
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      });

      if (!keyStore) {
        return {
          code: 'xxxxx',
          message: 'keyStore error',
        };
      }
      // console.log('publicKeyString:::', publicKeyString);
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log('publicKeyObject:::', publicKeyObject);
      // create token pair
      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Create token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };
}

module.exports = AccessService;
