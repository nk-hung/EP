'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // publicKey được tạo bởi thuật toán bất đối xứng => Đang ở dạng Buffer -> chuyển sang string
      // const publicKeyStr = publicKey.toString();
      /* level 0 */
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });

      /** level xxx */
      const filter = { user: userId },
        update = {
          user: userId,
          privateKey,
          publicKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      ); // atomotic in db

      return tokens ? tokens.publicKey : '';
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static removeKeyByUserId = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
