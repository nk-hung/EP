const { BadRequestError } = require('../core/error.response');
const { getCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('../services/discount.service');

class CheckoutService {
  /*
        {   
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [
                        { shopId, discountId, codeId }
                    ],
                    item_products: [
                        { price, quantity, productId }
                    ]
                }
            ]
        }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await getCartById(cartId);
    if (!foundCart) throw new BadRequestError('Cart does not exists!');

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien giam gia
        totalCheckout: 0, // tong tien phai thanh toan
      },
      shop_order_ids_now = [];

    // tinh tong bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check
      const checkProductServer = await checkProductByServer(item_products);
      console.log('check::', checkProductServer);
      if (!checkProductServer) throw new BadRequestError('Order Wrong!!!');
      const checkoutPrice = checkProductServer.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );
      // tong tien truoc khi xu ly
      checkout_order.totalPrice = checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // neu shop_discount ton tai, kiem tra discount co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        // get amount discount
        const { totalOrder = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // new tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_now.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_now,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
