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

  // update Product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product Success!',
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    console.log('req', req.user);
    new SuccessResponse({
      message: 'published product success!',
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.usesId,
      }),
    }).send(res);
  };
  /**
   * @desc  Get all drafts
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list Draft success!',
      metadata: await ProductFactory.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list Publish success!',
      metadata: await ProductFactory.getAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Success!',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.body.product_id,
      }),
    }).send(res);
  };

  unPublishedProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish success!',
      metadata: new ProductFactory.unPublishedProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListsearchProduct = async (req, res, next) => {
    console.log('vao');
    new SuccessResponse({
      message: 'Search Product Success',
      metadata: await ProductFactory.getListSearchProduct(req.params),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'get All products success',
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'get one product',
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
