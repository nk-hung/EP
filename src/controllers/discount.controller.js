const DiscountService = require('../services/discount.service');
const { SuccessResponse } = require('../core/success.response');

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success Code Found',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success Discount Amount',
      metadata: await DiscountService.getDiscountAmount({
        shopId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success Discount Products',
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    });
  };
}

module.exports = new DiscountController();
