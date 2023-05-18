'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({ userId, privateKey, publicKey }) => {
    try {
      // publicKey được tạo bởi thuật toán bất đối xứng => Đang ở dạng Buffer -> chuyển sang string
      // const publicKeyStr = publicKey.toString();
      const tokens = await keytokenModel.create({
        user: userId,
        privateKey,
        publicKey,
      });

      return tokens ? tokens.publicKey : '';
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
