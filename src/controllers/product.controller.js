const { SuccessResponse } = require('../core/success.response');
const ProductFactory = require('../services/product.service');

class ProductController {
  create = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Success',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
