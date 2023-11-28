const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const discountController = require('../../controllers/discount.controller');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

// get amount a discount

router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
    '/list_product_code',
    asyncHandler(discountController.getAllDiscountCodesWithProducts)
);

router.use(authentication);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
