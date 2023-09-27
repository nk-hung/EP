const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
  createUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create User Cart Success',
      metadata: await CartService.createUserCart({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };
  // update ---
  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  // delete ---
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };
  // get list
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list Cart Success',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
