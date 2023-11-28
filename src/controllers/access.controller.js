const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout Success!',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signUp(req.body));
    new CREATED({
      message: 'Registed Success!',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Token Success',
      metadata: await AccessService.handlerRefreshToken({
        refreshtoken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
