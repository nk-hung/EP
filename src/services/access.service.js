const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData, generateToken } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { NotFoundError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITTER: "WRITTER",
  CREATED: "CREATED",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyByUserId(userId);
      throw new ForbiddenError("Something wrong happend! Pls login!");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered!");
    }

    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new AuthFailureError("Wrong email");

    // cap tokens moi
    const tokens = await createTokensPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey,
    );
    // dua refreshToken nay vao dien da su dungj
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };

  /*  
	1 - check exist email
	2 - match password
	3 - create publicKey, privateKey and save
	4 - generate tokens 
	5 - get data return
  */
  static login = async ({ email, password, accessToken = null }) => {
    //1. check exist email
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registed!");

    // 2. compare password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Password wrong!");

    // 3. create publicKey and privateKey
    const publicKey = generateToken();
    const privateKey = generateToken();

    // 4. create tokens
    const { _id: userId } = foundShop;

    const tokens = await createTokensPair(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check email registed
    console.log("email::", email);
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) throw new BadRequestError("Error:: Shop already registed!");

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    // newShop created success -> create publicKey and accessToken, refreshToken
    if (newShop) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      // Save collection KeyStore->keytokenModel
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      });

      if (!keyStore) {
        return {
          code: "xxxxx",
          message: "keyStore error",
        };
      }

      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["id", "name", "email"],
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
  };
}

module.exports = AccessService;
